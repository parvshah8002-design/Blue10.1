"""
Schemes CRUD endpoint — list and retrieve validated schemes from local store.
Reads directly from backend/data/schemes.json via the central store module.
"""

from fastapi import APIRouter, HTTPException
from app.schemas.scheme import SchemeSchema
from app.core.store import load_all, load_by_id

router = APIRouter()


@router.get("/", response_model=list[SchemeSchema], summary="List all stored schemes")
async def list_schemes():
    """Return all validated schemes from backend/data/schemes.json."""
    return load_all()


@router.get("/{scheme_id}", response_model=SchemeSchema, summary="Get a scheme by ID")
async def get_scheme(scheme_id: str):
    """Retrieve a single scheme by its scheme_id."""
    scheme = load_by_id(scheme_id)
    if scheme is None:
        raise HTTPException(status_code=404, detail=f"Scheme '{scheme_id}' not found")
    return scheme
