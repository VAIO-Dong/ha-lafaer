"""Tests for the low-power session ownership rules."""

from __future__ import annotations

import asyncio
from typing import Any

import pytest

from custom_components.lafaer import session as session_module
from custom_components.lafaer.protocol.models import DeviceInfo, DeviceStatus, StoredDevice


class FakeHass:
    def async_create_task(self, coroutine):
        return asyncio.create_task(coroutine)


class FakeStore:
    def __init__(self, device: StoredDevice) -> None:
        self.device = device

    def get(self, device_id: str) -> StoredDevice | None:
        return self.device if device_id == self.device.device_id else None

    async def async_save_device(self, device: StoredDevice) -> None:
        self.device = device


class FakeDebug:
    def __init__(self) -> None:
        self.events: list[tuple[str, str]] = []

    def add(self, category: str, message: str, **kwargs: Any) -> None:
        self.events.append((category, message))

    def protocol_callback(self, event: str, data: dict[str, Any]) -> None:
        pass


class FakeClient:
    instances: list[FakeClient] = []

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        self.closed = False
        self.status_calls = 0
        self.instances.append(self)

    async def async_authenticate(self, uid: str) -> str:
        return "pairing"

    async def async_status(self) -> DeviceStatus:
        self.status_calls += 1
        return DeviceStatus(False, 0, 50, 100)

    async def async_information(self) -> DeviceInfo:
        return DeviceInfo(model="LWR01")

    async def async_get_lwr01_ranges(self) -> dict[str, list[int]]:
        return {
            "led_enabled": True,
            "enabled": [1] * 8,
            "trigger": [50] * 8,
            "hold": [50] * 8,
        }

    async def async_get_lwr01_settings(self) -> dict[str, Any]:
        return {
            "darkness_enabled": False,
            "darkness_threshold": 100,
            "battery_performance": False,
            "usb_performance": True,
            "trigger_delay": 0,
            "presence_timeout": 30,
        }

    async def async_close(self) -> None:
        self.closed = True


class SlowClient(FakeClient):
    started: asyncio.Event

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self.started = asyncio.Event()
        self.release = asyncio.Event()

    async def async_authenticate(self, uid: str) -> str:
        self.started.set()
        await self.release.wait()
        return "pairing"


@pytest.fixture
def manager(monkeypatch: pytest.MonkeyPatch):
    FakeClient.instances.clear()
    monkeypatch.setattr(session_module, "LafaerProtocolClient", FakeClient)
    device = StoredDevice(
        device_id="dev1",
        model="LWR01",
        host="fd00::1",
        uid="uid1",
        pairing_material="pairing",
    )
    return session_module.SessionManager(FakeHass(), FakeStore(device), FakeDebug())


@pytest.mark.asyncio
async def test_no_client_without_detail_viewer(manager) -> None:
    assert manager.sessions == {}
    assert FakeClient.instances == []


@pytest.mark.asyncio
async def test_last_viewer_closes_transport(manager) -> None:
    viewer_id, _ = await manager.async_subscribe("dev1", lambda event: None)
    client = FakeClient.instances[0]
    assert client.closed is False

    await manager.async_unsubscribe("dev1", viewer_id)

    assert client.closed is True
    assert manager.sessions == {}


@pytest.mark.asyncio
async def test_shared_session_closes_after_last_viewer(manager) -> None:
    first, _ = await manager.async_subscribe("dev1", lambda event: None)
    second, _ = await manager.async_subscribe("dev1", lambda event: None)
    client = FakeClient.instances[0]
    assert len(FakeClient.instances) == 1

    await manager.async_unsubscribe("dev1", first)
    assert client.closed is False

    await manager.async_unsubscribe("dev1", second)
    assert client.closed is True


@pytest.mark.asyncio
async def test_expired_lease_closes_abandoned_transport(manager, monkeypatch) -> None:
    monkeypatch.setattr(session_module, "STATUS_INTERVAL", 0.01)
    viewer_id, _ = await manager.async_subscribe("dev1", lambda event: None)
    active = manager.sessions["dev1"]
    _, callback = active.viewers[viewer_id]
    active.viewers[viewer_id] = (asyncio.get_running_loop().time() - 1, callback)

    await asyncio.wait_for(active._task, timeout=0.2)

    assert FakeClient.instances[0].closed is True
    assert active.viewers == {}
    assert manager.sessions == {}


@pytest.mark.asyncio
async def test_subscribe_can_be_cancelled_during_initial_load(manager, monkeypatch) -> None:
    monkeypatch.setattr(session_module, "LafaerProtocolClient", SlowClient)

    viewer_id, snapshot = await asyncio.wait_for(
        manager.async_subscribe("dev1", lambda event: None), timeout=0.05
    )
    client = FakeClient.instances[-1]
    await client.started.wait()

    assert snapshot["connected"] is False
    await manager.async_unsubscribe("dev1", viewer_id)

    assert client.closed is True
    assert manager.sessions == {}


@pytest.mark.asyncio
async def test_old_unsubscribe_does_not_remove_replacement_session(manager) -> None:
    viewer_id, _ = await manager.async_subscribe("dev1", lambda event: None)
    old_session = manager.sessions["dev1"]
    await old_session._ready.wait()
    close_started = asyncio.Event()
    allow_close = asyncio.Event()
    original_close = old_session.async_close

    async def delayed_close() -> None:
        old_session._closed = True
        close_started.set()
        await allow_close.wait()
        await original_close()

    old_session.async_close = delayed_close  # type: ignore[method-assign]
    unsubscribe_task = asyncio.create_task(manager.async_unsubscribe("dev1", viewer_id))
    await close_started.wait()

    replacement_viewer, _ = await manager.async_subscribe("dev1", lambda event: None)
    replacement = manager.sessions["dev1"]
    allow_close.set()
    await unsubscribe_task

    assert replacement is not old_session
    assert manager.sessions["dev1"] is replacement
    await manager.async_unsubscribe("dev1", replacement_viewer)
