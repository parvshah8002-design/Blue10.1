# 🏛️ SchemeSaathe — AI-Powered Government Scheme Navigator

> **Hackathon Project · Built for Hactomber 2026**
>
> An AI-powered, multilingual, voice-first web app that helps every Indian citizen discover government welfare schemes they are eligible for — and explains *exactly* why they don't qualify for the ones they miss.

---

## 🔑 Key Features

### 🧠 Zero-Hallucination Eligibility Engine
All numeric and categorical criteria (Age, Income, State, Gender, Category, BPL, PwD, Farmer, Student) are evaluated using **pure Python deterministic comparisons** in FastAPI — the LLM is **never** used to decide eligibility.

### 💬 Gemma-Powered "Why Not" Explainability
When you fail to qualify, Google Gemma explains in plain language *exactly* what you are missing — e.g., *"Your annual income of ₹3,20,000 exceeds the maximum allowed ₹2,50,000 for PM Awas Yojana."*

### 🌐 22+ Indian Languages
Built on **Bhashini API (ULCA)** for Speech-to-Text, Translation, and Text-to-Speech — supporting all 22 Indian scheduled languages.

### 🗂️ Two-Bucket Architecture
- **Bucket 1 (Eligible):** All standard criteria pass. A Tier-2 Quick Final Check prompts the user to self-verify miscellaneous conditions.
- **Bucket 2 (Near-Miss):** Only 1–2 criteria fail. Failed criteria are surfaced as readable tags with Gemma explanation.

### 🕷️ Live Scheme Scraper
On-demand scraping from any government portal URL via BeautifulSoup + Gemma HTML extraction. All scraped schemes are strictly validated against Pydantic `SchemeSchema`.

