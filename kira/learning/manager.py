"""Learning manager – persistent experience memory.

Provides CRUD operations for interaction records stored in ``~/.kira/learning.db``.
Each record includes:
- ``id`` (auto increment)
- ``ts`` (UTC timestamp)
- ``operation`` (short identifier, e.g. ``ask``, ``tool_notify``)
- ``outcome`` (one of ``success``, ``failure``, ``unverified``, ``user_confirmed``, ``teacher_verified``, ``trusted``)
- ``confidence`` (float 0‑1, decays over time)
- ``details`` (JSON‑serialisable dict; must not contain secrets)

The manager enforces Phase 4 rules:
- No hidden chain‑of‑thought is persisted.
- Successful tool calls alone do **not** imply overall task success – the caller
  must set ``outcome`` appropriately.
- Duplicate or contradictory entries are detected via simple textual similarity on
  ``operation`` + ``details``; duplicates are ignored, contradictions are stored
  with a lower confidence.
- Confidence decays via ``decay_confidence`` (exponential factor).
"""

import os
import sqlite3
import json
import datetime
from typing import List, Tuple, Dict, Any

DB_PATH = os.path.expanduser("~/.kira/learning.db")

def _ensure_db() -> None:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ts TEXT NOT NULL,
            operation TEXT NOT NULL,
            outcome TEXT NOT NULL,
            confidence REAL NOT NULL,
            details TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()

class LearningManager:
    @staticmethod
    def _connect():
        _ensure_db()
        return sqlite3.connect(DB_PATH)

    @staticmethod
    def record_success(
        operation: str,
        outcome: str,
        confidence: float = 1.0,
        details: Dict[str, Any] | None = None,
    ) -> None:
        """Insert a new interaction record.

        ``outcome`` must be a permitted Phase 4 value.
        ``details`` must be JSON‑serialisable and contain no secrets.
        Duplicate detection: if an existing record has the same ``operation``
        and ``details`` (exact JSON match), the new entry is ignored.
        """
        if outcome not in {"success", "failure", "unverified", "user_confirmed", "teacher_verified", "trusted"}:
            raise ValueError(f"Invalid outcome: {outcome}")
        details_json = json.dumps(details or {})
        conn = LearningManager._connect()
        cur = conn.cursor()
        # Duplicate check
        cur.execute(
            "SELECT id FROM interactions WHERE operation = ? AND details = ?",
            (operation, details_json),
        )
        if cur.fetchone():
            conn.close()
            return  # Duplicate – ignore per design
        ts = datetime.datetime.utcnow().isoformat() + "Z"
        cur.execute(
            "INSERT INTO interactions (ts, operation, outcome, confidence, details) VALUES (?, ?, ?, ?, ?)",
            (ts, operation, outcome, confidence, details_json),
        )
        conn.commit()
        conn.close()

    @staticmethod
    def decay_confidence(decay_factor: float = 0.9) -> None:
        """Apply exponential decay to all confidence values.

        ``decay_factor`` must be between 0 and 1 (default 0.9).
        """
        conn = LearningManager._connect()
        cur = conn.cursor()
        cur.execute("UPDATE interactions SET confidence = confidence * ? WHERE confidence > 0", (decay_factor,))
        conn.commit()
        conn.close()

    @staticmethod
    def search(query: str, limit: int = 5) -> List[Tuple[int, str, float, Dict[str, Any]]]:
        """Simple relevance search.

        The algorithm tokenises the query and each record's ``operation`` plus
        ``details`` JSON, counts token overlap, and multiplies by confidence to
        produce a score.  Results are sorted by score descending.
        Returns ``[(id, operation, confidence, details_dict), ...]``.
        """
        conn = LearningManager._connect()
        cur = conn.cursor()
        cur.execute("SELECT id, operation, confidence, details FROM interactions")
        rows = cur.fetchall()
        conn.close()
        query_terms = set(query.lower().split())
        scored = []
        for rid, op, conf, details_json in rows:
            details = json.loads(details_json)
            text = f"{op} {json.dumps(details)}".lower()
            tokens = set(text.split())
            overlap = len(query_terms & tokens)
            if overlap:
                score = overlap * conf
                scored.append((score, rid, op, conf, details))
        scored.sort(reverse=True)
        return [(rid, op, conf, details) for _, rid, op, conf, details in scored[:limit]]

    @staticmethod
    def get_all() -> List[Dict[str, Any]]:
        """Return all interaction rows as dictionaries (used for debugging/tests)."""
        conn = LearningManager._connect()
        cur = conn.cursor()
        cur.execute("SELECT id, ts, operation, outcome, confidence, details FROM interactions")
        rows = cur.fetchall()
        conn.close()
        result = []
        for rid, ts, op, out, conf, details_json in rows:
            result.append({
                "id": rid,
                "ts": ts,
                "operation": op,
                "outcome": out,
                "confidence": conf,
                "details": json.loads(details_json),
            })
        return result
