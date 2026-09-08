"""Lafaer on-demand sensor management integration."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    CONF_DEBUG_PERSIST,
    DATA_CONTROLLERS,
    DATA_PANEL_REGISTERED,
    DATA_STATIC_REGISTERED,
    DATA_WEBSOCKET_REGISTERED,
    DOMAIN,
)
from .controller import LafaerController
from .panel import async_register_panel, async_remove_panel
from .websocket_api import async_register_websocket_api


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Initialize domain-level storage without touching any sensor."""
    hass.data.setdefault(
        DOMAIN,
        {
            DATA_CONTROLLERS: {},
            DATA_PANEL_REGISTERED: False,
            DATA_STATIC_REGISTERED: False,
            DATA_WEBSOCKET_REGISTERED: False,
        },
    )
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Load an entry. This registers UI/API only and performs no I/O to devices."""
    domain_data = hass.data[DOMAIN]
    controller = LafaerController(
        hass, persist_debug=bool(entry.options.get(CONF_DEBUG_PERSIST, False))
    )
    await controller.async_load()
    domain_data[DATA_CONTROLLERS][entry.entry_id] = controller

    if not domain_data[DATA_WEBSOCKET_REGISTERED]:
        async_register_websocket_api(hass)
        domain_data[DATA_WEBSOCKET_REGISTERED] = True
    if not domain_data[DATA_PANEL_REGISTERED]:
        await async_register_panel(
            hass, register_static=not domain_data[DATA_STATIC_REGISTERED]
        )
        domain_data[DATA_STATIC_REGISTERED] = True
        domain_data[DATA_PANEL_REGISTERED] = True
    entry.async_on_unload(entry.add_update_listener(_async_options_updated))
    return True


async def _async_options_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Apply debug recording changes through a clean unload/reload."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload an entry and deterministically close every active transport."""
    domain_data = hass.data[DOMAIN]
    controller: LafaerController | None = domain_data[DATA_CONTROLLERS].pop(entry.entry_id, None)
    if controller is not None:
        await controller.async_unload()

    if not domain_data[DATA_CONTROLLERS] and domain_data[DATA_PANEL_REGISTERED]:
        async_remove_panel(hass)
        domain_data[DATA_PANEL_REGISTERED] = False
    return True
