"""Register the bundled Home Assistant panel."""

from __future__ import annotations

from inspect import isawaitable
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import PANEL_COMPONENT, PANEL_MODULE_URL, PANEL_URL


async def async_register_panel(
    hass: HomeAssistant, *, register_static: bool = True
) -> None:
    """Serve and register the prebuilt panel once."""
    frontend_path = Path(__file__).parent / "frontend" / "ha-lafaer-panel.js"
    if register_static:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(PANEL_MODULE_URL, str(frontend_path), True)]
        )
    registration = panel_custom.async_register_panel(
        hass,
        webcomponent_name=PANEL_COMPONENT,
        frontend_url_path=PANEL_URL,
        module_url=PANEL_MODULE_URL,
        sidebar_title="Lafaer",
        sidebar_icon="mdi:motion-sensor",
        require_admin=False,
    )
    # Home Assistant changed this API from a synchronous callback to a
    # coroutine. Supporting both keeps the integration compatible with the
    # declared minimum version as well as current releases.
    if isawaitable(registration):
        await registration



def async_remove_panel(hass: HomeAssistant) -> None:
    """Remove the sidebar panel."""
    frontend.async_remove_panel(hass, PANEL_URL)
