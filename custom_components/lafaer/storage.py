"""Private storage for adopted sensors and their exclusive credentials."""

from __future__ import annotations

import asyncio
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_VERSION
from .protocol.models import StoredDevice


class DeviceStore:
    """Serialize device metadata in Home Assistant's private .storage area."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._devices: dict[str, StoredDevice] = {}
        self._lock = asyncio.Lock()

    async def async_load(self) -> None:
        raw = await self._store.async_load() or {}
        self._devices = {
            device_id: StoredDevice.from_storage_dict(value)
            for device_id, value in raw.get("devices", {}).items()
        }

    def get(self, device_id: str) -> StoredDevice | None:
        return self._devices.get(device_id)

    def list(self) -> list[StoredDevice]:
        return list(self._devices.values())

    async def async_save_device(self, device: StoredDevice) -> None:
        async with self._lock:
            self._devices[device.device_id] = device
            await self._async_save()

    async def async_remove_device(self, device_id: str) -> None:
        async with self._lock:
            self._devices.pop(device_id, None)
            await self._async_save()

    async def _async_save(self) -> None:
        await self._store.async_save(
            {
                "devices": {
                    device_id: device.as_storage_dict()
                    for device_id, device in self._devices.items()
                }
            }
        )
