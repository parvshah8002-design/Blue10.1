# YojanaSaathi: Scheme Eligibility Navigator (`plan.md`)

**Hacktoberfest '26 Hack Day · Problem Statement #14 · 12-Hour Build · Team of 4 · Desktop WebApp Edition**

> **AGENT EXECUTION DIRECTIVE (Read this entire file before writing any code)**
>
> 1. **Phase Gate Rule:** Execute **Phase 0 and Phase 1 ONLY** first. Then STOP, run every test (`npm test`, `npm run validate:data`, `npm run build:bundle`), and report: what files exist, what tests passed, and what `TODO_VERIFY` items remain. Do NOT start Phase 2 until explicitly instructed.
> 2. **Incremental Commits:** Work in small, atomic tasks. After each task, run tests/lint and ensure the build stays green.
> 3. **Seven Hard Rules (Never Violate):**
>    - **Rule 1 — 100% Deterministic Eligibility:** Eligibility (`ELIGIBLE`, `PARTIAL_MATCH`, `NEAR_MISS`, `INELIGIBLE`) is decided **exclusively** by the pure TypeScript engine in `app/src/engine/`. Never put an LLM in the decision path.
>    - **Rule 2 — No Hallucinated Scheme Thresholds or Quotes:** Do not invent scheme rules, income caps, page numbers, or quotes from memory. Use only official sources fetched in session, or flag the rule with `"todo_verify": true` and `citation.page = "TODO_VERIFY"` while keeping `Rule.value` strictly typed (`number` for numeric ops, `boolean` for boolean ops) so TypeScript runtime checks never crash. Every scheme starts with `verification.status = "draft"` until a human marks it `"verified"`.
>    - **Rule 3 — Open-Source AI Only + Deterministic Fallbacks:** Use **Ollama** (`qwen2.5:3b-instruct` or `llama3.2:3b`) for structured profile extraction/explanation and **Whisper** (`faster-whisper`) for speech-to-text on the Python backend, plus browser `webkitSpeechRecognition` and deterministic regex normalizers as zero-latency desktop fallbacks. No paid/proprietary cloud LLM APIs.
>    - **Rule 4 — Zero Personal Data Persistence:** No profile database, no server-side profile logging, no analytics, and no sensitive government ID numbers, OTPs, or bank account numbers. The citizen profile lives strictly in browser memory (`React state`) and is wiped on "Reset Profile".
>    - **Rule 5 — Strict Null Semantics:** Missing information is always `null` and evaluates to `MISSING_INFO`. Never silently default a profile field (no default state, no default `false` on boolean fields).
>    - **Rule 6 — Focused Desktop WebApp Scope:** Build a **Desktop-First Widescreen WebApp (`1280px–1920px`)** optimized for laptops and desktop monitors (Village Help-Desk Operator Workstation + Citizen Guided Kiosk). No user auth, no Postgres/Supabase, no live PDF upload UI in the MVP, and stick to 3 languages (`en`, `hi`, `mr`) for the MVP.
>    - **Rule 7 — Isolated Engine Fixtures:** Unit tests in `vitest` must run against synthetic fixture schemes (`fixtures/test-schemes.json` with IDs starting with `TEST-`), never real government scheme files whose thresholds may be updated by data contributors.

---

## 1. Product Vision & Desktop WebApp Focus

### One-Liner
A desktop web application where village help-desk volunteers (via a high-speed 3-pane operator workstation) or citizens (via a guided widescreen kiosk view) answer simple questions in **English, Hindi, or Marathi** (via keyboard, click, or desktop microphone) to discover which government schemes they qualify for, verify the exact official clause and page citation, check off required documents with prerequisite guides, and print or share a 1-page takeaway slip.

### Target Personas & Desktop Modes
| Mode | Target User | Desktop UX & Key Capabilities |
| :--- | :--- | :--- |
| **1. Volunteer Workstation Mode** *(Default Desktop View)* | Village Help-Desk Operator, CSC Entrepreneur, Gram Panchayat Clerk (`30–50 citizens/day` on a laptop or desktop PC) | **3-Pane Widescreen Split View (`1280px–1920px`):**<br>• **Left Pane (30%):** "Next Best Question" prompt card + compact, keyboard-navigable multi-field operator intake form.<br>• **Center Pane (40%):** Live-updating scheme matrix grouped by tier (`ELIGIBLE`, `NEAR_MISS`, `PARTIAL_MATCH`, `INELIGIBLE`) with 0ms client-side recalculation.<br>• **Right Pane (30%):** Sticky Inspector with **Tab 1: Verbatim PDF Clause & Page Proof** and **Tab 2: Interactive Document Readiness & Prerequisite Tree**.<br>• **1-Click Slip Output:** A4 / Thermal receipt print (`Ctrl+P`) & WhatsApp Web share link. |
| **2. Citizen Guided Kiosk Mode** | Citizen at a public kiosk or assisted counter (low digital literacy, regional language preference) | **Focused Widescreen Wizard + Live Counter Rail:**<br>• One high-contrast question card at a time driven dynamically by `nextQuestion()`.<br>• Large clickable options with keyboard shortcuts (`1–9`, `Enter`) and desktop voice mic intake with confirmation banner.<br>• Right-hand progress rail showing unlocked schemes in real time. |

