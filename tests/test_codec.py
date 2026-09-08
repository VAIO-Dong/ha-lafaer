"""Protocol codec tests using independently generated fixtures."""

from __future__ import annotations

import pytest

from custom_components.lafaer.protocol.codec import (
    CodecError,
    crc16_xmodem,
    derive_aes_key,
    encode_request,
    pack_uint16_list,
    pairing_material_from_compare,
    unpack_uint16_list,
)


def test_key_and_encryption_fixture() -> None:
    """Fixture generated independently with Node's OpenSSL bindings."""
    material = "AABBCCDDEEFF0011"
    assert derive_aes_key(material).hex() == "54f24120378501902c8b6a6aa2f77077"
    assert encode_request(0x09, b"abc", material).hex() == ("c20ebc2d0e855b390c8375d44d043e5e")


def test_crc16_xmodem_well_known_vector() -> None:
    assert crc16_xmodem(b"123456789") == 0x31C3
    assert pairing_material_from_compare(b"123456789") == "goodlife--0031C3"


def test_uint16_list_round_trip() -> None:
    values = [0, 1, 255, 256, 1000, 65535]
    assert unpack_uint16_list(pack_uint16_list(values)) == values


def test_invalid_uint16_list() -> None:
    with pytest.raises(CodecError):
        unpack_uint16_list(b"\x00")
