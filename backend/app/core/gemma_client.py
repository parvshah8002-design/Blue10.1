"""
Thin async wrapper around the Google Generative AI SDK (Gemma/Gemini).
Swap this module out to point at a local Ollama instance if needed.
"""

from __future__ import annotations

import asyncio
import logging
import google.generativeai as genai

from app.core.config import settings

logger = logging.getLogger(__name__)

# Configure once at import time
if settings.google_api_key:
    genai.configure(api_key=settings.google_api_key)


async def ask_gemma(prompt: str) -> str:
    """
    Send *prompt* to the configured Gemma/Gemini model and return the text response.
    Wraps the synchronous SDK call in asyncio.to_thread to prevent blocking the event loop.
    """
    if not settings.google_api_key:
        raise RuntimeError("GOOGLE_API_KEY is not configured in .env")

    model = genai.GenerativeModel(settings.gemma_model)
    response = await asyncio.to_thread(model.generate_content, prompt)
    if not response.text:
        raise RuntimeError("Empty response received from LLM")
    return response.text