### Why Not Just `myScheme.gov.in`?
1. **Explainable Rule-by-Rule Proof:** Shows a green/red/amber badge for every single rule (`Age: 42 · Needs 21–65`) paired with the verbatim quote, page number, and link to the official Government Resolution (GR) / guidelines PDF.
2. **Actionable "Near-Miss" & Document Dependency Trees:** Tells the citizen *why* they missed by one fixable condition (`NEAR_MISS`) and expands missing mandatory documents to show *where to get them* and *which prerequisite documents are needed first*.
3. **100% Offline-Capable Desktop PWA:** Once loaded in the browser, the TypeScript rule engine and `bundle.json` run completely offline with zero network dependency.
4. **Git-Native Open Source Contributions:** Every scheme is a standalone, schema-validated JSON file in `data/schemes/*.json`. Anyone can add or update a scheme via a GitHub Pull Request verified automatically by CI.

---

## 2. Locked Architecture & Tech Stack Decisions

| Layer | Technology Choice | Rationale |
| :--- | :--- | :--- |
| **Desktop WebApp Frontend** | React 18 + Vite + **TypeScript** + Tailwind CSS + `lucide-react` | Fast HMR, strict compile-time contracts, widescreen multi-pane desktop layouts, installable offline PWA (`vite-plugin-pwa`). |
| **Eligibility Engine** | Pure **TypeScript** in `app/src/engine/` | Runs in-browser in `<1ms`, works 100% offline, guarantees citizen profile never leaves client RAM. |
| **Data & Schema Layer** | JSON files in `data/` + `ajv` / TypeScript validation in `scripts/validate-data.ts` | Single source of truth in Git; compiled into `app/public/bundle.json` via `scripts/build-bundle.ts`. |
| **Internationalization (i18n)** | `i18next` + `react-i18next` + `{ en, hi, mr }` map objects | Adding or fixing translations is pure data editing without touching UI component logic. |
| **Typography** | `@fontsource/noto-sans-devanagari` | Self-hosted font bundle ensuring crisp Hindi and Marathi Devanagari rendering even when offline. |
| **Local AI Backend** | Python 3.11+ **FastAPI** (`server/`) | Stateless microservices for voice transcription, natural-language profile extraction, and optional plain-language explanation. |
| **Open-Source AI Models** | **Whisper** (`faster-whisper`, `base`/`small`) + **Ollama** (`qwen2.5:3b-instruct` or `llama3.2:3b`) | 100% local/open-source stack. Includes deterministic Python/TS Indic numeral & unit pre-parser (`"1.2 lakh"` -> `120000`) + browser `webkitSpeechRecognition` fallback. |
| **Testing Framework** | `vitest` (TypeScript engine & data validator) + `pytest` (FastAPI server) | Automated verification of all 11 edge-case rule engine scenarios and API contracts. |
| **License** | MIT License | Hacktoberfest-ready public repository with `CONTRIBUTING.md` and PR templates. |

---

## 3. Repository Directory Structure

```text
yojana-saathi/
├── plan.md
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── .gitignore
├── .env.example
├── package.json                        # Root workspace scripts: dev, build, test, validate:data, build:bundle
├── data/
│   ├── schemes/                        # One JSON file per government scheme
│   │   ├── pm-kisan.json
│   │   ├── majhi-ladki-bahin.json
│   │   ├── pm-vishwakarma.json
│   │   ├── post-matric-scholarship-obc.json
│   │   ├── pmay-gramin.json
│   │   └── namo-shetkari.json
│   ├── documents.json                  # Shared catalog of documents, issuing authorities & prerequisites
│   ├── questions.json                  # Adaptive question bank with i18n text, help hints & ask_when conditions
│   ├── enums.json                      # Canonical allowed values for enum fields (occupations, trades, states, etc.)
│   ├── schema/                         # JSON Schemas enforced by scripts/validate-data.ts
│   │   ├── scheme.schema.json
│   │   ├── documents.schema.json
│   │   └── questions.schema.json
│   └── locales/                        # UI chrome translations
│       ├── en.json
│       ├── hi.json
│       └── mr.json
├── fixtures/
│   ├── test-schemes.json               # Synthetic TEST-* schemes used exclusively by vitest
│   └── personas.json                   # Pre-built demo personas (Savita, Ramesh Patil, Aarav)
├── scripts/
│   ├── validate-data.ts                # Validates all JSON files, cross-references, enums, and verification rules
│   ├── build-bundle.ts                 # Compiles data/ + fixtures/personas.json into app/public/bundle.json
│   └── ingest_pdf.py                   # Offline CLI helper (P2): converts a PDF into a draft scheme JSON via Ollama
├── app/                                # Vite + React + TypeScript Desktop WebApp
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── index.html
│   ├── public/
│   │   └── bundle.json                 # Generated artifact from npm run build:bundle
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── engine/                     # Pure deterministic TypeScript eligibility engine
│       │   ├── types.ts
│       │   ├── evaluate.ts
│       │   ├── tiers.ts
│       │   ├── nextQuestion.ts
│       │   └── __tests__/
│       │       └── engine.test.ts      # 11 mandatory unit tests
│       ├── ui/
│       │   ├── layout/
│       │   │   ├── DesktopShell.tsx
│       │   │   └── TopCommandBar.tsx   # Mode toggle, language switcher, persona bar, status badge, Print CTA
│       │   ├── volunteer/
│       │   │   ├── SplitWorkstation.tsx
│       │   │   ├── OperatorFormPane.tsx
│       │   │   └── LiveSchemeMatrix.tsx
│       │   ├── citizen/
│       │   │   ├── KioskWizard.tsx
│       │   │   └── LiveUnlockRail.tsx
│       │   ├── inspector/
│       │   │   ├── InspectorDrawer.tsx
│       │   │   ├── CitationProofTab.tsx
│       │   │   └── DocumentTreeTab.tsx
│       │   ├── voice/
│       │   │   ├── VoiceIntakeModal.tsx
│       │   │   └── ExtractionConfirmBanner.tsx
│       │   └── slip/
│       │       └── PrintableDeskSlip.tsx
│       ├── i18n/
│       │   └── index.ts
│       └── services/
│           └── apiClient.ts            # Stateless calls to FastAPI (/api/stt, /api/profile/extract, /api/explain)
└── server/                             # Python 3.11+ FastAPI Local AI Server
    ├── requirements.txt
    ├── config.py
    ├── main.py
    ├── models.py                       # Pydantic v2 models mirroring CitizenProfile
    ├── services/
    │   ├── normalizer.py               # Deterministic Indic numeral, lakh/hazaar & keyword pre-parser
    │   ├── stt.py                      # faster-whisper transcription service
    │   ├── extractor.py                # Ollama structured profile extraction + normalizer merge
    │   └── explainer.py                # Optional plain-language summary rewriter
    └── tests/
        └── test_server.py              # pytest suite for normalizer, extractor & health endpoint
```

