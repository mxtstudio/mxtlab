"""Operation registry for the Phase 4 policy engine.

Maps command names (as used by the CLI/orchestrator) to ``OperationDescriptor``
instances that capture the required identity level, minimum risk tier, and any
biometric/reauth requirements.
"""

from .models import (
    IdentityLevel,
    RiskTier,
    OperationDescriptor,
)

# Helper to create descriptors succinctly
def _op(name, identity, risk, biometric=False, reauth=False, desc=""):
    return OperationDescriptor(
        name=name,
        required_identity=identity,
        min_risk=risk,
        biometric_required=biometric,
        reauth_required=reauth,
        description=desc,
    )

OPERATION_REGISTRY = {
    # R0 – low/no risk, any identity
    "ask": _op("ask", IdentityLevel.UNKNOWN, RiskTier.R0, desc="Ask a question / chat"),
    "search": _op("search", IdentityLevel.KNOWN_USER, RiskTier.R0, desc="Search vault or web"),

    # R1 – low‑risk tools, Creator required (but no biometric)
    "tool_notify": _op("tool_notify", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R1, desc="Show notification"),
    "tool_toast": _op("tool_toast", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R1, desc="Show toast"),
    "tool_clipboard_set": _op("tool_clipboard_set", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R1, desc="Set clipboard"),
    "tool_clipboard_get": _op("tool_clipboard_get", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R1, desc="Get clipboard"),
    "tool_battery": _op("tool_battery", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R1, desc="Battery status"),
    "tool_vault_save_note": _op("tool_vault_save_note", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R1, desc="Save note to vault"),

    # Alias for termux_notification
    "tool_termux_notification": _op("tool_termux_notification", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R1, desc="Show notification (alias)"),

    # R2 – moderate‑risk operations (learning, preferences)
    "learning_record": _op("learning_record", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R1, desc="Record learning entry"),
    "preference_set": _op("preference_set", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R2, desc="Set a preference"),
    "preference_get": _op("preference_get", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R0, desc="Get a preference"),
    "preference_list": _op("preference_list", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R0, desc="List all preferences"),
    "memory_clear": _op("memory_clear", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R2, desc="Clear learning memory"),

    # R3 – high‑risk (config edit, skill edit, whitelist edit)
    "config_edit": _op("config_edit", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R3, biometric=True, desc="Edit Kira config"),
    "skill_add_candidate": _op("skill_add_candidate", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R2, desc="Add a candidate skill"),
    "skill_edit": _op("skill_edit", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R3, biometric=True, desc="Edit an existing skill"),
    "skill_promote": _op("skill_promote", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R3, biometric=True, desc="Promote a candidate skill"),
    "skill_deactivate": _op("skill_deactivate", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R3, biometric=True, desc="Deactivate a skill"),
    "skill_get": _op("skill_get", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R0, desc="Retrieve a skill definition"),
    "skill_list": _op("skill_list", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R0, desc="List all skills"),

    # R4 – critical (software install, source edit, data delete, authority transfer)
    "software_install": _op("software_install", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R4, biometric=True, desc="Install software package"),
    "source_edit": _op("source_edit", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R4, biometric=True, desc="Edit Kira source code"),
    "data_delete": _op("data_delete", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R4, biometric=True, desc="Delete important data"),
    "creator_transfer": _op("creator_transfer", IdentityLevel.AUTHENTICATED_CREATOR, RiskTier.R4, biometric=True, desc="Transfer Creator authority"),
}

def get_operation(name: str) -> OperationDescriptor:
    """Return the ``OperationDescriptor`` for *name*.

    Raises ``KeyError`` if the operation is unknown.
    """
    return OPERATION_REGISTRY[name]
