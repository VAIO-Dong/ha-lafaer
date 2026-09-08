"""Privacy-aware in-memory debug event storage."""

from __future__ import annotations

import asyncio
import json
import logging
import re
from collections import deque
from dataclasses import asdict, dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

_REDACTED = "[redacted]"
_SENSITIVE_KEYS = {
    "aes_key",
    "blue_id",
    "device_id",
    "host",
    "ipv6",
    "key",
    "mac",
    "name",
    "pairing_material",
    "serial_number",
    "sn",
    "thread_mac",
    "uid",
}
_MAC_RE = re.compile(r"(?i)(?<![0-9a-f])(?:[0-9a-f]{2}[:-]){5}[0-9a-f]{2}(?![0-9a-f])")
_DEVICE_HEX_RE = re.compile(r"(?i)(?<![0-9a-f])(?:[0-9a-f]{12}|[0-9a-f]{16})(?![0-9a-f])")
_IPV6_RE = re.compile(
    r"(?i)(?<![0-9a-f:])(?:[0-9a-f]{0,4}:){2,7}[0-9a-f]{0,4}(?:%[\w.-]+)?(?![0-9a-f:])"
)
_PAIRING_RE = re.compile(r"(?i)goodlife--00[0-9a-f]{4}")
_HEX_KEY_RE = re.compile(r"(?i)(?<![0-9a-f])[0-9a-f]{32}(?![0-9a-f])")


def _redact_string(value: str) -> str:
    for pattern in (_MAC_RE, _DEVICE_HEX_RE, _IPV6_RE, _PAIRING_RE, _HEX_KEY_RE):
        value = pattern.sub(_REDACTED, value)
    return value


def _redact(value: Any) -> Any:
    """Recursively remove credentials and stable device identifiers."""
    if isinstance(value, dict):
        return {
            key: _REDACTED
            if str(key).lower().replace("-", "_") in _SENSITIVE_KEYS
            else _redact(item)
            for key, item in value.items()
        }
    if isinstance(value, (list, tuple, set)):
        return [_redact(item) for item in value]
    if isinstance(value, bytes):
        return f"<{len(value)} bytes>"
    if isinstance(value, str):
        return _redact_string(value)
    return value


@dataclass(frozen=True, slots=True)
class DebugEvent:
    timestamp: str
    level: str
    category: str
    message: str
    data: dict[str, Any]

    def as_dict(self) -> dict[str, Any]:
        return asdict(self)


class DebugBuffer:
    """Bounded, centrally redacted event history."""

    def __init__(
        self,
        hass: HomeAssistant,
        *,
        persist: bool = False,
        max_events: int = 2000,
    ) -> None:
        self._hass = hass
        self._persist = persist
        self._events: deque[DebugEvent] = deque(maxlen=max_events)
        self._queue: asyncio.Queue[DebugEvent | None] | None = None
        self._writer_task: asyncio.Task[None] | None = None
        self._path = Path(hass.config.path(".storage", "lafaer-debug.log"))

    async def async_start(self) -> None:
        if self._persist and self._writer_task is None:
            self._queue = asyncio.Queue(maxsize=500)
            self._writer_task = self._hass.async_create_task(
                self._async_writer(self._queue)
            )

    async def async_close(self) -> None:
        if self._writer_task is None or self._queue is None:
            return
        queue = self._queue
        writer_task = self._writer_task
        self._writer_task = None
        self._queue = None
        await queue.put(None)
        await writer_task

    def add(
        self,
        category: str,
        message: str,
        *,
        level: str = "debug",
        data: dict[str, Any] | None = None,
    ) -> None:
        event = DebugEvent(
            timestamp=datetime.now(UTC).isoformat(),
            level=level,
            category=category,
            message=_redact_string(message),
            data=_redact(data or {}),
        )
        self._events.append(event)
        if self._queue is not None:
            try:
                self._queue.put_nowait(event)
            except asyncio.QueueFull:
                _LOGGER.warning("Lafaer persistent debug queue is full; dropping an event")
        log_method = getattr(_LOGGER, level, _LOGGER.debug)
        log_method("%s: %s %s", category, message, event.data)

    def protocol_callback(self, event: str, data: dict[str, Any]) -> None:
        """Receive metadata-only events from a protocol client."""
        self.add("protocol", event, level="error" if event == "error" else "debug", data=data)

    def as_list(self) -> list[dict[str, Any]]:
        return [event.as_dict() for event in reversed(self._events)]

    def clear(self) -> None:
        self._events.clear()

    async def async_clear(self) -> None:
        """Clear memory and all persistent rotations without writer races."""
        self.clear()
        writer_running = self._writer_task is not None
        if writer_running:
            await self.async_close()
        await self._hass.async_add_executor_job(self._delete_files)
        if writer_running:
            await self.async_start()

    async def _async_writer(self, queue: asyncio.Queue[DebugEvent | None]) -> None:
        while (event := await queue.get()) is not None:
            try:
                await self._hass.async_add_executor_job(self._write_event, event)
            except OSError:
                _LOGGER.exception("Unable to write the Lafaer persistent debug log")

    def _delete_files(self) -> None:
        for path in (
            self._path,
            self._path.with_suffix(".log.1"),
            self._path.with_suffix(".log.2"),
            self._path.with_suffix(".log.3"),
        ):
            path.unlink(missing_ok=True)

    def _write_event(self, event: DebugEvent) -> None:
        self._path.parent.mkdir(parents=True, exist_ok=True)
        if self._path.exists() and self._path.stat().st_size >= 1024 * 1024:
            oldest = self._path.with_suffix(".log.3")
            if oldest.exists():
                oldest.unlink()
            for index in (2, 1):
                source = self._path.with_suffix(f".log.{index}")
                if source.exists():
                    source.replace(self._path.with_suffix(f".log.{index + 1}"))
            self._path.replace(self._path.with_suffix(".log.1"))
        with self._path.open("a", encoding="utf-8") as output:
            output.write(json.dumps(event.as_dict(), ensure_ascii=False) + "\n")