---

## 4. Strict Data Contracts (`app/src/engine/types.ts`)

### 4.1 Internationalization & Citizen Profile
All profile fields (except `owned_documents` and `language`) are nullable. **`null` always means `MISSING_INFO`**.

```ts
export type LanguageCode = "en" | "hi" | "mr";
export type I18nString = {
  en: string;
  hi?: string;
  mr?: string;
  [key: string]: string | undefined;
};

export interface CitizenProfile {
  age: number | null;
  gender: "male" | "female" | "other" | null;
  state: string | null;                        // e.g. "Maharashtra"
  district: string | null;
  family_income_annual: number | null;         // Annual household income in INR
  social_category: "general" | "obc" | "sc" | "st" | "ews" | null;
  occupation: string | null;                   // Must match an entry in data/enums.json
  trade: string | null;                        // Asked when occupation === "artisan_craftsperson"
  land_acres: number | null;                   // Agricultural land holding in acres
  ration_card_type: "none" | "apl" | "bpl" | "antyodaya" | null;
  marital_status: "unmarried" | "married" | "widowed" | "divorced_or_separated" | null;
  education_level: string | null;              // Must match an entry in data/enums.json
  is_student: boolean | null;
  is_income_tax_payer: boolean | null;
  is_govt_employee: boolean | null;
  has_pucca_house: boolean | null;
  disability: boolean | null;
  owned_documents: string[];                   // IDs from data/documents.json already held by citizen
  language: LanguageCode;
}

export type ProfileField = Exclude<keyof CitizenProfile, "owned_documents" | "language">;
```

### 4.2 Rule Contract
```ts
export type RuleOperator =
  | "eq"
  | "neq"
  | "in"
  | "nin"
  | "lt"
  | "lte"
  | "gt"
  | "gte"
  | "between"; // inclusive [min, max]; requires 2-number array [lo, hi]

export interface RuleCitation {
  page: number | "TODO_VERIFY";
  clause: string;                              // Verbatim quote from official PDF/guidelines or "TODO_VERIFY"
}

export interface Rule {
  id: string;
  field: ProfileField;
  op: RuleOperator;
  value: string | number | boolean | Array<string | number>;
  fixable: boolean;                            // true if citizen can obtain/rectify (e.g., ration card, income cap check); false for immutable traits (e.g., gender, state)
  group?: string;                              // Rules sharing the same group string are OR-ed together; ungrouped rules are AND-ed
  todo_verify?: boolean;                       // true if threshold/citation awaits human verification against official PDF
  why: I18nString;                             // Plain-language explanation of the rule
  citation: RuleCitation;
}
```

### 4.3 Scheme Contract (`data/schemes/*.json`)
```ts
export interface SchemeVerification {
  status: "draft" | "verified";
  verified_by: string | null;
  verified_on: string | null;
  notes?: string;
}

export interface Scheme {
  id: string;
  level: "central" | "state";
  state: string | null;                        // null for central schemes, "Maharashtra" for state schemes
  category: "agriculture" | "women_welfare" | "artisans_msme" | "education" | "housing" | "social_welfare";
  name: I18nString;
  benefit: I18nString;
  rules: Rule[];
  depends_on: string[];                        // IDs of prerequisite schemes (e.g., ["pm-kisan"])
  not_combinable_with: string[];               // Informational list of mutually exclusive scheme IDs
  documents: string[];                         // Document IDs referencing data/documents.json
  apply: {
    url: string;
    office: I18nString;
  };
  source_url: string;
  source_name: string;
  last_verified: string;
  verification: SchemeVerification;
}
```

