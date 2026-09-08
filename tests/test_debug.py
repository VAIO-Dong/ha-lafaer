"""Tests for privacy-aware debug storage."""

from __future__ import annotations

import asyncio
from pathlib import Path

import pytest

from custom_components.lafaer.debug import DebugBuffer


class FakeConfig:
    def __init__(self, root: Path) -> None:
        self.root = root

    def path(self, *parts: str) -> str:
        return str(self.root.joinpath(*parts))


class FakeHass:
    def __init__(self, root: Path) -> None:
        self.config = FakeConfig(root)

    def async_create_task(self, coroutine):
        return asyncio.create_task(coroutine)

    async def async_add_executor_job(self, target, *args):
        return target(*args)


def _create_rotations(log_path: Path) -> None:
    for suffix in ("", ".1", ".2", ".3"):
        path = Path(f"{log_path}{suffix}")
        path.parent.mkdir(parents=True, exist_ok=True)
        path.touch()


def _assert_rotations_removed(log_path: Path) -> None:
    for suffix in ("", ".1", ".2", ".3"):
        assert not Path(f"{log_path}{suffix}").exists()


def test_debug_events_are_recursively_redacted(tmp_path: Path) -> None:
    debug = DebugBuffer(FakeHass(tmp_path))
    debug.add(
        "protocol",
        "failed via AABBCCDDEEFF",
        data={
            "host": "fe80::1234",
            "nested": {
                "aes-key": "should not survive",
                "error": (
                    "peer aa:bb:cc:dd:ee:ff at fd00::1234 used "
                    "goodlife--00beef / 0123456789abcdef0123456789abcdef"
                ),
            },
            "raw": b"secret bytes",
        },
    )

    event = debug.as_list()[0]
    assert "AABBCCDDEEFF" not in event["message"]
    assert event["data"]["host"] == "[redacted]"
    assert event["data"]["nested"]["aes-key"] == "[redacted]"
    error = event["data"]["nested"]["error"]
    assert "aa:bb" not in error
    assert "fd00" not in error
    assert "goodlife" not in error
    assert "0123456789abcdef" not in error
    assert event["data"]["raw"] == "<12 bytes>"


@pytest.mark.asyncio
async def test_clear_removes_persistent_rotations(tmp_path: Path) -> None:
    debug = DebugBuffer(FakeHass(tmp_path), persist=True)
    await debug.async_start()
    debug.add("test", "written")
    await debug.async_close()

    log_path = tmp_path / ".storage" / "lafaer-debug.log"
    _create_rotations(log_path)

    await debug.async_start()
    await debug.async_clear()

    assert debug.as_list() == []
    _assert_rotations_removed(log_path)
    await debug.async_close()
