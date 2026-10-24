// ============================================================
// YojanaSaathi — Workstation Engine Unit Tests
// Tests strict null semantics, zero-hallucination boundaries,
// persona unlocks, near-miss detection, and next-question ranking.
// ============================================================

import test from "node:test";
import assert from "node:assert/strict";
import {
  evaluateAllSchemes,
  getNextBestQuestion,
} from "../workstationEngine.ts";
import {
  initialEmptyProfile,
  demoPersonas,
  schemesData,
} from "../workstationData.ts";
import type { CitizenProfileState } from "../../types/workstation.ts";

test("Test 1: Empty profile guarantees strict null semantics (zero false positives)", () => {
  const evaluations = evaluateAllSchemes(initialEmptyProfile);

  const eligibleSchemes = evaluations.filter((e) => e.tier === "ELIGIBLE");
  assert.strictEqual(
    eligibleSchemes.length,
    0,
    "Empty profile must NOT result in any ELIGIBLE schemes"
  );

  const partialSchemes = evaluations.filter((e) => e.tier === "PARTIAL_MATCH");
  assert.ok(
    partialSchemes.length > 0,
    "Schemes with missing fields must return PARTIAL_MATCH"
  );
});

test("Test 2: Savita unlocks Majhi Ladki Bahin with 100% match", () => {
  const savita = demoPersonas.find((p) => p.id === "savita")!;
  assert.ok(savita, "Savita persona exists");

  const evaluations = evaluateAllSchemes(savita.profile);
  const ladkiBahin = evaluations.find((e) => e.scheme.id === "ladki-bahin");

  assert.ok(ladkiBahin, "Ladki Bahin scheme evaluated");
  assert.strictEqual(
    ladkiBahin.tier,
    "ELIGIBLE",
    "Savita must be ELIGIBLE for Majhi Ladki Bahin"
  );
  assert.strictEqual(
    ladkiBahin.scorePercent,
    100,
    "All Ladki Bahin rules must pass"
  );
  assert.strictEqual(
    ladkiBahin.checks.every((c) => c.status === "PASSED"),
    true
  );
});

test("Test 3: Ramesh Patil unlocks PM-KISAN and Namo Shetkari, is INELIGIBLE for Ladki Bahin", () => {
  const ramesh = demoPersonas.find((p) => p.id === "ramesh")!;
  assert.ok(ramesh, "Ramesh persona exists");

  const evaluations = evaluateAllSchemes(ramesh.profile);

  const pmKisan = evaluations.find((e) => e.scheme.id === "pm-kisan");
  assert.ok(pmKisan, "PM-KISAN evaluated");
  assert.strictEqual(
    pmKisan.tier,
    "ELIGIBLE",
    "Ramesh must be ELIGIBLE for PM-KISAN"
  );

  const namoShetkari = evaluations.find((e) => e.scheme.id === "namo-shetkari");
  assert.ok(namoShetkari, "Namo Shetkari evaluated");
  assert.strictEqual(
    namoShetkari.tier,
    "ELIGIBLE",
    "Ramesh must be ELIGIBLE for Namo Shetkari"
  );

  const ladkiBahin = evaluations.find((e) => e.scheme.id === "ladki-bahin");
  assert.ok(ladkiBahin, "Ladki Bahin evaluated");
  assert.strictEqual(
    ladkiBahin.tier,
    "INELIGIBLE",
    "Ramesh (Male) must be INELIGIBLE for Majhi Ladki Bahin"
  );
});

test("Test 4: Near-Miss sensitivity check: Income ₹2,60,000 flips Ladki Bahin to NEAR_MISS", () => {
  const savita = demoPersonas.find((p) => p.id === "savita")!;
  const nearMissProfile: CitizenProfileState = {
    ...savita.profile,
    annualHouseholdIncome: 260000, // Limit is 250,000
  };

  const evaluations = evaluateAllSchemes(nearMissProfile);
  const ladkiBahin = evaluations.find((e) => e.scheme.id === "ladki-bahin")!;

  assert.strictEqual(
    ladkiBahin.tier,
    "NEAR_MISS",
    "Exceeding income cap must classify scheme as NEAR_MISS"
  );
  assert.ok(ladkiBahin.unlockHint, "Unlock hint must be populated");
  assert.ok(
    ladkiBahin.unlockHint.en.includes("≤ ₹2.5L"),
    "Unlock hint must specify threshold ≤ ₹2.5L"
  );
});

test("Test 5: Adaptive Next Best Question prioritizes missing fields", () => {
  const evaluations = evaluateAllSchemes(initialEmptyProfile);
  const nextQ = getNextBestQuestion(initialEmptyProfile, evaluations);

  assert.ok(nextQ, "Next Best Question must not be null for empty profile");
  assert.ok(
    ["annualHouseholdIncome", "state", "gender"].includes(nextQ.field),
    "Top question must be high impact"
  );
});

test("Test 6: Verbatim rule citations are present and non-empty", () => {
  for (const scheme of schemesData) {
    for (const rule of scheme.rules) {
      assert.ok(rule.citation, `Rule ${rule.id} must have citation`);
      assert.ok(
        rule.citation.page,
        `Rule ${rule.id} must have page number citation`
      );
      assert.ok(
        rule.citation.clause.length > 5,
        `Rule ${rule.id} must have verbatim clause quote`
      );
    }
  }
});