### 4.4 Document Catalog (`data/documents.json`) & Questions (`data/questions.json`)
```ts
export interface DocumentItem {
  id: string;
  name: I18nString;                            // Keep local terms in parentheses, e.g., "7/12 Extract (सातबारा उतारा)"
  issuing_authority: I18nString;               // e.g., "Tehsildar / Talathi / Maha e-Seva Kendra"
  prerequisites: string[];                     // Other document IDs required to obtain this document
  how_to_get: I18nString;                      // Step-by-step instructions for missing document tree
}

export interface AskWhenCondition {
  field: ProfileField;
  op: "eq" | "neq" | "in";
  value: string | number | boolean | Array<string | number>;
}

export interface QuestionItem {
  field: ProfileField;
  type: "number" | "choice" | "boolean";
  unit?: string;                               // e.g., "INR/year", "acres", "years"
  enum_key?: string;                           // Key in data/enums.json if type === "choice"
  text: I18nString;
  help?: I18nString;
  ask_when: AskWhenCondition | null;
}
```

### 4.5 Evaluation Output Contract
```ts
export type RuleStatus = "PASSED" | "FAILED" | "MISSING_INFO";
export type MatchTier = "ELIGIBLE" | "PARTIAL_MATCH" | "NEAR_MISS" | "INELIGIBLE";

export interface RuleCheck {
  rule_id: string;
  field: ProfileField;
  status: RuleStatus;
  user_value: string | null;                   // Formatted human-readable value, e.g. "₹90,000" or null
  required_value: string;                      // Formatted requirement, e.g. "<= ₹2,50,000"
  fixable: boolean;
  todo_verify?: boolean;
  why: I18nString;
  citation: RuleCitation;
}

export interface Evaluation {
  scheme_id: string;
  tier: MatchTier;
  score_percent: number;                       // Percentage of applicable rule groups that PASSED
  checks: RuleCheck[];
  missing_fields: ProfileField[];              // Unique missing fields needed to resolve MISSING_INFO
  unlock_hint?: {
    field: ProfileField;
    required_value: string;
    why: I18nString;
  };                                           // Populated when tier === "NEAR_MISS"
  blocked_by_dependency?: string[];            // Populated if a scheme in depends_on is INELIGIBLE or PARTIAL_MATCH
}
```

---

## 5. Deterministic Rule Engine Specification (`app/src/engine/`)

### 5.1 Evaluating Individual Rules (`evaluate.ts`)
1. **Null / Undefined Check:** If `profile[rule.field]` is `null` or `undefined`, return `status = "MISSING_INFO"` and record `rule.field` in `missing_fields`.
2. **Type Safety Guard:**
   - For `"lt" | "lte" | "gt" | "gte"`, both `profile[rule.field]` and `rule.value` must be `typeof === "number"`.
   - For `"between"`, `profile[rule.field]` must be a `number` and `rule.value` must be a 2-element number array `[lo, hi]` with `lo <= hi`. Evaluate `lo <= userVal && userVal <= hi` (inclusive).
   - For `"in" | "nin"`, `rule.value` must be an `Array`.
   - If a type mismatch occurs: throw a descriptive `Error` in development/test (`import.meta.env?.DEV` or `process.env.NODE_ENV !== "production"`), or return `MISSING_INFO` in production.

### 5.2 Evaluating OR-Groups & AND-Units
- Ungrouped rules (where `rule.group` is undefined) each form their own singleton unit.
- Rules sharing the same `rule.group` string form a single **OR-Group unit**:
  - If **at least one** rule in the group is `PASSED` -> the OR-Group unit is `PASSED` (do not require missing fields from other branches of a passed OR-group).
  - Else if **all** rules in the group are `FAILED` -> the OR-Group unit is `FAILED` (the group is `fixable` if at least one rule in the group has `fixable: true`).
  - Otherwise -> the OR-Group unit is `MISSING_INFO` (collect `missing_fields` from the `MISSING_INFO` rules in that group).

### 5.3 Computing the Match Tier (`tiers.ts`)
Given all evaluated units (ungrouped rules + OR-group units) for a scheme:
1. Count `failedUnits`, `unfixableFailedUnits`, and `missingUnits`.
2. **Rule 1 (`INELIGIBLE`):** If `unfixableFailedUnits >= 1` OR `failedUnits >= 2` -> return `"INELIGIBLE"`.
3. **Rule 2 (Single Fixable Failure):** If `failedUnits === 1` (and it is `fixable: true`):
   - If `missingUnits === 0` -> return `"NEAR_MISS"` and populate `unlock_hint` from that single failed rule.
   - If `missingUnits >= 1` -> return `"PARTIAL_MATCH"` (we ask missing questions first while keeping the failed pill visible).
4. **Rule 3 (Zero Failures):** If `failedUnits === 0`:
   - If `missingUnits === 0` -> return `"ELIGIBLE"`.
   - If `missingUnits >= 1` -> return `"PARTIAL_MATCH"`.

