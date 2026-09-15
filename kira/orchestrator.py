"""Orchestrator – core request dispatcher for Kira Phase 4.

The orchestrator receives a plain ``dict`` request from the CLI (or other callers), ensures a valid session, checks the policy engine, logs the flow, and routes the request to the appropriate subsystem (learning, skill, preferences, tools, etc.).

All decisions are audited via ``audit.logger.log`` and returned as JSON‑compatible dictionaries.
"""

import uuid
import datetime
import dataclasses
from typing import Any, Dict

# Local imports – the project modules
from .auth.session import SessionStore
from .policy.models import AuthorizationRequest, IdentityLevel, AuthState
from .policy.registry import get_operation
from .policy.engine import authorize
from .audit.logger import log
from .security.boundary import check_tool_allowed
from .tools.registry import get_tool_info

# Subsystem imports – may be optional at runtime; we import lazily inside dispatch.

class Orchestrator:
    """Main request dispatcher.

    The public API is the ``handle`` method, which accepts a ``request`` dictionary and returns a response dictionary.
    """

    def _build_auth_request(self, session_id: str, operation) -> AuthorizationRequest:
        """Construct an ``AuthorizationRequest`` from the current session state and the operation descriptor."""
        sess = SessionStore.get(session_id)
        if sess is None:
            raise ValueError(f"Session {session_id} not found")
        # Convert the auth.identity enum (from auth.identity) to the policy IdentityLevel enum.
        identity_level = IdentityLevel[sess.identity.name]
        auth_req = AuthorizationRequest(
            session_id=session_id,
            identity=identity_level,
            auth_state=sess.auth_state,
            operation=operation,
            timestamp=datetime.datetime.utcnow(),
        )
        return auth_req

    def _log_event(self, event: Dict[str, Any]) -> None:
        """Thin wrapper around the audit logger.

        Ensures all audit entries contain a ``session_id`` field.
        """
        log(event)

    def _dispatch(self, command: str, params: Dict[str, Any]) -> Any:
        """Route an allowed command to the appropriate subsystem.

        The function returns the raw result from the subsystem – the orchestrator will embed it in the final response.
        """
        # Low‑risk built‑in commands – placeholder implementations.
        if command in ("ask", "search"):
            # In a real system this would forward to a search or chat service.
            return {"message": f"Executed placeholder for {command}"}

        # Tool commands – go through the whitelist and then a stub execution.
        if command.startswith("tool_"):
            # Verify whitelist via security boundary.
            if not check_tool_allowed(command):
                raise PermissionError(f"Tool {command} is not allowed by the whitelist")
            tool_meta = get_tool_info(command)
            # Stub execution – simply echo back parameters.
            return {
                "tool": command,
                "status": "executed",
                "params": params,
                "metadata": tool_meta,
            }

        # Learning subsystem – currently only ``learning_record`` is defined.
        if command.startswith("learning_"):
            from .learning.manager import LearningManager
            lm = LearningManager()
            if command == "learning_record":
                # Expected params: operation, outcome, confidence, details
                lm.record_success(
                    operation=params.get("operation", "unknown"),
                    outcome=params.get("outcome", "success"),
                    confidence=params.get("confidence", 1.0),
                    details=params.get("details"),
                )
                return {"learning": "recorded"}
            else:
                raise NotImplementedError(f"Learning command {command} not implemented")

        # Skill subsystem – placeholder for future skill actions.
        if command.startswith("skill_"):
            from .skill.manager import SkillManager
            sm = SkillManager()
            # Simple stub – return acknowledgement.
            return {"skill": command, "status": "handled", "params": params}

        # Preferences subsystem – placeholder.
        if command.startswith("preference_"):
            # Preferences manager would be imported here.
            return {"preference": command, "status": "handled", "params": params}

        # Any other command is currently unsupported.
        raise NotImplementedError(f"Unsupported command {command}")

    def handle(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """Entry point for processing a request.

        The request dictionary must contain at least a ``command`` key. Optional keys:
        - ``session_id`` – reuse an existing session; a new one is created if omitted or unknown.
        - ``params`` – operation‑specific arguments (dict).
        """
        command = request.get("command")
        if not command:
            return {"status": "error", "reason": "missing command"}

        # ------------------- Session handling -------------------
        session_id = request.get("session_id")
        if session_id:
            sess = SessionStore.get(session_id)
            if sess is None:
                # Unknown session – create a fresh one with the supplied ID.
                sess = SessionStore.create(session_id)
        else:
            sess = SessionStore.create()
            session_id = sess.session_id

        # Expire stale sessions before proceeding.
        SessionStore.expire_sessions()
        # Refresh activity for the current session.
        SessionStore.refresh_timestamp(session_id)

        # ------------------- Operation lookup -------------------
        try:
            operation = get_operation(command)
        except KeyError:
            # Unknown operation – audit and return a clear error.
            self._log_event({
                "type": "authorization",
                "session_id": session_id,
                "command": command,
                "outcome": "unknown_operation",
            })
            return {"status": "error", "reason": "unknown operation", "command": command}

        # ------------------- Policy decision -------------------
        auth_req = self._build_auth_request(session_id, operation)
        decision = authorize(auth_req)

        # Log the request and the policy decision.
        self._log_event({
            "type": "authorization",
            "session_id": session_id,
            "command": command,
            "request": dataclasses.asdict(auth_req),
            "decision": dataclasses.asdict(decision),
        })

        if not decision.allow:
            # Denied – return a structured denial response.
            return {
                "status": "denied",
                "reason": decision.reason,
                "biometric_needed": decision.biometric_needed,
                "reauth_needed": decision.reauth_needed,
                "session_id": session_id,
            }

        # ------------------- Dispatch to subsystem -------------------
        try:
            result = self._dispatch(command, request.get("params", {}))
        except Exception as exc:
            # Any unexpected error is logged and surfaced to the caller.
            self._log_event({
                "type": "operation",
                "session_id": session_id,
                "command": command,
                "outcome": "error",
                "error": str(exc),
            })
            return {"status": "error", "reason": str(exc), "session_id": session_id}

        # Log successful operation.
        self._log_event({
            "type": "operation",
            "session_id": session_id,
            "command": command,
            "outcome": "success",
            "result": result,
        })

        return {"status": "ok", "result": result, "session_id": session_id}
