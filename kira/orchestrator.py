"""Orchestrator – core request dispatcher for Kira Phase 4.

The orchestrator receives a plain ``dict`` request from the CLI (or other callers), ensures a valid session, checks the policy engine, logs the flow, and routes the request to the appropriate subsystem (learning, skill, preferences, tools, etc.).

All decisions are audited via ``audit.logger.log`` and returned as JSON‑compatible dictionaries.
"""

import uuid
import datetime
import dataclasses
from typing import Any, Dict

# Local imports – the project modules
from auth.session import SessionStore
from policy.models import AuthorizationRequest, IdentityLevel, AuthState
from policy.registry import get_operation
from policy.engine import authorize
from audit.logger import log
from security.boundary import check_tool_allowed
from tools.registry import get_tool_info

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
            from learning.manager import LearningManager
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
            from skill.manager import SkillManager
            sm = SkillManager()
            # Map specific skill commands to manager methods.
            if command == "skill_add_candidate":
                name = params.get("name")
                definition = params.get("definition")
                if not name or not definition:
                    raise ValueError("'name' and 'definition' are required for skill_add_candidate")
                sm.add_candidate(name, definition)
                return {"skill": "added", "name": name}
            if command == "skill_edit":
                name = params.get("name")
                definition = params.get("definition")
                if not name or not definition:
                    raise ValueError("'name' and 'definition' are required for skill_edit")
                sm.edit_skill(name, definition)
                return {"skill": "edited", "name": name}
            if command == "skill_promote":
                name = params.get("name")
                if not name:
                    raise ValueError("'name' is required for skill_promote")
                sm.promote(name)
                return {"skill": "promoted", "name": name}
            if command == "skill_deactivate":
                name = params.get("name")
                if not name:
                    raise ValueError("'name' is required for skill_deactivate")
                sm.deactivate(name)
                return {"skill": "deactivated", "name": name}
            if command == "skill_get":
                name = params.get("name")
                if not name:
                    raise ValueError("'name' is required for skill_get")
                skill = sm.get(name)
                return {"skill": skill}
            if command == "skill_list":
                return {"skills": sm.list_all()}
            # Fallback – unsupported skill command.
            raise NotImplementedError(f"Skill command {command} not implemented")


        # Preferences subsystem – placeholder.
        if command.startswith("preference_"):
            from preferences.manager import set_preference, get_preference, list_all
            if command == "preference_set":
                key = params.get("key")
                value = params.get("value")
                if key is None:
                    raise ValueError("'key' is required for preference_set")
                set_preference(key, value)
                return {"preference": {"key": key, "value": value}}
            if command == "preference_get":
                key = params.get("key")
                if key is None:
                    raise ValueError("'key' is required for preference_get")
                return {"preference": {"key": key, "value": get_preference(key)}}
            if command == "preference_list":
                return {"preferences": list_all()}
            raise NotImplementedError(f"Preference command {command} not implemented")


        # Repository commands – manage git repositories.
        if command.startswith("repo_"):
            # Lazy import to avoid circular dependencies.
            from repo.manager import RepoManager
            repo_cmd = command[len("repo_"):]
            if repo_cmd == "clone":
                url = params.get("url")
                dest = params.get("dest", ".")
                if not url:
                    raise ValueError("'url' parameter is required for repo_clone")
                return RepoManager.clone(url, dest)
            if repo_cmd == "pull":
                path = params.get("path")
                if not path:
                    raise ValueError("'path' parameter is required for repo_pull")
                return RepoManager.pull(path)
            if repo_cmd == "status":
                path = params.get("path")
                if not path:
                    raise ValueError("'path' parameter is required for repo_status")
                return RepoManager.status(path)
            if repo_cmd == "list_files":
                path = params.get("path")
                if not path:
                    raise ValueError("'path' parameter is required for repo_list_files")
                return RepoManager.list_files(path)
            raise NotImplementedError(f"Repo command {command} not implemented")
        # Obsidian sync – expose memory files to a vault.
        if command == "obsidian_sync":
            from .obsidian_sync import sync_brain_to_obsidian
            # Optional custom destination can be supplied via params.
            dest = params.get("dest")
            return sync_brain_to_obsidian(dest)


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

        # Log the request and the policy decision (minimal fields to avoid serialization issues)
        self._log_event({
            "type": "authorization",
            "session_id": session_id,
            "command": command,
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
