"""Top-level controller for one Lafaer config entry."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from .debug import DebugBuffer
from .discovery import OnDemandDiscovery
from .session import SessionManager
from .storage import DeviceStore


class LafaerController:
    def __init__(self, hass: HomeAssistant, *, persist_debug: bool = False) -> None:
        self.hass = hass
        self.debug = DebugBuffer(hass, persist=persist_debug)
        self.store = DeviceStore(hass)
        self.discovery = OnDemandDiscovery(hass)
        self.sessions = SessionManager(hass, self.store, self.debug)

    async def async_load(self) -> None:
        await self.store.async_load()
        await self.debug.async_start()

    async def async_unload(self) -> None:
        await self.sessions.async_close_all()
        await self.debug.async_close()
