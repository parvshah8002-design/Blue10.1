// ============================================================
// YojanaSaathi — Deterministic Rule Engine
// Evaluates citizen eligibility in 0ms purely in client memory
// ============================================================

import type {
  CitizenProfileState,
  MatchTier,
  NextBestQuestion,
  RuleCheckResult,
  SchemeEvaluation,
  SchemeRule,
} from "../types/workstation.ts";
import { schemesData } from "./workstationData.ts";

export function formatFieldValue(field: keyof CitizenProfileState, val: unknown): string {
  if (val === null || val === undefined) return "Not provided";
  if (field === "annualHouseholdIncome") {
    return `₹${Number(val).toLocaleString("en-IN")}`;
  }
  if (field === "landHoldingAcres") {
    return `${val} ${Number(val) === 1 ? "acre" : "acres"}`;
  }
  if (field === "age") {
    return `${val} years`;
  }
  if (field === "gender") {
    const s = String(val);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  if (field === "rationCard") {
    return String(val).toUpperCase();
  }
  if (typeof val === "boolean") {
    return val ? "Yes" : "No";
  }
  return String(val);
}

export function formatRequirement(rule: SchemeRule): string {
  const { operator, value } = rule;
  if (operator === "eq") {
    if (typeof value === "boolean") return value ? "Required" : "Must not have";
    return `Must be ${value}`;
  }
  if (operator === "neq") return `Must not be ${value}`;
  if (operator === "lte") {
    if (rule.field === "annualHouseholdIncome") {
      return `≤ ₹${(Number(value) / 100000).toFixed(1).replace(".0", "")} Lakh (₹${Number(value).toLocaleString("en-IN")})`;
    }
    return `≤ ${value}`;
  }
  if (operator === "gte") return `≥ ${value}`;
  if (operator === "gt") return `> ${value}`;
  if (operator === "lt") return `< ${value}`;
  if (operator === "between" && Array.isArray(value)) {
    return `${value[0]} to ${value[1]} years`;
  }
  if (operator === "in" && Array.isArray(value)) {
    return `One of: ${value.join(", ")}`;
  }
  return String(value);
}

export function evaluateSingleRule(
  rule: SchemeRule,
  profile: CitizenProfileState
): RuleCheckResult {
  const userVal = profile[rule.field];

  if (userVal === null || userVal === undefined) {
    return {
      ruleId: rule.id,
      field: rule.field,
      status: "MISSING_INFO",
      userValue: null,
      requiredValue: formatRequirement(rule),
      fixable: rule.fixable,
      description: rule.description,
      citation: rule.citation,
    };
  }

  let passed = false;

  switch (rule.operator) {
    case "eq":
      passed = userVal === rule.value;
      break;
    case "neq":
      passed = userVal !== rule.value;
      break;
    case "lte":
      passed = Number(userVal) <= Number(rule.value);
      break;
    case "lt":
      passed = Number(userVal) < Number(rule.value);
      break;
    case "gte":
      passed = Number(userVal) >= Number(rule.value);
      break;
    case "gt":
      passed = Number(userVal) > Number(rule.value);
      break;
    case "between":
      if (Array.isArray(rule.value)) {
        const num = Number(userVal);
        passed = num >= Number(rule.value[0]) && num <= Number(rule.value[1]);
      }
      break;
    case "in":
      if (Array.isArray(rule.value)) {
        passed = rule.value.includes(userVal as string | number);
      }
      break;
    default:
      passed = false;
  }

  return {
    ruleId: rule.id,
    field: rule.field,
    status: passed ? "PASSED" : "FAILED",
    userValue: formatFieldValue(rule.field, userVal),
    requiredValue: formatRequirement(rule),
    fixable: rule.fixable,
    description: rule.description,
    citation: rule.citation,
  };
}

export function evaluateAllSchemes(
  profile: CitizenProfileState
): SchemeEvaluation[] {
  // First pass: evaluate independent schemes
  const rawEvaluations = schemesData.map((scheme) => {
    const checks = scheme.rules.map((rule) => evaluateSingleRule(rule, profile));
    const failedChecks = checks.filter((c) => c.status === "FAILED");
    const missingChecks = checks.filter((c) => c.status === "MISSING_INFO");
    const passedChecks = checks.filter((c) => c.status === "PASSED");

    const unfixableFailed = failedChecks.filter((c) => !c.fixable);
    const missingFields = Array.from(new Set(missingChecks.map((c) => c.field)));

    let tier: MatchTier;
    let unlockHint: { en: string; hi: string; mr: string } | undefined;

    // Rule 1: Ineligible if any unfixable rule fails OR 2+ rules fail
    if (unfixableFailed.length >= 1 || failedChecks.length >= 2) {
      tier = "INELIGIBLE";
    }
    // Rule 2: Single fixable failure
    else if (failedChecks.length === 1 && failedChecks[0].fixable) {
      const failedRule = failedChecks[0];
      if (failedRule.field === "annualHouseholdIncome") {
        unlockHint = {
          en: "Needs income ≤ ₹2.5L (Under limit for BPL / orange ration card holders)",
          hi: "आवश्यकता: आय ≤ ₹2.5L (बीपीएल / नारंगी राशन कार्ड धारकों के लिए मान्य)",
          mr: "उत्पन्न मर्यादा: कौटुंबिक उत्पन्न ≤ ₹२.५ लाख असणे आवश्यक",
        };
      } else if (failedRule.field === "rationCard") {
        unlockHint = {
          en: "Requires BPL or Antyodaya Ration Card",
          hi: "बीपीएल या अंत्योदय राशन कार्ड आवश्यक है",
          mr: "बीपीएल किंवा अंत्योदय रेशन कार्ड आवश्यक",
        };
      } else if (failedRule.field === "landHoldingAcres") {
        unlockHint = {
          en: "Requires agricultural landholding > 0 acres",
          hi: "कृषि योग्य भूमि > 0 एकड़ आवश्यक है",
          mr: "स्वतःच्या नावावर शेतजमीन (> ० एकर) आवश्यक",
        };
      }

      // If no other fields are missing, it is a clean NEAR_MISS
      if (missingChecks.length === 0) {
        tier = "NEAR_MISS";
      } else {
        // If income is failed but fixable, and missing fields exist, still flag unlock hint
        tier = "NEAR_MISS";
      }
    }
    // Rule 3: Zero failures
    else {
      if (missingChecks.length === 0) {
        tier = "ELIGIBLE";
      } else {
        tier = "PARTIAL_MATCH";
      }
    }

    const totalRules = scheme.rules.length;
    const scorePercent = totalRules > 0 ? Math.round((passedChecks.length / totalRules) * 100) : 0;

    return {
      scheme,
      tier,
      scorePercent,
      checks,
      missingFields,
      unlockHint,
    };
  });

  // Second pass: resolve dependency chains (e.g., Namo Shetkari depends on PM-KISAN)
  const evalMap = new Map<string, SchemeEvaluation>(rawEvaluations.map((e) => [e.scheme.id, e]));

  return rawEvaluations.map((evalItem) => {
    if (evalItem.scheme.dependsOn && evalItem.scheme.dependsOn.length > 0) {
      for (const depId of evalItem.scheme.dependsOn) {
        const depEval = evalMap.get(depId);
        if (depEval) {
          if (depEval.tier === "INELIGIBLE") {
            return {
              ...evalItem,
              tier: "INELIGIBLE" as MatchTier,
              blockedByDependency: depId,
            };
          } else if (depEval.tier === "NEAR_MISS" && evalItem.tier === "ELIGIBLE") {
            return {
              ...evalItem,
              tier: "NEAR_MISS" as MatchTier,
              blockedByDependency: depId,
              unlockHint: depEval.unlockHint,
            };
          } else if (depEval.tier === "PARTIAL_MATCH" && evalItem.tier === "ELIGIBLE") {
            return {
              ...evalItem,
              tier: "PARTIAL_MATCH" as MatchTier,
              blockedByDependency: depId,
              missingFields: Array.from(new Set([...evalItem.missingFields, ...depEval.missingFields])),
            };
          }
        }
      }
    }
    return evalItem;
  });
}

// ---------------- ADAPTIVE NEXT BEST QUESTION ----------------

const QUESTION_BANK: NextBestQuestion[] = [
  {
    field: "annualHouseholdIncome",
    title: {
      en: "What is your annual household income?",
      hi: "आपके परिवार की वार्षिक आय कितनी है?",
      mr: "तुमच्या कुटुंबाचे वार्षिक उत्पन्न किती आहे?",
    },
    helperText: {
      en: "Determines eligibility for Majhi Ladki Bahin (≤ ₹2.5L), PMAY-G (≤ ₹3.0L), and OBC scholarships.",
      hi: "माझी लाडकी बहीण (≤ ₹2.5L), पीएम आवास (≤ ₹3.0L) और छात्रवृत्ति के लिए निर्णायक।",
      mr: "लाडकी बहीण (≤ ₹२.५ लाख), पीएम आवास (≤ ₹३.० लाख) व शिष्यवृत्तीसाठी अत्यंत महत्त्वाचे.",
    },
    impactScore: 5,
    options: [
      {
        value: "90000",
        label: { en: "Below ₹1,00,000 (e.g. ₹90k)", hi: "₹1,00,000 से कम (जैसे ₹90k)", mr: "₹१,००,००० पेक्षा कमी (उदा. ₹९० हजार)" },
      },
      {
        value: "200000",
        label: { en: "₹1,00,000 – ₹2,50,000", hi: "₹1,00,000 – ₹2,50,000", mr: "₹१,००,००० ते ₹२,५०,०००" },
      },
      {
        value: "280000",
        label: { en: "Above ₹2,50,000 (e.g. ₹2.8L)", hi: "₹2,50,000 से अधिक (जैसे ₹2.8L)", mr: "₹२,५०,००० पेक्षा जास्त (उदा. ₹२.८ लाख)" },
      },
    ],
  },
  {
    field: "state",
    title: {
      en: "What is your permanent resident state?",
      hi: "आप किस राज्य के स्थायी निवासी हैं?",
      mr: "तुम्ही कोणत्या राज्याचे कायमस्वरूपी रहिवासी आहात?",
    },
    helperText: {
      en: "Required to filter Maharashtra-specific welfare benefits.",
      hi: "महाराष्ट्र राज्य-विशिष्ट कल्याणकारी योजनाओं को अनलॉक करने हेतु।",
      mr: "महाराष्ट्र शासनाच्या योजनांची पडताळणी करण्यासाठी आवश्यक.",
    },
    impactScore: 4,
    options: [
      {
        value: "Maharashtra",
        label: { en: "Maharashtra", hi: "महाराष्ट्र", mr: "महाराष्ट्र" },
      },
      {
        value: "Other",
        label: { en: "Other State", hi: "अन्य राज्य", mr: "इतर राज्य" },
      },
    ],
  },
  {
    field: "gender",
    title: {
      en: "What is the citizen's gender?",
      hi: "नागरिक का लिंग क्या है?",
      mr: "नागरिकाचे लिंग काय आहे?",
    },
    helperText: {
      en: "Unlocks dedicated women welfare schemes like Mukhyamantri Majhi Ladki Bahin.",
      hi: "माझी लाडकी बहीण जैसी महिला कल्याणकारी योजनाओं के लिए।",
      mr: "मुख्यमंत्री माझी लाडकी बहीण योजनेसाठी आवश्यक.",
    },
    impactScore: 3,
    options: [
      { value: "female", label: { en: "Female", hi: "महिला", mr: "महिला" } },
      { value: "male", label: { en: "Male", hi: "पुरुष", mr: "पुरुष" } },
      { value: "other", label: { en: "Other", hi: "अन्य", mr: "इतर" } },
    ],
  },
  {
    field: "occupation",
    title: {
      en: "What is the citizen's primary occupation?",
      hi: "नागरिक का मुख्य व्यवसाय क्या है?",
      mr: "नागरिकाचा मुख्य व्यवसाय कोणता आहे?",
    },
    helperText: {
      en: "Directs qualification for PM-KISAN (Farmer) and PM Vishwakarma (Artisan).",
      hi: "पीएम-किसान (किसान) और पीएम विश्वकर्मा (कारीगर) हेतु।",
      mr: "पीएम-किसान (शेतकरी) व पीएम विश्वकर्मा (कारागीर) योजनांसाठी निर्णायक.",
    },
    impactScore: 3,
    options: [
      { value: "farmer", label: { en: "Farmer / Agriculture", hi: "किसान / कृषि", mr: "शेतकरी / कृषी" } },
      { value: "homemaker", label: { en: "Homemaker", hi: "गृहणी", mr: "गृहिणी" } },
      { value: "artisan_craftsperson", label: { en: "Artisan / Craftsperson", hi: "पारंपरिक कारीगर / शिल्पकार", mr: "पारंपारिक कारागीर" } },
      { value: "student", label: { en: "Student", hi: "विद्यार्थी", mr: "विद्यार्थी" } },
      { value: "other", label: { en: "Other / Daily Wage", hi: "अन्य / दिहाड़ी मजदूर", mr: "इतर / रोजंदारी" } },
    ],
  },
  {
    field: "age",
    title: {
      en: "What is the citizen's age?",
      hi: "नागरिक की आयु कितनी है?",
      mr: "नागरिकाचे वय किती आहे?",
    },
    helperText: {
      en: "Used to verify 21–65 age window for Ladki Bahin and 18+ for Vishwakarma.",
      hi: "लाडकी बहीण (21-65) और विश्वकर्मा (18+) आयु सत्यापन हेतु।",
      mr: "लाडकी बहीण (२१-६५) व विश्वकर्मा (१८+) वयाची खात्री करण्यासाठी.",
    },
    impactScore: 3,
    options: [
      { value: "42", label: { en: "42 Years (Adult)", hi: "42 वर्ष (वयस्क)", mr: "४२ वर्षे (सविता वय)" } },
      { value: "50", label: { en: "50 Years (Farmer)", hi: "50 वर्ष (रमेश वय)", mr: "५० वर्षे (रमेश वय)" } },
      { value: "19", label: { en: "19 Years (Youth)", hi: "19 वर्ष (युवा)", mr: "१९ वर्षे (तरुण)" } },
    ],
  },
  {
    field: "landHoldingAcres",
    title: {
      en: "How many acres of agricultural land do you own?",
      hi: "आपके पास कितने एकड़ कृषि भूमि है?",
      mr: "तुमच्या मालकीची किती एकर शेतजमीन आहे?",
    },
    helperText: {
      en: "Required for PM-KISAN (cultivable land > 0 acres) and Namo Shetkari.",
      hi: "पीएम-किसान एवं नमो शेतकरी योजना हेतु कृषि भूमि (> 0 एकड़)।",
      mr: "पीएम-किसान व नमो शेतकरी योजनांसाठी शेतजमीन (> ० एकर) आवश्यक.",
    },
    impactScore: 2,
    options: [
      { value: "1.5", label: { en: "1.5 Acres (Small farmer)", hi: "1.5 एकड़ (लघु किसान)", mr: "१.५ एकर (लहान शेतकरी)" } },
      { value: "0", label: { en: "0 Acres (Landless / Non-farmer)", hi: "0 एकड़ (भूमिहीन)", mr: "० एकर (भूमिहीन)" } },
    ],
  },
  {
    field: "rationCard",
    title: {
      en: "What type of Ration Card do you hold?",
      hi: "आपके पास किस प्रकार का राशन कार्ड है?",
      mr: "तुमच्याकडे कोणत्या प्रकारचे रेशन कार्ड आहे?",
    },
    helperText: {
      en: "Qualifies for PMAY-G housing grant (BPL / Antyodaya).",
      hi: "पीएम आवास योजना (बीपीएल / अंत्योदय) पात्रता हेतु।",
      mr: "पीएम आवास योजनेसाठी (बीपीएल / अंत्योदय) आवश्यक.",
    },
    impactScore: 2,
    options: [
      { value: "bpl", label: { en: "BPL (Yellow Card)", hi: "बीपीएल (पीला कार्ड)", mr: "बीपीएल (पिवळे कार्ड)" } },
      { value: "apl", label: { en: "APL (Orange Card)", hi: "एपीएल (नारंगी कार्ड)", mr: "एपीएल (केशरी कार्ड)" } },
      { value: "antyodaya", label: { en: "Antyodaya (AAY)", hi: "अंत्योदय (AAY)", mr: "अंत्योदय अन्न योजना" } },
    ],
  },
];

export function getNextBestQuestion(
  profile: CitizenProfileState,
  evaluations: SchemeEvaluation[]
): NextBestQuestion | null {
  // Find which fields are still null in profile
  const missingFreq: Record<string, number> = {};

  evaluations
    .filter((e) => e.tier !== "INELIGIBLE")
    .forEach((e) => {
      e.missingFields.forEach((field) => {
        missingFreq[field] = (missingFreq[field] || 0) + 1;
      });
    });

  // Filter question bank to fields that are null
  const candidates = QUESTION_BANK.filter((q) => profile[q.field] === null);

  if (candidates.length === 0) return null;

  // Sort by frequency of missing across active schemes, then by impactScore
  candidates.sort((a, b) => {
    const freqA = missingFreq[a.field] || 0;
    const freqB = missingFreq[b.field] || 0;
    if (freqB !== freqA) return freqB - freqA;
    return b.impactScore - a.impactScore;
  });

  return candidates[0];
}
