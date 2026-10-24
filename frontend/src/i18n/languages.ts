import { Language, LanguageMeta } from './types';

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    dir: 'ltr',
    bcp47: 'en-IN',
    status: 'ready'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    script: 'Devanagari',
    dir: 'ltr',
    bcp47: 'hi-IN',
    status: 'ready'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    dir: 'ltr',
    bcp47: 'bn-IN',
    status: 'ready'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    dir: 'ltr',
    bcp47: 'te-IN',
    status: 'ready'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    dir: 'ltr',
    bcp47: 'mr-IN',
    status: 'ready'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    dir: 'ltr',
    bcp47: 'ta-IN',
    status: 'ready'
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    script: 'Perso-Arabic',
    dir: 'rtl',
    bcp47: 'ur-IN',
    status: 'ready'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    dir: 'ltr',
    bcp47: 'gu-IN',
    status: 'ready'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    dir: 'ltr',
    bcp47: 'kn-IN',
    status: 'ready'
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    dir: 'ltr',
    bcp47: 'or-IN',
    status: 'ready'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    dir: 'ltr',
    bcp47: 'ml-IN',
    status: 'ready'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    dir: 'ltr',
    bcp47: 'pa-IN',
    status: 'ready'
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'Bengali-Assamese',
    dir: 'ltr',
    bcp47: 'as-IN',
    status: 'ready'
  },
  {
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    script: 'Devanagari',
    dir: 'ltr',
    bcp47: 'mai-IN',
    status: 'ready'
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    script: 'Devanagari',
    dir: 'ltr',
    bcp47: 'sa-IN',
    status: 'ready'
  },
  {
    code: 'ks',
    name: 'Kashmiri',
    nativeName: 'कॉशुर / کٲشُر',
    script: 'Devanagari / Perso-Arabic',
    dir: 'ltr',
    bcp47: 'ks-IN',
    status: 'preview'
  },
  {
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    script: 'Devanagari',
    dir: 'ltr',
    bcp47: 'kok-IN',
    status: 'ready'
  },
  {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'सिन्धी / سنڌي',
    script: 'Devanagari / Perso-Arabic',
    dir: 'ltr',
    bcp47: 'sd-IN',
    status: 'preview'
  },
  {
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    script: 'Devanagari',
    dir: 'ltr',
    bcp47: 'doi-IN',
    status: 'ready'
  },
  {
    code: 'mni',
    name: 'Manipuri (Meitei)',
    nativeName: 'মেইতেই / মৈতৈলোন্',
    script: 'Bengali / Meitei Mayek',
    dir: 'ltr',
    bcp47: 'mni-IN',
    status: 'preview'
  },
  {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बड़ो',
    script: 'Devanagari',
    dir: 'ltr',
    bcp47: 'brx-IN',
    status: 'ready'
  },
  {
    code: 'sat',
    name: 'Santali',
    nativeName: 'संताली',
    script: 'Ol Chiki / Devanagari',
    dir: 'ltr',
    bcp47: 'sat-IN',
    status: 'ready'
  }
];

export const getLanguageMeta = (lang: Language): LanguageMeta => {
  return SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];
};

export const isRTL = (lang: Language): boolean => {
  return getLanguageMeta(lang).dir === 'rtl';
};
