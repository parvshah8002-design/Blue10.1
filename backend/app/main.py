"""
FastAPI application entry point.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.database import count_schemes, init_db, seed_from_json

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lifespan — runs once on startup (handles Vercel cold-start seeding)
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa: ANN001
    """Initialise SQLite and seed from schemes.json if the table is empty."""
    try:
        init_db()
        if count_schemes() == 0:
            seeded = seed_from_json()
            logger.info("Cold-start seed: inserted %d scheme(s) into SQLite.", seeded)
        else:
            logger.info("SQLite already has %d scheme(s) — skipping seed.", count_schemes())
    except Exception as exc:  # noqa: BLE001
        logger.error("Startup DB init failed: %s", exc)
    yield  # application runs here


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Scheme Eligibility Navigator API",
    description=(
        "AI-powered, multilingual government scheme discovery. "
        "Deterministic eligibility matching + Gemma-powered 'Why Not' explanations."
    ),
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS — allow Vite dev server, Next.js, and any Vercel preview/production domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://*.vercel.app",
        "*",  # loosen for hackathon demo; tighten for production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "env": settings.app_env, "db_schemes": count_schemes()}

