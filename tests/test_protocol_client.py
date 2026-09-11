"""Tests for command selection in the typed protocol facade."""

from __future__ import annotations

import asyncio
from unittest.mock import AsyncMock

import pytest

from custom_components.lafaer.protocol.client import (
    CoapError,
    CoapTransport,
    LafaerProtocolClient,
    _DatagramQueue,
)
from custom_components.lafaer.protocol.codec import DecodedResponse
from custom_components.lafaer.protocol.commands import Command


@pytest.mark.asyncio
async def test_radar_activation_payload() -> None:
    client = LafaerProtocolClient("fd00::1", "pairing", model="LWR02")
    client._exchange = AsyncMock()
    await client.async_activate_radar()
    client._exchange.assert_awaited_once_with(
        Command.RADAR_ACTIVE, method="POST", data=b"\x01"
    )


@pytest.mark.asyncio
async def test_radar_status_matches_app_range_get_behavior() -> None:
    client = LafaerProtocolClient("fd00::1", "pairing", model="LWR02")
    payload = bytes(15) + bytes((0, 0, 0, 1, 2, 0, 30))
    client._exchange = AsyncMock(  # type: ignore[method-assign]
        return_value=DecodedResponse(0, payload, 0, True)
    )

    status = await client.async_radar_status()

    client._exchange.assert_awaited_once_with(
        Command.RADAR_RANGE, method="GET", allowed_statuses=(0, 2)
    )
    assert status.presence_timeout == 30


@pytest.mark.asyncio
async def test_radar_status_two_preserves_only_known_ranges() -> None:
    client = LafaerProtocolClient("fd00::1", "pairing", model="LWR02")
    payload = bytes([2] * 15) + bytes((1, 0, 0, 1, 2, 0, 30))
    client._exchange = AsyncMock(return_value=DecodedResponse(2, payload, 0, True))
    unknown = await client.async_radar_status()
    assert unknown.ranges == []
    assert unknown.ranges_valid is False
    assert unknown.pir_status == 1
    client._exchange.return_value = DecodedResponse(0, payload, 0, True)
    healthy = await client.async_radar_status()
    assert healthy.ranges_valid is True
    client._exchange.return_value = DecodedResponse(2, bytes(22), 0, True)
    degraded = await client.async_radar_status()
    assert degraded.ranges == healthy.ranges
    assert degraded.ranges_valid is False


@pytest.mark.asyncio
async def test_close_interrupts_pending_udp_read_without_retrying() -> None:
    sent = asyncio.Event()

    class FakeTransport:
        calls = 0

        def sendto(self, packet):
            self.calls += 1
            sent.set()

        def close(self):
            pass

    client = CoapTransport("fd00::1")
    transport = FakeTransport()
    client._transport = transport
    client._protocol = _DatagramQueue()
    request = asyncio.create_task(client.async_request("GET", "status", b"test"))
    await sent.wait()
    await client.async_close()
    with pytest.raises(CoapError, match="transport is closed"):
        await asyncio.wait_for(request, timeout=0.1)
    assert transport.calls == 1