### 5.4 Dependency Resolution (`depends_on`)
Evaluate schemes in topological order (or two-pass evaluation):
- For any scheme with `depends_on: [depId, ...]`:
  - If any dependency scheme has tier `"INELIGIBLE"`, override the dependent scheme's tier to `"INELIGIBLE"` and set `blocked_by_dependency: [depId]`.
  - Else if any dependency scheme has tier `"PARTIAL_MATCH"` or `"NEAR_MISS"`, cap the dependent scheme's tier at `"PARTIAL_MATCH"`, merge the dependency's `missing_fields` into the dependent scheme's `missing_fields`, and set `blocked_by_dependency: [depId]`.

### 5.5 Adaptive Next Question Selection (`nextQuestion.ts`)
`getNextQuestion(profile, evaluations, questions)`:
1. Filter `evaluations` to schemes whose tier is **not** `"INELIGIBLE"`.
2. Count how many active schemes list each `field` in their `missing_fields`.
3. Filter `questions` to those where:
   - `profile[q.field] === null`
   - `missingFrequency[q.field] > 0`
   - `q.ask_when` is `null` OR `profile` satisfies `q.ask_when` (e.g., only ask `trade` when `profile.occupation === "artisan_craftsperson"`).
4. Sort candidate questions by `missingFrequency[q.field]` descending; break ties by their original index in `data/questions.json`.
5. Return the top `QuestionItem` or `null` if no questions remain.

### 5.6 Mandatory `vitest` Unit Tests (`app/src/engine/__tests__/engine.test.ts`)
All 11 tests MUST be implemented using `fixtures/test-schemes.json` (`TEST-*` IDs):
1. **All rules pass** -> returns `ELIGIBLE` with `score_percent: 100`.
2. **Empty profile (all fields `null`)** -> every scheme returns `PARTIAL_MATCH`, and **zero** schemes return `ELIGIBLE` (proves no silent default values).
3. **Single fixable failure (e.g. income ₹10,000 above cap)** -> returns `NEAR_MISS`, failing `RuleCheck` carries exact `citation`, and `unlock_hint` is populated.
4. **Missing income field (`null`)** -> returns `PARTIAL_MATCH` and `missing_fields` includes `"family_income_annual"`.
5. **Single non-fixable failure (`fixable: false`, e.g., `gender` or `state`)** -> returns `INELIGIBLE` immediately.
6. **Two fixable failures** -> returns `INELIGIBLE`.
7. **OR-Group evaluation** -> passes when 1 rule in group passes even if others fail/missing; fails only when all rules in group fail.
8. **Single-sided numeric bounds (`gte` only, `lte` only) & `between` inclusive bounds** -> evaluates boundary values accurately without crashing.
9. **Scheme dependency (`depends_on`)** -> when `TEST-DEP-BASE` is `INELIGIBLE`, dependent `TEST-DEP-ADDON` becomes `INELIGIBLE` with `blocked_by_dependency: ["TEST-DEP-BASE"]`.
10. **Adaptive `nextQuestion()`** -> selects the most frequently missing field across non-ineligible schemes and respects `ask_when` conditions.
11. **Boundary sensitivity check** -> changing a profile's `family_income_annual` from `250000` to `250001` against a `lte: 250000` rule deterministically flips the tier from `ELIGIBLE` to `NEAR_MISS`.

---

## 6. Target Schemes, Documents & Data Validation (`data/` & `scripts/`)

### 6.1 Target Schemes in `data/schemes/*.json` (Start as `status: "draft"`)
Create 6 well-structured scheme files in Phase 1:
1. `pm-kisan.json` — **PM-KISAN Samman Nidhi** (Central, Agriculture: farmer occupation, land holding > 0, not an income tax payer, not a govt employee).
2. `majhi-ladki-bahin.json` — **Mukhyamantri Majhi Ladki Bahin Yojana** (Maharashtra, Women Welfare: state = Maharashtra, gender = female, age between 21 and 65, family income <= ₹2,50,000, not income tax payer, not govt employee).
3. `pm-vishwakarma.json` — **PM Vishwakarma Yojana** (Central, Artisans & MSME: occupation = `artisan_craftsperson`, age >= 18, eligible traditional trade from `enums.json`, not govt employee).
4. `post-matric-scholarship-obc.json` — **Post-Matric Scholarship for OBC Students** (Maharashtra/Central, Education: `is_student = true`, `social_category = "obc"`, family income <= ₹2,50,000).
5. `pmay-gramin.json` — **Pradhan Mantri Awas Yojana - Gramin (PMAY-G)** (Central, Housing: `has_pucca_house = false`, ration card in `["bpl", "antyodaya"]`, not income tax payer, not govt employee).
6. `namo-shetkari.json` — **Namo Shetkari Mahasanman Nidhi Yojana** (Maharashtra, Agriculture: `state = "Maharashtra"`, `depends_on: ["pm-kisan"]`).

