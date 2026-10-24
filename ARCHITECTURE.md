# YojanaSaathi — Architecture Document

## Technical Stack
- **Frontend Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + `@media print` layout rules
- **State Architecture**: Local React state & React Context (`useAppContext` or unified workstation state)
- **Engine**: Pure TypeScript deterministic evaluation engine (`evaluate`, `tiers`, `nextQuestion`)
- **Offline / Zero Network Dependency**: Pure client-side calculations and mock schemes with official citations.

## Desktop Workstation Layout (1280px–1920px)
- **Top Command Bar**:
  - Branding: YojanaSaathi (Scheme Eligibility Navigator)
  - Workstation vs Kiosk Mode Switcher
  - Multilingual Switcher (EN / HI / MR)
  - 1-Click Demo Personas: Savita (42F, ₹90k, Maharashtra), Ramesh Patil (50M, Farmer, 1.5 acres), Reset Profile
  - "Print / Thermal Receipt" CTA
- **Left Pane (30%) — Rapid Intake**:
  - Highlighted "Next Best Question" card
  - Compact form fields: Age, Gender, State, Annual Household Income, Occupation, Landholding (acres), Ration Card
  - Simulate Voice Intake button with listening state animation
- **Center Pane (40%) — Live Scheme Matrix**:
  - Tiers: `ELIGIBLE` (green), `NEAR_MISS` (amber with unlock hint), `PARTIAL_MATCH` (blue with missing field badges), `INELIGIBLE` (muted gray)
  - Interactive selection to inspect scheme details
- **Right Pane (30%) — Inspector Drawer**:
  - Tab 1: Rule Citation & Proof (Rule-by-rule pass/fail pills, verbatim PDF clause quote, page number, verified status)
  - Tab 2: Document Tree (Interactive owned checkboxes, prerequisite badges, issuing authority, how-to-get guidance)
- **Printable Slip Modal**:
  - Modal with A4 summary vs 80mm thermal receipt toggle
  - Dedicated print styles hiding workstation UI during `window.print()`
