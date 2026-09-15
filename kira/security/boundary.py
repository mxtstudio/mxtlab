"""Security boundary checks for Kira.

All operations must pass the policy engine *and* the immutable security
boundaries defined here.  Currently the only hard boundary is the tool
whitelist – attempts to execute a non‑whitelisted tool are rejected.
"""

from tools.registry import TOOLS


def check_tool_allowed(tool_name: str) -> bool:
    """Return ``True`` if the tool is present in the whitelist.

    The CLI uses ``tool_<suffix>`` commands, while the whitelist entries are the
    actual tool identifiers (e.g., ``termux_notification``).  This helper strips
    the ``tool_`` prefix and checks whether the remaining suffix appears in any
    whitelist entry, allowing a convenient mapping without exposing the exact
    implementation name.
    """
    # Map known tool command aliases to whitelist entries.
    ALIAS_MAP = {
        "tool_notify": "termux_notification",
        "tool_toast": "termux_toast",
        "tool_clipboard_set": "termux_clipboard_set",
        "tool_clipboard_get": "termux_clipboard_get",
        "tool_battery": "termux_battery_status",
        "tool_vault_save_note": "vault_save_note",
    }
    stripped = tool_name.replace('tool_', '')
    # Direct match of stripped name
    if stripped in TOOLS:
        return True
    # Alias map
    if tool_name in ALIAS_MAP and ALIAS_MAP[tool_name] in TOOLS:
        return True
    # Fallback: direct prefix match (e.g., "notify" -> "termux_notification")
    for name in TOOLS:
        if name.endswith(stripped) or stripped in name:
            return True
    return False

