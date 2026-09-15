"""Session management for Kira Phase 4.

Provides an in‑memory `SessionStore` that tracks a session's identity, authentication state, and last activity timestamp.
The store is used by the authentication layer and the orchestrator to enforce policy decisions and session expiry.
"""

import uuid
import datetime
from dataclasses import dataclass
from typing import Dict, Optional

from .identity import Identity
from policy.models import AuthState

# Default session time‑to‑live – 30 minutes of inactivity expires the session.
SESSION_TTL = datetime.timedelta(minutes=30)

@dataclass
class Session:
    """Simple session record.

    Attributes:
        session_id: Unique identifier for the session (UUID string).
        identity: Current `Identity` (UNKNOWN, KNOWN_USER, AUTHENTICATED_CREATOR).
        auth_state: One of `AuthState` – reflects whether the session is authenticated or expired.
        last_activity: UTC timestamp of the last activity; used for expiry.
    """
    session_id: str
    identity: Identity
    auth_state: AuthState
    last_activity: datetime.datetime

class SessionStore:
    """Global in‑memory store for sessions.

    The store is deliberately simple – a class‑level dict mapping session IDs to ``Session`` objects.
    It provides helper methods for creation, lookup, identity updates, timestamp refresh, and expiration.
    """
    _sessions: Dict[str, Session] = {}

    @classmethod
    def create(cls, session_id: Optional[str] = None) -> Session:
        """Create a fresh session.

        If ``session_id`` is supplied and not already present, that ID is used; otherwise a new UUID is generated.
        The new session starts with ``Identity.UNKNOWN`` and ``AuthState.UNAUTHENTICATED``.
        """
        if session_id is None:
            session_id = str(uuid.uuid4())
        now = datetime.datetime.utcnow()
        sess = Session(
            session_id=session_id,
            identity=Identity.UNKNOWN,
            auth_state=AuthState.UNAUTHENTICATED,
            last_activity=now,
        )
        cls._sessions[session_id] = sess
        return sess

    @classmethod
    def get(cls, session_id: str) -> Optional[Session]:
        """Retrieve a session by ID, or ``None`` if not found."""
        return cls._sessions.get(session_id)

    @classmethod
    def set_identity(cls, session_id: str, identity: Identity) -> None:
        """Update the ``identity`` of a session.

        The caller is responsible for ensuring the session exists.
        """
        sess = cls._sessions[session_id]
        sess.identity = identity
        # When identity is upgraded we also consider the session authenticated.
        if identity != Identity.UNKNOWN:
            sess.auth_state = AuthState.AUTHENTICATED
        else:
            sess.auth_state = AuthState.UNAUTHENTICATED

    @classmethod
    def set_auth_state(cls, session_id: str, state: AuthState) -> None:
        """Force‑set the authentication state (e.g., ``EXPIRED``)."""
        sess = cls._sessions[session_id]
        sess.auth_state = state

    @classmethod
    def refresh_timestamp(cls, session_id: str) -> None:
        """Mark activity on the session and bump its ``last_activity``.

        If the session has a known identity, we also promote the auth state to ``AUTHENTICATED``.
        """
        sess = cls._sessions[session_id]
        now = datetime.datetime.utcnow()
        sess.last_activity = now
        if sess.identity != Identity.UNKNOWN:
            sess.auth_state = AuthState.AUTHENTICATED

    @classmethod
    def expire_sessions(cls, timeout: datetime.timedelta = SESSION_TTL) -> None:
        """Expire sessions that have been idle longer than ``timeout``.

        Expired sessions have their ``auth_state`` set to ``AuthState.EXPIRED`` – the orchestrator will then ask the policy engine to require re‑authentication.
        """
        now = datetime.datetime.utcnow()
        for sess in cls._sessions.values():
            if now - sess.last_activity > timeout:
                sess.auth_state = AuthState.EXPIRED

    @classmethod
    def all_sessions(cls) -> Dict[str, Session]:
        """Return a shallow copy of the internal session mapping – useful for debugging and tests."""
        return dict(cls._sessions)
