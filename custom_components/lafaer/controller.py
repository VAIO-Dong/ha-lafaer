"""Top-level controller for one Lafaer config entry."""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from typing import Any

from homeassistant.core import HomeAssistant

from .const import DISCOVERY_TIMEOUT
from .debug import DebugBuffer, exception_summary
from .discovery import OnDemandDiscovery
from .protocol.models import DiscoveredDevice
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
        self._discovery_listeners: set[Callable[[dict[str, Any]], None]] = set()
        self._discovery_waiters = 0
        self._scan_id = 0
        self._scan_seen: set[tuple[str, str]] = set()
        self._scan_error: str | None = None

    async def async_load(self) -> None:
        await self.store.async_load()
        await self.debug.async_start()

    async def async_unload(self) -> None:
        self._discovery_listeners.clear()
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
        self._discovery_waiters += 1
        try:
            return await asyncio.shield(self._ensure_discovery(scan_duration))
        finally:
            self._discovery_waiters -= 1
            self._cancel_unused_discovery()

    def subscribe_discovery(
        self, listener: Callable[[dict[str, Any]], None]
    ) -> Callable[[], None]:
        """Immediately replay cache/current progress, then share the active scan."""
        self._discovery_listeners.add(listener)
        self._ensure_discovery(DISCOVERY_TIMEOUT)
        listener(self.discovery_snapshot())

        def unsubscribe() -> None:
            self._discovery_listeners.discard(listener)
            self._cancel_unused_discovery()

        return unsubscribe

    def _cancel_unused_discovery(self) -> None:
        if (
            not self._discovery_listeners and not self._discovery_waiters
            and self._discovery_task is not None and not self._discovery_task.done()
            and not self._discovery_task.cancelling()
        ):
            self._discovery_task.cancel()

    def _ensure_discovery(self, duration: float) -> asyncio.Task[list[dict[str, Any]]]:
        previous = self._discovery_task
        if previous is None or previous.done() or previous.cancelling():
            self._scan_id += 1
            self._scan_seen = set()
            self._scan_error = None

            async def run() -> list[dict[str, Any]]:
                # Finish cleanup before opening a replacement browser.
                if previous is not None and not previous.done():
                    await asyncio.gather(previous, return_exceptions=True)
                try:
                    async with asyncio.timeout(DISCOVERY_TIMEOUT + 7):
                        return await self._async_discover(duration)
                except Exception as err:
                    self._scan_error = exception_summary(err)
                    raise

            self._discovery_task = self.hass.async_create_task(run())
            self._discovery_task.add_done_callback(self._discovery_done)
        return self._discovery_task

    def discovery_snapshot(self) -> dict[str, Any]:
        """Return progress without claiming that cached records were found now."""
        records = []
        for device in self.store.list_discovered():
            public = device.as_public_dict()
            public["available"] = (device.model, device.device_id) in self._scan_seen
            stored = self.store.get(device.device_id)
            public["adopted"] = stored is not None and stored.model == device.model
            records.append(public)
        return {
            "scan_id": self._scan_id,
            "revision": self.store.discovery_revision,
            "scanning": self._discovery_task is not None and not self._discovery_task.done(),
            "error": self._scan_error,
            "devices": [device.as_public_dict() for device in self.store.list()],
            "discovered": records,
        }

    def publish_discovery(self) -> None:
        """Notify list viewers, including after rename/removal/adoption."""
        event = self.discovery_snapshot()
        for listener in tuple(self._discovery_listeners):
            try:
                listener(event)
            except Exception as err:
                self._discovery_listeners.discard(listener)
                self.debug.add(
                    "discovery", "viewer disconnected", level="debug",
                    data={"error": exception_summary(err)},
                )
        self._cancel_unused_discovery()

    async def async_clear_discovery_history(self) -> None:
        """Clear records not found in this round, not last round's availability."""
        await self.store.async_clear_discovery_history(current_seen=self._scan_seen)
        self.publish_discovery()

    def _discovery_done(self, task: asyncio.Task[list[dict[str, Any]]]) -> None:
        """Retrieve failures even if every requesting browser has disconnected."""
        if not task.cancelled():
            task.exception()
        if task is self._discovery_task:
            self.publish_discovery()

    async def _async_discover(self, scan_duration: float) -> list[dict[str, Any]]:
        """Run and publish one bounded discovery without contacting sensors."""
        self.debug.add("discovery", "scan started")
        revision = self.store.discovery_revision

        async def update(devices: list[DiscoveredDevice]) -> None:
            cached = await self.store.async_update_discovery(
                devices, expected_revision=revision, complete=False
            )
            accepted = {(device.model, device.device_id) for device in cached}
            self._scan_seen = {
                (device.model, device.device_id) for device in devices
            } & accepted
            self.publish_discovery()

        try:
            devices = await self.discovery.async_scan(scan_duration, on_update=update)
            cached_devices = await self.store.async_update_discovery(
                devices, expected_revision=revision
            )
            output: list[dict[str, Any]] = []
            for device in cached_devices:
                public = device.as_public_dict()
                stored = self.store.get(device.device_id)
                public["adopted"] = stored is not None and stored.model == device.model
                output.append(public)
            self._scan_seen = {
                (device.model, device.device_id) for device in cached_devices if device.available
            }
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