### 6.2 Shared Document Catalog (`data/documents.json`)
Include realistic Indian & Maharashtra local names, issuing authorities, and prerequisite chains (never ask for or store actual ID numbers):
- `identity_card` — Identity Proof / Photo ID Card
- `ration_card` — Ration Card (रेशन कार्ड / राशन कार्ड)
- `income_certificate` — Income Certificate (उत्पन्नाचा दाखला / आय प्रमाणपत्र) -> `prerequisites: ["ration_card", "identity_card"]`, `issuing_authority: "Tehsildar / Maha e-Seva Kendra / Talathi"`
- `domicile_certificate` — Domicile / Residence Certificate (अधिवास प्रमाणपत्र / रहिवासी दाखला) -> `prerequisites: ["ration_card", "identity_card"]`
- `land_7_12_extract` — 7/12 & 8A Land Extract (सातबारा आणि ८अ उतारा / खसरा-खतौनी) -> `issuing_authority: "Talathi Office / Mahabhulekh Portal"`
- `caste_certificate` — Caste Certificate (जात प्रमाणपत्र / जाति प्रमाणपत्र) -> `prerequisites: ["identity_card", "domicile_certificate"]`
- `bank_passbook` — Bank Account Passbook (बँक पासबुक)
- `bonafide_fee_receipt` — College Bonafide & Fee Receipt (बोनाफाईड प्रमाणपत्र)

### 6.3 Data Validator Rules (`scripts/validate-data.ts`)
`npm run validate:data` must exit with non-zero code if:
- Any JSON file fails its JSON Schema (`data/schema/*.schema.json`).
- Any scheme has an empty `source_url`.
- Any scheme with `verification.status === "verified"` still contains `"TODO_VERIFY"` in any string field or `"todo_verify": true` on any rule.
- Any `rule.field` is not a valid `ProfileField`, or any enum value is missing from `data/enums.json`.
- Any document ID in `scheme.documents` or `document.prerequisites` does not exist in `data/documents.json`.
- Any scheme ID in `depends_on` does not exist in `data/schemes/*.json` (or introduces a circular dependency).
- Any `I18nString` is missing its `"en"` key.

---

## 7. Local AI Server Specification (`server/`)

All endpoints in `server/main.py` are **100% stateless**. No database, no file logging of user inputs.

| Endpoint | Method | Purpose & Behavior |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Returns `{ status: "ok", ollama_available: bool, whisper_available: bool, model: str }`. |
| `/api/stt` | `POST` | Accepts audio file (`webm`/`wav`), runs `faster-whisper` (`base` model default), returns `{ text: str, language: str }`. |
| `/api/profile/extract` | `POST` | Accepts `{ text: str, language: str }`. First runs **deterministic Indic normalizer** (`server/services/normalizer.py`), then calls Ollama with Pydantic JSON schema `ProfileExtraction` (all fields optional/nullable), merges results, and returns `{ extracted: Partial<CitizenProfile>, confidence_note: str }`. |
| `/api/explain` | `POST` | *(Optional helper)* Accepts an `Evaluation` object and `language`, rewrites rule `why` strings into conversational Hindi/Marathi/English without altering tiers or inventing rules. Falls back to deterministic template assembly if Ollama is offline. |

### Deterministic Indic Number & Keyword Pre-Parser (`server/services/normalizer.py`)
Even before calling Ollama (or when Ollama is offline), `normalizer.py` must deterministically parse:
- Devanagari digits (`०१२३४५६७८९` -> `0123456789`).
- Indian currency/income multipliers: `"1.2 lakh"` / `"१.२ लाख"` -> `120000`, `"90 hazaar"` / `"90k"` -> `90000`, `"savva lakh"` -> `125000`, `"dedh lakh"` -> `150000`, `"dhai lakh"` -> `250000`.
- Common demographic keywords in English, Hindi, and Marathi (e.g., age patterns `"42 years"` / `"42 saal"` / `"वय ४२"`, gender `"mahila"` / `"stree"` / `"female"`, occupation `"kisan"` / `"shetkari"` -> `"farmer"`, land `"1.5 acre"` / `"१.५ एकर"` -> `1.5`).

---

## 8. Desktop WebApp UI & Widescreen Architecture (`app/src/ui/`)

```text
+------------------------------------------------------------------------------------------------------+
| TopCommandBar: [Volunteer Workstation | Citizen Kiosk]   [EN | हिंदी | मराठी]   [Personas: Savita...] |
+----------------------------+-----------------------------------------+-------------------------------+
| LEFT PANE (30% Width)      | CENTER PANE (40% Width)                 | RIGHT PANE (30% Width)        |
| Rapid Intake & Next Q      | Live Scheme Results Matrix              | Sticky Proof & Doc Inspector  |
|                            |                                         |                               |
| [!] Next Best Question:    | ● ELIGIBLE (2)                          | Selected: Majhi Ladki Bahin   |
| "Annual Family Income?"    |  [Card: Majhi Ladki Bahin Yojana]       |                               |
| [ ₹ 90,000          ]      |  [Card: Post-Matric OBC Scholarship]    | [Tab 1: Official Rule Proof]  |
|                            |                                         |  ✔ Age: 42 (Needs 21–65)      |
| [Mic: Voice Intake]        | ◐ NEAR MISS — 1 Fixable Rule (1)        |  ✔ Income: ₹90k (<= ₹2.5L)    |
|                            |  [Card: PMAY-Gramin • Unlock Hint]      |  📄 Verbatim Clause & Page    |
| Operator Profile Form:     |                                         |                               |
| Age: [42]  Gender: [F]     | ○ PARTIAL MATCH — Need Info (2)         | [Tab 2: Document Tree]        |
| State: [Maharashtra]       |  [Card: PM-KISAN • Ask Land Acres]      |  [ ] Income Certificate       |
| Occupation: [Homemaker]    |                                         |   └─ Need: Ration Card + ID   |
| Ration Card: [BPL]         | ✕ INELIGIBLE (1)                        |                               |
+----------------------------+-----------------------------------------+-------------------------------+
```

