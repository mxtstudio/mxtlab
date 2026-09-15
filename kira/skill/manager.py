"""Skill manager – reusable skill memory for Phase 4.

Provides CRUD operations for skill entries stored in ``~/.kira/skills.db``.
Each entry includes:

- ``id`` INTEGER PRIMARY KEY AUTOINCREMENT
- ``name`` TEXT UNIQUE NOT NULL – identifier for the skill.
- ``definition`` TEXT NOT NULL – JSON-encoded skill definition (e.g., command template, description).
- ``status`` TEXT NOT NULL – one of ``candidate``, ``reviewed``, ``trusted``, ``deactivated``.
- ``trust_level`` INTEGER NOT NULL – numeric trust (0‑100).
- ``confidence`` REAL NOT NULL – confidence score that decays over time.

All modifications are subject to the Phase 3 policy engine via the orchestrator.
"""

import os
import sqlite3
import json
from typing import List, Dict, Any, Optional

DB_PATH = os.path.expanduser("~/.kira/skills.db")

def _ensure_db() -> None:
    """Create the SQLite database and ``skills`` table if missing."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            definition TEXT NOT NULL,
            status TEXT NOT NULL,
            trust_level INTEGER NOT NULL,
            confidence REAL NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()

class SkillManager:
    """Manage skill lifecycle: candidate → reviewed → trusted, with confidence decay."""

    @staticmethod
    def _connect():
        _ensure_db()
        return sqlite3.connect(DB_PATH)

    @staticmethod
    def add_candidate(name: str, definition: Dict[str, Any]) -> None:
        """Insert a new skill as a candidate.

        ``definition`` is stored as JSON. The initial ``status`` is ``candidate``,
        ``trust_level`` is 0, and ``confidence`` starts at 1.0.
        """
        conn = SkillManager._connect()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO skills (name, definition, status, trust_level, confidence) VALUES (?, ?, ?, ?, ?)",
            (name, json.dumps(definition), "candidate", 0, 1.0),
        )
        conn.commit()
        conn.close()

    @staticmethod
    def edit_skill(name: str, new_definition: Dict[str, Any]) -> None:
        """Replace the definition of an existing skill while preserving status.
        """
        conn = SkillManager._connect()
        cur = conn.cursor()
        cur.execute(
            "UPDATE skills SET definition = ? WHERE name = ?",
            (json.dumps(new_definition), name),
        )
        conn.commit()
        conn.close()

    @staticmethod
    def promote(name: str) -> None:
        """Promote a skill to ``trusted`` status, set trust level to 100 and reset confidence.
        """
        conn = SkillManager._connect()
        cur = conn.cursor()
        cur.execute(
            "UPDATE skills SET status = ?, trust_level = ?, confidence = 1.0 WHERE name = ?",
            ("trusted", 100, name),
        )
        conn.commit()
        conn.close()

    @staticmethod
    def deactivate(name: str) -> None:
        """Mark a skill as ``deactivated`` – it will no longer be usable.
        """
        conn = SkillManager._connect()
        cur = conn.cursor()
        cur.execute("UPDATE skills SET status = ? WHERE name = ?", ("deactivated", name))
        conn.commit()
        conn.close()

    @staticmethod
    def get(name: str) -> Optional[Dict[str, Any]]:
        """Retrieve a skill by name. Returns ``None`` if not found."""
        conn = SkillManager._connect()
        cur = conn.cursor()
        cur.execute(
            "SELECT name, definition, status, trust_level, confidence FROM skills WHERE name = ?",
            (name,),
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return None
        name, definition_json, status, trust_level, confidence = row
        return {
            "name": name,
            "definition": json.loads(definition_json),
            "status": status,
            "trust_level": trust_level,
            "confidence": confidence,
        }

    @staticmethod
    def list_all() -> List[Dict[str, Any]]:
        """Return all skills as dictionaries – useful for the Teacher advisory.
        """
        conn = SkillManager._connect()
        cur = conn.cursor()
        cur.execute("SELECT name, definition, status, trust_level, confidence FROM skills")
        rows = cur.fetchall()
        conn.close()
        result = []
        for name, definition_json, status, trust_level, confidence in rows:
            result.append({
                "name": name,
                "definition": json.loads(definition_json),
                "status": status,
                "trust_level": trust_level,
                "confidence": confidence,
            })
        return result

    @staticmethod
    def decay_confidence(decay_factor: float = 0.9) -> None:
        """Apply exponential decay to the confidence column of all skills.
        """
        conn = SkillManager._connect()
        cur = conn.cursor()
        cur.execute("UPDATE skills SET confidence = confidence * ? WHERE confidence > 0", (decay_factor,))
        conn.commit()
        conn.close()
