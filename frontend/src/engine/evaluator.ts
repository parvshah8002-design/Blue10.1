import {
  Scheme,
  UserProfile,
  EligibilityRule,
  RuleEvaluationResult,
  SchemeEvaluation,
  LogicalState,
  EvaluationSummary
} from '../types/scheme';

/**
 * Deterministic Rule Evaluator
 * Pure, side-effect-free evaluation function conforming to the 3-state logic:
 * - MET: The supplied information satisfies the verified rule.
 * - NOT MET: The supplied information contradicts the verified rule.
 * - UNKNOWN: Information is missing, ambiguous, outdated, or unverified.
 *
 * CRITICAL RULE: Missing information is NEVER interpreted as satisfying a requirement.
 */
export function evaluateRule(rule: EligibilityRule, profile: UserProfile): RuleEvaluationResult {
  const userValue = (profile as Record<string, any>)[rule.field];

  // 1. Missing or undefined information check -> ALWAYS UNKNOWN
  if (userValue === undefined || userValue === null || userValue === '') {
    return {
      rule,
      state: 'UNKNOWN',
      userValue: undefined,
      reason: `Information not provided in profile: ${rule.label} is required for this assessment.`
    };
  }

  // 2. Evaluate according to rule operator
  switch (rule.operator) {
    case 'equals': {
      const isMatch = String(userValue).trim().toLowerCase() === String(rule.expectedValue).trim().toLowerCase();
      return {
        rule,
        state: isMatch ? 'MET' : 'NOT MET',
        userValue,
        reason: isMatch
          ? `Matches requirement: ${rule.label} is '${userValue}'.`
          : `Requirement requires '${rule.expectedValue}', but profile provides '${userValue}'.`
      };
    }

    case 'not_equals': {
      const isNotMatch = String(userValue).trim().toLowerCase() !== String(rule.expectedValue).trim().toLowerCase();
      return {
        rule,
        state: isNotMatch ? 'MET' : 'NOT MET',
        userValue,
        reason: isNotMatch
          ? `Satisfies exclusion test: ${rule.label} is '${userValue}'.`
          : `Profile contradicts rule: value cannot be '${rule.expectedValue}'.`
      };
    }

    case 'less_than_or_equal': {
      const numVal = Number(userValue);
      const expectedNum = Number(rule.expectedValue);
      if (isNaN(numVal)) {
        return {
          rule,
          state: 'UNKNOWN',
          userValue,
          reason: `Invalid numeric value '${userValue}' provided for ${rule.label}.`
        };
      }
      const isMatch = numVal <= expectedNum;
      return {
        rule,
        state: isMatch ? 'MET' : 'NOT MET',
        userValue: numVal,
        reason: isMatch
          ? `Within limit: ₹${numVal.toLocaleString('en-IN')} is at or below ceiling of ₹${expectedNum.toLocaleString('en-IN')}.`
          : `Exceeds ceiling: ₹${numVal.toLocaleString('en-IN')} exceeds maximum limit of ₹${expectedNum.toLocaleString('en-IN')}.`
      };
    }

    case 'greater_than_or_equal': {
      const numVal = Number(userValue);
      const expectedNum = Number(rule.expectedValue);
      if (isNaN(numVal)) {
        return {
          rule,
          state: 'UNKNOWN',
          userValue,
          reason: `Invalid numeric value '${userValue}' provided for ${rule.label}.`
        };
      }
      const isMatch = numVal >= expectedNum;
      return {
        rule,
        state: isMatch ? 'MET' : 'NOT MET',
        userValue: numVal,
        reason: isMatch
          ? `Meets minimum benchmark: ${numVal} satisfies minimum cutoff of ${expectedNum}.`
          : `Below required cutoff: ${numVal} is below required minimum of ${expectedNum}.`
      };
    }

    case 'in_list': {
      const validList = Array.isArray(rule.expectedValue)
        ? (rule.expectedValue as string[]).map(v => String(v).toLowerCase())
        : [String(rule.expectedValue).toLowerCase()];
      const isMatch = validList.includes(String(userValue).toLowerCase());
      return {
        rule,
        state: isMatch ? 'MET' : 'NOT MET',
        userValue,
        reason: isMatch
          ? `Matches approved list for ${rule.label} (${userValue}).`
          : `Current ${rule.label} ('${userValue}') is not among approved categories (${validList.join(', ')}).`
      };
    }

    case 'boolean_is': {
      const boolUserVal = Boolean(userValue);
      const expectedBool = Boolean(rule.expectedValue);
      const isMatch = boolUserVal === expectedBool;
      return {
        rule,
        state: isMatch ? 'MET' : 'NOT MET',
        userValue: boolUserVal,
        reason: isMatch
          ? `Satisfies criteria: ${rule.label} matches requirement (${boolUserVal ? 'Yes' : 'No'}).`
          : `Does not satisfy criteria: requires ${expectedBool ? 'Yes' : 'No'}, but profile indicates ${boolUserVal ? 'Yes' : 'No'}.`
      };
    }

    default:
      return {
        rule,
        state: 'UNKNOWN',
        userValue,
        reason: `Unsupported rule operator '${rule.operator}'. Requires manual verification.`
      };
  }
}

