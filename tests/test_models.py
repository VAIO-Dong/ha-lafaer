"""Tests for firmware response parsing."""

from __future__ import annotations

import pytest

from custom_components.lafaer.protocol.codec import CodecError
from custom_components.lafaer.protocol.models import (
    DeviceInfo,
    DeviceStatus,
    Lwr2Config,
    RadarStatus,
    RadarThresholds,
)


def test_optional_lwr02_fault_and_update_flags() -> None:
    assert Lwr2Config.parse(bytes(10)).climate_error is None
    assert Lwr2Config.parse(bytes(10) + b"\x01").climate_error == 1
    assert RadarStatus.parse(bytes(22)).thresholds_updating is None
    assert RadarStatus.parse(bytes(22) + b"\x01").thresholds_updating == 1
    assert RadarStatus.parse(bytes(23)).thresholds_updating == 0


def test_parse_lwr01_status_uses_little_endian() -> None:
    status = DeviceStatus.parse_lwr01(bytes((1, 0, 75, 0, 0x34, 0x12, 0x2C, 0x01)))
    assert status.occupied is True
    assert status.battery_level == 75
    assert status.illuminance == 0x1234
    assert status.distance_cm == 300


def test_parse_lwr02_status() -> None:
    status = DeviceStatus.parse_lwr02(bytes((1, 2, 1, 0x09, 0xC4, 0x17, 0x70, 88, 0x01, 0xF4, 1)))
    assert status.occupied is True
    assert status.work_mode == 2
    assert status.temperature_c == -25.0
    assert status.humidity == 60.0
    assert status.battery_level == 88
    assert status.illuminance == 500
    assert status.battery_type == 1


def test_parse_lwr02_config() -> None:
    config = Lwr2Config.parse(bytes((0, 1, 2, 1, 0, 30, 1, 0, 100, 1)))
    assert config.radar_error == 0
    assert config.pir_error == 1
    assert config.presence_timeout == 30
    assert config.darkness_enabled is True
    assert config.darkness_threshold == 100
    assert config.led_enabled is True


def test_parse_information() -> None:
    info = DeviceInfo.parse(b"AABBCCDDEEFF\nSN01\nLWR02\nThread\n-60\n0011\n0.7.0\n1.2.3\n")
    assert info.model == "LWR02"
    assert info.firmware_version == "0.7.0"
    assert info.radar_version == "1.2.3"


def test_parse_radar_status() -> None:
    raw = bytes(range(15)) + bytes((1, 1, 0, 2, 1, 0, 30))
    status = RadarStatus.parse(raw)
    assert status.ranges == list(range(15))
    assert status.presence_timeout == 30


def test_parse_thresholds() -> None:
    raw = bytes(range(45)) + b"".join(value.to_bytes(2, "big") for value in range(15))
    thresholds = RadarThresholds.parse(raw)
    assert thresholds.low == list(range(15))
    assert thresholds.custom == list(range(15))


@pytest.mark.parametrize(
    ("parser", "data"),
    [
        (DeviceStatus.parse_lwr01, b"\x00" * 7),
        (DeviceStatus.parse_lwr02, b"\x00" * 9),
        (Lwr2Config.parse, b"\x00" * 9),
        (RadarStatus.parse, b"\x00" * 21),
        (RadarThresholds.parse, b"\x00" * 74),
    ],
)
def test_short_payloads_are_rejected(parser, data: bytes) -> None:
    with pytest.raises(CodecError):
        parser(data)
