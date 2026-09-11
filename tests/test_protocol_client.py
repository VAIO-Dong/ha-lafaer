"""Tests for command selection in the typed protocol facade."""

from __future__ import annotations

import asyncio
from unittest.mock import AsyncMock

import pytest

from custom_components.lafaer.protocol import client as client_module
from custom_components.lafaer.protocol.client import (
    CoapError,
    CoapTransport,
    LafaerProtocolClient,
    _DatagramQueue,
)
from custom_components.lafaer.protocol.codec import DecodedResponse
from custom_components.lafaer.protocol.commands import Command


def test_lwr02_command_names_do_not_alias_lwr01() -> None:
    assert Command.STATUS_LWR02 is not Command.STATUS_LWR01
    assert Command.STATUS_LWR02.name == "STATUS_LWR02"
    assert Command.WORK_MODE.name == "WORK_MODE"
    assert Command.STATUS_LWR02.path == Command.STATUS_LWR01.path == "status"
    assert Command.STATUS_LWR02.code == Command.STATUS_LWR01.code == 0
    assert len(Command.__members__) == len(list(Command))


@pytest.mark.asyncio
async def test_all_commands_are_serialized_and_paced_even_after_failure() -> None:
    client = LafaerProtocolClient("fd00::1", "pairing", model="LWR02")
    timestamps = []

    async def exchange(*args, **kwargs):
        timestamps.append(asyncio.get_running_loop().time())
        if len(timestamps) == 1:
            raise CoapError("temporary failure")
        return DecodedResponse(0, b"", 0, True)

    client._exchange_now = exchange
    results = await asyncio.gather(
        client._exchange(Command.RADAR_ACTIVE, method="POST"),
        client._exchange(Command.RADAR_RANGE, method="GET"),
        client._exchange(Command.STATUS_LWR02, method="GET"),
        return_exceptions=True,
    )
    assert isinstance(results[0], CoapError)
    assert len(timestamps) == 3
    assert all(
        later - earlier >= 0.14
        for earlier, later in zip(timestamps, timestamps[1:], strict=False)
    )
    await client.async_close()
    with pytest.raises(CoapError, match="closed"):
        await client._exchange(Command.STATUS_LWR02, method="GET")
    assert len(timestamps) == 3


@pytest.mark.asyncio
@pytest.mark.parametrize("size", [0, 28, 32])
async def test_energy_rejects_incomplete_gate_data(size: int) -> None:
    client = LafaerProtocolClient("fd00::1", "pairing", model="LWR02")
    client._exchange = AsyncMock(return_value=DecodedResponse(0, bytes(size), 0, True))
    with pytest.raises(CoapError, match="exactly 30"):
        await client.async_energy(keep=False)


@pytest.mark.asyncio
async def test_rejected_command_emits_error_event(monkeypatch) -> None:
    events = []
    client = LafaerProtocolClient(
        "fd00::1", "pairing", model="LWR02",
        debug=lambda event, data: events.append((event, data)),
    )
    client._transport.async_request = AsyncMock(return_value=b"response")
    monkeypatch.setattr(
        client_module, "decode_response",
        lambda *args, **kwargs: DecodedResponse(1, b"", 0, True),
    )
    with pytest.raises(CoapError, match="RADAR_DETECTION_VALUE returned status 1"):
        await client.async_energy(keep=False)
    assert events[-1][0] == "error"
    assert events[-1][1]["command"] == "RADAR_DETECTION_VALUE"
    assert events[-1][1]["status"] == 1
    await client.async_close()


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
