"""Reference-counted, heartbeat-guarded device sessions."""

from __future__ import annotations

import asyncio
import secrets
from collections.abc import Callable, Coroutine
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

    from .debug import DebugBuffer
    from .storage import DeviceStore

from .const import LEASE_TIMEOUT, STATUS_INTERVAL
from .protocol.client import LafaerProtocolClient
from .protocol.models import StoredDevice

EventCallback = Callable[[dict[str, Any]], None]
ClosedCallback = Callable[["DeviceSession"], None]


async def _gather_reads(*reads: Coroutine[Any, Any, Any]) -> list[Any]:
    """Finish cancelling sibling reads before their transport can be closed."""
    tasks = [asyncio.create_task(read) for read in reads]
    try:
        return await asyncio.gather(*tasks)
    except BaseException:
        for task in tasks:
            task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)
        raise


class DeviceSession:
    """One shared transport for all viewers of one device detail page."""

    def __init__(
        self,
        hass: HomeAssistant,
        device: StoredDevice,
        store: DeviceStore,
        debug: DebugBuffer,
        on_closed: ClosedCallback | None = None,
    ) -> None:
        self.hass = hass
        self.device = device
        self.store = store
        self.debug = debug
        self._on_closed = on_closed
        self.client = LafaerProtocolClient(
            device.host,
            device.pairing_material,
            model=device.model,
            debug=debug.protocol_callback,
        )
        self.viewers: dict[str, tuple[float, EventCallback]] = {}
        self._background_viewers: set[str] = set()
        self.snapshot: dict[str, Any] = {"connected": False}
        self._task: asyncio.Task[None] | None = None
        self._ready = asyncio.Event()
        self._closed = False
        self._radar_read_lock = asyncio.Lock()
        self._radar_active_at: float | None = None
        self._threshold_refresh_pending = False
        self._last_energy_read_at: float | None = None

    async def async_start(self) -> None:
        self.start()
        await self._ready.wait()
        if not self.snapshot.get("connected"):
            error = self.snapshot.get("error", "unable to connect")
            await self.async_close()
            raise RuntimeError(error)

    def start(self) -> None:
        """Start loading without delaying delivery of the unsubscribe handle."""
        if self._task is not None:
            return
        self._task = self.hass.async_create_task(self._async_run())

    def add_viewer(self, callback: EventCallback) -> str:
        viewer_id = secrets.token_hex(8)
        self.viewers[viewer_id] = (
            asyncio.get_running_loop().time() + LEASE_TIMEOUT,
            callback,
        )
        return viewer_id

    def heartbeat(self, viewer_id: str, *, background: bool = False) -> bool:
        viewer = self.viewers.get(viewer_id)
        if viewer is None:
            return False
        if background:
            self._background_viewers.add(viewer_id)
        else:
            self._background_viewers.discard(viewer_id)
        self.viewers[viewer_id] = (
            asyncio.get_running_loop().time() + (60 if background else LEASE_TIMEOUT),
            viewer[1],
        )
        return True

    def remove_viewer(self, viewer_id: str) -> None:
        self.viewers.pop(viewer_id, None)
        self._background_viewers.discard(viewer_id)

    def _publish(self) -> None:
        event = {"device_id": self.device.device_id, **self.snapshot}
        for _, callback in list(self.viewers.values()):
            callback(event)

    async def _async_initial_load(self) -> None:
        pairing_material = await self.client.async_authenticate(self.device.uid or "")
        if pairing_material != self.device.pairing_material:
            self.device.pairing_material = pairing_material
            await self.store.async_save_device(self.device)
        status, information = await _gather_reads(
            self.client.async_status(), self.client.async_information()
        )
        self.snapshot.update(
            connected=True,
            status=status.as_dict(),
            information=information.as_dict(),
        )
        if self.device.model == "LWR02":
            config, radar_status = await _gather_reads(
                self.client.async_lwr02_config(),
                self.client.async_radar_status(),
            )
            self.snapshot.update(
                config=config.as_dict(),
                radar_status=radar_status.as_dict(),
            )
            # The trailing range-response flag is not implemented by firmware.
            # Fetch thresholds on entry, independently of that reserved byte.
            try:
                detection, keep = await _gather_reads(
                    self.client.async_thresholds(keep=False),
                    self.client.async_thresholds(keep=True),
                )
                self.snapshot.update(
                    detection_thresholds=detection.as_dict(), keep_thresholds=keep.as_dict(),
                )
            except Exception as err:
                self._threshold_refresh_pending = True
                self.debug.add(
                    "protocol", "initial threshold read failed; will retry in foreground",
                    level="warning", data={"error": str(err)},
                )
        else:
            ranges, settings = await _gather_reads(
                self.client.async_get_lwr01_ranges(),
                self.client.async_get_lwr01_settings(),
            )
            self.snapshot.update(ranges=ranges, config=settings)

    async def _async_run(self) -> None:
        try:
            async with asyncio.timeout(LEASE_TIMEOUT):
                await self._async_initial_load()
            self.debug.add("lifecycle", "device session opened")
        except Exception as err:
            self.snapshot.update(connected=False, error=str(err))
            self.debug.add(
                "lifecycle", "device session initialization failed",
                level="error", data={"error": str(err)},
            )
        finally:
            self._ready.set()
            self._publish()

        if not self.snapshot.get("connected"):
            await self.client.async_close()
            self._closed = True
            self.debug.add("lifecycle", "failed device session closed")
            self._notify_closed()
            return

        try:
            while not self._closed:
                now = asyncio.get_running_loop().time()
                expired = [key for key, (deadline, _) in self.viewers.items() if deadline <= now]
                for viewer_id in expired:
                    self.remove_viewer(viewer_id)
                if not self.viewers:
                    break
                if self._background_viewers.issuperset(self.viewers):
                    await asyncio.sleep(STATUS_INTERVAL)
                    continue
                try:
                    async with self._radar_read_lock:
                        if self._closed or not self.viewers:
                            break
                        if self._background_viewers.issuperset(self.viewers):
                            continue
                        status = await self.client.async_status()
                    self.snapshot.update(
                        connected=True, status=status.as_dict(), error=None
                    )
                except Exception as err:
                    self.snapshot.update(connected=False, error=str(err))
                self._publish()
                await asyncio.sleep(STATUS_INTERVAL)
        except asyncio.CancelledError:
            raise
        finally:
            await self.client.async_close()
            self._closed = True
            self.snapshot["connected"] = False
            self.debug.add("lifecycle", "device session closed")
            self._publish()
            self._notify_closed()

    def _notify_closed(self) -> None:
        if self._on_closed is not None:
            self._on_closed(self)

    async def async_call(self, action: str, data: dict[str, Any]) -> None:
        """Serialize configuration writes with foreground radar reads."""
        async with self._radar_read_lock:
            if self._closed or not self.snapshot.get("connected"):
                raise RuntimeError("device is not connected")
            self._validate_sensing_action(action, data)
            await self._async_call_locked(action, data)

    def _validate_sensing_action(self, action: str, data: dict[str, Any]) -> None:
        if self.device.model != "LWR02":
            return
        sensing = {
            "set_settings", "save_mode_sensing", "set_work_mode",
            "set_pir_sensitivity", "set_radar_sensitivity", "set_radar_range",
            "set_detection_thresholds", "set_keep_thresholds", "start_learning",
            "radar_reset", "set_presence_timeout",
        }
        if action not in sensing:
            return
        config = self.snapshot.get("config", {})
        radar = self.snapshot.get("radar_status", {})
        if radar.get("studying") == 1:
            raise ValueError("learningRunning")
        mode = int(data.get("work_mode", data.get(
            "mode", self.snapshot.get("status", {}).get("work_mode", 2)
        )))
        combined = action in {"set_settings", "save_mode_sensing", "set_work_mode"}
        if config.get("pir_error") == 1 and (
            action == "set_pir_sensitivity" or combined and mode != 1
        ):
            raise ValueError("pirFault")
        if config.get("radar_error") == 1 and (
            action in {
                "set_radar_sensitivity", "set_radar_range", "set_detection_thresholds",
                "set_keep_thresholds", "start_learning",
            }
            or combined and mode != 0
        ):
            raise ValueError("radarFault")
        if action == "start_learning" and mode == 0:
            raise ValueError("radarModeRequired")

    async def _async_call_locked(self, action: str, data: dict[str, Any]) -> None:
        methods: dict[str, Callable[[], Coroutine[Any, Any, Any]]] = {
            "set_settings": lambda: self._async_set_settings(data),
            "save_mode_sensing": lambda: self._async_save_mode_sensing(data),
            "save_advanced": lambda: self._async_save_advanced(data),
            "set_led": lambda: self.client.async_set_led(bool(data["enabled"])),
            "identify": self.client.async_identify,
            "set_darkness": lambda: self.client.async_set_darkness(
                bool(data["enabled"]), int(data["threshold"])
            ),
            "set_presence_timeout": lambda: self.client.async_set_presence_timeout(
                int(data["seconds"])
            ),
            "set_work_mode": lambda: self.client.async_set_work_mode(int(data["mode"])),
            "set_pir_sensitivity": lambda: self.client.async_set_pir_sensitivity(
                int(data["value"])
            ),
            "set_radar_sensitivity": lambda: self.client.async_set_radar_sensitivity(
                int(data["value"])
            ),
            "set_battery_type": lambda: self.client.async_set_battery_type(int(data["value"])),
            "set_radar_range": lambda: self.client.async_set_radar_range(
                self._validated_radar_ranges(data["ranges"])
            ),
            "set_detection_thresholds": lambda: self.client.async_set_thresholds(
                [int(value) for value in data["values"]], keep=False
            ),
            "set_keep_thresholds": lambda: self.client.async_set_thresholds(
                [int(value) for value in data["values"]], keep=True
            ),
            "set_lwr01_ranges": lambda: self.client.async_set_lwr01_ranges(
                [int(value) for value in data["enabled"]],
                [int(value) for value in data["trigger"]],
                [int(value) for value in data["hold"]],
            ),
            "set_performance_mode": lambda: self.client.async_set_performance_mode(
                bool(data["battery"]), bool(data["usb"])
            ),
            "start_learning": self.client.async_start_learning,
            "radar_reset": self.client.async_radar_reset,
            "factory_reset": self.client.async_factory_reset,
            "delete_management": self.client.async_delete_management,
        }
        if action not in methods:
            raise ValueError(f"unsupported action: {action}")
        await methods[action]()
        if action == "start_learning" and self.device.model == "LWR02":
            self.snapshot.setdefault("radar_status", {})["studying"] = 1
            self._threshold_refresh_pending = True
            self._publish()
        if action in {"set_work_mode", "save_mode_sensing", "radar_reset"}:
            self._radar_active_at = None
        if action not in {"factory_reset", "delete_management"}:
            status = await self.client.async_status()
            self.snapshot["status"] = status.as_dict()
            if self.device.model == "LWR02":
                self.snapshot["config"] = (await self.client.async_lwr02_config()).as_dict()
                if action in {"set_radar_range", "radar_reset", "save_mode_sensing"}:
                    self.snapshot["radar_status"] = (
                        await self.client.async_radar_status()
                    ).as_dict()
                if action in {
                    "set_detection_thresholds",
                    "radar_reset",
                    "save_mode_sensing",
                }:
                    self.snapshot["detection_thresholds"] = (
                        await self.client.async_thresholds(keep=False)
                    ).as_dict()
                if action in {
                    "set_keep_thresholds",
                    "radar_reset",
                    "save_mode_sensing",
                }:
                    self.snapshot["keep_thresholds"] = (
                        await self.client.async_thresholds(keep=True)
                    ).as_dict()
            else:
                self.snapshot["ranges"] = await self.client.async_get_lwr01_ranges()
                self.snapshot["config"] = await self.client.async_get_lwr01_settings()
            self._publish()

    async def _async_set_settings(self, data: dict[str, Any]) -> None:
        """Apply the settings form, then let async_call refresh only once."""
        await self.client.async_set_presence_timeout(int(data["presence_timeout"]))
        await self.client.async_set_darkness(
            bool(data["darkness_enabled"]), int(data["darkness_threshold"])
        )
        if self.device.model == "LWR01":
            await self.client.async_set_performance_mode(
                bool(data["battery_performance"]), bool(data["usb_performance"])
            )
            return
        await self.client.async_set_work_mode(int(data["work_mode"]))
        if int(data["work_mode"]) != 1:
            await self.client.async_set_pir_sensitivity(int(data["pir_sensitivity"]))
        if int(data["work_mode"]) != 0:
            await self.client.async_set_radar_sensitivity(int(data["radar_sensitivity"]))
        await self.client.async_set_battery_type(int(data["battery_type"]))

    async def _async_save_mode_sensing(self, data: dict[str, Any]) -> None:
        """Save the mode and sensing section as one user action."""
        await self.client.async_set_presence_timeout(int(data["presence_timeout"]))
        if self.device.model == "LWR01":
            await self.client.async_set_lwr01_ranges(
                [int(value) for value in data["enabled"]],
                [int(value) for value in data["trigger"]],
                [int(value) for value in data["hold"]],
            )
            return

        work_mode = int(data["work_mode"])
        await self.client.async_set_work_mode(work_mode)
        if work_mode != 1:
            await self.client.async_set_pir_sensitivity(int(data["pir_sensitivity"]))
        if work_mode != 0:
            await self.client.async_set_radar_sensitivity(int(data["radar_sensitivity"]))
            if self.snapshot.get("radar_status", {}).get("ranges_valid", True):
                await self.client.async_set_radar_range(
                    self._validated_radar_ranges(data["ranges"])
                )
            # Writing thresholds switches the firmware to custom sensitivity.
            # Preset modes use the device's own low/medium/high tables.
            if int(data["radar_sensitivity"]) == 3:
                await self.client.async_set_thresholds(
                    [int(value) for value in data["detection_thresholds"]], keep=False
                )
                await self.client.async_set_thresholds(
                    [int(value) for value in data["keep_thresholds"]], keep=True
                )

    def _validated_radar_ranges(self, values: list[int]) -> list[int]:
        """Prevent replacing unknown distance settings after a radar error."""
        if not self.snapshot.get("radar_status", {}).get("ranges_valid", True):
            raise ValueError("radar distance configuration is unavailable")
        return [int(value) for value in values]

    async def _async_save_advanced(self, data: dict[str, Any]) -> None:
        """Save the advanced section as one user action."""
        await self.client.async_set_darkness(
            bool(data["darkness_enabled"]), int(data["darkness_threshold"])
        )
        if self.device.model == "LWR01":
            await self.client.async_set_performance_mode(
                bool(data["battery_performance"]), bool(data["usb_performance"])
            )
            return
        await self.client.async_set_battery_type(int(data["battery_type"]))

    async def async_read(self, kind: str) -> dict[str, Any]:
        """Perform a foreground-only read requested by the visible panel."""
        if self.device.model != "LWR02":
            raise ValueError("real-time radar values are only available on LWR02")
        if kind not in {"detection_energy", "keep_energy", "radar_status", "sensing_status"}:
            raise ValueError(f"unsupported read: {kind}")
        async with self._radar_read_lock:
            if self._closed or not self.snapshot.get("connected"):
                raise RuntimeError("device is not connected")
            if self.viewers and self._background_viewers.issuperset(self.viewers):
                raise RuntimeError("device page is in background")
            mode = self.snapshot.get("status", {}).get("work_mode")
            if mode not in (1, 2) and not (mode == 0 and kind == "sensing_status"):
                raise ValueError("radar data is unavailable in the current mode")
            if kind in {"detection_energy", "keep_energy"}:
                if self.snapshot.get("config", {}).get("radar_error") == 1:
                    raise ValueError("radarFault")
                radar = self.snapshot.get("radar_status", {})
                if radar.get("studying") == 1:
                    raise ValueError("learningRunning")
                if radar.get("ranges_valid") is False:
                    return {"kind": kind, "available": False}
            now = asyncio.get_running_loop().time()
            if mode == 2 and (
                self._radar_active_at is None or now - self._radar_active_at >= 20
            ):
                await self.client.async_activate_radar()
                self._radar_active_at = now
            elif mode == 1:
                self._radar_active_at = None
            return await self._async_read_radar(kind)

    async def _async_read_radar(self, kind: str) -> dict[str, Any]:
        """Read after activating, serialized across viewers and chart requests."""
        if kind in {"radar_status", "sensing_status"}:
            status = (await self.client.async_radar_status()).as_dict()
            previous = self.snapshot.get("radar_status", {})
            if status.get("studying") == 1 or previous.get("studying") == 1:
                self._threshold_refresh_pending = True
            self.snapshot["radar_status"] = status
            self._publish()
            if self._threshold_refresh_pending and status.get("studying") != 1:
                # Commit the complete refresh together. A failed read leaves
                # the pending flag set so the next foreground poll retries.
                config = await self.client.async_lwr02_config()
                detection = await self.client.async_thresholds(keep=False)
                keep = await self.client.async_thresholds(keep=True)
                self.snapshot.update(
                    config=config.as_dict(), detection_thresholds=detection.as_dict(),
                    keep_thresholds=keep.as_dict(),
                )
                self._threshold_refresh_pending = False
            self._publish()
            return {"kind": kind, "values": status}
        if self._last_energy_read_at is not None:
            gap = 0.15 - (asyncio.get_running_loop().time() - self._last_energy_read_at)
            if gap > 0:
                await asyncio.sleep(gap)
        if self._closed:
            raise RuntimeError("device is not connected")
        if kind == "detection_energy":
            values = await self.client.async_energy(keep=False)
        elif kind == "keep_energy":
            values = await self.client.async_energy(keep=True)
        else:
            raise ValueError(f"unsupported read: {kind}")
        self._last_energy_read_at = asyncio.get_running_loop().time()
        return {"kind": kind, "values": values}

    async def async_close(self) -> None:
        self._closed = True
        self.viewers.clear()
        self._background_viewers.clear()
        if self._task is not None and self._task is not asyncio.current_task():
            self._task.cancel()
            await asyncio.gather(self._task, return_exceptions=True)
        await self.client.async_close()
        self._notify_closed()


