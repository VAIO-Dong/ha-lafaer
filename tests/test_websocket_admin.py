"""Static compatibility checks for privileged WebSocket commands."""

from __future__ import annotations

import ast
from pathlib import Path

SOURCE_PATH = (
    Path(__file__).parents[1] / "custom_components" / "lafaer" / "websocket_api.py"
)
ADMIN_COMMANDS = {
    "websocket_adopt_device",
    "websocket_device_action",
    "websocket_forget_device",
    "websocket_rename_device",
    "websocket_debug_clear",
}


def test_privileged_commands_use_supported_admin_decorator() -> None:
    source = SOURCE_PATH.read_text(encoding="utf-8")
    tree = ast.parse(source)
    functions = {
        node.name: node
        for node in tree.body
        if isinstance(node, ast.AsyncFunctionDef)
    }

    assert ".require_admin()" not in source
    for command in ADMIN_COMMANDS:
        decorators = functions[command].decorator_list
        assert any(
            isinstance(decorator, ast.Attribute)
            and decorator.attr == "require_admin"
            for decorator in decorators
        ), command
