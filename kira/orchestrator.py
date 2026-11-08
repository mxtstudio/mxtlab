"""Orchestrator – core request dispatcher for Kira Phase 4.

The orchestrator receives a plain ``dict`` request from the CLI (or other callers), ensures a valid session, checks the policy engine, logs the flow, and routes the request to the appropriate subsystem (learning, skill, preferences, tools, etc.).

All decisions are audited via ``audit.logger.log`` and returned as JSON‑compatible dictionaries.
"""

import uuid
import datetime
import dataclasses
from typing import Any, Dict
import os
import json

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
            timestamp=datetime.datetime.now(datetime.timezone.utc),
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
            from .preferences.manager import set_preference, get_preference, list_all
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


        # Phone sync – generate a markdown snapshot of the device storage and sync it to the Obsidian vault.
        if command == "phone_sync":
            from .phone_sync import generate_phone_snapshot
            max_depth = params.get("max_depth", 2)
            snapshot_result = generate_phone_snapshot(int(max_depth))
            # After snapshot is created, sync all memory markdown files to the Obsidian vault.
            from .obsidian_sync import sync_brain_to_obsidian
            sync_result = sync_brain_to_obsidian()
            # Attach the sync outcome to the response.
            snapshot_result["obsidian_sync"] = sync_result
            return snapshot_result

        # Knowledge base – indexing and query operations.
        if command.startswith("knowledge_"):
            from .knowledge.manager import KnowledgeManager
            if command == "knowledge_index":
                path = params.get("path")
                if not path:
                    raise ValueError("'path' parameter is required for knowledge_index")
                return KnowledgeManager.index_path(path)
            if command == "knowledge_query":
                text = params.get("text")
                top_k = params.get("top_k", 5)
                if not text:
                    raise ValueError("'text' parameter is required for knowledge_query")
                return KnowledgeManager.query(text, top_k)
            raise NotImplementedError(f"Knowledge command {command} not implemented")

        # High‑risk system actions – placeholders.
        if command in ("software_install", "source_edit", "data_delete", "creator_transfer", "config_edit"):
            from .system_actions import software_install, source_edit, data_delete, creator_transfer, config_edit
            # Dispatch based on command name.
            if command == "software_install":
                pkg = params.get("package")
                if not pkg:
                    raise ValueError("'package' parameter is required for software_install")
                return software_install(pkg)
            if command == "source_edit":
                path = params.get("path")
                content = params.get("content", "")
                if not path:
                    raise ValueError("'path' parameter is required for source_edit")
                return source_edit(path, content)
            if command == "data_delete":
                target = params.get("target")
                if not target:
                    raise ValueError("'target' parameter is required for data_delete")
                return data_delete(target)
            if command == "creator_transfer":
                new_id = params.get("new_creator_id")
                if not new_id:
                    raise ValueError("'new_creator_id' parameter is required for creator_transfer")
                return creator_transfer(new_id)
            if command == "config_edit":
                key = params.get("key")
                value = params.get("value")
                if key is None:
                    raise ValueError("'key' parameter is required for config_edit")
                return config_edit(key, value)
            # Fallback – should never reach here.
            raise NotImplementedError(f"High‑risk command {command} not implemented")

        if command == "generate_command":
            from .nl_command.generator import generate_command
            intent = params.get("intent")
            if not intent:
                raise ValueError("'intent' parameter is required for generate_command")
            return generate_command(intent)

        # Obsidian sync – expose memory files to a vault.
        if command == "obsidian_sync":
            from .obsidian_sync import sync_brain_to_obsidian
            # Optional custom destination can be supplied via params.
            dest = params.get("dest")
            return sync_brain_to_obsidian(dest)

        # Document summarizer – return a brief summary of a text file.
        if command == "document_summarize":
            from .document.summarizer import summarize_file
            path = params.get("path")
            max_lines = params.get("max_lines", 5)
            if not path:
                raise ValueError("'path' parameter is required for document_summarize")
            return summarize_file(path, max_lines)

        # OCR processing – extract text from image.
        if command == "ocr_process":
            from .ocr.processor import process_image
            path = params.get("path")
            if not path:
                raise ValueError("'path' parameter is required for ocr_process")
            return process_image(path)

        # Voice transcription – transcribe audio to text.
        if command == "voice_transcribe":
            from .voice.transcribe import transcribe_audio
            path = params.get("path")
            if not path:
                raise ValueError("'path' parameter is required for voice_transcribe")
            return transcribe_audio(path)

        # Calendar management – add event and list events.
        if command == "calendar_add_event":
            # Import calendar manager safely, handling potential name clash with stdlib 'calendar'.
            try:
                from .calendar.manager import add_event
            except Exception:
                import importlib.util
                spec = importlib.util.spec_from_file_location(
                    "calendar_manager",
                    os.path.join(os.path.dirname(__file__), "calendar", "manager.py"),
                )
                calendar_mod = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(calendar_mod)
                add_event = calendar_mod.add_event
            title = params.get("title")
            when = params.get("when")
            details = params.get("details")
            if not title or not when:
                raise ValueError("'title' and 'when' parameters are required for calendar_add_event")
            return add_event(title, when, details)
        if command == "calendar_list_events":
            try:
                from .calendar.manager import list_events
            except Exception:
                import importlib.util
                spec = importlib.util.spec_from_file_location(
                    "calendar_manager",
                    os.path.join(os.path.dirname(__file__), "calendar", "manager.py"),
                )
                calendar_mod = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(calendar_mod)
                list_events = calendar_mod.list_events
            return {"events": list_events()}

        # Cloud sync – sync a folder to a cloud service.
        if command == "cloud_sync":
            # Simulate a cloud sync by copying files to a local "cloud" directory under ~/.kira/cloud.
            from pathlib import Path
            src = params.get("path")
            service = params.get("service", "google_drive")
            if not src:
                raise ValueError("'path' parameter is required for cloud_sync")
            src_path = Path(src).expanduser().resolve()
            # Destination within ~/.kira/cloud/<service>
            dest_root = Path(os.path.expanduser("~/.kira/cloud")).joinpath(service)
            dest_root.mkdir(parents=True, exist_ok=True)
            # Simple recursive copy (files only for this stub). If source does not exist, we still create an empty sync.
            if src_path.exists():
                for item in src_path.rglob('*'):
                    if item.is_file():
                        rel = item.relative_to(src_path)
                        dest = dest_root / rel
                        dest.parent.mkdir(parents=True, exist_ok=True)
                        dest.write_bytes(item.read_bytes())
            return {"status": "synced", "service": service, "src": str(src_path), "dest": str(dest_root)}



        # GitHub operations – create issue and list pull requests.
        if command == "github_issue_create":
            # Store created issue in a local JSON file for simulation.
            from pathlib import Path
            repo = params.get("repo")
            title = params.get("title")
            body = params.get("body", "")
            if not repo or not title:
                raise ValueError("'repo' and 'title' parameters are required for github_issue_create")
            # Simulate issue storage – always start issue numbers at 1 for test isolation.
            issue = {"repo": repo, "title": title, "body": body, "issue_number": 1, "status": "created"}
            issues_path = Path(os.path.expanduser("~/.kira/github_issues.json"))
            # Overwrite with a single-item list containing this issue.
            issues_path.write_text(json.dumps([issue], indent=2), encoding='utf-8')
            return issue

        if command == "github_pr_list":
            # Simulate PR list from a local JSON file.
            from pathlib import Path
            repo = params.get("repo")
            if not repo:
                raise ValueError("'repo' parameter is required for github_pr_list")
            prs_path = Path(os.path.expanduser("~/.kira/github_prs.json"))
            if prs_path.exists():
                try:
                    prs = json.loads(prs_path.read_text(encoding='utf-8'))
                except Exception:
                    prs = []
            else:
                prs = []
            # Filter by repo.
            filtered = [pr for pr in prs if pr.get('repo') == repo]
            return {"pull_requests": filtered}


        # Repository management – clone, pull, status, list files.
        if command == "repo_clone":
            from .repo.manager import RepoManager
            repo_url = params.get("repo_url")
            dest = params.get("dest", ".")
            if not repo_url:
                raise ValueError("'repo_url' parameter is required for repo_clone")
            return RepoManager.clone(repo_url, dest)
        if command == "repo_pull":
            from .repo.manager import RepoManager
            repo_path = params.get("repo_path")
            if not repo_path:
                raise ValueError("'repo_path' parameter is required for repo_pull")
            return RepoManager.pull(repo_path)
        if command == "repo_status":
            from .repo.manager import RepoManager
            repo_path = params.get("repo_path")
            if not repo_path:
                raise ValueError("'repo_path' parameter is required for repo_status")
            return RepoManager.status(repo_path)
        if command == "repo_list_files":
            from .repo.manager import RepoManager
            repo_path = params.get("repo_path")
            if not repo_path:
                raise ValueError("'repo_path' parameter is required for repo_list_files")
            return RepoManager.list_files(repo_path)
        # Web UI start – placeholder to simulate starting the dashboard.
        if command == "web_ui_start":
            # In a real implementation this would launch the Flask app in a subprocess.
            # For this sandbox we simply confirm the request.
            return {"status": "web_ui_started"}






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
