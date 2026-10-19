"""ICD metadata must come from explicit, address-matched Matter advertisements."""

from __future__ import annotations

import asyncio
import importlib.util
import sys
import types
from pathlib import Path
from unittest.mock import AsyncMock

import pytest

from custom_components.lafaer.protocol.models import DiscoveredDevice


@pytest.fixture
def discovery_module(monkeypatch):
    dependencies = {
        "homeassistant.core": {"HomeAssistant": object},
        "homeassistant.components": {},
        "homeassistant.components.zeroconf": {},
        "zeroconf": {
            "IPVersion": types.SimpleNamespace(V6Only=6),
            "ServiceStateChange": types.SimpleNamespace(Removed="removed"),
            "Zeroconf": object,
        },
        "zeroconf.asyncio": {"AsyncServiceBrowser": object, "AsyncServiceInfo": object},
    }
    for name, attributes in dependencies.items():
        module = types.ModuleType(name)
        module.__dict__.update(attributes)
        monkeypatch.setitem(sys.modules, name, module)
    path = Path(__file__).parents[1] / "custom_components/lafaer/discovery.py"
    spec = importlib.util.spec_from_file_location("custom_components.lafaer._test_discovery", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.mark.parametrize("flags,expected", [
    ([True], True), ([False], False), ([None], None),
    ([True, True], True), ([True, False], None), ([True, None], True), ([], None),
])
def test_explicit_flags_and_multiple_fabrics(discovery_module, flags, expected):
    key = ("LWR02", "test")
    device = DiscoveredDevice(device_id="test", model="LWR02", host="fd00::1")
    records = {str(i): ({"fd00::1"}, flag) for i, flag in enumerate(flags)}
    discovery_module._apply_icd_metadata({key: device}, {key: {"fd00::1"}}, records)
    assert device.icd_lit is expected
    assert bool(device.icd_last_seen) is (expected is not None)


def test_unrelated_or_ambiguous_addresses_never_mark_sensor(discovery_module):
    first = DiscoveredDevice(device_id="one", model="LWR02", host="fd00::1")
    second = DiscoveredDevice(device_id="two", model="LWR02", host="fd00::1")
    found = {("LWR02", "one"): first, ("LWR02", "two"): second}
    addresses = {key: {"fd00::1"} for key in found}
    discovery_module._apply_icd_metadata(found, addresses, {"shared": ({"fd00::1"}, True)})
    assert first.icd_lit is second.icd_lit is None
    discovery_module._apply_icd_metadata(found, addresses, {"other": ({"fd00::2"}, True)})
    assert first.icd_lit is second.icd_lit is None


def test_address_normalization_and_unreliable_address_exclusion(discovery_module):
    assert discovery_module._matching_addresses([
        "FD00:0000:0000:0000:0000:0000:0000:0001", "fd00::1",
        "fe80::1%eth0", "::1", "::", "ff02::fb", "192.168.1.1", "bad",
    ]) == {"fd00::1"}


@pytest.mark.parametrize("raw,expected", [(b"1", True), (b"0", False), (b"invalid", None)])
async def test_scan_resolves_both_services_in_same_window(
    discovery_module, monkeypatch, raw, expected
):
    module = discovery_module
    cancelled = asyncio.Event()
    service_types = []
    module.ha_zeroconf.async_get_async_instance = AsyncMock(
        return_value=types.SimpleNamespace(zeroconf=object())
    )

    class Info:
        def __init__(self, service_type, name):
            self.properties = (
                {b"ICD": raw} if service_type == module.MATTER_SERVICE_TYPE
                else {b"mn": b"LWR02", b"devid": b"test"}
            )

        async def async_request(self, zeroconf, request_timeout):
            await asyncio.sleep(0)
            return True

        def parsed_scoped_addresses(self, version):
            return ["fd00::1"]

    class Browser:
        def __init__(self, zeroconf, types_, handlers):
            service_types.extend(types_)
            for service_type in reversed(types_):
                handlers[0](zeroconf, service_type, f"sensor.{service_type}", "added")

        async def async_cancel(self):
            cancelled.set()

    monkeypatch.setattr(module, "AsyncServiceInfo", Info)
    monkeypatch.setattr(module, "AsyncServiceBrowser", Browser)
    hass = types.SimpleNamespace(async_create_task=asyncio.create_task)
    devices = await module.OnDemandDiscovery(hass).async_scan(0.1)
    assert service_types == [module.SERVICE_TYPE, module.MATTER_SERVICE_TYPE]
    assert cancelled.is_set()
    assert len(devices) == 1
    assert devices[0].icd_lit is expected
    assert bool(devices[0].icd_last_seen) is (expected is not None)