### Mandatory Desktop UI Components
1. **`TopCommandBar.tsx`:**
   - **Mode Switcher:** Instant toggle between `Volunteer Workstation (3-Pane Split)` and `Citizen Guided Kiosk (Wizard)`.
   - **Language Switcher:** `English` | `हिंदी` | `मराठी` (updates UI strings, scheme names, rule explanations, and slip output immediately).
   - **One-Click Demo Personas Bar:** Loads `Savita` (42F widow/homemaker, MH, ₹90k income), `Ramesh Patil` (50M farmer, 1.5 acres, MH), or `Aarav` (19M engineering student, OBC) from `fixtures/personas.json`, plus a `Reset Profile` button.
   - **Draft Toggle & Status Pill:** Shows `Offline Engine Ready`, AI server health indicator, a toggle for `Show Draft Schemes (VITE_SHOW_DRAFTS)`, and primary CTA `Print / Share Slip`.
2. **`Volunteer Workstation` (`SplitWorkstation.tsx`):**
   - **Left Pane (`OperatorFormPane.tsx`):** Highlighted "Top Missing Question" card at the top (so the volunteer knows the single highest-impact question to ask next), a `Voice Intake` button, and a clean 2-column compact form for all `CitizenProfile` fields with an explicit `Unknown / Clear` state for every input.
   - **Center Pane (`LiveSchemeMatrix.tsx`):** Scheme cards grouped into collapsible/badged sections: `ELIGIBLE` (green), `NEAR_MISS` (amber, with prominent unlock hint banner: *"Qualifies if family income <= ₹2,50,000"*), `PARTIAL_MATCH` (blue, showing clickable missing field chips), and `INELIGIBLE` (muted grey).
   - **Right Pane (`InspectorDrawer.tsx`):**
     - **Tab 1 (`CitationProofTab.tsx`):** Displays every `RuleCheck` pill (`PASSED` green, `FAILED` red, `MISSING_INFO` amber) showing `user_value` vs `required_value`, plain-language `why`, verbatim `citation.clause`, `citation.page`, clickable `source_url`, and `verification.status` badge (`VERIFIED` vs `DRAFT - UNVERIFIED`).
     - **Tab 2 (`DocumentTreeTab.tsx`):** Interactive checklist of required documents for the selected scheme (or all eligible schemes combined). Checking a document updates `profile.owned_documents`. Unchecked documents automatically expand a card showing `issuing_authority`, `how_to_get`, and clickable `prerequisites` from `documents.json`.
3. **`Citizen Guided Kiosk` (`KioskWizard.tsx`):**
   - Large widescreen question card driven by `getNextQuestion()`, big option buttons with keyboard shortcut badges (`[1]`, `[2]`, `[3]`), voice input modal with mandatory **Confirmation Banner** (*"We understood: Age 42, Income ₹90,000 — Confirm & Apply"*), and a right-hand live summary rail (`LiveUnlockRail.tsx`).
4. **`PrintableDeskSlip.tsx` (Print & WhatsApp Takeaway):**
   - Modal/view with format toggle (`A4 Official Summary` vs `80mm Thermal Help-Desk Receipt`).
   - Uses `@media print` CSS to hide all app navigation and print a crisp localized summary containing: Eligible & Near-Miss schemes, benefit summary, checked vs pending documents to bring tomorrow (with issuing authority hints), official portal/office, `last_verified` date, and the mandatory disclaimer (*"Indicative guidance only. Confirm with the official department before applying."*).
   - Includes a `Share via WhatsApp Web` button (`https://wa.me/?text=...`) pre-formatted in the user's selected language.

---

## 9. Step-by-Step Build Phases & Checklists

### Phase 0: Workspace & Scaffold (Execute Now)
- [ ] **0.1:** Create root directory structure (`data/`, `fixtures/`, `scripts/`, `app/`, `server/`), `.gitignore`, `.env.example`, `LICENSE` (MIT), `README.md`, and `CONTRIBUTING.md`.
- [ ] **0.2:** Initialize `app/` with Vite + React 18 + TypeScript + Tailwind CSS + `i18next` + `@fontsource/noto-sans-devanagari` + `lucide-react` + `vitest`.
- [ ] **0.3:** Initialize `server/` with `requirements.txt` (`fastapi`, `uvicorn`, `pydantic`, `python-multipart`, `faster-whisper`, `ollama`, `slowapi`, `httpx`, `pytest`), `config.py`, and `main.py` with `GET /api/health`.
- [ ] **0.4:** Configure root `package.json` scripts: `dev`, `build`, `test`, `validate:data`, and `build:bundle`.

