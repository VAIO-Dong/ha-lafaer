"""Private storage for adopted sensors and their exclusive credentials."""

from __future__ import annotations

import asyncio
from dataclasses import asdict
from datetime import UTC, datetime
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_VERSION
from .protocol.models import DiscoveredDevice, StoredDevice


class DeviceStore:
    """Serialize device metadata in Home Assistant's private .storage area."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._devices: dict[str, StoredDevice] = {}
        self._discovered: dict[str, DiscoveredDevice] = {}
        self._lock = asyncio.Lock()

    async def async_load(self) -> None:
        raw = await self._store.async_load() or {}
        self._devices = {
            device_id: StoredDevice.from_storage_dict(value)
            for device_id, value in raw.get("devices", {}).items()
        }
        self._discovered = {}
        for cache_key, stored_value in raw.get("discovered", {}).items():
            value = dict(stored_value)
            value.pop("available", None)
            self._discovered[cache_key] = DiscoveredDevice(**value, available=False)

    def get(self, device_id: str) -> StoredDevice | None:
        return self._devices.get(device_id)

    def list(self) -> list[StoredDevice]:
        return list(self._devices.values())

    def get_discovered(self, device_id: str, model: str) -> DiscoveredDevice | None:
        """Return the cached discovery record for a device ID."""
        return self._discovered.get(f"{model}:{device_id}")

    def list_discovered(self) -> list[DiscoveredDevice]:
        """Return remembered discoveries, including offline records."""
        return sorted(
            self._discovered.values(), key=lambda item: (item.model, item.device_id)
        )

    async def async_update_discovery(
        self, devices: list[DiscoveredDevice]
    ) -> list[DiscoveredDevice]:
        """Cache one complete scan and mark records not seen this time offline."""
        async with self._lock:
            for cached in self._discovered.values():
                cached.available = False

            seen_at = datetime.now(UTC).isoformat()
            for device in devices:
                device.available = True
                device.last_seen = seen_at
                self._discovered[f"{device.model}:{device.device_id}"] = device

            await self._async_save()
            return self.list_discovered()

    async def async_save_device(self, device: StoredDevice) -> None:
        async with self._lock:
            self._devices[device.device_id] = device
            await self._async_save()

    async def async_remove_device(self, device_id: str) -> None:
        async with self._lock:
            self._devices.pop(device_id, None)
            await self._async_save()

    async def _async_save(self) -> None:
        discovered = {}
        for cache_key, device in self._discovered.items():
            value = asdict(device)
            value.pop("available", None)
            discovered[cache_key] = value
        await self._store.async_save(
            {
                "devices": {
                    device_id: device.as_storage_dict()
                    for device_id, device in self._devices.items()
                },
                "discovered": discovered,
            }
        )
