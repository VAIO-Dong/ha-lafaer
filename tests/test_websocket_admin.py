"""Static compatibility checks for privileged WebSocket commands."""

from __future__ import annotations

import ast
from pathlib import Path
from types import SimpleNamespace

SOURCE_PATH = (
    Path(__file__).parents[1] / "custom_components" / "lafaer" / "websocket_api.py"
)
ADMIN_COMMANDS = {
    "websocket_remove_discovery",
    "websocket_clear_discovery_history",
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


async def test_discovery_subscription_acknowledges_before_events_and_registers_cleanup():
    tree = ast.parse(SOURCE_PATH.read_text(encoding="utf-8"))
    function = next(node for node in tree.body
                    if isinstance(node, ast.AsyncFunctionDef)
                    and node.name == "websocket_subscribe_discovery")
    function.decorator_list = []
    module = ast.Module(body=[
        ast.ImportFrom(module="__future__", names=[ast.alias(name="annotations")], level=0),
        function,
    ], type_ignores=[])
    events, removed = [], []

    def subscribe(listener):
        listener({"scanning": True, "discovered": []})
        return lambda: removed.append(True)

    controller = SimpleNamespace(subscribe_discovery=subscribe)
    namespace = {"_controller": lambda hass: controller}
    exec(compile(ast.fix_missing_locations(module), str(SOURCE_PATH), "exec"), namespace)  # noqa: S102
    connection = SimpleNamespace(
        subscriptions={},
        send_result=lambda identifier: events.append(("ack", identifier)),
        send_event=lambda identifier, event: events.append(("event", identifier, event)),
    )
    await namespace["websocket_subscribe_discovery"](None, connection, {"id": 42})
    assert events[0] == ("ack", 42)
    assert events[1][0:2] == ("event", 42)
    connection.subscriptions[42]()
    assert removed == [True]
