"""Controller discovery is single-flight across WebSocket callers."""

from __future__ import annotations

import asyncio
import importlib.util
import sys
import types
from pathlib import Path
from unittest.mock import AsyncMock, Mock

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
    instance.store.async_update_discovery = AsyncMock(side_effect=lambda devices, **_: devices)
    instance.sessions.async_close_all = AsyncMock()
    instance.debug.async_close = AsyncMock()
    return instance


def controlled_scan(controller):
    """Hold a real controller scan pending until explicitly released."""
    started = asyncio.Event()
    release = asyncio.Event()
    device = DiscoveredDevice(device_id="test", model="LWR02", host="fd00::1")

    async def scan(duration):
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
    controller.discovery.async_scan.assert_awaited_once_with(15)
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
    controller.discovery.async_scan.assert_awaited_with(3)


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


async def test_all_browsers_can_leave_without_starting_another_scan(controller):
    started, release = controlled_scan(controller)
    first = asyncio.create_task(controller.async_discover())
    await started.wait()
    first.cancel()
    with pytest.raises(asyncio.CancelledError):
        await first
    second = asyncio.create_task(controller.async_discover())
    await asyncio.sleep(0)
    release.set()
    await second
    controller.discovery.async_scan.assert_awaited_once()


async def test_failure_reaches_all_waiters_and_allows_retry(controller):
    started = asyncio.Event()
    release = asyncio.Event()

    async def fail(duration):
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
