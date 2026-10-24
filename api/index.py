"""
Vercel Serverless entry point for the FastAPI backend.

Vercel looks for a Python handler at api/index.py.
This file simply adds the backend package to sys.path and
re-exports the FastAPI `app` object so Vercel can discover it.
"""

import sys
import os
from pathlib import Path

# Ensure `backend/` is on the path so `app.*` imports resolve correctly.
_REPO_ROOT = Path(__file__).resolve().parent.parent
_BACKEND = _REPO_ROOT / "backend"
if str(_BACKEND) not in sys.path:
    sys.path.insert(0, str(_BACKEND))

# Import the FastAPI application
from app.main import app  # noqa: E402, F401  (re-exported for Vercel)
