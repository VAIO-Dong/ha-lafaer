"""Tests for the low-power session ownership rules."""

from __future__ import annotations

import asyncio
from typing import Any
from unittest.mock import AsyncMock

import pytest

from custom_components.lafaer import session as session_module
from custom_components.lafaer.protocol.models import (
    DeviceInfo,
    DeviceStatus,
    StoredDevice,
)


class FakeHass:
    def async_create_task(self, coroutine):
        return asyncio.create_task(coroutine)


@pytest.mark.asyncio
async def test_radar_activation_is_foreground_mode_gated_and_shared() -> None:
    device = StoredDevice(
        device_id="radar", model="LWR02", host="fd00::1", pairing_material="pairing"
    )
    session = session_module.DeviceSession(FakeHass(), device, FakeStore(device), FakeDebug())
    session.client = AsyncMock()
    session.client.async_energy.return_value = [12]
    session.snapshot = {"connected": True, "status": {"work_mode": 2}}
    await asyncio.gather(
        session.async_read("detection_energy"), session.async_read("keep_energy")
    )
    session.client.async_activate_radar.assert_awaited_once()
    session._radar_active_at -= 25
    await session.async_read("detection_energy")
    assert session.client.async_activate_radar.await_count == 2
    session.snapshot["status"]["work_mode"] = 1
    await session.async_read("detection_energy")
    assert session.client.async_activate_radar.await_count == 2
    session.snapshot["status"]["work_mode"] = 0
    with pytest.raises(ValueError, match="unavailable"):
        await session.async_read("detection_energy")
    assert session.client.async_energy.await_count == 4
    await session.async_close()
    with pytest.raises(RuntimeError, match="not connected"):
        await session.async_read("detection_energy")
    assert session.client.async_activate_radar.await_count == 2


@pytest.mark.asyncio
async def test_failed_initial_read_cancels_siblings_before_returning() -> None:
    started = asyncio.Event()
    cancelled = asyncio.Event()

    async def fail():
        await started.wait()
        raise ValueError("radar error")

    async def sibling():
        started.set()
        try:
            await asyncio.Event().wait()
        finally:
            cancelled.set()

    with pytest.raises(ValueError, match="radar error"):
        await session_module._gather_reads(fail(), sibling())
    assert cancelled.is_set()


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


@pytest.mark.asyncio
@pytest.mark.parametrize("work_mode", [0, 1])
async def test_lwr02_mode_save_only_writes_active_sensor_settings(work_mode: int) -> None:
    device = StoredDevice(
        device_id="lwr2",
        model="LWR02",
        host="fd00::2",
        uid="uid2",
        pairing_material="pairing",
    )
    session = session_module.DeviceSession(
        FakeHass(), device, FakeStore(device), FakeDebug()
    )
    client = session.client
    client.async_set_presence_timeout = AsyncMock()
    client.async_set_work_mode = AsyncMock()
    client.async_set_pir_sensitivity = AsyncMock()
    client.async_set_radar_sensitivity = AsyncMock()
    client.async_set_radar_range = AsyncMock()
    client.async_set_thresholds = AsyncMock()

    await session._async_save_mode_sensing(
        {
            "presence_timeout": 30,
            "work_mode": work_mode,
            "pir_sensitivity": 2,
            "radar_sensitivity": 3,
            "ranges": [0] * 15,
            "detection_thresholds": [100] * 15,
            "keep_thresholds": [80] * 15,
        }
    )

    if work_mode == 0:
        client.async_set_pir_sensitivity.assert_awaited_once_with(2)
        client.async_set_radar_sensitivity.assert_not_awaited()
        client.async_set_radar_range.assert_not_awaited()
        client.async_set_thresholds.assert_not_awaited()
    else:
        client.async_set_pir_sensitivity.assert_not_awaited()
        client.async_set_radar_sensitivity.assert_awaited_once_with(3)
        client.async_set_radar_range.assert_awaited_once_with([0] * 15)
        assert client.async_set_thresholds.await_count == 2
    await session.async_close()
