"""
Vercel Serverless entry point for the FastAPI backend.

Vercel looks for a Python handler at api/index.py.
This file adds the repo root and backend package to sys.path and
re-exports the FastAPI `app` object so Vercel can serve it cleanly.
"""

import sys
import os
import traceback
from pathlib import Path

# Ensure `backend/` and repo root are on sys.path
_REPO_ROOT = Path(__file__).resolve().parent.parent
_BACKEND = _REPO_ROOT / "backend"

for p in [str(_BACKEND), str(_REPO_ROOT)]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from app.main import app  # noqa: E402, F401  (re-exported for Vercel)
except Exception as e:
    err_tb = traceback.format_exc()
    print(f"CRITICAL FASTAPI STARTUP ERROR ON VERCEL:\n{err_tb}", file=sys.stderr)

    from fastapi import FastAPI
    from fastapi.responses import PlainTextResponse

    app = FastAPI(title="Startup Error Handler")

    @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
    async def vercel_startup_error(path: str):
        return PlainTextResponse(f"FastAPI Startup Exception on Vercel:\n\n{err_tb}", status_code=500)
