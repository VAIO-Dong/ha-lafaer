"""Typed protocol and storage models."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any

from .codec import CodecError, unpack_uint16_be, unpack_uint16_le, unpack_uint16_list


@dataclass(slots=True)
class DiscoveredDevice:
    """A supported device found during a bounded mDNS scan."""

    device_id: str
    model: str
    host: str
    version: str = ""
    uid: str | None = None
    thread_mac: str | None = None
    blue_id: str | None = None
    name: str | None = None

    def as_public_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class StoredDevice(DiscoveredDevice):
    """A device adopted by Home Assistant."""

    pairing_material: str = field(default="", repr=False)

    def as_storage_dict(self) -> dict[str, Any]:
        return asdict(self)

    def as_public_dict(self) -> dict[str, Any]:
        value = DiscoveredDevice.as_public_dict(self)
        value.pop("pairing_material", None)
        value["adopted"] = True
        return value

    @classmethod
    def from_storage_dict(cls, data: dict[str, Any]) -> StoredDevice:
        return cls(**data)


@dataclass(frozen=True, slots=True)
class DeviceStatus:
    occupied: bool
    power_type: int
    battery_level: int
    illuminance: int
    distance_cm: int | None = None
    work_mode: int | None = None
    temperature_c: float | None = None
    humidity: float | None = None
    battery_type: int | None = None

    def as_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def parse_lwr01(cls, data: bytes) -> DeviceStatus:
        if len(data) < 8:
            raise CodecError("LWR01 status requires at least 8 bytes")
        return cls(
            occupied=data[0] == 1,
            power_type=data[1],
            battery_level=unpack_uint16_le(data[2:4]),
            illuminance=unpack_uint16_le(data[4:6]),
            distance_cm=unpack_uint16_le(data[6:8]),
        )

    @classmethod
    def parse_lwr02(cls, data: bytes) -> DeviceStatus:
        if len(data) < 10:
            raise CodecError("LWR02 status requires at least 10 bytes")
        temperature = unpack_uint16_be(data[3:5]) / 100
        if data[2] == 1:
            temperature = -temperature
        return cls(
            occupied=data[0] == 1,
            work_mode=data[1],
            power_type=0,
            temperature_c=temperature,
            humidity=unpack_uint16_be(data[5:7]) / 100,
            battery_level=data[7],
            illuminance=unpack_uint16_be(data[8:10]),
            battery_type=data[10] if len(data) >= 11 else None,
        )


@dataclass(frozen=True, slots=True)
class Lwr2Config:
    radar_error: int
    pir_error: int
    radar_sensitivity: int
    pir_sensitivity: int
    presence_timeout: int
    darkness_enabled: bool
    darkness_threshold: int
    led_enabled: bool

    def as_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def parse(cls, data: bytes) -> Lwr2Config:
        if len(data) < 10:
            raise CodecError("LWR02 config requires at least 10 bytes")
        return cls(
            radar_error=data[0],
            pir_error=data[1],
            radar_sensitivity=data[2],
            pir_sensitivity=data[3],
            presence_timeout=unpack_uint16_be(data[4:6]),
            darkness_enabled=data[6] == 1,
            darkness_threshold=unpack_uint16_be(data[7:9]),
            led_enabled=data[9] == 1,
        )


@dataclass(frozen=True, slots=True)
class DeviceInfo:
    mac: str = ""
    serial_number: str = ""
    model: str = ""
    thread_network_name: str = ""
    rssi: str = ""
    thread_mac: str = ""
    firmware_version: str = ""
    radar_version: str = ""

    def as_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def parse(cls, data: bytes) -> DeviceInfo:
        lines = data.strip(b"\n").decode("utf-8").split("\n")
        if len(lines) < 6:
            raise CodecError("device information requires at least six lines")
        values = lines + [""] * (8 - len(lines))
        return cls(*values[:8])


@dataclass(frozen=True, slots=True)
class RadarStatus:
    ranges: list[int]
    pir_status: int
    occupancy_status: int
    studying: int
    radar_sensitivity: int
    pir_sensitivity: int
    presence_timeout: int

    def as_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def parse(cls, data: bytes) -> RadarStatus:
        if len(data) < 22:
            raise CodecError("radar status requires at least 22 bytes")
        return cls(
            ranges=list(data[:15]),
            pir_status=data[15],
            occupancy_status=data[16],
            studying=data[17],
            radar_sensitivity=data[18],
            pir_sensitivity=data[19],
            presence_timeout=unpack_uint16_be(data[20:22]),
        )


@dataclass(frozen=True, slots=True)
class RadarThresholds:
    low: list[int]
    medium: list[int]
    high: list[int]
    custom: list[int]

    def as_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def parse(cls, data: bytes) -> RadarThresholds:
        if len(data) != 75:
            raise CodecError("radar thresholds require exactly 75 bytes")
        return cls(
            low=list(data[0:15]),
            medium=list(data[15:30]),
            high=list(data[30:45]),
            custom=unpack_uint16_list(data[45:75]),
        )
