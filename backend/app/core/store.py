"""
Persistence layer — hybrid JSON / SQLite store
===============================================
* Locally  → reads/writes to backend/data/schemes.json  (unchanged behaviour)
* On Vercel → reads/writes to /tmp/schemes.db via the SQLite database module
              (the filesystem is read-only except for /tmp, so JSON writes would fail)

All endpoints continue to import only from here; the backend decision is transparent.
"""

from __future__ import annotations

import json
import logging
import os
from pathlib import Path
from threading import Lock
from typing import Any

from app.schemas.scheme import SchemeSchema

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Backend selector
# ---------------------------------------------------------------------------

_ON_VERCEL: bool = bool(os.environ.get("VERCEL"))

# ---------------------------------------------------------------------------
# JSON-file backend (local dev)
# ---------------------------------------------------------------------------

# This file lives at:  backend/app/core/store.py
# Two .parent calls walk up to:  backend/
_BACKEND_ROOT: Path = Path(__file__).resolve().parent.parent.parent
SCHEMES_FILE: Path = _BACKEND_ROOT / "data" / "schemes.json"

# Ensure the directory exists
SCHEMES_FILE.parent.mkdir(parents=True, exist_ok=True)

# In-process lock — prevents concurrent writes from corrupting the JSON file.
_lock = Lock()


def _read_raw() -> list[dict[str, Any]]:
    """Return the raw list from schemes.json, or [] if missing / empty."""
    try:
        text = SCHEMES_FILE.read_text(encoding="utf-8").strip()
        if not text:
            return []
        return json.loads(text)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError as exc:
        logger.error("schemes.json is corrupted — resetting: %s", exc)
        return []


def _write_raw(records: list[dict[str, Any]]) -> None:
    """Atomically write *records* to schemes.json."""
    tmp = SCHEMES_FILE.with_suffix(".tmp")
    tmp.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(SCHEMES_FILE)


# ---------------------------------------------------------------------------
# SQLite backend (Vercel)
# ---------------------------------------------------------------------------

def _sqlite_load_all() -> list[dict[str, Any]]:
    from app.db.database import get_all_schemes
    return get_all_schemes()


def _sqlite_upsert(scheme_dict: dict[str, Any]) -> None:
    from app.db.database import upsert_scheme
    upsert_scheme(scheme_dict)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def load_all() -> list[SchemeSchema]:
    """Return all stored schemes as validated SchemeSchema objects."""
    if _ON_VERCEL:
        raw = _sqlite_load_all()
    else:
        with _lock:
            raw = _read_raw()

    schemes: list[SchemeSchema] = []
    for rec in raw:
        try:
            schemes.append(SchemeSchema.model_validate(rec))
        except Exception as exc:  # noqa: BLE001
            logger.warning("Skipping invalid record in store: %s", exc)
    return schemes


def load_by_id(scheme_id: str) -> SchemeSchema | None:
    """Return a single scheme by its scheme_id, or None."""
    for s in load_all():
        if s.scheme_id == scheme_id:
            return s
    return None


def upsert(scheme: SchemeSchema) -> None:
    """
    Insert or replace a scheme by scheme_id.
    Thread-safe on the JSON path; atomic on the SQLite path.
    """
    record = json.loads(scheme.model_dump_json())
    if _ON_VERCEL:
        _sqlite_upsert(record)
        logger.info("Upserted scheme '%s' (id=%s) via SQLite", scheme.name, scheme.scheme_id)
        return

    with _lock:
        records = _read_raw()
        updated = False
        for i, rec in enumerate(records):
            if rec.get("scheme_id") == scheme.scheme_id:
                records[i] = record
                updated = True
                break
        if not updated:
            records.append(record)
        _write_raw(records)
    action = "Updated" if updated else "Inserted"
    logger.info("%s scheme '%s' (id=%s) in %s", action, scheme.name, scheme.scheme_id, SCHEMES_FILE)


def upsert_many(schemes: list[SchemeSchema]) -> None:
    """Bulk upsert — single lock acquisition for the whole batch."""
    if not schemes:
        return

    if _ON_VERCEL:
        for scheme in schemes:
            _sqlite_upsert(json.loads(scheme.model_dump_json()))
        logger.info("Bulk upserted %d scheme(s) via SQLite", len(schemes))
        return

    with _lock:
        records = _read_raw()
        existing: dict[str, int] = {r.get("scheme_id", ""): i for i, r in enumerate(records)}
        for scheme in schemes:
            record = json.loads(scheme.model_dump_json())
            idx = existing.get(scheme.scheme_id)
            if idx is not None:
                records[idx] = record
            else:
                existing[scheme.scheme_id] = len(records)
                records.append(record)
        _write_raw(records)
    logger.info("Bulk upserted %d scheme(s) into %s", len(schemes), SCHEMES_FILE)
