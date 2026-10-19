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

from custom_components.lafaer.protocol.models import DiscoveredDevice, StoredDevice  # noqa: E402
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


async def test_icd_metadata_survives_reload_and_can_be_cleared_by_new_scan() -> None:
    store = DeviceStore(object())
    await store.async_update_discovery([
        DiscoveredDevice(
            device_id="icd", model="LWR02", host="fd00::1",
            icd_lit=True, icd_last_seen="2026-10-19T00:00:00+00:00",
        )
    ])
    await store.async_load()
    cached = store.get_discovered("icd", "LWR02")
    assert cached.icd_lit is True
    assert cached.icd_last_seen == "2026-10-19T00:00:00+00:00"
    assert cached.available is False
    await store.async_update_discovery([
        DiscoveredDevice(device_id="icd", model="LWR02", host="fd00::1")
    ])
    cached = store.get_discovered("icd", "LWR02")
    assert cached.icd_lit is None
    assert cached.icd_last_seen is None


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


async def test_forgetting_offline_device_removes_credentials_and_discovery() -> None:
    store = DeviceStore(object())
    await store.async_save_device(StoredDevice(
        device_id="old", model="LWR02", host="fd00::1", pairing_material="private"
    ))
    await store.async_update_discovery([
        DiscoveredDevice(device_id="old", model="LWR02", host="fd00::1")
    ])
    await store.async_update_discovery([])
    await store.async_remove_device("old")
    assert store.get("old") is None
    assert store.list_discovered() == []
    await store.async_load()
    assert store.get("old") is None
    assert store.list_discovered() == []


async def test_clear_history_keeps_managed_and_current_discoveries() -> None:
    store = DeviceStore(object())
    records = [DiscoveredDevice(device_id=key, model="LWR02", host="fd00::1")
               for key in ("managed", "historical", "current")]
    await store.async_update_discovery(records)
    await store.async_save_device(StoredDevice(
        device_id="managed", model="LWR02", host="fd00::1", pairing_material="private"
    ))
    await store.async_update_discovery([records[2]])
    await store.async_clear_discovery_history()
    assert {item.device_id for item in store.list_discovered()} == {"managed", "current"}
    assert store.get("managed").pairing_material == "private"
    await store.async_load()
    assert {item.device_id for item in store.list_discovered()} == {"managed", "current"}


async def test_delete_single_record_and_prevent_inflight_scan_resurrection() -> None:
    store = DeviceStore(object())
    records = [DiscoveredDevice(device_id="same-id", model=model, host="fd00::1")
               for model in ("LWR01", "LWR02")]
    await store.async_update_discovery(records)
    old_revision = store.discovery_revision
    await store.async_remove_discovery("same-id", "LWR02")
    await store.async_update_discovery(records, expected_revision=old_revision)
    assert store.get_discovered("same-id", "LWR02") is None
    assert store.get_discovered("same-id", "LWR01") is not None
    await store.async_load()
    assert store.get_discovered("same-id", "LWR02") is None
    # A subsequent, explicitly started scan can discover it again.
    await store.async_update_discovery(records, expected_revision=store.discovery_revision)
    assert store.get_discovered("same-id", "LWR02") is not None
