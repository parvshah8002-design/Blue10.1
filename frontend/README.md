# SchemeSaathi (स्कीम साथी) 🇮🇳
### *Evidence-Backed Government Benefits Discovery Platform*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-teal.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tests-13%20Passed-emerald.svg)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> **"The benefits you deserve shouldn't be hard to find."**  
> *Discover government schemes that match your life, understand eligibility in simple language, and find out exactly what to do next — with evidence you can verify.*

---

## 🏛️ The Problem
Over **₹1.5 Lakh Crore** in social welfare, higher education scholarships, and youth training allowances go unclaimed annually across India because:
1. Scheme rules are scattered across **30+ page official gazette PDFs** in dense administrative language.
2. Portals like *myScheme* present overwhelming search directories without providing personalized, honest eligibility breakdowns.
3. Chatbots **hallucinate** eligibility conditions, quote fabricated income cutoffs, or mislead vulnerable citizens into believing missing criteria are satisfied.

---

## 🗺️ Complete User Journey (Redesigned Flow)

SchemeSaathi guides citizens through an intentional, fintech-grade progression:

```
[ LANDING PAGE ]
       │
       ▼
[ SIGN UP / LOGIN ] (Client-side authenticated demo prototype)
       │
       ▼
[ PERSONAL PROFILE ONBOARDING ] (5-Step conversational wizard with needs & priorities)
       │
       ▼
[ PERSONALIZED BENEFITS DASHBOARD ] (Need-based recommendation ranking & summary cards)
       │
       ├──► [ SORT & COMPARE SCHEMES ] (Side-by-side comparison matrix of 2–3 schemes)
       │
       └──► [ DETAILED SCHEME EXPLANATION ] (8 plain-language questions, evidence citations)
                 │
                 ├──► [ DOCUMENT READINESS ASSISTANT ] (DigiLocker tags, printable checklist)
                 │
                 └──► [ OFFICIAL APPLICATION STEPS ] (Direct verified .gov.in portal links)
```

---

## 🌟 Key Differentiators & Product Innovations

1. **Public Landing Page**:
   - Compelling headline: *"The benefits you deserve shouldn't be hard to find."*
   - Interactive live product preview card demonstrating real match mechanics.
   - 4-step horizontal timeline (*Tell us about yourself* → *Discover your matches* → *Understand your benefits* → *Take the next step*).
   - 7 core feature cards highlighting personalization, 3-state evaluation, and accessibility.

2. **Clean Authentication Experience**:
   - Modern Login & Signup forms with validation, show/hide password, and terms acknowledgement.
   - Transparent prototype disclosure (*Zero Aadhaar, passwords, or bank credentials collected*).
   - Instant 1-click **Quick Demo Login** for rapid hackathon judge evaluation.

3. **5-Step Conversational Onboarding Wizard**:
   - Progressive disclosure: Demographics → Life Situation & Education → Financial & Landholding → **Needs & Priorities** → Review.
   - Citizens choose what they are looking for (*Scholarships, Skill Training, Agriculture, Micro-Credit, Social Security*).

4. **Transparent Need-Based Ranking & Scoring Engine**:
   - Schemes are scored deterministically based on:
     - User priority area match (+40 pts)
     - Satisfied verified conditions (+0 to 50 pts)
     - Overall eligibility state (MET = +100 pts, UNKNOWN = +40 pts)
     - Official source verification status (+10 pts)
   - Every scheme card includes an explicit explanation:
     > *"Why this scheme is shown to you: Matches your selected priority (scholarships). Your profile satisfies all 4 evaluated conditions."*

5. **Sort & Side-by-Side Scheme Comparison Matrix**:
   - Sort by *Best match for my priorities*, *Eligibility conditions met*, *Needs more information*, or *Recently verified sources*.
   - Checkbox-select any 2–3 schemes to compare direct benefits, eligibility requirements, and document requirements side by side.

6. **8-Question Plain-Language Explanation Engine**:
   - Answers: *What is this scheme? Who is it for? What benefits does it provide? Why might it be relevant to me? What are the published conditions? What information is still missing? What documents are required? How do I proceed?*
   - Toggle between **Simple Explanation** and **Official Gazette Text**.

