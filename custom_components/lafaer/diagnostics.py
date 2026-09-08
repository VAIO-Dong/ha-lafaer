"""Downloadable, redacted diagnostics for Lafaer."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.redact import async_redact_data

from .const import DATA_CONTROLLERS, DOMAIN
from .controller import LafaerController

TO_REDACT = {
    "pairing_material",
    "uid",
    "host",
    "thread_mac",
    "device_id",
    "blue_id",
    "name",
}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    controller: LafaerController = hass.data[DOMAIN][DATA_CONTROLLERS][entry.entry_id]
    devices = [device.as_storage_dict() for device in controller.store.list()]
    return {
        "entry": async_redact_data(
            {"data": dict(entry.data), "options": dict(entry.options)}, TO_REDACT
        ),
        "devices": async_redact_data(devices, TO_REDACT),
        "active_session_count": len(controller.sessions.sessions),
        "debug_events": async_redact_data(controller.debug.as_list(), TO_REDACT),
    }
