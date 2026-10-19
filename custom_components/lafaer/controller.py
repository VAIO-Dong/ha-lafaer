"""Top-level controller for one Lafaer config entry."""

from __future__ import annotations

import asyncio
from typing import Any

from homeassistant.core import HomeAssistant

from .const import DISCOVERY_TIMEOUT
from .debug import DebugBuffer, exception_summary
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
        self._discovery_task: asyncio.Task[list[dict[str, Any]]] | None = None

    async def async_load(self) -> None:
        await self.store.async_load()
        await self.debug.async_start()

    async def async_unload(self) -> None:
        if self._discovery_task is not None:
            self._discovery_task.cancel()
            await asyncio.gather(self._discovery_task, return_exceptions=True)
            self._discovery_task = None
        await self.sessions.async_close_all()
        await self.debug.async_close()

    async def async_discover(
        self, scan_duration: float = DISCOVERY_TIMEOUT
    ) -> list[dict[str, Any]]:
        """Join the current scan, including its single cache update, if active."""
        if self._discovery_task is None or self._discovery_task.done():
            self._discovery_task = self.hass.async_create_task(
                self._async_discover(scan_duration)
            )
            self._discovery_task.add_done_callback(self._discovery_done)
        # A closed browser must not cancel the scan other viewers are awaiting.
        return await asyncio.shield(self._discovery_task)

    @staticmethod
    def _discovery_done(task: asyncio.Task[list[dict[str, Any]]]) -> None:
        """Retrieve failures even if every requesting browser has disconnected."""
        if not task.cancelled():
            task.exception()

    async def _async_discover(self, scan_duration: float) -> list[dict[str, Any]]:
        """Run and publish one bounded discovery without contacting sensors."""
        self.debug.add("discovery", "scan started")
        revision = self.store.discovery_revision
        try:
            devices = await self.discovery.async_scan(scan_duration)
            cached_devices = await self.store.async_update_discovery(
                devices, expected_revision=revision
            )
            output: list[dict[str, Any]] = []
            for device in cached_devices:
                public = device.as_public_dict()
                stored = self.store.get(device.device_id)
                public["adopted"] = stored is not None and stored.model == device.model
                output.append(public)
                if device.available and stored is not None and stored.model == device.model:
                    stored.host = device.host
                    stored.version = device.version
                    stored.icd_lit = device.icd_lit
                    stored.icd_last_seen = device.icd_last_seen
                    if device.blue_id:
                        stored.blue_id = device.blue_id
                    await self.store.async_save_device(stored)
        except Exception as err:
            self.debug.add(
                "discovery", "scan failed", level="error",
                data={"error": exception_summary(err)},
            )
            raise
        self.debug.add(
            "discovery", "scan finished",
            data={"device_count": len(devices), "cached_device_count": len(output)},
        )
        return output
