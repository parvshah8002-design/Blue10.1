# YojanaSaathi — Product Specification

## Overview
YojanaSaathi is a single-screen desktop scheme eligibility navigator designed for village help-desk operators (Common Service Centers / CSCs, Gram Panchayat kiosks) and rural citizens. It evaluates government scheme eligibility deterministically in real time, provides rule-by-rule proof with verbatim government resolution citations and page numbers, guides document prerequisite collection, and generates printable takeaway slips (A4 and 80mm thermal receipt formats).

## Target Users & Modes
1. **Volunteer Workstation (3-Pane Desktop, 1280px–1920px)**:
   - Optimized for fast operator triage (30-50 citizens/day).
   - Left Pane (30%): Dynamic Next Best Question + Rapid Intake Profile Form + Voice Intake simulation.
   - Center Pane (40%): Live Scheme Matrix grouped into 4 match tiers (`ELIGIBLE`, `NEAR_MISS`, `PARTIAL_MATCH`, `INELIGIBLE`).
   - Right Pane (30%): Deep Inspector with Rule Citation & Verbatim Proof Tab and Document Dependency Tree Tab.
2. **Citizen Guided Kiosk**:
   - High-contrast, large-button single question wizard with live scheme unlock rail.

## Languages Supported
- English (`en`)
- Hindi (`hi`)
- Marathi (`mr`)

## Core Differentiators
- **Zero Hallucination / Deterministic**: 100% deterministic rule evaluation in TypeScript.
- **Explainable Citations**: Every rule provides official PDF clause and page citations.
- **Actionable Near-Miss Guidance**: Outlines fixable conditions to unlock near-miss schemes.
- **Document Prerequisite Trees**: Details prerequisite documents needed before applying.
- **Instant Printable Slips**: A4 summary and 80mm thermal receipt with WhatsApp share link.
