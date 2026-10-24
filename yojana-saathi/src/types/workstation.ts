// ============================================================
// YojanaSaathi — Workstation TypeScript Contracts
// ============================================================

export type Language = "en" | "hi" | "mr";

export interface I18nText {
  en: string;
  hi: string;
  mr: string;
}

export type WorkstationMode = "volunteer" | "kiosk";

export type MatchTier = "ELIGIBLE" | "NEAR_MISS" | "PARTIAL_MATCH" | "INELIGIBLE";

export type RuleStatus = "PASSED" | "FAILED" | "MISSING_INFO";

export type GenderType = "female" | "male" | "other";

export type RationCardType = "none" | "apl" | "bpl" | "antyodaya";

export type SocialCategoryType = "general" | "obc" | "sc" | "st" | "ews";

export interface CitizenProfileState {
  age: number | null;
  gender: GenderType | null;
  state: string | null;
  annualHouseholdIncome: number | null;
  occupation: string | null;
  landHoldingAcres: number | null;
  rationCard: RationCardType | null;
  socialCategory: SocialCategoryType | null;
  hasPuccaHouse: boolean | null;
  documentsAvailable: string[];
}

export interface RuleCitation {
  page: string | number;
  clause: string;
  grNumber?: string;
  sourceUrl?: string;
}

export interface SchemeRule {
  id: string;
  field: keyof CitizenProfileState;
  operator: "eq" | "neq" | "lte" | "lt" | "gte" | "gt" | "between" | "in";
  value: string | number | boolean | Array<string | number>;
  fixable: boolean;
  description: I18nText;
  citation: RuleCitation;
}

export interface DocumentInfo {
  id: string;
  name: I18nText;
  issuingAuthority: I18nText;
  howToGet: I18nText;
  prerequisites: string[]; // IDs of prerequisite documents
}

export interface SchemeData {
  id: string;
  title: I18nText;
  department: I18nText;
  level: "Central" | "State (Maharashtra)";
  category: "Women Welfare" | "Agriculture" | "Housing" | "Artisans & MSME" | "Education";
  benefitSummary: I18nText;
  monthlyOrYearlyAmount?: string;
  rules: SchemeRule[];
  documents: DocumentInfo[];
  officialApplyUrl: string;
  sourceGuidelinesUrl: string;
  lastVerifiedDate: string;
  verificationStatus: "verified" | "draft";
  dependsOn?: string[]; // Prerequisite scheme IDs (e.g., Namo Shetkari depends on PM-KISAN)
}

export interface RuleCheckResult {
  ruleId: string;
  field: keyof CitizenProfileState;
  status: RuleStatus;
  userValue: string | null;
  requiredValue: string;
  fixable: boolean;
  description: I18nText;
  citation: RuleCitation;
}

export interface SchemeEvaluation {
  scheme: SchemeData;
  tier: MatchTier;
  scorePercent: number;
  checks: RuleCheckResult[];
  missingFields: (keyof CitizenProfileState)[];
  unlockHint?: I18nText;
  blockedByDependency?: string;
}

export interface NextBestQuestion {
  field: keyof CitizenProfileState;
  title: I18nText;
  helperText: I18nText;
  impactScore: number; // How many non-ineligible schemes this resolves
  options?: { value: string; label: I18nText }[];
}

export interface DemoPersona {
  id: string;
  name: string;
  tagline: I18nText;
  profile: CitizenProfileState;
  targetSchemeUnlocked: string;
}
