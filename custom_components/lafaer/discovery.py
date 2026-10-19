"""Bounded, user-triggered mDNS discovery."""

from __future__ import annotations

import asyncio
from datetime import UTC, datetime
from ipaddress import IPv6Address, ip_address

from homeassistant.components import zeroconf as ha_zeroconf
from homeassistant.core import HomeAssistant
from zeroconf import IPVersion, ServiceStateChange, Zeroconf
from zeroconf.asyncio import AsyncServiceBrowser, AsyncServiceInfo

from .const import DISCOVERY_TIMEOUT, SERVICE_TYPE, SUPPORTED_MODELS
from .protocol.models import DiscoveredDevice

MATTER_SERVICE_TYPE = "_matter._tcp.local."


def _matching_addresses(addresses: list[str]) -> set[str]:
    """Use only unambiguous, routable IPv6 host addresses for correlation."""
    result = set()
    for value in addresses:
        try:
            address = ip_address(value)
        except ValueError:
            continue
        if isinstance(address, IPv6Address) and not (
            address.is_link_local or address.is_multicast
            or address.is_unspecified or address.is_loopback
        ):
            result.add(str(address))
    return result


def _apply_icd_metadata(
    found: dict[tuple[str, str], DiscoveredDevice],
    addresses: dict[tuple[str, str], set[str]],
    matter: dict[str, tuple[set[str], bool | None]],
) -> None:
    """Match explicit Matter LIT flags; absence is not evidence of non-ICD."""
    seen_at = datetime.now(UTC).isoformat()
    for key, device in found.items():
        own = addresses.get(key, set())
        others = set().union(*(value for other, value in addresses.items() if other != key))
        unique = own - others
        flags = {
            flag for hosts, flag in matter.values()
            if flag is not None and unique.intersection(hosts)
        }
        device.icd_lit = next(iter(flags)) if len(flags) == 1 else None
        device.icd_last_seen = seen_at if device.icd_lit is not None else None


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
            device_addresses: dict[tuple[str, str], set[str]] = {}
            matter: dict[str, tuple[set[str], bool | None]] = {}
            tasks: set[asyncio.Task[None]] = set()

            async def resolve(service_type: str, name: str) -> None:
                info = AsyncServiceInfo(service_type, name)
                if not await info.async_request(async_zeroconf.zeroconf, 3000):
                    return
                properties = _decode_properties(info.properties)
                if service_type == MATTER_SERVICE_TYPE:
                    raw_icd = properties.get("ICD")
                    matter[name] = (
                        _matching_addresses(info.parsed_scoped_addresses(IPVersion.V6Only)),
                        raw_icd == "1" if raw_icd in ("0", "1") else None,
                    )
                    return
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
                device_addresses[(model, device_id)] = _matching_addresses(addresses)
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
                    matter.pop(name, None)
                    return
                task = self._hass.async_create_task(resolve(service_type, name))
                tasks.add(task)
                task.add_done_callback(tasks.discard)

            browser = AsyncServiceBrowser(
                async_zeroconf.zeroconf,
                [SERVICE_TYPE, MATTER_SERVICE_TYPE],
                handlers=[on_change],
            )
            try:
                await asyncio.sleep(max(0.1, min(scan_duration, DISCOVERY_TIMEOUT)))
            finally:
                await browser.async_cancel()
                if tasks:
                    await asyncio.gather(*tasks, return_exceptions=True)
            _apply_icd_metadata(found, device_addresses, matter)
            return sorted(found.values(), key=lambda item: (item.model, item.device_id))