### ☁️ Vercel-Ready Serverless Deployment
FastAPI runs as Serverless Python, SQLite auto-seeds from `schemes.json` on cold starts using `/tmp/schemes.db`.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Browser (React + Vite)                     │
│  ProfileWizard → eligibility API → Dashboard → SchemeCards     │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS (same-origin on Vercel)
┌───────────────────────────▼─────────────────────────────────────┐
│         FastAPI  (api/index.py → backend/app/main.py)           │
│                                                                 │
│  POST /api/v1/eligibility/check  ← Deterministic Rule Engine   │
│  GET  /api/v1/schemes/           ← Scheme CRUD                 │
│  POST /api/v1/scrape/single      ← Live URL Scraper            │
└───────────────┬─────────────────────────────────────────────────┘
                │
    ┌───────────▼────────────┐     ┌────────────────────────┐
    │   SQLite / JSON Store  │     │   Google Gemma API     │
    │  /tmp/schemes.db (Prod)│     │  HTML→JSON extraction  │
    │  data/schemes.json (Dev│     │  "Why Not" explanation │
    └────────────────────────┘     └────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, TypeScript, Tailwind CSS 4 |
| **Backend** | FastAPI (Python), Uvicorn |
| **AI / LLM** | Google Gemma via Gemini API |
| **Voice & Translation** | Bhashini API (ULCA) — STT, TTS, Translation |
| **Scraping** | BeautifulSoup4, httpx |
| **Data Validation** | Pydantic v2 (`SchemeSchema`) |
| **Persistence** | SQLite (Vercel) / JSON flat-file (local) |
| **Deployment** | Vercel (Serverless Python + Static Frontend) |

---

## 📁 Project Structure

```
hackday/
├── api/
│   └── index.py              # Vercel Serverless Python entry point
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/
│   │   │   ├── eligibility.py  # Deterministic rule engine
│   │   │   ├── schemes.py      # CRUD
│   │   │   └── scrape.py       # Live scraper endpoint
│   │   ├── core/
│   │   │   ├── gemma_client.py # Gemma AI client
│   │   │   └── store.py        # Hybrid JSON/SQLite persistence
│   │   ├── db/
│   │   │   └── database.py     # SQLite module (Vercel /tmp aware)
│   │   ├── schemas/
│   │   │   └── scheme.py       # SchemeSchema + EligibilityResult
│   │   ├── scraper/
│   │   │   └── scraper.py      # BeautifulSoup + Gemma HTML extractor
│   │   └── main.py             # FastAPI app + startup seeding lifespan
│   ├── data/
│   │   └── schemes.json        # Seed data (10+ real schemes)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx       # Results view (Bucket 1 + 2)
│   │   │   ├── ProfileWizard.tsx   # 5-step user profile wizard
│   │   │   ├── SchemeCard.tsx      # Individual scheme card
│   │   │   └── Navbar.tsx          # Fixed top navigation
│   │   ├── services/api.ts         # FastAPI calls (same-origin in prod)
│   │   ├── i18n/                   # 22+ Indian language locale files
│   │   └── index.css               # Tailwind CSS + dark-mode tokens
│   └── package.json
├── requirements.txt              # Root-level Vercel Python deps (unpinned)
└── vercel.json                   # Build config + API rewrites
```

---

## 🚀 Local Development

### Prerequisites
- **Python 3.11+**
- **Node.js 20+**
- A **Google AI API Key** (for Gemma)
- *(Optional)* Bhashini API credentials (for voice/translation)

### 1. Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add GOOGLE_API_KEY to .env
python3 run.py
# → http://localhost:8000  |  Docs: http://localhost:8000/docs
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Environment Variables

**`backend/.env`**
```env
GOOGLE_API_KEY=your_gemini_api_key_here
BHASHINI_USER_ID=optional
BHASHINI_API_KEY=optional
BHASHINI_PIPELINE_ID=optional
APP_ENV=development
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:8000
```
> In production (Vercel), `VITE_API_URL` is not needed — the frontend automatically uses same-origin relative URLs.

---

## ☁️ Vercel Deployment

### Method A: GitHub Auto-Deploy (Recommended)

1. Push code to GitHub: `git push -u origin main`
2. Go to **[vercel.com/new](https://vercel.com/new)** and import `parvshah8002-design/Blue10.1`
3. Root Directory: `./` (Vercel reads `vercel.json` automatically)
4. Add environment variable: `GOOGLE_API_KEY`
5. Click **Deploy** 🎉

### Method B: Vercel CLI
```bash
npx vercel --prod
```

### Vercel Routing (from `vercel.json`)

| Request | Handler |
|---------|---------|
| `/api/*` | FastAPI serverless function |
| `/health`, `/docs`, `/redoc` | FastAPI serverless function |
| `/*` (everything else) | React SPA (`frontend/dist/index.html`) |

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health + DB scheme count |
| `GET` | `/api/v1/schemes/` | List all stored schemes |
| `GET` | `/api/v1/schemes/{id}` | Get single scheme |
| `POST` | `/api/v1/eligibility/check` | Check eligibility for all schemes |
| `POST` | `/api/v1/scrape/single` | Scrape a government portal URL |
| `POST` | `/api/v1/scrape/bulk` | Scrape multiple URLs in batch |

### Example: Eligibility Check

```bash
curl -X POST http://localhost:8000/api/v1/eligibility/check \
  -H "Content-Type: application/json" \
  -d '{
    "age": 28,
    "annual_income_inr": 120000,
    "gender": "female",
    "state": "MH",
    "category": "sc",
    "marital_status": "single",
    "is_pwd": false,
    "is_bpl": false,
    "is_student": false,
    "is_farmer": false
  }'
```

---

## 🧩 Data Model

### `EligibilityResult` response shape

```python
{
  "scheme_id": "pm-kisan",
  "scheme_name": "Pradhan Mantri Kisan Samman Nidhi",
  "is_eligible": false,
  "match_score": 0.833,
  "failed_criteria": ["Scheme requires applicant to be a farmer"],
  "requires_misc_check": false,
  "misc_conditions_to_verify": [],
  "why_not_explanation": "You did not qualify because: Scheme requires applicant to be a farmer."
}
```

---

## 🔒 Architecture Principles

1. **Zero Hallucination on Eligibility** — LLM never decides numeric/categorical criteria. Only pure Python comparisons.
2. **Strict Pydantic Validation** — Every scraped scheme passes `SchemeSchema.model_validate()` before persistence.
3. **"Why Not" Diff Engine** — Near-miss schemes (≤2 failed criteria) are always returned with a `failed_criteria` array.
4. **Hybrid Persistence** — `store.py` auto-switches between JSON (local) and SQLite (Vercel) via the `VERCEL` env var.

---

## 🌍 Supported Languages

`Hindi` · `Bengali` · `Marathi` · `Telugu` · `Tamil` · `Gujarati` · `Urdu` · `Kannada` · `Odia` · `Punjabi` · `Malayalam` · `Assamese` · `Maithili` · `Sanskrit` · `Santali` · `Kashmiri` · `Konkani` · `Sindhi` · `Dogri` · `Manipuri` · `Bodo` · `Nepali`

---

## 🤝 Team

Built by **Team Blue10.1** for **Hactomber 2026**

---

## 📄 License

MIT License — see [LICENSE](frontend/LICENSE) for details.

Presentation Link:
https://drive.google.com/file/d/19sDl5j-LmlVUBh4O3ULi1ymxPrsUXDZ8/view
