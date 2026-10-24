# Project: Scheme Eligibility Navigator

## Problem Statement & Overview
An AI-powered, multilingual, voice-first government scheme discovery and explainability web app. It scrapes government portals, structures eligibility criteria into strict JSON, matches users via a 100% accurate deterministic rule engine + semantic search (RAG), and explains exact "Why Not" missing criteria when a user fails to qualify.

## Official Tech Stack
- **Frontend:** Next.js (React), Tailwind CSS (located in `/frontend`)
- **Backend & Rule Engine:** FastAPI (Python) (located in `/backend`)
- **Data Scraping & Validation:** BeautifulSoup4, Pydantic
- **AI / LLM Layer:** Google Gemma (used for HTML-to-JSON extraction, profile extraction, and "Why Not" explainability)
- **Database & Vector Search:** Local `schemes.json` / SQLite + ChromaDB (for needs-based RAG search)
- **Voice & Multilingual:** Bhashini API (ULCA) for Speech-to-Text, Translation, and Text-to-Speech

## Architecture Rules for Antigravity Agent
1. **Zero Hallucination on Eligibility:** NEVER use the LLM to decide if a user meets numeric/categorical criteria (Age, Income, State, Gender, PwD, Marital Status). Always use pure Python deterministic comparisons in FastAPI.
2. **The "Why Not" Diff Engine:** When checking eligibility, return both 100% matched schemes AND partial matches (where user fails 1 or 2 criteria, e.g., `user_income > max_income`), outputting a structured `failed_criteria` array so Gemma can explain what is missing.
3. **Strict Pydantic Validation:** All scraped schemes must validate against our Pydantic `SchemeSchema` before being stored.