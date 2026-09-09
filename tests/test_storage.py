"""Tests for persistent discovery and credential storage."""

from __future__ import annotations

import sys
import types
from typing import Any

homeassistant = sys.modules.setdefault("homeassistant", types.ModuleType("homeassistant"))
helpers = sys.modules.setdefault(
    "homeassistant.helpers", types.ModuleType("homeassistant.helpers")
)
ha_storage = sys.modules.setdefault(
    "homeassistant.helpers.storage", types.ModuleType("homeassistant.helpers.storage")
)
core = sys.modules.setdefault("homeassistant.core", types.ModuleType("homeassistant.core"))


class FakeStore:
    """Small in-memory replacement for Home Assistant Store."""

    def __class_getitem__(cls, item: Any) -> type[FakeStore]:
        return cls

    def __init__(self, *args: Any) -> None:
        self.data: dict[str, Any] | None = None

    async def async_load(self) -> dict[str, Any] | None:
        return self.data

    async def async_save(self, data: dict[str, Any]) -> None:
        self.data = data


ha_storage.Store = FakeStore
core.HomeAssistant = object
helpers.storage = ha_storage
homeassistant.helpers = helpers

from custom_components.lafaer.protocol.models import DiscoveredDevice  # noqa: E402
from custom_components.lafaer.storage import DeviceStore  # noqa: E402


async def test_discovery_cache_marks_unseen_devices_offline() -> None:
    store = DeviceStore(object())
    first = DiscoveredDevice(
        device_id="first",
        model="LWR01",
        host="fd00::1",
        thread_mac="aabb",
    )

    initial = await store.async_update_discovery([first])
    first_seen = initial[0].last_seen

    assert initial[0].available is True
    assert first_seen is not None

    second = DiscoveredDevice(
        device_id="second",
        model="LWR02",
        host="fd00::2",
        thread_mac="ccdd",
    )
    updated = await store.async_update_discovery([second])

    assert [(item.device_id, item.available) for item in updated] == [
        ("first", False),
        ("second", True),
    ]
    assert updated[0].last_seen == first_seen


async def test_discovery_cache_survives_reload_as_offline() -> None:
    store = DeviceStore(object())
    await store.async_update_discovery(
        [
            DiscoveredDevice(
                device_id="cached",
                model="LWR01",
                host="fd00::3",
                thread_mac="eeff",
            )
        ]
    )
    saved = store._store.data

    assert saved is not None
    assert "available" not in saved["discovered"]["LWR01:cached"]

    reloaded = DeviceStore(object())
    reloaded._store.data = saved
    await reloaded.async_load()

    cached = reloaded.get_discovered("cached", "LWR01")
    assert cached is not None
    assert cached.available is False
    assert cached.last_seen is not None
