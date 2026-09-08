"""Small async CoAP client and typed Lafaer command facade.

The sensor protocol only needs confirmable UDP CoAP with Uri-Path options and
small payloads. Keeping this implementation local avoids a permanently running
third-party CoAP context and makes transport ownership explicit per UI session.
"""

from __future__ import annotations

import asyncio
import secrets
import socket
from collections.abc import Callable
from dataclasses import dataclass
from typing import Any, Final

from .codec import (
    DecodedResponse,
    decode_response,
    encode_request,
    pack_uint16_list,
    pairing_material_from_compare,
    uint16_be,
    uint16_le,
)
from .commands import Command
from .models import DeviceInfo, DeviceStatus, Lwr2Config, RadarStatus, RadarThresholds

COAP_VERSION: Final = 1
COAP_TYPE_CON: Final = 0
COAP_TYPE_ACK: Final = 2
COAP_CODE_EMPTY: Final = 0
COAP_CODE_GET: Final = 1
COAP_CODE_POST: Final = 2
COAP_CODE_CONTENT: Final = 69  # 2.05
COAP_PAYLOAD_MARKER: Final = 0xFF
COAP_OPTION_URI_PATH: Final = 11


class CoapError(RuntimeError):
    """Raised for transport, CoAP or sensor application errors."""

    def __init__(self, message: str, *, response_code: int | None = None) -> None:
        super().__init__(message)
        self.response_code = response_code


@dataclass(frozen=True, slots=True)
class _CoapMessage:
    message_type: int
    code: int
    message_id: int
    token: bytes
    payload: bytes


def _extended_nibble(value: int) -> tuple[int, bytes]:
    if value < 13:
        return value, b""
    if value < 269:
        return 13, bytes((value - 13,))
    if value < 65805:
        return 14, (value - 269).to_bytes(2, "big")
    raise CoapError("CoAP option value is too large")


def _encode_options(path: str) -> bytes:
    output = bytearray()
    previous = 0
    for segment in (part for part in path.split("/") if part):
        raw = segment.encode("utf-8")
        delta_nibble, delta_ext = _extended_nibble(COAP_OPTION_URI_PATH - previous)
        length_nibble, length_ext = _extended_nibble(len(raw))
        output.append((delta_nibble << 4) | length_nibble)
        output.extend(delta_ext)
        output.extend(length_ext)
        output.extend(raw)
        previous = COAP_OPTION_URI_PATH
    return bytes(output)


def _build_request(code: int, message_id: int, token: bytes, path: str, payload: bytes) -> bytes:
    if len(token) > 8:
        raise CoapError("CoAP token cannot exceed 8 bytes")
    header = bytes(
        (
            (COAP_VERSION << 6) | (COAP_TYPE_CON << 4) | len(token),
            code,
        )
    ) + message_id.to_bytes(2, "big")
    body = header + token + _encode_options(path)
    return body + bytes((COAP_PAYLOAD_MARKER,)) + payload if payload else body


def _read_extended(nibble: int, packet: bytes, offset: int) -> tuple[int, int]:
    if nibble < 13:
        return nibble, offset
    if nibble == 13:
        if offset >= len(packet):
            raise CoapError("truncated CoAP option")
        return packet[offset] + 13, offset + 1
    if nibble == 14:
        if offset + 2 > len(packet):
            raise CoapError("truncated CoAP option")
        return int.from_bytes(packet[offset : offset + 2], "big") + 269, offset + 2
    raise CoapError("reserved CoAP option nibble")


def _parse_message(packet: bytes) -> _CoapMessage:
    if len(packet) < 4:
        raise CoapError("CoAP packet is shorter than its header")
    first = packet[0]
    if first >> 6 != COAP_VERSION:
        raise CoapError("unsupported CoAP version")
    token_length = first & 0x0F
    if token_length > 8 or 4 + token_length > len(packet):
        raise CoapError("invalid CoAP token length")
    offset = 4 + token_length
    while offset < len(packet) and packet[offset] != COAP_PAYLOAD_MARKER:
        option = packet[offset]
        offset += 1
        _, offset = _read_extended(option >> 4, packet, offset)
        length, offset = _read_extended(option & 0x0F, packet, offset)
        offset += length
        if offset > len(packet):
            raise CoapError("truncated CoAP option value")
    payload = packet[offset + 1 :] if offset < len(packet) else b""
    return _CoapMessage(
        message_type=(first >> 4) & 0x03,
        code=packet[1],
        message_id=int.from_bytes(packet[2:4], "big"),
        token=packet[4 : 4 + token_length],
        payload=payload,
    )


