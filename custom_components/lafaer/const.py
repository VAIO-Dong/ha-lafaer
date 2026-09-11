"""Constants for the Lafaer integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "lafaer"
NAME: Final = "Lafaer"
PANEL_URL: Final = "lafaer"
PANEL_COMPONENT: Final = "ha-lafaer-panel"
PANEL_STATIC_URL: Final = "/api/lafaer/frontend/ha-lafaer-panel.js"
PANEL_MODULE_URL: Final = f"{PANEL_STATIC_URL}?v=0.1.28"

CONF_DEBUG_PERSIST: Final = "debug_persist"
DEFAULT_DEBUG_PERSIST: Final = False

SERVICE_TYPE: Final = "_glinet._tcp.local."
COAP_PORT: Final = 5683
DISCOVERY_TIMEOUT: Final = 15.0
STATUS_INTERVAL: Final = 2.0
HEARTBEAT_INTERVAL: Final = 10.0
LEASE_TIMEOUT: Final = 25.0

SUPPORTED_MODELS: Final = frozenset({"LWR01", "LWR02"})
STORAGE_KEY: Final = DOMAIN
STORAGE_VERSION: Final = 1

DATA_CONTROLLERS: Final = "controllers"
DATA_PANEL_REGISTERED: Final = "panel_registered"
DATA_STATIC_REGISTERED: Final = "static_registered"
DATA_WEBSOCKET_REGISTERED: Final = "websocket_registered"
