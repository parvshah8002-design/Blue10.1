import { describe, it, expect } from 'vitest';
import { evaluateRule, evaluateScheme, evaluateAllSchemes } from './evaluator';
import { EligibilityRule, Scheme, UserProfile } from '../types/scheme';
import { VERIFIED_SCHEMES } from '../data/schemes';
import { DEMO_PERSONAS } from '../data/personas';

describe('SchemeSaathi Deterministic Eligibility Engine', () => {
  const sampleIncomeRule: EligibilityRule = {
    id: 'test-income-rule',
    field: 'annualFamilyIncome',
    label: 'Income Ceiling',
    operator: 'less_than_or_equal',
    expectedValue: 250000,
    mandatory: true,
    officialWording: 'Income must not exceed ₹2,50,000.',
    simpleExplanation: 'Household income must be ₹2.5 Lakh or lower.',
    sourceEvidence: 'Official Guidelines Section 4',
    evidenceLocation: 'Page 3',
    verificationStatus: 'verified'
  };

  const sampleAgeRule: EligibilityRule = {
    id: 'test-age-rule',
    field: 'age',
    label: 'Minimum Age',
    operator: 'greater_than_or_equal',
    expectedValue: 14,
    mandatory: true,
    officialWording: 'Must have completed 14 years of age.',
    simpleExplanation: 'You must be at least 14 years old.',
    sourceEvidence: 'Apprentices Act Section 3',
    evidenceLocation: 'Section 3',
    verificationStatus: 'verified'
  };

  const sampleCategoryRule: EligibilityRule = {
    id: 'test-caste-rule',
    field: 'socialCategory',
    label: 'Caste Category',
    operator: 'equals',
    expectedValue: 'SC',
    mandatory: true,
    officialWording: 'Open to Scheduled Caste students only.',
    simpleExplanation: 'Must belong to Scheduled Caste.',
    sourceEvidence: 'Guidelines Section 4.1',
    evidenceLocation: 'Page 2',
    verificationStatus: 'verified'
  };

  describe('Rule Evaluation: 3-State Logic & Missing Data Handling', () => {
    it('returns UNKNOWN when a profile field is missing (never assumes eligibility)', () => {
      const emptyProfile: UserProfile = {};
      const result = evaluateRule(sampleIncomeRule, emptyProfile);
      expect(result.state).toBe('UNKNOWN');
      expect(result.userValue).toBeUndefined();
    });

    it('returns UNKNOWN when a profile field is empty string or null', () => {
      const profileWithNull = { annualFamilyIncome: null } as any;
      const result = evaluateRule(sampleIncomeRule, profileWithNull);
      expect(result.state).toBe('UNKNOWN');
    });

    it('returns MET when income satisfies the ceiling', () => {
      const profile: UserProfile = { annualFamilyIncome: 180000 };
      const result = evaluateRule(sampleIncomeRule, profile);
      expect(result.state).toBe('MET');
      expect(result.userValue).toBe(180000);
    });

    it('returns NOT MET when income contradicts the ceiling', () => {
      const profile: UserProfile = { annualFamilyIncome: 300000 };
      const result = evaluateRule(sampleIncomeRule, profile);
      expect(result.state).toBe('NOT MET');
    });

    it('handles exact boundary values for income ceiling', () => {
      // Exactly at the ceiling (250,000) -> MET
      const boundaryAt = evaluateRule(sampleIncomeRule, { annualFamilyIncome: 250000 });
      expect(boundaryAt.state).toBe('MET');

      // 1 Rupee over the ceiling (250,001) -> NOT MET
      const boundaryOver = evaluateRule(sampleIncomeRule, { annualFamilyIncome: 250001 });
      expect(boundaryOver.state).toBe('NOT MET');
    });

    it('handles exact boundary values for age requirement', () => {
      // Age 14 -> MET
      const age14 = evaluateRule(sampleAgeRule, { age: 14 });
      expect(age14.state).toBe('MET');

      // Age 13 -> NOT MET
      const age13 = evaluateRule(sampleAgeRule, { age: 13 });
      expect(age13.state).toBe('NOT MET');

      // Age 15 -> MET
      const age15 = evaluateRule(sampleAgeRule, { age: 15 });
      expect(age15.state).toBe('MET');
    });

    it('handles invalid non-numeric inputs gracefully as UNKNOWN', () => {
      const invalidAge = evaluateRule(sampleAgeRule, { age: 'invalid_text' as any });
      expect(invalidAge.state).toBe('UNKNOWN');
      expect(invalidAge.reason).toContain('Invalid numeric value');
    });

    it('evaluates category matches case-insensitively and returns NOT MET on mismatch', () => {
      const scProfile: UserProfile = { socialCategory: 'SC' };
      const obcProfile: UserProfile = { socialCategory: 'OBC' };

      expect(evaluateRule(sampleCategoryRule, scProfile).state).toBe('MET');
      expect(evaluateRule(sampleCategoryRule, obcProfile).state).toBe('NOT MET');
    });
  });

  describe('Full Scheme Evaluation with Mandatory vs Optional Rules', () => {
    it('evaluates Priya Sharma as MET for Central Sector Scholarship (CSSS)', () => {
      const priya = DEMO_PERSONAS.find(p => p.id === 'priya-merit-student')!;
      const csssScheme = VERIFIED_SCHEMES.find(s => s.id === 'pm-usp-csss')!;

      const evaluation = evaluateScheme(csssScheme, priya.profile);
      expect(evaluation.overallState).toBe('MET');
      expect(evaluation.unmetMandatoryCount).toBe(0);
      expect(evaluation.conditionsMet.length).toBe(4);
    });

    it('evaluates Priya Sharma as NOT MET for SC Scholarship due to category mismatch', () => {
      const priya = DEMO_PERSONAS.find(p => p.id === 'priya-merit-student')!;
      const scScheme = VERIFIED_SCHEMES.find(s => s.id === 'post-matric-sc')!;

      const evaluation = evaluateScheme(scScheme, priya.profile);
      expect(evaluation.overallState).toBe('NOT MET');
      expect(evaluation.conditionsNotMet.some(c => c.rule.field === 'socialCategory')).toBe(true);
    });

    it('evaluates Rameshwar Patel as MET for PM-KISAN', () => {
      const ramesh = DEMO_PERSONAS.find(p => p.id === 'ramesh-farmer')!;
      const kisanScheme = VERIFIED_SCHEMES.find(s => s.id === 'pm-kisan')!;

      const evaluation = evaluateScheme(kisanScheme, ramesh.profile);
      expect(evaluation.overallState).toBe('MET');
      expect(evaluation.conditionsMet.some(c => c.rule.field === 'ownsCultivableLand')).toBe(true);
    });

    it('evaluates incomplete profile as UNKNOWN without falsifying eligibility', () => {
      const incomplete = DEMO_PERSONAS.find(p => p.id === 'incomplete-profile')!;
      const csssScheme = VERIFIED_SCHEMES.find(s => s.id === 'pm-usp-csss')!;

      const evaluation = evaluateScheme(csssScheme, incomplete.profile);
      expect(evaluation.overallState).toBe('UNKNOWN');
      expect(evaluation.missingProfileFields.length).toBeGreaterThan(0);
      // Missing info must NEVER be recorded as met
      expect(evaluation.conditionsMet.length).toBe(0);
    });

    it('evaluates all schemes across personas and correctly prioritizes results', () => {
      const rahul = DEMO_PERSONAS.find(p => p.id === 'rahul-sc-scholar')!;
      const summary = evaluateAllSchemes(VERIFIED_SCHEMES, rahul.profile);

      expect(summary.evaluatedSchemes.length).toBe(5);
      // SC scheme should be at the top with MET
      expect(summary.evaluatedSchemes[0].scheme.id).toBe('post-matric-sc');
      expect(summary.evaluatedSchemes[0].overallState).toBe('MET');
    });
  });
});
