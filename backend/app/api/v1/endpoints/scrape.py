"""
Scraper endpoint — trigger on-demand scraping of a government portal URL.
Scraped schemes are validated then persisted to backend/data/schemes.json.
"""

import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl

from app.scraper.scraper import scrape_scheme, scrape_multiple, ScraperError
from app.schemas.scheme import SchemeSchema
from app.core.store import upsert, upsert_many

logger = logging.getLogger(__name__)

router = APIRouter()


class ScrapeRequest(BaseModel):
    url: HttpUrl
    store: bool = True  # If True, persist to schemes.json after validation


class BulkScrapeRequest(BaseModel):
    urls: list[HttpUrl]
    store: bool = True


@router.post("/single", response_model=SchemeSchema, summary="Scrape a single scheme URL")
async def scrape_single(req: ScrapeRequest):
    """
    Fetches the URL, extracts scheme data via BeautifulSoup + Gemma,
    validates against SchemeSchema, and upserts into backend/data/schemes.json
    when store=True.
    """
    try:
        scheme = await scrape_scheme(str(req.url))
    except ScraperError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Unexpected error during scraping")
        raise HTTPException(status_code=500, detail=f"Scraping error: {exc}") from exc

    if req.store:
        try:
            upsert(scheme)
        except Exception as exc:
            logger.error("Failed to persist scheme '%s': %s", scheme.scheme_id, exc)
            # Don't fail the request — scheme was scraped successfully; warn only.
            raise HTTPException(
                status_code=500,
                detail=f"Scheme scraped but persistence failed: {exc}",
            ) from exc

    return scheme


@router.post("/bulk", response_model=list[SchemeSchema], summary="Scrape multiple scheme URLs")
async def scrape_bulk(req: BulkScrapeRequest):
    """
    Scrape a batch of URLs sequentially.
    Failed URLs are skipped and logged; successful schemes are upserted into
    backend/data/schemes.json when store=True.
    """
    schemes = await scrape_multiple([str(u) for u in req.urls])

    if req.store and schemes:
        try:
            upsert_many(schemes)
        except Exception as exc:
            logger.error("Bulk persistence failed: %s", exc)
            raise HTTPException(
                status_code=500,
                detail=f"Schemes scraped but bulk persistence failed: {exc}",
            ) from exc

    return schemes
