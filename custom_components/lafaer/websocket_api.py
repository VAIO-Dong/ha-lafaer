"""Authenticated WebSocket API used by the on-demand Lafaer panel."""

from __future__ import annotations

import logging
import secrets
import string
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from .const import DATA_CONTROLLERS, DOMAIN, SUPPORTED_MODELS
from .controller import LafaerController
from .debug import exception_summary
from .protocol.client import LafaerProtocolClient
from .protocol.models import StoredDevice

_LOGGER = logging.getLogger(__name__)


def _controller(hass: HomeAssistant) -> LafaerController:
    controllers: dict[str, LafaerController] = hass.data[DOMAIN][DATA_CONTROLLERS]
    if not controllers:
        raise RuntimeError("Lafaer is not configured")
    return next(iter(controllers.values()))


def _new_uid() -> str:
    alphabet = string.ascii_lowercase + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(8))


def _stored_public(controller: LafaerController, device: StoredDevice) -> dict[str, Any]:
    """Add explicit-scan availability without opening a device connection."""
    public = device.as_public_dict()
    cached = controller.store.get_discovered(device.device_id, device.model)
    if cached is not None:
        public["available"] = cached.available
        public["last_seen"] = cached.last_seen
    return public


@websocket_api.websocket_command({vol.Required("type"): "lafaer/devices/list"})
@websocket_api.async_response
async def websocket_list_devices(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    controller = _controller(hass)
    connection.send_result(
        msg["id"], [_stored_public(controller, device) for device in controller.store.list()]
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lafaer/discover",
        vol.Optional("timeout", default=15): vol.All(vol.Coerce(float), vol.Range(min=1, max=15)),
    }
)
@websocket_api.async_response
async def websocket_discover(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    controller = _controller(hass)
    controller.debug.add("discovery", "scan started")
    try:
        devices = await controller.discovery.async_scan(msg["timeout"])
    except Exception as err:
        controller.debug.add("discovery", "scan failed", level="error", data={"error": str(err)})
        connection.send_error(msg["id"], "discovery_failed", str(err))
        return

    cached_devices = await controller.store.async_update_discovery(devices)
    output: list[dict[str, Any]] = []
    for device in cached_devices:
        public = device.as_public_dict()
        stored = controller.store.get(device.device_id)
        public["adopted"] = stored is not None and stored.model == device.model
        output.append(public)
        if device.available and stored is not None and stored.model == device.model:
            stored.host = device.host
            stored.version = device.version
            if device.blue_id:
                stored.blue_id = device.blue_id
            await controller.store.async_save_device(stored)
    controller.debug.add(
        "discovery",
        "scan finished",
        data={"device_count": len(devices), "cached_device_count": len(output)},
    )
    connection.send_result(msg["id"], output)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lafaer/device/adopt",
        vol.Required("device_id"): vol.All(str, vol.Length(min=1, max=64)),
        vol.Required("model"): vol.In(SUPPORTED_MODELS),
        vol.Required("host"): vol.All(str, vol.Length(min=1, max=255)),
        vol.Required("thread_mac"): vol.All(str, vol.Length(min=1, max=64)),
        vol.Optional("version", default=""): str,
        vol.Optional("blue_id"): str,
        vol.Optional("name"): str,
        # Accepted for compatibility with the 0.1.1 panel, but never trusted.
        vol.Optional("adopted"): bool,
        vol.Optional("uid"): vol.Any(None, str),
        vol.Optional("available"): bool,
        vol.Optional("last_seen"): vol.Any(None, str),
    }
)
@websocket_api.async_response
async def websocket_adopt_device(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    connection.require_admin()
    controller = _controller(hass)
    uid = _new_uid()
    client: LafaerProtocolClient | None = None
    stage = "initialization"
    device: StoredDevice | None = None
    controller.debug.add(
        "pairing",
        "HA takeover started",
        level="info",
        data={"device_id": msg["device_id"], "model": msg["model"]},
    )
    try:
        client = LafaerProtocolClient(
            msg["host"],
            msg["thread_mac"],
            model=msg["model"],
            debug=controller.debug.protocol_callback,
        )
        stage = "connection and authentication"
        pairing_material = await client.async_authenticate(uid)
        stage = "credential storage"
        device = StoredDevice(
            device_id=msg["device_id"],
            model=msg["model"],
            host=msg["host"],
            version=msg["version"],
            uid=uid,
            thread_mac=msg["thread_mac"],
            blue_id=msg.get("blue_id"),
            name=msg.get("name") or f"{msg['model']} {msg['device_id']}",
            pairing_material=pairing_material,
        )
        await controller.store.async_save_device(device)
    except Exception as err:
        summary = exception_summary(err)
        message = f"{stage} failed: {summary}"
        controller.debug.add(
            "pairing",
            "HA takeover failed",
            level="error",
            data={
                "device_id": msg["device_id"],
                "model": msg["model"],
                "stage": stage,
                "error_type": type(err).__name__,
                "error": summary,
            },
        )
        _LOGGER.exception("Lafaer takeover %s for model %s", message, msg["model"])
        connection.send_error(msg["id"], "adoption_failed", message)
        return
    finally:
        if client is not None:
            try:
                await client.async_close()
            except Exception as err:  # Closing must not discard a successful takeover.
                summary = exception_summary(err)
                controller.debug.add(
                    "pairing",
                    "transport close failed",
                    level="warning",
                    data={"error_type": type(err).__name__, "error": summary},
                )
                _LOGGER.warning("Unable to close Lafaer takeover transport: %s", summary)

    assert device is not None
    controller.debug.add(
        "pairing",
        "device adopted by Home Assistant",
        level="info",
        data={"device_id": device.device_id, "model": device.model},
    )
    connection.send_result(msg["id"], _stored_public(controller, device))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lafaer/session/subscribe",
        vol.Required("device_id"): str,
    }
)
@websocket_api.async_response
async def websocket_subscribe_session(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    controller = _controller(hass)
    ready = False

    def forward(event: dict[str, Any]) -> None:
        if ready:
            connection.send_event(msg["id"], event)

    try:
        viewer_id, snapshot = await controller.sessions.async_subscribe(msg["device_id"], forward)
    except Exception as err:
        connection.send_error(msg["id"], "session_open_failed", str(err))
        return

    def unsubscribe() -> None:
        hass.async_create_task(controller.sessions.async_unsubscribe(msg["device_id"], viewer_id))

    connection.subscriptions[msg["id"]] = unsubscribe
    connection.send_result(msg["id"])
    ready = True
    connection.send_event(msg["id"], {**snapshot, "viewer_id": viewer_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lafaer/session/heartbeat",
        vol.Required("device_id"): str,
        vol.Required("viewer_id"): str,
    }
)
@websocket_api.async_response
async def websocket_session_heartbeat(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    ok = _controller(hass).sessions.heartbeat(msg["device_id"], msg["viewer_id"])
    if not ok:
        connection.send_error(msg["id"], "expired_session", "device session has expired")
        return
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lafaer/device/action",
        vol.Required("device_id"): str,
        vol.Required("action"): str,
        vol.Optional("data", default={}): dict,
    }
)
@websocket_api.async_response
async def websocket_device_action(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    connection.require_admin()
    controller = _controller(hass)
    try:
        await controller.sessions.async_action(msg["device_id"], msg["action"], msg["data"])
    except Exception as err:
        connection.send_error(msg["id"], "action_failed", str(err))
        return
    if msg["action"] in {"factory_reset", "delete_management"}:
        # Remove storage first so a concurrent detail-page open cannot create
        # a replacement session with credentials the device just invalidated.
        await controller.store.async_remove_device(msg["device_id"])
        session = controller.sessions.sessions.get(msg["device_id"])
        if session is not None:
            await session.async_close()
            if controller.sessions.sessions.get(msg["device_id"]) is session:
                controller.sessions.sessions.pop(msg["device_id"], None)
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lafaer/device/read",
        vol.Required("device_id"): str,
        vol.Required("kind"): vol.In(("detection_energy", "keep_energy")),
    }
)
@websocket_api.async_response
async def websocket_device_read(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    try:
        result = await _controller(hass).sessions.async_read(msg["device_id"], msg["kind"])
    except Exception as err:
        connection.send_error(msg["id"], "read_failed", str(err))
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lafaer/device/forget",
        vol.Required("device_id"): str,
    }
)
@websocket_api.async_response
async def websocket_forget_device(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    connection.require_admin()
    controller = _controller(hass)
    await controller.store.async_remove_device(msg["device_id"])
    session = controller.sessions.sessions.get(msg["device_id"])
    if session is not None:
        await session.async_close()
        if controller.sessions.sessions.get(msg["device_id"]) is session:
            controller.sessions.sessions.pop(msg["device_id"], None)
    controller.debug.add("storage", "device forgotten locally")
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lafaer/device/rename",
        vol.Required("device_id"): str,
        vol.Required("name"): vol.All(str, vol.Length(min=1, max=64)),
    }
)
@websocket_api.async_response
async def websocket_rename_device(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Rename a stored device locally without opening a sensor session."""
    connection.require_admin()
    controller = _controller(hass)
    device = controller.store.get(msg["device_id"])
    if device is None:
        connection.send_error(msg["id"], "unknown_device", "unknown device")
        return
    name = msg["name"].strip()
    if not name:
        connection.send_error(msg["id"], "invalid_name", "device name cannot be empty")
        return
    device.name = name
    await controller.store.async_save_device(device)
    controller.debug.add("storage", "device renamed locally")
    connection.send_result(msg["id"], device.as_public_dict())


@websocket_api.websocket_command({vol.Required("type"): "lafaer/debug/list"})
@websocket_api.async_response
async def websocket_debug_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    connection.send_result(msg["id"], _controller(hass).debug.as_list())


@websocket_api.websocket_command({vol.Required("type"): "lafaer/debug/clear"})
@websocket_api.async_response
async def websocket_debug_clear(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    connection.require_admin()
    await _controller(hass).debug.async_clear()
    connection.send_result(msg["id"])


COMMANDS = (
    websocket_list_devices,
    websocket_discover,
    websocket_adopt_device,
    websocket_subscribe_session,
    websocket_session_heartbeat,
    websocket_device_action,
    websocket_device_read,
    websocket_forget_device,
    websocket_rename_device,
    websocket_debug_list,
    websocket_debug_clear,
)


def async_register_websocket_api(hass: HomeAssistant) -> None:
    for command in COMMANDS:
        websocket_api.async_register_command(hass, command)
