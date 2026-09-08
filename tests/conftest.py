"""Load the protocol package without requiring a full Home Assistant install."""

from __future__ import annotations

import sys
import types
from pathlib import Path

ROOT = Path(__file__).parents[1]

for package, path in (
    ("custom_components", ROOT / "custom_components"),
    ("custom_components.lafaer", ROOT / "custom_components" / "lafaer"),
):
    module = types.ModuleType(package)
    module.__path__ = [str(path)]
    sys.modules.setdefault(package, module)
