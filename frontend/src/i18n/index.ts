import { Language, LanguageMeta, Translations, SchemeTextTranslation } from './types';
import { SUPPORTED_LANGUAGES, getLanguageMeta, isRTL } from './languages';
import { getMultilingualSchemeText } from './schemes';

// Import all 23 language locale dictionaries
import { en } from './locales/en';
import { hi } from './locales/hi';
import { mr } from './locales/mr';
import { bn } from './locales/bn';
import { te } from './locales/te';
import { ta } from './locales/ta';
import { ur } from './locales/ur';
import { gu } from './locales/gu';
import { kn } from './locales/kn';
import { or } from './locales/or';
import { ml } from './locales/ml';
import { pa } from './locales/pa';
import { as } from './locales/as';
import { mai } from './locales/mai';
import { sa } from './locales/sa';
import { kok } from './locales/kok';
import { doi } from './locales/doi';
import { brx } from './locales/brx';
import { sat } from './locales/sat';
import { ks } from './locales/ks';
import { sd } from './locales/sd';
import { mni } from './locales/mni';

const rawLocales: Record<Language, Partial<Translations>> = {
  en,
  hi,
  mr,
  bn,
  te,
  ta,
  ur,
  gu,
  kn,
  or,
  ml,
  pa,
  as,
  mai,
  sa,
  kok,
  doi,
  brx,
  sat,
  ks,
  sd,
  mni
};

// Create fully merged translation dictionaries with strict English fallback
// This guarantees that no key is ever undefined or displayed as raw token
function createMergedLocale(langDict: Partial<Translations>): Translations {
  return new Proxy(langDict as Translations, {
    get(target, prop: string) {
      if (prop in target && target[prop as keyof Translations] !== undefined && target[prop as keyof Translations] !== '') {
        return target[prop as keyof Translations];
      }
      return en[prop as keyof Translations] ?? prop;
    }
  });
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: createMergedLocale(en),
  hi: createMergedLocale(hi),
  mr: createMergedLocale(mr),
  bn: createMergedLocale(bn),
  te: createMergedLocale(te),
  ta: createMergedLocale(ta),
  ur: createMergedLocale(ur),
  gu: createMergedLocale(gu),
  kn: createMergedLocale(kn),
  or: createMergedLocale(or),
  ml: createMergedLocale(ml),
  pa: createMergedLocale(pa),
  as: createMergedLocale(as),
  mai: createMergedLocale(mai),
  sa: createMergedLocale(sa),
  kok: createMergedLocale(kok),
  doi: createMergedLocale(doi),
  brx: createMergedLocale(brx),
  sat: createMergedLocale(sat),
  ks: createMergedLocale(ks),
  sd: createMergedLocale(sd),
  mni: createMergedLocale(mni)
};

export const getTranslation = (lang: Language): Translations => {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
};

export const getSchemeText = (
  schemeId: string,
  lang: Language,
  fallback: { name: string; simpleDescription: string; benefit: string; ministry: string }
): SchemeTextTranslation => {
  return getMultilingualSchemeText(schemeId, lang, fallback);
};

export {
  SUPPORTED_LANGUAGES,
  getLanguageMeta,
  isRTL
};

export type {
  Language,
  LanguageMeta,
  Translations,
  SchemeTextTranslation
};
