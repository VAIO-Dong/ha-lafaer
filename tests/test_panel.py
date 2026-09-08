"""Tests for Home Assistant panel API compatibility."""

from __future__ import annotations

import sys
import types
from typing import Any

import pytest

homeassistant = types.ModuleType("homeassistant")
components = types.ModuleType("homeassistant.components")
frontend = types.ModuleType("homeassistant.components.frontend")
panel_custom = types.ModuleType("homeassistant.components.panel_custom")
http = types.ModuleType("homeassistant.components.http")
core = types.ModuleType("homeassistant.core")


class StaticPathConfig:
    """Minimal stand-in used while importing panel.py."""

    def __init__(self, *args: Any) -> None:
        self.args = args


http.StaticPathConfig = StaticPathConfig
core.HomeAssistant = object
frontend.async_remove_panel = lambda *args, **kwargs: None
panel_custom.async_register_panel = lambda *args, **kwargs: None
components.frontend = frontend
components.panel_custom = panel_custom
homeassistant.components = components
sys.modules.setdefault("homeassistant", homeassistant)
sys.modules.setdefault("homeassistant.components", components)
sys.modules.setdefault("homeassistant.components.frontend", frontend)
sys.modules.setdefault("homeassistant.components.panel_custom", panel_custom)
sys.modules.setdefault("homeassistant.components.http", http)
sys.modules.setdefault("homeassistant.core", core)

from custom_components.lafaer import panel  # noqa: E402


@pytest.mark.asyncio
async def test_register_panel_supports_synchronous_api(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    calls: list[dict[str, Any]] = []
    monkeypatch.setattr(
        panel.panel_custom,
        "async_register_panel",
        lambda *args, **kwargs: calls.append(kwargs),
    )

    await panel.async_register_panel(object(), register_static=False)

    assert calls[0]["frontend_url_path"] == "lafaer"


@pytest.mark.asyncio
async def test_register_panel_awaits_asynchronous_api(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    awaited = False

    async def register(*args: Any, **kwargs: Any) -> None:
        nonlocal awaited
        awaited = True

    monkeypatch.setattr(panel.panel_custom, "async_register_panel", register)

    await panel.async_register_panel(object(), register_static=False)

    assert awaited is True