/**
 * Evaluate an entire Scheme against a citizen's UserProfile
 */
export function evaluateScheme(scheme: Scheme, profile: UserProfile): SchemeEvaluation {
  const conditionsMet: RuleEvaluationResult[] = [];
  const conditionsNotMet: RuleEvaluationResult[] = [];
  const conditionsUnknown: RuleEvaluationResult[] = [];

  for (const rule of scheme.rules) {
    const result = evaluateRule(rule, profile);
    if (result.state === 'MET') {
      conditionsMet.push(result);
    } else if (result.state === 'NOT MET') {
      conditionsNotMet.push(result);
    } else {
      conditionsUnknown.push(result);
    }
  }

  // Mandatory rule check:
  // If ANY mandatory condition is NOT MET -> Scheme overall state is NOT MET
  const unmetMandatory = conditionsNotMet.filter(r => r.rule.mandatory);
  const unknownMandatory = conditionsUnknown.filter(r => r.rule.mandatory);

  let overallState: LogicalState;
  if (unmetMandatory.length > 0) {
    overallState = 'NOT MET';
  } else if (unknownMandatory.length > 0) {
    overallState = 'UNKNOWN';
  } else {
    // All mandatory conditions are MET
    overallState = 'MET';
  }

  // Calculate score percentage (0 - 100) based on verified rules
  const totalRules = scheme.rules.length;
  const scorePercentage = totalRules > 0
    ? Math.round((conditionsMet.length / totalRules) * 100)
    : 0;

  // Compute Priority & Ranking Score
  let priorityRankScore = 0;

  // Base state score
  if (overallState === 'MET') {
    priorityRankScore += 100;
  } else if (overallState === 'UNKNOWN') {
    priorityRankScore += 40;
  } else {
    priorityRankScore += 0;
  }

  // Rule match progression (+0 to 50 pts)
  priorityRankScore += Math.round(scorePercentage * 0.5);

  // User Priorities Boost (+40 pts if primary priority matches user selection)
  const userPriorities = profile.priorities || [];
  const priorityMatch = userPriorities.includes(scheme.primaryPriority);
  if (priorityMatch) {
    priorityRankScore += 40;
  }

  // Verified source trustworthiness boost (+10 pts)
  if (scheme.verificationStatus === 'verified') {
    priorityRankScore += 10;
  }

  // Generate transparent, human-readable relevance reason
  let relevanceReason = '';
  if (priorityMatch) {
    relevanceReason += `Matches your selected priority (${scheme.primaryPriority.replace('_', ' ')}). `;
  }

  if (overallState === 'MET') {
    relevanceReason += `Your profile satisfies all ${conditionsMet.length} evaluated conditions.`;
  } else if (overallState === 'UNKNOWN') {
    relevanceReason += `You meet ${conditionsMet.length} published criteria; ${conditionsUnknown.length} condition(s) require verification.`;
  } else {
    const firstUnmet = unmetMandatory[0] || conditionsNotMet[0];
    relevanceReason += `Does not meet published rule: ${firstUnmet?.rule.label || 'statutory condition'}.`;
  }

  // Identify missing profile fields needed for evaluation
  const missingProfileFields = conditionsUnknown.map(r => ({
    fieldKey: r.rule.field as keyof UserProfile,
    label: r.rule.label,
    whyNeeded: r.rule.simpleExplanation,
    associatedRuleId: r.rule.id
  }));

  // Document readiness breakdown
  const documentReadiness = {
    totalDocuments: scheme.requiredDocuments.length,
    confirmedDocuments: scheme.requiredDocuments.filter(d => d.status === 'confirmed').length,
    conditionalDocuments: scheme.requiredDocuments.filter(d => d.status === 'conditional').length,
    verificationNeededDocuments: scheme.requiredDocuments.filter(d => d.status === 'verification_needed').length
  };

  return {
    scheme,
    overallState,
    scorePercentage,
    priorityRankScore,
    relevanceReason,
    conditionsMet,
    conditionsNotMet,
    conditionsUnknown,
    missingProfileFields,
    unmetMandatoryCount: unmetMandatory.length,
    documentReadiness,
    requires_misc_check: Boolean(scheme.has_misc_conditions && scheme.misc_conditions && scheme.misc_conditions.length > 0),
    misc_conditions_to_verify: scheme.misc_conditions || [],
    why_not_explanation: unmetMandatory.length > 0
      ? `Does not meet published rule: ${unmetMandatory.map(m => m.rule.label).join('; ')}`
      : undefined
  };
}

