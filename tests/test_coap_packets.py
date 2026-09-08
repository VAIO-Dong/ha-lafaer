"""Tests for the dependency-free CoAP packet codec."""

from __future__ import annotations

import pytest

from custom_components.lafaer.protocol.client import (
    COAP_CODE_CONTENT,
    CoapError,
    _build_request,
    _parse_message,
)


def test_build_request_encodes_uri_path_and_payload() -> None:
    packet = _build_request(2, 0x1234, b"tokn", "gl-radar", b"payload")

    assert packet[:8] == bytes((0x44, 0x02, 0x12, 0x34)) + b"tokn"
    assert packet[8:17] == bytes((0xB8,)) + b"gl-radar"
    assert packet[17:] == b"\xffpayload"


def test_parse_response_skips_options() -> None:
    packet = (
        bytes((0x64, COAP_CODE_CONTENT, 0x12, 0x34))
        + b"tokn"
        + bytes((0xC1,))
        + b"x"
        + b"\xffresponse"
    )

    message = _parse_message(packet)

    assert message.message_id == 0x1234
    assert message.token == b"tokn"
    assert message.payload == b"response"


@pytest.mark.parametrize(
    "packet",
    (
        b"\x40\x45\x00",
        b"\x49\x45\x00\x01",
        b"\x40\x45\x00\x01\xf0",
        b"\x40\x45\x00\x01\xbeabc",
    ),
)
def test_parse_rejects_malformed_packets(packet: bytes) -> None:
    with pytest.raises(CoapError):
        _parse_message(packet)
