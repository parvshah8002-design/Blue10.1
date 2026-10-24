/**
 * SchemeSaathi Type Definitions
 * Strict typing for deterministic eligibility evaluation, evidence provenance, and document readiness.
 */

export type LogicalState = 'MET' | 'NOT MET' | 'UNKNOWN';

export type BeneficiaryGroup = 'students' | 'farmers' | 'youth' | 'women' | 'workers' | 'all';

export type UserPriority =
  | 'scholarships'
  | 'employment_skills'
  | 'farming'
  | 'micro_credit'
  | 'financial_aid';

export type RuleOperator =
  | 'equals'
  | 'not_equals'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'in_list'
  | 'not_in_list'
  | 'boolean_is';

export interface EligibilityRule {
  id: string;
  field: string;
  label: string;
  operator: RuleOperator;
  expectedValue: string | number | boolean | string[];
  mandatory: boolean;
  officialWording: string;
  simpleExplanation: string;
  sourceEvidence: string;
  evidenceLocation: string; // e.g. "Section 3.1, Page 4"
  verificationStatus: 'verified' | 'needs_review';
  uncertaintyNotes?: string;
}

export interface RequiredDocument {
  id: string;
  name: string;
  category: 'identity' | 'income' | 'academic' | 'category' | 'residence' | 'land';
  whyRequired: string;
  status: 'confirmed' | 'conditional' | 'verification_needed';
  officialIssuingAuthority: string;
  howToObtain: string;
  digilockerAvailable: boolean;
  verifiedSourceRef: string;
}

export interface Scheme {
  id: string;
  name: string;
  hindiName?: string;
  ministryOrDepartment: string;
  beneficiaryGroup: BeneficiaryGroup;
  primaryPriority: UserPriority;
  tagline: string;
  simpleDescription: string;
  officialSummary: string;
  benefitAmountOrDescription: string;
  officialSourceUrl: string;
  officialApplicationUrl?: string;
  sourceTitle: string;
  sourceType: 'Official Notification Guidelines' | 'Central Ministry Portal' | 'National Scheme Guidelines';
  lastVerifiedAt: string; // ISO date string
  verificationStatus: 'verified' | 'needs_review';
  dataQualityNotes: string;
  rules: EligibilityRule[];
  requiredDocuments: RequiredDocument[];
  applicationSteps: {
    stepNumber: number;
    title: string;
    description: string;
    verifiedUrl?: string;
  }[];
  deadlineNote?: string;
  // Two-Tier Miscellaneous conditions
  has_misc_conditions?: boolean;
  misc_conditions?: string[];
}

export interface UserProfile {
  age?: number;
  gender?: 'female' | 'male' | 'other' | 'prefer_not_to_say';
  state?: string;
  district?: string;
  socialCategory?: 'SC' | 'ST' | 'OBC' | 'General' | 'EWS';
  annualFamilyIncome?: number; // In Indian Rupees (INR)
  occupation?: 'student' | 'employed' | 'unemployed' | 'farmer' | 'self_employed' | 'apprentice_seeker';
  educationLevel?:
  | 'below_10th'
  | '10th_pass'
  | '12th_pass'
  | 'diploma'
  | 'undergraduate'
  | 'postgraduate';
  currentCourse?: string;
  institutionType?: string;
  percentile12thOrMarks?: number; // e.g. 85 for 85 percentile / percentage
  ownsCultivableLand?: boolean;
  isTaxPayer?: boolean;
  enrolledInRegularCourse?: boolean;
  priorities?: UserPriority[];
  // Direct occupation/status flags (set by occupation card selection in ProfileWizard)
  is_student?: boolean;
  is_farmer?: boolean;
  is_bpl?: boolean;
  is_pwd?: boolean;
  marital_status?: 'single' | 'married' | 'widowed' | 'divorced';
  needs_description?: string | null;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  isDemo: boolean;
  savedSchemeIds: string[];
  profileCompleted: boolean;
}

export interface RuleEvaluationResult {
  rule: EligibilityRule;
  state: LogicalState;
  userValue: any;
  reason: string;
}

export interface SchemeEvaluation {
  scheme: Scheme;
  overallState: LogicalState;
  scorePercentage: number;
  priorityRankScore: number;
  relevanceReason: string;
  conditionsMet: RuleEvaluationResult[];
  conditionsNotMet: RuleEvaluationResult[];
  conditionsUnknown: RuleEvaluationResult[];
  missingProfileFields: {
    fieldKey: keyof UserProfile;
    label: string;
    whyNeeded: string;
    associatedRuleId: string;
  }[];
  unmetMandatoryCount: number;
  documentReadiness: {
    totalDocuments: number;
    confirmedDocuments: number;
    conditionalDocuments: number;
    verificationNeededDocuments: number;
  };
  // Two-Tier Miscellaneous conditions
  requires_misc_check?: boolean;
  misc_conditions_to_verify?: string[];
  why_not_explanation?: string;
}

export interface EvaluationSummary {
  evaluatedSchemes: SchemeEvaluation[];
  totalEligibleOrLikely: number;
  totalAttentionNeeded: number;
  totalNotEligible: number;
  highPriorityGaps: string[];
}

export type AppView =
  | 'landing'
  | 'login'
  | 'signup'
  | 'onboarding'
  | 'dashboard'
  | 'scheme_detail'
  | 'compare';