class _DatagramQueue(asyncio.DatagramProtocol):
    def __init__(self) -> None:
        self.queue: asyncio.Queue[bytes | Exception] = asyncio.Queue()

    def datagram_received(self, data: bytes, addr: Any) -> None:
        self.queue.put_nowait(data)

    def error_received(self, exc: Exception) -> None:
        self.queue.put_nowait(exc)


class CoapTransport:
    """A session-owned UDP transport supporting one request at a time."""

    def __init__(self, host: str, port: int = 5683) -> None:
        self.host = host
        self.port = port
        self._transport: asyncio.DatagramTransport | None = None
        self._protocol: _DatagramQueue | None = None
        self._lock = asyncio.Lock()
        self._closed = False

    async def async_open(self) -> None:
        if self._transport is not None:
            return
        if self._closed:
            raise CoapError("transport is closed")
        family = socket.AF_INET6 if ":" in self.host else socket.AF_INET
        loop = asyncio.get_running_loop()
        transport, protocol = await loop.create_datagram_endpoint(
            _DatagramQueue,
            remote_addr=(self.host, self.port),
            family=family,
        )
        self._transport = transport
        self._protocol = protocol

    async def async_request(self, method: str, path: str, payload: bytes) -> bytes:
        async with self._lock:
            await self.async_open()
            assert self._transport is not None
            assert self._protocol is not None

            message_id = secrets.randbelow(0x10000)
            token = secrets.token_bytes(4)
            code = COAP_CODE_GET if method == "GET" else COAP_CODE_POST
            packet = _build_request(code, message_id, token, path, payload)

            timeout = 1.0
            for _attempt in range(5):
                self._transport.sendto(packet)
                deadline = asyncio.get_running_loop().time() + timeout
                while True:
                    remaining = deadline - asyncio.get_running_loop().time()
                    if remaining <= 0:
                        break
                    try:
                        incoming = await asyncio.wait_for(
                            self._protocol.queue.get(), timeout=remaining
                        )
                    except TimeoutError:
                        break
                    if isinstance(incoming, Exception):
                        raise CoapError(f"UDP transport error: {incoming}") from incoming
                    response = _parse_message(incoming)
                    if response.message_type == COAP_TYPE_ACK and response.code == COAP_CODE_EMPTY:
                        # Empty ACK: keep waiting for a separate response carrying our token.
                        if response.message_id != message_id:
                            continue
                        continue
                    # Piggybacked and separate responses both echo the token;
                    # a matching message ID alone is not sufficient.
                    if response.token != token:
                        continue
                    if response.message_type == COAP_TYPE_CON:
                        ack = bytes(
                            (
                                (COAP_VERSION << 6) | (COAP_TYPE_ACK << 4),
                                COAP_CODE_EMPTY,
                            )
                        ) + response.message_id.to_bytes(2, "big")
                        self._transport.sendto(ack)
                    if response.code != COAP_CODE_CONTENT:
                        raise CoapError(
                            f"sensor returned CoAP {response.code >> 5}.{response.code & 0x1F:02d}",
                            response_code=response.code,
                        )
                    return response.payload
                timeout *= 2
            raise CoapError("request timed out")

    async def async_close(self) -> None:
        self._closed = True
        if self._transport is not None:
            self._transport.close()
            self._transport = None
            await asyncio.sleep(0)
        self._protocol = None


DebugCallback = Callable[[str, dict[str, Any]], None]