### Phase 1: Deterministic Engine, Fixtures & Data Pipeline (Execute Now, Then STOP & Report)
- [ ] **1.1:** Implement `app/src/engine/types.ts` matching Section 4 contracts.
- [ ] **1.2:** Implement `app/src/engine/evaluate.ts`, `tiers.ts`, and `nextQuestion.ts` matching Section 5 rules.
- [ ] **1.3:** Create `fixtures/test-schemes.json` (`TEST-*` synthetic schemes covering all operators, OR-groups, fixable/unfixable rules, and `depends_on`) and `fixtures/personas.json` (`Savita`, `Ramesh Patil`, `Aarav`).
- [ ] **1.4:** Write and pass all 11 mandatory unit tests in `app/src/engine/__tests__/engine.test.ts`.
- [ ] **1.5:** Create `data/enums.json`, `data/documents.json`, `data/questions.json`, and `data/locales/{en,hi,mr}.json`.
- [ ] **1.6:** Create JSON Schemas in `data/schema/`, implement `scripts/validate-data.ts` and `scripts/build-bundle.ts`, and generate `app/public/bundle.json`.
- [ ] **1.7:** Create the 6 target scheme files in `data/schemes/*.json` with `verification.status = "draft"`, valid typed `Rule.value` numbers/booleans, and `"todo_verify": true` on items awaiting human PDF verification.
- [ ] **1.8:** **STOP GATE:** Run `npm test`, `npm run validate:data`, and `npm run build:bundle`. Report directory tree, test summary, and `TODO_VERIFY` checklist.

### Phase 2: Desktop Widescreen UI (After Phase 1 Approval)
- [ ] **2.1:** Build `DesktopShell.tsx` and `TopCommandBar.tsx` (Mode switcher, EN/HI/MR language toggle, 1-click Personas bar, Draft visibility toggle, Reset button).
- [ ] **2.2:** Build `SplitWorkstation.tsx` with `OperatorFormPane.tsx` (Next Best Question banner + compact keyboard-friendly form) and `LiveSchemeMatrix.tsx` (4 tier sections with score badges, missing field chips, and near-miss unlock hints).
- [ ] **2.3:** Build `InspectorDrawer.tsx` with `CitationProofTab.tsx` (rule pills, verbatim quote, page number, source link, draft/verified badge) and `DocumentTreeTab.tsx` (interactive owned-document checkboxes + expandable prerequisite tree).
- [ ] **2.4:** Build `KioskWizard.tsx` and `LiveUnlockRail.tsx` for Citizen Guided Kiosk mode.

### Phase 3: Action Layer & Offline Resilience
- [ ] **3.1:** Build `PrintableDeskSlip.tsx` with A4/Thermal toggle, `@media print` stylesheet, and localized WhatsApp Web share link generator.
- [ ] **3.2:** Add "Report Rule Issue" button on each scheme inspector that opens a pre-filled GitHub Issue URL with scheme ID and rule ID.
- [ ] **3.3:** Configure `vite-plugin-pwa` so the desktop app and `bundle.json` work 100% offline after initial load.

### Phase 4: Local AI Server & Voice/Text Extraction
- [ ] **4.1:** Implement `server/services/normalizer.py` (Devanagari digits, lakh/hazaar multipliers, bilingual demographic keywords) + unit tests in `server/tests/test_server.py`.
- [ ] **4.2:** Implement `POST /api/profile/extract` (Normalizer + Ollama structured JSON output) and `POST /api/stt` (`faster-whisper`) + `POST /api/explain`.
- [ ] **4.3:** Build `VoiceIntakeModal.tsx` and `ExtractionConfirmBanner.tsx` in the desktop UI with automatic fallback to browser `webkitSpeechRecognition` or natural-language text box if the Python server is offline.

### Phase 5: Human Verification & Demo Polish
- [ ] **5.1:** Verify the 6 target schemes in `data/schemes/*.json` against official government PDFs, replace `TODO_VERIFY` with verbatim clauses and page numbers, set `verification.status = "verified"`, and re-run `npm run validate:data`.
- [ ] **5.2:** Walk through the 2-minute live demo flow across all 3 personas (`Savita`, `Ramesh Patil`, `Aarav`) in English, Hindi, and Marathi.

---

## 10. Definition of Done (DoD) Verification Checklist

1. **Zero Hallucination Boundary Test:** Selecting persona *Savita* (income `₹90,000`) shows *Mukhyamantri Majhi Ladki Bahin Yojana* as `ELIGIBLE`. Typing `260000` into `family_income_annual` immediately moves the scheme to `NEAR_MISS` with the unlock hint (`<= ₹2,50,000`) and highlights the failed income rule pill with its citation.
2. **Strict Missing-Info Test:** Clicking `Reset Profile` and entering only `Age: 45`, `Gender: Female`, `State: Maharashtra` (leaving income `null`) classifies income-capped schemes as `PARTIAL_MATCH` (never `ELIGIBLE`) and prompts `"What is your annual family income?"` as the Next Best Question.
3. **Multilingual & Local Term Test:** Switching the top bar between `English`, `हिंदी`, and `मराठी` translates the entire workstation, rule reasons, and document checklist while preserving recognizable local document terms (`सातबारा उतारा`, `उत्पन्नाचा दाखला`).
4. **Server-Off Resilience Test:** Stopping the FastAPI/Ollama server does not break the desktop app—the deterministic engine, persona buttons, document dependency tree, and printable slip continue working at 100% speed.
