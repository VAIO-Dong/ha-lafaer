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
        self.discovery_revision = 0
        self._discovery_removed: dict[str, int] = {}

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
        self, devices: list[DiscoveredDevice], *, expected_revision: int | None = None,
        complete: bool = True,
    ) -> list[DiscoveredDevice]:
        """Merge discoveries; only a completed scan may mark unseen records absent."""
        async with self._lock:
            if complete:
                for cached in self._discovered.values():
                    cached.available = False

            seen_at = datetime.now(UTC).isoformat()
            for device in devices:
                key = f"{device.model}:{device.device_id}"
                if (
                    expected_revision is not None
                    and self._discovery_removed.get(key, -1) > expected_revision
                ):
                    continue
                device.available = True
                device.last_seen = seen_at
                self._discovered[key] = device
                stored = self.get(device.device_id)
                if stored is not None and stored.model == device.model:
                    stored.host = device.host
                    stored.version = device.version
                    stored.icd_lit = device.icd_lit
                    stored.icd_last_seen = device.icd_last_seen
                    if device.blue_id:
                        stored.blue_id = device.blue_id

            await self._async_save()
            return self.list_discovered()

    async def async_save_device(self, device: StoredDevice) -> None:
        async with self._lock:
            self._devices[device.device_id] = device
            await self._async_save()

    async def async_remove_device(self, device_id: str) -> None:
        async with self._lock:
            stored = self._devices.pop(device_id, None)
            self.discovery_revision += 1
            if stored is not None:
                self._discovery_removed[f"{stored.model}:{device_id}"] = self.discovery_revision
            for key, item in self._discovered.items():
                if item.device_id == device_id:
                    self._discovery_removed[key] = self.discovery_revision
            self._discovered = {
                key: item for key, item in self._discovered.items()
                if item.device_id != device_id
            }
            await self._async_save()

    async def async_remove_discovery(self, device_id: str, model: str) -> None:
        """Forget a discovery record, never device ownership or credentials."""
        async with self._lock:
            self._discovered.pop(f"{model}:{device_id}", None)
            self.discovery_revision += 1
            self._discovery_removed[f"{model}:{device_id}"] = self.discovery_revision
            await self._async_save()

    async def async_clear_discovery_history(
        self, *, current_seen: set[tuple[str, str]] | None = None
    ) -> None:
        """Clear unseen, unmanaged records without touching current discoveries."""
        async with self._lock:
            old_keys = set(self._discovered)
            self._discovered = {
                key: item for key, item in self._discovered.items()
                if (item.available if current_seen is None else
                    (item.model, item.device_id) in current_seen) or (
                    item.device_id in self._devices
                    and self._devices[item.device_id].model == item.model
                )
            }
            self.discovery_revision += 1
            for key in old_keys - self._discovered.keys():
                self._discovery_removed[key] = self.discovery_revision
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
