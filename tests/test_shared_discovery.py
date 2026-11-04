"""Controller discovery is single-flight across WebSocket callers."""

from __future__ import annotations

import asyncio
import importlib.util
import sys
import types
from pathlib import Path
from unittest.mock import ANY, AsyncMock, Mock

import pytest

from custom_components.lafaer.protocol.models import DiscoveredDevice


@pytest.fixture
def controller(monkeypatch):
    """Load the real controller with isolated HA/transport dependencies."""
    package = "custom_components.lafaer"
    dependencies = {
        "homeassistant.core": {"HomeAssistant": object},
        f"{package}.debug": {
            "DebugBuffer": lambda *args, **kwargs: Mock(),
            "exception_summary": lambda err: f"{type(err).__name__}: {err}",
        },
        f"{package}.discovery": {"OnDemandDiscovery": lambda *args: Mock()},
        f"{package}.storage": {"DeviceStore": lambda *args: Mock()},
        f"{package}.session": {"SessionManager": lambda *args: Mock()},
    }
    for name, attributes in dependencies.items():
        module = types.ModuleType(name)
        module.__dict__.update(attributes)
        monkeypatch.setitem(sys.modules, name, module)
    path = Path(__file__).parents[1] / "custom_components/lafaer/controller.py"
    spec = importlib.util.spec_from_file_location(f"{package}._test_controller", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    hass = types.SimpleNamespace(async_create_task=asyncio.create_task)
    instance = module.LafaerController(hass)
    instance.store.discovery_revision = 0
    instance.store.get.return_value = None
    instance.store.list.return_value = []
    instance.store.list_discovered.return_value = []
    instance.store.async_update_discovery = AsyncMock(side_effect=lambda devices, **_: devices)
    instance.sessions.async_close_all = AsyncMock()
    instance.debug.async_close = AsyncMock()
    return instance


def controlled_scan(controller):
    """Hold a real controller scan pending until explicitly released."""
    started = asyncio.Event()
    release = asyncio.Event()
    device = DiscoveredDevice(device_id="test", model="LWR02", host="fd00::1")

    async def scan(duration, *, on_update):
        started.set()
        await release.wait()
        return [device]

    controller.discovery.async_scan = AsyncMock(side_effect=scan)
    return started, release


async def test_concurrent_requests_share_scan_duration_cache_and_result(controller):
    started, release = controlled_scan(controller)
    first = asyncio.create_task(controller.async_discover(15))
    await started.wait()
    # Later requests must join even if they ask for a different scan duration.
    second = asyncio.create_task(controller.async_discover(1))
    third = asyncio.create_task(controller.async_discover(10))
    await asyncio.sleep(0)
    controller.discovery.async_scan.assert_awaited_once_with(15, on_update=ANY)
    release.set()
    results = await asyncio.gather(first, second, third)
    assert results[0] is results[1] is results[2]
    assert results[0][0]["device_id"] == "test"
    controller.store.async_update_discovery.assert_awaited_once()
    assert [call.args[1] for call in controller.debug.add.call_args_list] == [
        "scan started", "scan finished",
    ]
    # Finished results do not prevent a fresh, explicitly requested scan.
    await controller.async_discover(3)
    assert controller.discovery.async_scan.await_count == 2
    controller.discovery.async_scan.assert_awaited_with(3, on_update=ANY)


async def test_closing_one_browser_does_not_cancel_shared_scan(controller):
    started, release = controlled_scan(controller)
    first = asyncio.create_task(controller.async_discover())
    await started.wait()
    second = asyncio.create_task(controller.async_discover())
    await asyncio.sleep(0)
    first.cancel()
    with pytest.raises(asyncio.CancelledError):
        await first
    assert not controller._discovery_task.done()
    release.set()
    assert (await second)[0]["device_id"] == "test"
    controller.discovery.async_scan.assert_awaited_once()


async def test_last_waiter_leaving_cancels_scan_and_new_viewer_can_restart(controller):
    started, release = controlled_scan(controller)
    first = asyncio.create_task(controller.async_discover())
    await started.wait()
    first.cancel()
    with pytest.raises(asyncio.CancelledError):
        await first
    await asyncio.gather(controller._discovery_task, return_exceptions=True)
    second = asyncio.create_task(controller.async_discover())
    await asyncio.sleep(0)
    release.set()
    await second
    assert controller.discovery.async_scan.await_count == 2


async def test_failure_reaches_all_waiters_and_allows_retry(controller):
    started = asyncio.Event()
    release = asyncio.Event()

    async def fail(duration, *, on_update):
        started.set()
        await release.wait()
        raise OSError("discovery unavailable")

    controller.discovery.async_scan = AsyncMock(side_effect=fail)
    first = asyncio.create_task(controller.async_discover())
    await started.wait()
    second = asyncio.create_task(controller.async_discover())
    await asyncio.sleep(0)
    release.set()
    results = await asyncio.gather(first, second, return_exceptions=True)
    assert all(isinstance(result, OSError) for result in results)
    controller.discovery.async_scan.assert_awaited_once()
    controller.store.async_update_discovery.assert_not_awaited()
    assert [call.args[1] for call in controller.debug.add.call_args_list] == [
        "scan started", "scan failed",
    ]
    controller.discovery.async_scan = AsyncMock(return_value=[])
    assert await controller.async_discover() == []


async def test_late_join_after_deletion_keeps_original_cache_revision(controller):
    started, release = controlled_scan(controller)

    async def update(devices, *, expected_revision):
        return devices if expected_revision == controller.store.discovery_revision else []

    controller.store.async_update_discovery.side_effect = update
    first = asyncio.create_task(controller.async_discover())
    await started.wait()
    controller.store.discovery_revision += 1  # User deleted a cached record.
    second = asyncio.create_task(controller.async_discover())
    await asyncio.sleep(0)
    release.set()
    assert await asyncio.gather(first, second) == [[], []]
    controller.store.async_update_discovery.assert_awaited_once()
    assert controller.store.async_update_discovery.call_args.kwargs == {"expected_revision": 0}


async def test_unload_cancels_shared_scan_and_all_waiters(controller):
    started, _ = controlled_scan(controller)
    first = asyncio.create_task(controller.async_discover())
    await started.wait()
    second = asyncio.create_task(controller.async_discover())
    await asyncio.sleep(0)
    await controller.async_unload()
    results = await asyncio.gather(first, second, return_exceptions=True)
    assert all(isinstance(result, asyncio.CancelledError) for result in results)
    assert controller._discovery_task is None
    controller.store.async_update_discovery.assert_not_awaited()
    controller.sessions.async_close_all.assert_awaited_once()
    controller.debug.async_close.assert_awaited_once()


async def test_subscribers_receive_cache_then_live_results_and_late_join_replay(controller):
    history = DiscoveredDevice(device_id="old", model="LWR02", host="fd00::1", available=True)
    fresh = DiscoveredDevice(device_id="new", model="LWR02", host="fd00::2")
    controller.store.list_discovered.return_value = [history]
    started, finish = asyncio.Event(), asyncio.Event()

    async def merge(devices, **kwargs):
        for device in devices:
            device.available = True
        controller.store.list_discovered.return_value = [history, *devices]
        return [history, *devices]

    controller.store.async_update_discovery.side_effect = merge

    async def scan(duration, *, on_update):
        await on_update([fresh])
        started.set()
        await finish.wait()
        return [fresh]

    controller.discovery.async_scan = AsyncMock(side_effect=scan)
    first_events, second_events = [], []
    unsubscribe_first = controller.subscribe_discovery(first_events.append)
    assert first_events[0]["discovered"][0]["device_id"] == "old"
    assert first_events[0]["discovered"][0]["available"] is False
    assert first_events[0]["scanning"] is True
    await asyncio.wait_for(started.wait(), 1)
    assert first_events[-1]["discovered"][1]["available"] is True
    unsubscribe_second = controller.subscribe_discovery(second_events.append)
    assert second_events[0] == first_events[-1]
    unsubscribe_first()
    assert not controller._discovery_task.cancelling()
    finish.set()
    await controller._discovery_task
    await asyncio.sleep(0)
    assert second_events[-1]["scanning"] is False
    controller.discovery.async_scan.assert_awaited_once()
    unsubscribe_second()


async def test_last_subscriber_leaving_does_not_finalize_incomplete_scan(controller):
    started, _ = controlled_scan(controller)
    unsubscribe = controller.subscribe_discovery(lambda event: None)
    await asyncio.wait_for(started.wait(), 1)
    unsubscribe()
    await asyncio.gather(controller._discovery_task, return_exceptions=True)
    controller.store.async_update_discovery.assert_not_awaited()


async def test_stream_failure_ends_loading_and_preserves_cache(controller):
    history = DiscoveredDevice(device_id="old", model="LWR02", host="fd00::1")
    controller.store.list_discovered.return_value = [history]
    controller.discovery.async_scan = AsyncMock(side_effect=OSError("network unavailable"))
    events = []
    unsubscribe = controller.subscribe_discovery(events.append)
    await asyncio.gather(controller._discovery_task, return_exceptions=True)
    await asyncio.sleep(0)
    assert events[-1]["scanning"] is False
    assert "OSError" in events[-1]["error"]
    assert events[-1]["discovered"][0]["device_id"] == "old"
    controller.store.async_update_discovery.assert_not_awaited()
    unsubscribe()


async def test_broken_viewer_does_not_interrupt_other_subscribers(controller):
    started, finish = controlled_scan(controller)
    calls = 0

    def broken(event):
        nonlocal calls
        calls += 1
        if calls > 1:
            raise RuntimeError("socket closed")

    controller.subscribe_discovery(broken)
    events = []
    unsubscribe = controller.subscribe_discovery(events.append)
    await started.wait()
    controller.publish_discovery()
    assert len(events) == 2
    assert not controller._discovery_task.cancelling()
    finish.set()
    await controller._discovery_task
    await asyncio.sleep(0)
    assert events[-1]["scanning"] is False
    unsubscribe()
