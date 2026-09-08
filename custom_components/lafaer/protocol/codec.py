"""Encryption, checksum and byte-order helpers for Lafaer payloads."""

from __future__ import annotations

import hashlib
from dataclasses import dataclass

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.padding import PKCS7

ZERO_IV = bytes(16)


class CodecError(ValueError):
    """Raised when an encrypted application payload is malformed."""


@dataclass(frozen=True, slots=True)
class DecodedResponse:
    """Decoded response returned by a sensor."""

    status: int
    data: bytes
    checksum: int
    checksum_valid: bool


def derive_aes_key(pairing_material: str) -> bytes:
    """Derive the 128-bit key exactly as the mobile application does."""
    return hashlib.md5(pairing_material.encode("utf-8")).digest()  # noqa: S324


def checksum_byte(data: bytes) -> int:
    """Return the first byte of MD5(data), used by the firmware protocol."""
    return hashlib.md5(data).digest()[0]  # noqa: S324


def encode_request(command: int, data: bytes, pairing_material: str) -> bytes:
    """Build and encrypt a command payload."""
    if not 0 <= command <= 0xFF:
        raise CodecError("command must fit in one byte")
    plain_without_checksum = bytes((command,)) + data
    plain = plain_without_checksum + bytes((checksum_byte(plain_without_checksum),))
    padder = PKCS7(128).padder()
    padded = padder.update(plain) + padder.finalize()
    encryptor = Cipher(
        algorithms.AES(derive_aes_key(pairing_material)), modes.CBC(ZERO_IV)
    ).encryptor()
    return encryptor.update(padded) + encryptor.finalize()


def decode_response(
    payload: bytes, pairing_material: str, *, strict_checksum: bool = True
) -> DecodedResponse:
    """Decrypt a response and validate its trailing checksum."""
    if not payload or len(payload) % 16:
        raise CodecError("encrypted payload length is not a positive AES block multiple")
    decryptor = Cipher(
        algorithms.AES(derive_aes_key(pairing_material)), modes.CBC(ZERO_IV)
    ).decryptor()
    padded = decryptor.update(payload) + decryptor.finalize()
    try:
        unpadder = PKCS7(128).unpadder()
        plain = unpadder.update(padded) + unpadder.finalize()
    except ValueError as err:
        raise CodecError("invalid response padding or key") from err
    if len(plain) < 2:
        raise CodecError("response is shorter than status and checksum")

    expected = checksum_byte(plain[:-1])
    valid = plain[-1] == expected
    if strict_checksum and not valid:
        raise CodecError("response checksum mismatch")
    return DecodedResponse(
        status=plain[0], data=plain[1:-1], checksum=plain[-1], checksum_valid=valid
    )


def uint16_be(value: int) -> bytes:
    """Encode an unsigned 16-bit big-endian integer."""
    if not 0 <= value <= 0xFFFF:
        raise CodecError("value must fit in uint16")
    return value.to_bytes(2, "big")


def uint16_le(value: int) -> bytes:
    """Encode an unsigned 16-bit little-endian integer."""
    if not 0 <= value <= 0xFFFF:
        raise CodecError("value must fit in uint16")
    return value.to_bytes(2, "little")


def unpack_uint16_be(data: bytes) -> int:
    if len(data) != 2:
        raise CodecError("uint16 requires exactly two bytes")
    return int.from_bytes(data, "big")


def unpack_uint16_le(data: bytes) -> int:
    if len(data) != 2:
        raise CodecError("uint16 requires exactly two bytes")
    return int.from_bytes(data, "little")


def unpack_uint16_list(data: bytes) -> list[int]:
    if len(data) % 2:
        raise CodecError("uint16 list requires an even number of bytes")
    return [unpack_uint16_be(data[index : index + 2]) for index in range(0, len(data), 2)]


def pack_uint16_list(values: list[int]) -> bytes:
    return b"".join(uint16_be(value) for value in values)


def crc16_xmodem(data: bytes) -> int:
    """Calculate CRC-16/XMODEM (poly 0x1021, init 0x0000)."""
    crc = 0
    for byte in data:
        crc ^= byte << 8
        for _ in range(8):
            crc = ((crc << 1) ^ 0x1021) & 0xFFFF if crc & 0x8000 else (crc << 1) & 0xFFFF
    return crc


def pairing_material_from_compare(data: bytes) -> str:
    """Derive the persistent pairing material returned by compare."""
    return f"goodlife--00{crc16_xmodem(data):04X}"