class LafaerProtocolClient:
    """Typed command facade whose lifetime is exactly one active UI session."""

    def __init__(
        self,
        host: str,
        pairing_material: str,
        *,
        model: str,
        debug: DebugCallback | None = None,
        strict_checksum: bool = True,
    ) -> None:
        self.host = host
        self.model = model
        self.pairing_material = pairing_material
        self._transport = CoapTransport(host)
        self._debug = debug
        self._strict_checksum = strict_checksum

    def _event(self, event: str, **data: Any) -> None:
        if self._debug is not None:
            self._debug(event, data)

    async def _exchange(
        self, command: Command, *, method: str, data: bytes = b""
    ) -> DecodedResponse:
        encrypted = encode_request(command.code, data, self.pairing_material)
        self._event(
            "request",
            command=command.name,
            method=method,
            data_length=len(data),
            encrypted_length=len(encrypted),
        )
        started = asyncio.get_running_loop().time()
        try:
            response_payload = await self._transport.async_request(method, command.path, encrypted)
            response = decode_response(
                response_payload,
                self.pairing_material,
                strict_checksum=self._strict_checksum,
            )
        except Exception as err:
            self._event("error", command=command.name, error=str(err))
            raise
        self._event(
            "response",
            command=command.name,
            status=response.status,
            data_length=len(response.data),
            checksum_valid=response.checksum_valid,
            duration_ms=round((asyncio.get_running_loop().time() - started) * 1000),
        )
        if response.status != 0:
            raise CoapError(f"sensor command {command.name} returned status {response.status}")
        return response

    async def async_authenticate(self, uid: str) -> str:
        """Authenticate and accept a rotated pairing material if returned."""
        response = await self._exchange(Command.COMPARE, method="POST", data=uid.encode("utf-8"))
        if response.data:
            self.pairing_material = pairing_material_from_compare(response.data)
        return self.pairing_material

    async def async_status(self) -> DeviceStatus:
        command = Command.STATUS_LWR02 if self.model == "LWR02" else Command.STATUS_LWR01
        response = await self._exchange(command, method="GET")
        return (
            DeviceStatus.parse_lwr02(response.data)
            if self.model == "LWR02"
            else DeviceStatus.parse_lwr01(response.data)
        )

    async def async_information(self) -> DeviceInfo:
        response = await self._exchange(Command.INFORMATION, method="GET")
        return DeviceInfo.parse(response.data)

    async def async_lwr02_config(self) -> Lwr2Config:
        response = await self._exchange(Command.CONFIG_LWR02, method="GET")
        return Lwr2Config.parse(response.data)

    async def async_radar_status(self) -> RadarStatus:
        # The App defines RADAR_STATUS (0x16) but never calls it. Its active
        # radar settings page reads 0x10 and parses that GET response as the
        # full 22-byte status structure (range states plus radar metadata).
        response = await self._exchange(Command.RADAR_RANGE, method="GET")
        return RadarStatus.parse(response.data)

    async def async_thresholds(self, *, keep: bool) -> RadarThresholds:
        command = Command.RADAR_KEEP_THRESHOLD if keep else Command.RADAR_DETECTION_THRESHOLD
        response = await self._exchange(command, method="GET")
        return RadarThresholds.parse(response.data)

    async def async_energy(self, *, keep: bool) -> list[int]:
        command = Command.RADAR_KEEP_VALUE if keep else Command.RADAR_DETECTION_VALUE
        response = await self._exchange(command, method="GET")
        from .codec import unpack_uint16_list

        return unpack_uint16_list(response.data)

    async def async_set_led(self, enabled: bool) -> None:
        command = Command.LED_LWR02 if self.model == "LWR02" else Command.LED
        await self._exchange(command, method="POST", data=bytes((int(enabled),)))

    async def async_identify(self) -> None:
        command = Command.IDENTIFY_LWR02 if self.model == "LWR02" else Command.IDENTIFY_LWR01
        await self._exchange(command, method="POST")

    async def async_set_darkness(self, enabled: bool, threshold: int) -> None:
        if not 0 <= threshold <= 1000:
            raise ValueError("darkness threshold must be between 0 and 1000 lux")
        command = Command.DARK_LUX if self.model == "LWR02" else Command.ALS_THRESHOLD
        encoded = uint16_be(threshold) if self.model == "LWR02" else uint16_le(threshold)
        await self._exchange(command, method="POST", data=bytes((int(enabled),)) + encoded)

    async def async_set_presence_timeout(self, seconds: int) -> None:
        minimum = 10 if self.model == "LWR02" else 20
        if not minimum <= seconds <= 3600:
            raise ValueError(f"presence timeout must be between {minimum} and 3600 seconds")
        if self.model == "LWR02":
            await self._exchange(Command.PRESENCE_TIMEOUT, method="POST", data=uint16_be(seconds))
        else:
            await self._exchange(
                Command.TRIGGER_NOBODY_TIME,
                method="POST",
                data=uint16_le(0) + uint16_le(seconds),
            )

    async def async_set_work_mode(self, mode: int) -> None:
        if self.model != "LWR02" or mode not in (0, 1, 2):
            raise ValueError("invalid LWR02 work mode")
        await self._exchange(Command.WORK_MODE, method="POST", data=bytes((mode,)))

    async def async_set_pir_sensitivity(self, value: int) -> None:
        if self.model != "LWR02" or value not in (0, 1, 2):
            raise ValueError("invalid LWR02 PIR sensitivity")
        await self._exchange(Command.PIR_SENSITIVITY, method="POST", data=bytes((value,)))

    async def async_set_radar_sensitivity(self, value: int) -> None:
        if self.model != "LWR02" or value not in (0, 1, 2, 3):
            raise ValueError("invalid LWR02 radar sensitivity")
        await self._exchange(Command.RADAR_SENSITIVITY, method="POST", data=bytes((value,)))

    async def async_set_battery_type(self, value: int) -> None:
        if self.model != "LWR02" or value not in (0, 1):
            raise ValueError("invalid LWR02 battery type")
        await self._exchange(Command.BATTERY_TYPE, method="POST", data=bytes((value,)))

    async def async_set_radar_range(self, ranges: list[int]) -> None:
        if (
            self.model != "LWR02"
            or len(ranges) != 15
            or any(value not in (0, 1, 2) for value in ranges)
        ):
            raise ValueError("radar range must contain 15 values in the range 0..2")
        await self._exchange(Command.RADAR_RANGE, method="POST", data=bytes(ranges))

    async def async_set_thresholds(self, values: list[int], *, keep: bool) -> None:
        if self.model != "LWR02" or len(values) != 15:
            raise ValueError("radar thresholds must contain 15 values")
        command = Command.RADAR_KEEP_THRESHOLD if keep else Command.RADAR_DETECTION_THRESHOLD
        await self._exchange(command, method="POST", data=pack_uint16_list(values))

    async def async_set_lwr01_ranges(
        self, enabled: list[int], trigger: list[int], hold: list[int]
    ) -> None:
        if self.model != "LWR01" or any(len(values) != 8 for values in (enabled, trigger, hold)):
            raise ValueError("LWR01 range configuration requires three 8-value lists")
        if any(value not in (0, 1) for value in enabled):
            raise ValueError("LWR01 enabled values must be 0 or 1")
        if any(not 10 <= value <= 90 for value in trigger + hold):
            raise ValueError("LWR01 sensitivity values must be between 10 and 90")
        await self._exchange(
            Command.TRIGGER_HOLD_GATE,
            method="POST",
            data=bytes(enabled + trigger + hold),
        )

    async def async_get_lwr01_ranges(self) -> dict[str, list[int]]:
        response = await self._exchange(Command.TRIGGER_HOLD_GATE, method="GET")
        if len(response.data) != 24:
            raise CoapError("LWR01 range response must contain 24 bytes")
        return {
            "enabled": list(response.data[:8]),
            "trigger": list(response.data[8:16]),
            "hold": list(response.data[16:24]),
        }

    async def async_get_lwr01_settings(self) -> dict[str, Any]:
        if self.model != "LWR01":
            raise ValueError("LWR01 settings requested for another model")
        darkness, performance, timeout, led = await asyncio.gather(
            self._exchange(Command.ALS_THRESHOLD, method="GET"),
            self._exchange(Command.PERFORMANCE_MODE, method="GET"),
            self._exchange(Command.TRIGGER_NOBODY_TIME, method="GET"),
            self._exchange(Command.LED, method="GET"),
        )
        if (
            len(darkness.data) < 3
            or len(performance.data) < 2
            or len(timeout.data) < 4
            or not led.data
        ):
            raise CoapError("LWR01 settings response has an invalid length")
        return {
            "led_enabled": led.data[0] == 1,
            "darkness_enabled": darkness.data[0] == 1,
            "darkness_threshold": int.from_bytes(darkness.data[1:3], "little"),
            "battery_performance": performance.data[0] == 1,
            "usb_performance": performance.data[1] == 1,
            "trigger_delay": int.from_bytes(timeout.data[0:2], "little"),
            "presence_timeout": int.from_bytes(timeout.data[2:4], "little"),
        }

    async def async_set_performance_mode(self, battery: bool, usb: bool) -> None:
        if self.model != "LWR01":
            raise ValueError("performance mode is only available on LWR01")
        await self._exchange(
            Command.PERFORMANCE_MODE,
            method="POST",
            data=bytes((int(battery), int(usb))),
        )

    async def async_start_learning(self) -> None:
        command = Command.SELF_LEARNING if self.model == "LWR02" else Command.AUTO_THRESHOLD
        data = bytes((1,)) if self.model == "LWR02" else uint16_le(120)
        await self._exchange(command, method="POST", data=data)

    async def async_radar_reset(self) -> None:
        command = Command.RADAR_RESET_LWR02 if self.model == "LWR02" else Command.RADAR_RESET_LWR01
        await self._exchange(command, method="POST")

    async def async_factory_reset(self) -> None:
        await self._exchange(Command.FACTORY_RESET, method="POST")

    async def async_delete_management(self) -> None:
        if self.model != "LWR01":
            raise ValueError("firmware delete-management command is only available on LWR01")
        await self._exchange(Command.DELETE_DEVICE, method="POST")

    async def async_close(self) -> None:
        await self._transport.async_close()
