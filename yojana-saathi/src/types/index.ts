// ============================================================
// YojanaSaathi — TypeScript Types
// All types designed for easy swap from mock data to real API.
// ============================================================

/** Supported languages */
export type Language = "en" | "hi" | "mr";

/** Translatable string */
export interface I18nString {
  en: string;
  hi?: string;
  mr?: string;
}

/** Result status for eligibility */
export type ResultStatus = "eligible" | "possibly_eligible" | "not_eligible";

/** Citizen profile collected via guided form */
export interface CitizenProfile {
  state: string | null;
  district: string | null;
  age: number | null;
  gender: "male" | "female" | "other" | null;
  annualHouseholdIncome: number | null;
  occupation: string | null;
  educationLevel: string | null;
  socialCategory: "general" | "obc" | "sc" | "st" | "ews" | null;
  disabilityStatus: boolean | null;
  isFarmer: boolean | null;
  landHoldingAcres: number | null;
  documentsAvailable: string[];
}

/** A single eligibility rule */
export interface EligibilityRule {
  id: string;
  field: string;
  operator: "eq" | "neq" | "in" | "lt" | "lte" | "gt" | "gte" | "between";
  value: string | number | boolean | (string | number)[];
  description: I18nString;
}

/** Result of checking one rule against a profile */
export interface RuleCheckResult {
  ruleId: string;
  passed: boolean | null; // null = missing info
  userValue: string | null;
  requiredValue: string;
  description: I18nString;
}

/** Overall eligibility result for one scheme */
export interface RuleEngineResult {
  schemeId: string;
  status: ResultStatus;
  matchedRules: RuleCheckResult[];
  failedRules: RuleCheckResult[];
  missingInformation: string[];
  scorePercent: number;
}

/** Document status in a checklist */
export type DocumentStatus = "available" | "missing" | "unknown" | "not_required";

/** A single document item in a checklist */
export interface DocumentChecklistItem {
  documentId: string;
  name: I18nString;
  status: DocumentStatus;
  issuingAuthority?: I18nString;
  howToGet?: I18nString;
}

/** Full checklist for a scheme */
export interface DocumentChecklist {
  schemeId: string;
  schemeName: I18nString;
  items: DocumentChecklistItem[];
  confirmedCount: number;
  totalRequired: number;
}

/** Feedback categories */
export type FeedbackType =
  | "wrong_eligibility_rule"
  | "outdated_information"
  | "broken_application_link"
  | "translation_issue"
  | "missing_document";

/** Feedback submission */
export interface FeedbackSubmission {
  schemeId: string;
  type: FeedbackType;
  comment?: string;
}

/** Government scheme */
export interface Scheme {
  scheme_id: string;
  title_en: string;
  title_hi: string;
  title_mr: string;
  department: string;
  level: "central" | "state";
  state: string | null;
  category: string;
  benefits: I18nString;
  eligibility_rules: EligibilityRule[];
  matched_rules: RuleCheckResult[];
  failed_rules: RuleCheckResult[];
  missing_information: string[];
  documents: DocumentChecklistItem[];
  official_apply_url: string;
  source_url: string;
  last_verified: string;
  result_status: ResultStatus;
}

/** Form step configuration */
export interface FormStep {
  id: string;
  title: I18nString;
  fields: FormField[];
}

/** Form field configuration */
export interface FormField {
  name: keyof CitizenProfile;
  label: I18nString;
  type: "text" | "number" | "select" | "radio" | "checkbox" | "multi-select";
  options?: { value: string; label: I18nString }[];
  required: boolean;
  helperText?: I18nString;
  placeholder?: I18nString;
}
