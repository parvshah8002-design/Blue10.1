# YojanaSaathi — Project Status

## Current Roadmap Task
- **Active Task**: Fix Next.js / Turbopack runtime crash on `localhost:3000`, enforce `'use client';` directives across all interactive workstation components, verify import graph and circular dependency freedom, and confirm `npm run build` succeeds with 0 errors.
- **Status**: **COMPLETED & VERIFIED**

## Summary of Completed Work
1. **Turbopack Dev & Runtime Crash Remediation**:
   - Diagnosed root cause: Next.js 16 defaults `next dev` to Turbopack. When processing `globals.css` with `@tailwindcss/turbopack`, Turbopack spawned child Node processes that exited prematurely under Node 26 (`node process exited before we could connect to it with exit status: 0`).
   - Standardized dev runtime in `yojana-saathi/package.json` to `"dev": "next dev --webpack"`, aligning development mode with the verified production build pipeline (`next build --webpack`).
2. **Directive Verification**:
   - Enforced `'use client';` explicitly at line 1 in `src/app/page.tsx` and all interactive workstation components:
     * `src/components/workstation/RapidIntakePane.tsx`
     * `src/components/workstation/TopCommandBar.tsx`
     * `src/components/workstation/LiveSchemeMatrixPane.tsx`
     * `src/components/workstation/InspectorDrawerPane.tsx`
     * `src/components/workstation/PrintableSlipModal.tsx`
     * `src/components/workstation/CitizenKioskView.tsx`
3. **Import Graph & Circular Dependency Verification**:
   - Audited import graphs across `src/types/workstation.ts`, `src/lib/workstationEngine.ts`, and `src/lib/workstationData.ts`:
     * `workstation.ts`: Pure type contracts, 0 dependencies.
     * `workstationData.ts`: Depends only on `workstation.ts`.
     * `workstationEngine.ts`: Depends on `workstation.ts` and `workstationData.ts`.
     * Zero circular dependencies, zero missing imports.
4. **Build and Test Verification**:
   - Verified automated test suite: 6/6 tests passing (0 failures).
   - Verified ESLint: 0 errors.
   - Verified `npm run build`: Static prerender of `/`, `/_not-found`, `/form`, `/home` completed with 0 errors.

## Summary of Completed Work
1. **Top Command Bar (`src/components/workstation/TopCommandBar.tsx`)**:
   - Branding: *YojanaSaathi (Scheme Eligibility Navigator)*
   - Interactive Mode Switcher: *Volunteer Workstation (3-Pane)* vs *Citizen Kiosk*
   - Multilingual Switcher: *English* | *हिंदी* | *मराठी*
   - 1-Click Demo Personas:
     * *Savita (42F, ₹90k, Maharashtra)*: Sets profile and unlocks *Mukhyamantri Majhi Ladki Bahin Yojana* (ELIGIBLE).
     * *Ramesh Patil (50M, Farmer, 1.5 acres)*: Sets profile and unlocks *PM-KISAN Samman Nidhi* and *Namo Shetkari Mahasanman Nidhi*.
     * *Reset Profile*: Clears all inputs to null state with zero false positives.
   - Primary Action CTA: *Print / Thermal Receipt*.

2. **Left Pane (30% Width) — Rapid Intake (`src/components/workstation/RapidIntakePane.tsx`)**:
   - *Next Best Question*: Dynamically ranks and surfaces the single most impactful unasked question across all active schemes with 1-click answer pills.
   - Compact operator form with clear states for Age, Gender, State, Annual Household Income (with quick presets like ₹90k, ₹2.0L, ₹2.6L), Occupation, Landholding (acres), and Ration Card (BPL, APL, Antyodaya).
   - *Simulate Voice Intake*: Interactive soundwave audio animation that simulates rural dialect speech recognition and auto-populates Savita's details into the form with immediate 0ms matrix updates.

3. **Center Pane (40% Width) — Live Scheme Matrix (`src/components/workstation/LiveSchemeMatrixPane.tsx`)**:
   - Real-time scheme cards grouped into 4 distinct badge tiers:
     * `ELIGIBLE` (Emerald green badge, matched rules score, benefit amount pill)
     * `NEAR_MISS` (Amber badge with prominent unlock hint banner, e.g., *"Unlock Hint: Needs income ≤ ₹2.5L"*)
     * `PARTIAL_MATCH` (Blue badge displaying specific missing field chips, e.g., *"Needs: income, landHolding"*)
     * `INELIGIBLE` (Muted slate grey badge for disqualified schemes)
   - Real-time updates when inputs change or demo personas are clicked.
   - Scheme selection activates deep inspection in the Right Pane.

