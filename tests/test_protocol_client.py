"""Tests for command selection in the typed protocol facade."""

from __future__ import annotations

from unittest.mock import AsyncMock

import pytest

from custom_components.lafaer.protocol.client import LafaerProtocolClient
from custom_components.lafaer.protocol.codec import DecodedResponse
from custom_components.lafaer.protocol.commands import Command


@pytest.mark.asyncio
async def test_radar_status_matches_app_range_get_behavior() -> None:
    client = LafaerProtocolClient("fd00::1", "pairing", model="LWR02")
    payload = bytes(15) + bytes((0, 0, 0, 1, 2, 0, 30))
    client._exchange = AsyncMock(  # type: ignore[method-assign]
        return_value=DecodedResponse(0, payload, 0, True)
    )

    status = await client.async_radar_status()

    client._exchange.assert_awaited_once_with(Command.RADAR_RANGE, method="GET")
    assert status.presence_timeout == 30
