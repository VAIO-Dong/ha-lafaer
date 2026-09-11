"""Command definitions reverse-mapped from the Lafaer application."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


@dataclass(frozen=True, slots=True)
class CommandSpec:
    """A command byte sent as an encrypted CoAP payload."""

    path: str
    code: int
    model: str = "LWR01"


class Command(Enum):
    """Commands supported by LWR01 and LWR02 firmware."""

    # LWR01
    DETECT_RANGE = CommandSpec("gl-radar", 0x00)
    TRIGGER_HOLD_GATE = CommandSpec("gl-radar", 0x01)
    AUTO_THRESHOLD = CommandSpec("gl-radar", 0x02)
    PERFORMANCE_MODE = CommandSpec("gl-radar", 0x03)
    TRIGGER_NOBODY_TIME = CommandSpec("gl-radar", 0x04)
    ALS_THRESHOLD = CommandSpec("gl-radar", 0x05)
    LED = CommandSpec("gl-radar", 0x06)
    FACTORY_RESET = CommandSpec("gl-radar", 0x07)
    IDENTIFY_LWR01 = CommandSpec("gl-radar", 0x08)
    COMPARE = CommandSpec("gl-radar", 0x09)
    DELETE_DEVICE = CommandSpec("gl-radar", 0x0A)
    RADAR_RESET_LWR01 = CommandSpec("gl-radar", 0x0B)
    DEFAULT_RADAR_PARAMETERS = CommandSpec("gl-radar", 0x0C)
    STATUS_LWR01 = CommandSpec("status", 0x00)
    INFORMATION = CommandSpec("status", 0x01)

    # LWR02 (some bytes intentionally overlap LWR01 commands)
    STATUS_LWR02 = CommandSpec("status", 0x00, "LWR02")
    RADAR_SENSITIVITY = CommandSpec("gl-radar", 0x01, "LWR02")
    PIR_SENSITIVITY = CommandSpec("gl-radar", 0x02, "LWR02")
    SELF_LEARNING = CommandSpec("gl-radar", 0x03, "LWR02")
    PRESENCE_TIMEOUT = CommandSpec("gl-radar", 0x04, "LWR02")
    DARK_LUX = CommandSpec("gl-radar", 0x05, "LWR02")
    LED_LWR02 = CommandSpec("gl-radar", 0x06, "LWR02")
    IDENTIFY_LWR02 = CommandSpec("gl-radar", 0x08, "LWR02")
    WORK_MODE = CommandSpec("gl-radar", 0x0B, "LWR02")
    START_OTA = CommandSpec("gl-radar", 0x0C, "LWR02")
    RADAR_RESET_LWR02 = CommandSpec("gl-radar", 0x0D, "LWR02")
    BATTERY_TYPE = CommandSpec("gl-radar", 0x0E, "LWR02")
    RADAR_ACTIVE = CommandSpec("gl-radar", 0x0F, "LWR02")
    RADAR_RANGE = CommandSpec("gl-radar", 0x10, "LWR02")
    RADAR_DETECTION_THRESHOLD = CommandSpec("gl-radar", 0x11, "LWR02")
    RADAR_KEEP_THRESHOLD = CommandSpec("gl-radar", 0x12, "LWR02")
    RADAR_DETECTION_VALUE = CommandSpec("gl-radar", 0x13, "LWR02")
    RADAR_KEEP_VALUE = CommandSpec("gl-radar", 0x14, "LWR02")
    PIR_STATUS = CommandSpec("gl-radar", 0x15, "LWR02")
    RADAR_STATUS = CommandSpec("gl-radar", 0x16, "LWR02")
    CONFIG_LWR02 = CommandSpec("gl-radar", 0x00, "LWR02")

    @property
    def path(self) -> str:
        return self.value.path

    @property
    def code(self) -> int:
        return self.value.code
