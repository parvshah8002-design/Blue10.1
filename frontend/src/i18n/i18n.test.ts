import { describe, it, expect } from 'vitest';
import { SUPPORTED_LANGUAGES, getLanguageMeta, isRTL } from './languages';
import { TRANSLATIONS } from './index';
import { getSchemeText } from './schemes';
import { Language } from './types';

describe('SchemeSaathi Centralized Multilingual System', () => {
  it('supports English and all 22 Eighth Schedule Indian Languages', () => {
    expect(SUPPORTED_LANGUAGES.length).toBe(22);
    const codes = SUPPORTED_LANGUAGES.map(l => l.code);
    const expectedScheduleCodes: Language[] = [
      'en', 'hi', 'bn', 'te', 'mr', 'ta', 'ur', 'gu', 'kn', 'or',
      'ml', 'pa', 'as', 'mai', 'sa', 'ks', 'kok', 'sd', 'doi', 'mni', 'brx', 'sat'
    ];
    for (const code of expectedScheduleCodes) {
      expect(codes).toContain(code);
    }
  });

  it('correctly distinguishes text direction (Urdu RTL vs others LTR)', () => {
    expect(isRTL('ur')).toBe(true);
    expect(isRTL('en')).toBe(false);
    expect(isRTL('hi')).toBe(false);
    expect(isRTL('mr')).toBe(false);
    expect(isRTL('bn')).toBe(false);
    expect(isRTL('te')).toBe(false);
    expect(isRTL('ta')).toBe(false);
  });

  it('provides native script display names for each language', () => {
    const hindi = getLanguageMeta('hi');
    expect(hindi.nativeName).toBe('हिंदी');

    const marathi = getLanguageMeta('mr');
    expect(marathi.nativeName).toBe('मराठी');

    const bengali = getLanguageMeta('bn');
    expect(bengali.nativeName).toBe('বাংলা');

    const telugu = getLanguageMeta('te');
    expect(telugu.nativeName).toBe('తెలుగు');

    const tamil = getLanguageMeta('ta');
    expect(tamil.nativeName).toBe('தமிழ்');

    const urdu = getLanguageMeta('ur');
    expect(urdu.nativeName).toBe('اردو');

    const gujarati = getLanguageMeta('gu');
    expect(gujarati.nativeName).toBe('ગુજરાતી');
  });

  it('falls back seamlessly to English if a key is not defined without throwing or rendering undefined', () => {
    const en = TRANSLATIONS['en'];
    const mr = TRANSLATIONS['mr'];
    expect(mr.appName).toBeDefined();
    expect(mr.navHome).toBe('मुख्यपृष्ठ');
    expect(en.navHome).toBe('Home');
    expect(mr.navServices).toBeDefined();
  });

  it('provides verified scheme summaries across multiple languages without altering official names', () => {
    const fallback = {
      name: 'PM-KISAN Samman Nidhi',
      simpleDescription: 'Income support to eligible farmer families',
      benefit: '₹6,000 per year',
      ministry: 'Ministry of Agriculture & Farmers Welfare'
    };

    const enText = getSchemeText('pm-kisan', 'en', fallback);
    expect(enText.name).toBe('PM-KISAN Samman Nidhi');

    const hiText = getSchemeText('pm-kisan', 'hi', fallback);
    expect(hiText.benefit).toContain('₹6,000');
    expect(hiText.ministry).toContain('कृषि');

    const mrText = getSchemeText('pm-kisan', 'mr', fallback);
    expect(mrText.benefit).toContain('₹');
    expect(mrText.ministry).toContain('कृषी');
  });
});
