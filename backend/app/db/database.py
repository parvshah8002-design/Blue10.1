"""
SQLite persistence layer — Vercel-safe.

On Vercel the filesystem is read-only except for /tmp, so the DB path is
switched to /tmp/schemes.db when the VERCEL env var is present.
Locally it falls back to backend/data/schemes.db.

Public surface
--------------
get_db_path()          -> Path          resolved DB path
init_db()              -> None          create table if needed
seed_from_json()       -> int           insert seed rows from schemes.json; returns count
get_all_schemes()      -> list[dict]    fetch every row as a dict
upsert_scheme(d)       -> None          insert-or-replace a single scheme dict
"""

from __future__ import annotations

import json
import logging
import os
import sqlite3
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Path resolution
# ---------------------------------------------------------------------------

# This file lives at:  backend/app/db/database.py
# Three .parent calls walk up to:  backend/
_BACKEND_ROOT: Path = Path(__file__).resolve().parent.parent.parent


def get_db_path() -> Path:
    """Return the SQLite DB path, switching to /tmp on Vercel."""
    if os.environ.get("VERCEL"):
        return Path("/tmp/schemes.db")
    return _BACKEND_ROOT / "data" / "schemes.db"


def _get_seed_path() -> Path:
    return _BACKEND_ROOT / "data" / "schemes.json"


# ---------------------------------------------------------------------------
# Schema
# ---------------------------------------------------------------------------

_CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS schemes (
    scheme_id   TEXT PRIMARY KEY,
    data        TEXT NOT NULL   -- full JSON blob for the SchemeSchema
);
"""


# ---------------------------------------------------------------------------
# Connection helper
# ---------------------------------------------------------------------------

def _connect() -> sqlite3.Connection:
    db_path = get_db_path()
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(db_path), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def init_db() -> None:
    """Create the schemes table if it doesn't already exist."""
    with _connect() as conn:
        conn.execute(_CREATE_TABLE_SQL)
        conn.commit()
    logger.info("SQLite DB initialised at %s", get_db_path())


def seed_from_json() -> int:
    """
    Read backend/data/schemes.json and INSERT OR IGNORE every entry into SQLite.
    Returns the number of rows inserted (0 if already seeded).
    """
    seed_path = _get_seed_path()
    if not seed_path.exists():
        logger.warning("Seed file not found: %s — skipping seed", seed_path)
        return 0

    try:
        records: list[dict[str, Any]] = json.loads(seed_path.read_text(encoding="utf-8"))
    except Exception as exc:
        logger.error("Failed to parse seed JSON: %s", exc)
        return 0

    inserted = 0
    with _connect() as conn:
        for rec in records:
            sid = rec.get("scheme_id", "")
            if not sid:
                continue
            cur = conn.execute(
                "INSERT OR IGNORE INTO schemes (scheme_id, data) VALUES (?, ?)",
                (sid, json.dumps(rec, ensure_ascii=False)),
            )
            inserted += cur.rowcount
        conn.commit()

    logger.info("Seeded %d new scheme(s) from %s", inserted, seed_path)
    return inserted


def get_all_schemes() -> list[dict[str, Any]]:
    """Return every scheme row as a parsed dict."""
    with _connect() as conn:
        rows = conn.execute("SELECT data FROM schemes").fetchall()
    return [json.loads(r["data"]) for r in rows]


def upsert_scheme(scheme_dict: dict[str, Any]) -> None:
    """Insert or replace a single scheme (keyed by scheme_id)."""
    sid = scheme_dict.get("scheme_id", "")
    if not sid:
        raise ValueError("scheme_dict must contain a non-empty 'scheme_id'")
    with _connect() as conn:
        conn.execute(
            "INSERT OR REPLACE INTO schemes (scheme_id, data) VALUES (?, ?)",
            (sid, json.dumps(scheme_dict, ensure_ascii=False)),
        )
        conn.commit()
    logger.info("Upserted scheme '%s' into SQLite", sid)


def count_schemes() -> int:
    """Return the total number of schemes currently stored."""
    with _connect() as conn:
        row = conn.execute("SELECT COUNT(*) FROM schemes").fetchone()
    return row[0] if row else 0
