"""Preferences manager – simple key/value store for Phase 4.

Preferences are persisted as JSON in ``~/.kira/preferences.json``. The manager provides
basic CRUD operations used by the orchestrator for ``preference_set`` and future
preference queries.
"""

import os
import json
from typing import Any, Dict

PREF_PATH = os.path.expanduser("~/.kira/preferences.json")

def _ensure_file() -> None:
    """Create the preferences file if it does not exist."""
    os.makedirs(os.path.dirname(PREF_PATH), exist_ok=True)
    if not os.path.isfile(PREF_PATH):
        with open(PREF_PATH, "w", encoding="utf-8") as f:
            json.dump({}, f)

def _load() -> Dict[str, Any]:
    _ensure_file()
    with open(PREF_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def _save(prefs: Dict[str, Any]) -> None:
    with open(PREF_PATH, "w", encoding="utf-8") as f:
        json.dump(prefs, f, indent=2)

def set_preference(key: str, value: Any) -> None:
    """Set or update a preference value."""
    prefs = _load()
    prefs[key] = value
    _save(prefs)

def get_preference(key: str) -> Any:
    """Retrieve a preference value, or ``None`` if not set."""
    prefs = _load()
    return prefs.get(key)

def list_all() -> Dict[str, Any]:
    """Return the entire preferences dictionary."""
    return _load()
