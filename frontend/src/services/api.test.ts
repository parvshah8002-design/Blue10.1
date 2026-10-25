import { describe, it, expect, vi } from 'vitest';
import { schemeNavigatorApi, SchemeNavigatorApiClient } from './api';
import { UserProfile } from '../types/scheme';

describe('Scheme Eligibility Navigator API Client & Contracts', () => {
  it('correctly defaults base URL to http://localhost:8000', () => {
    const client = new SchemeNavigatorApiClient();
    expect(client.getBaseUrl()).toBe('http://localhost:8000');
  });

  it('converts frontend UserProfile into exact backend UserProfile JSON schema', () => {
    const profile: UserProfile = {
      age: 24,
      gender: 'male',
      state: 'Maharashtra',
      annualFamilyIncome: 120000,
      socialCategory: 'General',
      occupation: 'farmer',
      ownsCultivableLand: true
    };

    const backendPayload = schemeNavigatorApi.toBackendUserProfile(profile);
    expect(backendPayload).toEqual({
      age: 24,
      gender: 'male',
      state: 'Maharashtra',
      annual_income_inr: 120000,
      category: 'general',
      marital_status: 'single',
      is_farmer: true,
      is_student: false,
      is_pwd: false,
      is_bpl: false
    });
  });

  it('evaluates Two-Tier Progressive Filtering with deterministic offline fallback', async () => {
    const profile: UserProfile = {
      age: 24,
      gender: 'male',
      state: 'Maharashtra',
      annualFamilyIncome: 120000,
      socialCategory: 'General',
      occupation: 'farmer',
      ownsCultivableLand: true,
      isTaxPayer: false
    };

    const result = await schemeNavigatorApi.checkEligibility(profile);
    expect(result.total_evaluated).toBeGreaterThan(0);
    expect(result.results.length).toBe(result.total_evaluated);

    // Verify Two-Tier structure
    const pmKisan = result.results.find(r => r.scheme_id === 'pm-kisan');
    expect(pmKisan).toBeDefined();
    expect(pmKisan?.tier_1_passed).toBe(true);
    expect(pmKisan?.tier).toBe('eligible');
    expect(pmKisan?.tier_2_score_percent).toBeGreaterThan(0);
  });

  it('supports single and bulk scraping contracts with valid SchemeSchema output', async () => {
    const scraped = await schemeNavigatorApi.scrapeSingle('https://myscheme.gov.in/schemes/pm-kisan', true);
    expect(scraped.scheme_id).toBe('pm-kisan');
    expect(scraped.title_en).toBeDefined();
    expect(scraped.department).toBeDefined();

    const bulk = await schemeNavigatorApi.scrapeBulk([
      'https://myscheme.gov.in/schemes/pm-kisan',
      'https://myscheme.gov.in/schemes/pm-svanidhi'
    ], true);
    expect(bulk.total).toBe(2);
    expect(bulk.scraped.length).toBe(2);
  });

  it('shortlists schemes based on natural language citizen need', async () => {
    const res = await schemeNavigatorApi.suggestSchemes('Small farmer needing yearly income support');
    expect(res.query).toBe('Small farmer needing yearly income support');
    expect(res.understood_needs.length).toBeGreaterThan(0);
    expect(res.extracted_profile_hints.is_farmer).toBe(true);
    expect(res.recommendations.length).toBeGreaterThan(0);
    expect(res.recommendations[0].relevance_score).toBeGreaterThanOrEqual(0.65);
    expect(res.recommendations[0].why_recommended).toBeDefined();
  });
});