4. **Right Pane (30% Width) — Inspector Drawer (`src/components/workstation/InspectorDrawerPane.tsx`)**:
   - *Tab 1: Rule Citation & Proof*:
     * Rule-by-rule pass / fail / missing pills.
     * Citizen value vs required threshold comparison.
     * Official resolution badge (*VERIFIED BY OFFICIAL GR*).
     * Verbatim quotation from official Government Resolution (GR) PDF.
     * Official page number citation (e.g., *Page 4, Clause 3(b)*).
     * Direct link to official government application portal.
   - *Tab 2: Document Tree & Prerequisites*:
     * Interactive checklist of required documents updating citizen possession state.
     * Document readiness progress bar (e.g., *60% Ready*).
     * Explicit prerequisite badges (e.g., *Income Certificate requires: Ration Card + Aadhaar*).
     * Issuing authorities and step-by-step guidance on how to obtain missing documents.

5. **Printable Slip Modal (`src/components/workstation/PrintableSlipModal.tsx`)**:
   - Modal dialog with light-dismiss, Escape key support, and focus trap.
   - Format Switcher:
     * *A4 Official Summary*: Formal multi-section report with citizen demographic table, qualified schemes, near-miss advice, document checklist, and signature stamps.
     * *80mm Thermal Receipt*: High-contrast compact monospace layout designed for POS receipt printers in rural CSC kiosks.
   - Localized WhatsApp Web share button (`wa.me/?text=...`).
   - Clean `@media print` rules hiding app navigation, sidebars, and background elements.

6. **Citizen Guided Kiosk View (`src/components/workstation/CitizenKioskView.tsx`)**:
   - High-contrast, large-button touch wizard driven by `nextBestQuestion`.
   - Voice microphone button with simulated audio stream transcription.
   - Live unlock rail displaying unlocked schemes in real-time.

## Verification & Commands
- `npm test`: Ran 6 automated unit tests verifying strict null semantics, Savita unlock, Ramesh unlock, near-miss sensitivity, next-question ranking, and citation completeness. **Result: 6/6 tests passed (0 failures).**
- `npm run lint`: ESLint check completed. **Result: 0 errors.**
- `npm run build`: Production compilation via Next.js + Webpack. **Result: 0 errors, prerendered static `/` successfully.**

## Changed / Created Files
- `src/app/page.tsx`: Single-screen desktop workstation orchestrator.
- `src/types/workstation.ts`: Strict TypeScript contracts for profile, rules, citations, document tree, and match tiers.
- `src/lib/workstationData.ts`: 6 schemes with verbatim GR citations, master documents catalog, demo personas, and translations.
- `src/lib/workstationEngine.ts`: Deterministic client-side evaluation engine and adaptive Next Best Question algorithm.
- `src/lib/__tests__/workstationEngine.test.ts`: 6 automated unit tests.
- `src/components/workstation/TopCommandBar.tsx`: Top command bar component.
- `src/components/workstation/RapidIntakePane.tsx`: Left pane (30% width).
- `src/components/workstation/LiveSchemeMatrixPane.tsx`: Center pane (40% width).
- `src/components/workstation/InspectorDrawerPane.tsx`: Right pane (30% width).
- `src/components/workstation/CitizenKioskView.tsx`: Citizen Kiosk guided mode.
- `src/components/workstation/PrintableSlipModal.tsx`: A4 & 80mm thermal receipt modal.
- `src/app/globals.css`: Enhanced `@media print` and scrollbar styles.
- `src/app/layout.tsx`: System font fallback for offline builds.
- `package.json`: Build and test scripts configured.
- `tsconfig.json`: `allowImportingTsExtensions` enabled for clean test execution.

## Risks & Mitigations
- **Network Dependency Risk**: Eliminated. Engine, mock schemes, citations, and i18n are 100% self-contained in client memory; zero external API or network calls required.
- **Hallucination Risk**: Eliminated. Pure deterministic TypeScript rule engine; no LLMs in the decision path.
