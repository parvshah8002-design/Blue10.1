"""
API v1 router — aggregates all sub-routers.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import schemes, scrape, eligibility

api_router = APIRouter()

api_router.include_router(schemes.router, prefix="/schemes", tags=["Schemes"])
api_router.include_router(scrape.router, prefix="/scrape", tags=["Scraper"])
api_router.include_router(eligibility.router, prefix="/eligibility", tags=["Eligibility"])