class SessionManager:
    """Own active sessions and guarantee cleanup on integration unload."""

    def __init__(self, hass: HomeAssistant, store: DeviceStore, debug: DebugBuffer) -> None:
        self.hass = hass
        self.store = store
        self.debug = debug
        self.sessions: dict[str, DeviceSession] = {}
        self._lock = asyncio.Lock()

    async def async_subscribe(
        self, device_id: str, callback: EventCallback
    ) -> tuple[str, dict[str, Any]]:
        async with self._lock:
            device = self.store.get(device_id)
            if device is None:
                raise ValueError("unknown device")
            session = self.sessions.get(device_id)
            if session is None or session._closed:
                session = DeviceSession(
                    self.hass,
                    device,
                    self.store,
                    self.debug,
                    self._session_closed,
                )
                self.sessions[device_id] = session
            viewer_id = session.add_viewer(callback)
        session.start()
        return viewer_id, {"device_id": device_id, **session.snapshot}

    def _session_closed(self, session: DeviceSession) -> None:
        """Drop naturally expired and failed sessions from the registry."""
        if self.sessions.get(session.device.device_id) is session:
            self.sessions.pop(session.device.device_id, None)

    def heartbeat(self, device_id: str, viewer_id: str, *, background: bool = False) -> bool:
        session = self.sessions.get(device_id)
        return session is not None and session.heartbeat(viewer_id, background=background)

    async def async_unsubscribe(self, device_id: str, viewer_id: str) -> None:
        session = self.sessions.get(device_id)
        if session is None:
            return
        session.remove_viewer(viewer_id)
        if not session.viewers:
            await session.async_close()
            if self.sessions.get(device_id) is session:
                self.sessions.pop(device_id, None)

    async def async_action(self, device_id: str, action: str, data: dict[str, Any]) -> None:
        session = self.sessions.get(device_id)
        if session is None or not session.viewers:
            raise RuntimeError("device detail session is not open")
        await session.async_call(action, data)

    async def async_read(self, device_id: str, kind: str) -> dict[str, Any]:
        session = self.sessions.get(device_id)
        if session is None or not session.viewers:
            raise RuntimeError("device detail session is not open")
        return await session.async_read(kind)

    async def async_close_all(self) -> None:
        sessions = list(self.sessions.values())
        self.sessions.clear()
        await asyncio.gather(
            *(session.async_close() for session in sessions), return_exceptions=True
        )