7. **Evidence-Backed Trust Engine**:
   - Every condition links to exact source excerpts, section references, and page numbers from official guidelines.

8. **Document Readiness Assistant**:
   - Interactive checkboxes to mark documents you have ready.
   - Real-time progress bar, **DigiLocker** validity indicators, and **Print / Copy** support.

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js `v18+` (Tested on Node v26)
- npm `v9+`

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/your-username/schemesaathi.git
cd schemesaathi

# Install dependencies
npm install

# Start local development server (serves on http://localhost:5173/)
npm run dev

# Run automated tests
npm test

# Production build
npm run build
```

---

## 🧪 Verified Scheme Dataset & Citations

| Scheme Name | Beneficiary | Issuing Ministry | Verified Portal | Primary Source Document |
|:---|:---|:---|:---|:---|
| **PM-USP Central Sector Scholarship (CSSS)** | Higher Education Students | Ministry of Education, Dept of Higher Education | [scholarships.gov.in](https://scholarships.gov.in) | *Guidelines for Central Sector Scheme of Scholarship for College and University Students* |
| **Post-Matric Scholarship for SC Students** | Scheduled Caste Students | Ministry of Social Justice & Empowerment | [socialjustice.gov.in](https://socialjustice.gov.in) | *Revised Centrally Sponsored Scheme Guidelines for SC Post-Matric* |
| **PM Kisan Samman Nidhi (PM-KISAN)** | Landholding Farmers | Ministry of Agriculture & Farmers Welfare | [pmkisan.gov.in](https://pmkisan.gov.in) | *PM-KISAN Operational Guidelines Section 2 & 3* |
| **National Apprenticeship Scheme (NAPS-2)** | Youth & Job Seekers | Ministry of Skill Development & Entrepreneurship | [apprenticeshipindia.gov.in](https://apprenticeshipindia.gov.in) | *NAPS-2 Operational Guidelines & Apprentices Act 1961* |
| **PM SVANidhi Micro-Credit** | Informal Street Vendors | Ministry of Housing and Urban Affairs | [pmsvanidhi.mohua.gov.in](https://pmsvanidhi.mohua.gov.in) | *PM SVANidhi Scheme Guidelines & Vending Norms* |

---

## 🏗️ Architecture & Component Hierarchy

```
src/
├── types/
│   └── scheme.ts            # Strict TypeScript types (LogicalState, UserPriority, UserAccount, AppView)
├── engine/
│   ├── evaluator.ts         # Deterministic 3-state evaluator & need-based ranking algorithm
│   └── evaluator.test.ts    # 13 automated unit tests
├── data/
│   ├── schemes.ts           # 5 deeply verified, authentic Indian schemes with gazette citations
│   ├── personas.ts          # 5 demo personas (Priya, Rahul, Ramesh, Anita, Asha)
│   ├── glossary.ts          # Plain-language civic terms (DBT, DigiLocker, PFMS, Bonafide)
│   └── translations.ts      # Curated English & Hindi translations
├── components/
│   ├── Navbar.tsx           # Original document+checkmark logo, responsive drawer, view router
│   ├── LandingPage.tsx      # Public landing page with product preview, 4-step timeline, 7 features
│   ├── AuthPage.tsx         # Modern Login & Signup views with quick demo login
│   ├── ProfileWizard.tsx    # 5-step conversational profile onboarding with needs & priorities
│   ├── Dashboard.tsx        # Benefits dashboard with need-based sorting, summary metrics, filters
│   ├── SchemeDetailView.tsx # 8 plain-language questions, evidence citations, document assistant
│   ├── SchemeComparisonView.tsx # Side-by-side comparison matrix of selected schemes
│   ├── CivicGlossaryModal.tsx   # Terms helper modal
│   └── Footer.tsx           # Statutory disclaimer and official portal links
├── utils/
│   └── speech.ts            # Web Speech API speech synthesis utility
├── App.tsx                  # Main reactive application router & state manager
└── index.css                # Tailwind CSS v4 design system
```

---

## ⚖️ Open Source & Disclaimer
- **License**: Released under the [MIT License](./LICENSE).
- **Statutory Notice**: SchemeSaathi is an open-source civic discovery platform referencing publicly available guidelines on `.gov.in` and `.nic.in` portals. Final eligibility determination is made exclusively by the respective government department.