export type SortCriteria = 'priority' | 'eligibility' | 'needs_info' | 'recent' | 'benefit';

/**
 * Evaluate all schemes and build aggregate summary with custom sorting
 */
export function evaluateAllSchemes(
  schemes: Scheme[],
  profile: UserProfile,
  sortBy: SortCriteria = 'priority'
): EvaluationSummary {
  const evaluatedSchemes = schemes.map(s => evaluateScheme(s, profile));

  // Sort schemes according to user-selected priority criteria
  evaluatedSchemes.sort((a, b) => {
    switch (sortBy) {
      case 'priority': {
        // High priority score first, then overall state
        if (b.priorityRankScore !== a.priorityRankScore) {
          return b.priorityRankScore - a.priorityRankScore;
        }
        return b.scorePercentage - a.scorePercentage;
      }
      case 'eligibility': {
        const statePriority: Record<LogicalState, number> = { MET: 3, UNKNOWN: 2, 'NOT MET': 1 };
        if (statePriority[a.overallState] !== statePriority[b.overallState]) {
          return statePriority[b.overallState] - statePriority[a.overallState];
        }
        return b.scorePercentage - a.scorePercentage;
      }
      case 'needs_info': {
        // Schemes needing most clarification first
        return b.conditionsUnknown.length - a.conditionsUnknown.length;
      }
      case 'recent': {
        return new Date(b.scheme.lastVerifiedAt).getTime() - new Date(a.scheme.lastVerifiedAt).getTime();
      }
      case 'benefit': {
        // Sort by priority rank score
        return b.priorityRankScore - a.priorityRankScore;
      }
      default:
        return b.priorityRankScore - a.priorityRankScore;
    }
  });

  const totalEligibleOrLikely = evaluatedSchemes.filter(s => s.overallState === 'MET').length;
  const totalAttentionNeeded = evaluatedSchemes.filter(s => s.overallState === 'UNKNOWN').length;
  const totalNotEligible = evaluatedSchemes.filter(s => s.overallState === 'NOT MET').length;

  // Extract unique high priority missing gap fields across all schemes
  const gapFieldMap = new Map<string, string>();
  for (const s of evaluatedSchemes) {
    if (s.overallState === 'UNKNOWN') {
      for (const m of s.missingProfileFields) {
        if (!gapFieldMap.has(m.fieldKey)) {
          gapFieldMap.set(m.fieldKey, m.label);
        }
      }
    }
  }

  return {
    evaluatedSchemes,
    totalEligibleOrLikely,
    totalAttentionNeeded,
    totalNotEligible,
    highPriorityGaps: Array.from(gapFieldMap.values())
  };
}
