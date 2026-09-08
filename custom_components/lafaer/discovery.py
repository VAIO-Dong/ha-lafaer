"""Bounded, user-triggered mDNS discovery."""

from __future__ import annotations

import asyncio

from homeassistant.components import zeroconf as ha_zeroconf
from homeassistant.core import HomeAssistant
from zeroconf import IPVersion, ServiceStateChange, Zeroconf
from zeroconf.asyncio import AsyncServiceBrowser, AsyncServiceInfo

from .const import DISCOVERY_TIMEOUT, SERVICE_TYPE, SUPPORTED_MODELS
from .protocol.models import DiscoveredDevice


def _decode_properties(properties: dict[bytes, bytes | None]) -> dict[str, str]:
    decoded: dict[str, str] = {}
    for raw_key, raw_value in properties.items():
        if raw_value is None:
            continue
        try:
            decoded[raw_key.decode("utf-8")] = raw_value.decode("utf-8")
        except UnicodeDecodeError:
            continue
    return decoded


class OnDemandDiscovery:
    """Attach to HA zeroconf only for one explicit scan request."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._lock = asyncio.Lock()

    async def async_scan(self, scan_duration: float = DISCOVERY_TIMEOUT) -> list[DiscoveredDevice]:
        async with self._lock:
            async_zeroconf = await ha_zeroconf.async_get_async_instance(self._hass)
            found: dict[tuple[str, str], DiscoveredDevice] = {}
            tasks: set[asyncio.Task[None]] = set()

            async def resolve(service_type: str, name: str) -> None:
                info = AsyncServiceInfo(service_type, name)
                if not await info.async_request(async_zeroconf.zeroconf, 3000):
                    return
                properties = _decode_properties(info.properties)
                model = properties.get("mn", "").upper()
                if model not in SUPPORTED_MODELS:
                    return
                addresses = info.parsed_scoped_addresses(IPVersion.V6Only)
                if not addresses:
                    addresses = info.parsed_addresses()
                if not addresses:
                    return

                parts = name.removesuffix(SERVICE_TYPE).rstrip(".").split("-")
                device_id = properties.get("devid", "")
                thread_mac = None
                if not device_id and len(parts) == 4:
                    device_id = parts[2]
                if len(parts) >= 3:
                    thread_mac = parts[-1]
                if not device_id:
                    return
                uid = properties.get("uid") or None
                found[(model, device_id)] = DiscoveredDevice(
                    device_id=device_id,
                    model=model,
                    host=addresses[0],
                    version=properties.get("v", ""),
                    uid=uid,
                    thread_mac=thread_mac,
                    blue_id=properties.get("D") or device_id,
                    name=f"{model} {device_id}",
                )

            def on_change(
                zeroconf: Zeroconf,
                service_type: str,
                name: str,
                state_change: ServiceStateChange,
            ) -> None:
                if state_change is ServiceStateChange.Removed:
                    return
                task = self._hass.async_create_task(resolve(service_type, name))
                tasks.add(task)
                task.add_done_callback(tasks.discard)

            browser = AsyncServiceBrowser(
                async_zeroconf.zeroconf,
                SERVICE_TYPE,
                handlers=[on_change],
            )
            try:
                await asyncio.sleep(max(0.1, min(scan_duration, DISCOVERY_TIMEOUT)))
            finally:
                await browser.async_cancel()
                if tasks:
                    await asyncio.gather(*tasks, return_exceptions=True)
            return sorted(found.values(), key=lambda item: (item.model, item.device_id))
