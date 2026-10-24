export type Language =
  | 'en' // English
  | 'hi' // Hindi (हिंदी)
  | 'bn' // Bengali (বাংলা)
  | 'te' // Telugu (తెలుగు)
  | 'mr' // Marathi (मराठी)
  | 'ta' // Tamil (தமிழ்)
  | 'ur' // Urdu (اردو) - RTL
  | 'gu' // Gujarati (ગુજરાતી)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'or' // Odia (ଓଡ଼ିଆ)
  | 'ml' // Malayalam (മലയാളം)
  | 'pa' // Punjabi (ਪੰਜਾਬੀ)
  | 'as' // Assamese (অসমীয়া)
  | 'mai' // Maithili (मैथिली)
  | 'sa' // Sanskrit (संस्कृतम्)
  | 'ks' // Kashmiri (कॉशुर)
  | 'kok' // Konkani (कोंकणी)
  | 'sd' // Sindhi (सिन्धी)
  | 'doi' // Dogri (डोगरी)
  | 'mni' // Manipuri (মেইতেই)
  | 'brx' // Bodo (बड़ो)
  | 'sat'; // Santali (संताली)

export interface LanguageMeta {
  code: Language;
  name: string;
  nativeName: string;
  script: string;
  dir: 'ltr' | 'rtl';
  bcp47: string;
  status: 'ready' | 'preview';
}

export interface SchemeTextTranslation {
  name: string;
  simpleDescription: string;
  benefit: string;
  ministry: string;
}

export interface Translations {
  // App brand & header
  appName: string;
  appTagline: string;
  publicPortal: string;
  citizenAssistanceNotice: string;
  zeroDataStorage: string;
  noAadhaar: string;

  // Navigation
  navHome: string;
  navHowItWorks: string;
  navServices: string;
  navTrust: string;
  navCivicTerms: string;
  navDashboard: string;
  navSignIn: string;
  navSignUp: string;
  navSignOut: string;
  navProfile: string;

  // Hero Section
  heroBadge: string;
  heroHeadline: string;
  heroHeadlineHighlight: string;
  heroSubtitle: string;
  findBenefitsBtn: string;
  howItWorksBtn: string;
  trustClear: string;
  trustOfficial: string;
  trustPersonalized: string;

  // How It Works Section
  howItWorksHeading: string;
  howItWorksSubheading: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  // Services Section
  servicesHeading: string;
  servicesSubheading: string;
  feat1Title: string;
  feat1Desc: string;
  feat2Title: string;
  feat2Desc: string;
  feat3Title: string;
  feat3Desc: string;

  // Trust & Data Policy Section
  trustHeading: string;
  trustSubheading: string;
  policy1Title: string;
  policy1Desc: string;
  policy2Title: string;
  policy2Desc: string;
  policy3Title: string;
  policy3Desc: string;

  // CTA Section
  ctaHeading: string;
  ctaDesc: string;

  // Auth Page
  authCreateAccount: string;
  authSignIn: string;
  authSignupSub: string;
  authLoginSub: string;
  authPrototypeNotice: string;
  authFullName: string;
  authFullNamePlaceholder: string;
  authEmail: string;
  authPassword: string;
  authConfirmPassword: string;
  authRememberMe: string;
  authSimulatedSession: string;
  authTerms: string;
  authCreateAccountBtn: string;
  authSignInBtn: string;
  authQuickDemo: string;
  authStudentAccount: string;
  authFarmerAccount: string;
  authAlreadyRegistered: string;
  authNewCitizen: string;

  // Profile Wizard
  wizardStep: string;
  wizardStepOf: string;
  wizardTitle: string;
  wizardSub: string;
  step1TitleLong: string;
  ageLabel: string;
  ageWhy: string;
  stateLabel: string;
  stateWhy: string;
  districtLabel: string;
  socialCategoryLabel: string;
  socialCategoryWhy: string;
  selectState: string;
  selectCategory: string;
  step2TitleLong: string;
  occupationPrompt: string;
  educationDetails: string;
  educationLevelLabel: string;
  selectEducationLevel: string;
  percentileLabel: string;
  percentileWhy: string;
  regularCourseCheck: string;
  step3TitleLong: string;
  familyIncomeLabel: string;
  familyIncomeWhy: string;
  taxPayerPrompt: string;
  selectTaxStatus: string;
  taxPayerNo: string;
  taxPayerYes: string;
  taxPayerWhy: string;
  ownsLandCheck: string;
  step4TitleLong: string;
  prioritiesPrompt: string;
  step5TitleLong: string;
  reviewPrompt: string;
  demographicsReview: string;
  occupationReview: string;
  incomeReview: string;
  prioritiesReview: string;
  privacyGuaranteeTitle: string;
  privacyGuaranteeText: string;
  btnContinue: string;
  btnBack: string;
  btnCancel: string;
  btnDiscover: string;

  // Dashboard & Benefits Results
  personalizedPortalTitle: string;
  activeSession: string;
  dashboardHeadline: string;
  dashboardSub: string;
  btnEditProfilePriorities: string;
  quickSwitchPersona: string;
  likelyEligibleTitle: string;
  likelyEligibleSubtitle: string;
  needsInfoTitle: string;
  needsInfoSubtitle: string;
  criteriaUnmetTitle: string;
  criteriaUnmetSubtitle: string;
  searchPlaceholder: string;
  sortByLabel: string;
  sortHighestPriority: string;
  sortMaxFinancial: string;
  sortEasiestProcess: string;
  allSchemesFilter: string;
  formatGrid: string;
  formatStacked: string;
  schemesFound: string;
  btnViewDetails: string;
  btnCompare: string;
  btnComparing: string;
  noMatchingSchemes: string;
  btnResetFilters: string;
  compareBannerText: string;
  btnCompareNow: string;
  btnClearCompare: string;
  benefitLabel: string;
  verifiedLabel: string;

  // Scheme Details View
  backToDashboardBtn: string;
  listenAudioBtn: string;
  stopAudioBtn: string;
  wordingSimpleBtn: string;
  wordingOfficialBtn: string;
  printChecklistBtn: string;
  copyChecklistBtn: string;
  copiedSuccessText: string;
  questionsHeading: string;
  q1Title: string;
  q2Title: string;
  q3Title: string;
  q4Title: string;
  q5Title: string;
  q6Title: string;
  q7Title: string;
  q8Title: string;
  eligibilityRulesHeading: string;
  statusMetBadge: string;
  statusNotMetBadge: string;
  statusUnknownBadge: string;
  mandatoryReq: string;
  optionalReq: string;
  yourAnswerLabel: string;
  notProvidedLabel: string;
  updateFieldPrompt: string;
  whyThisRuleMatches: string;
  officialGazetteEvidence: string;
  documentsHeading: string;
  docProgressLabel: string;
  docReadyBadge: string;
  docMissingBadge: string;
  authorityLabel: string;
  howToObtainLabel: string;
  digilockerBadge: string;
  applicationStepsHeading: string;
  visitOfficialPortalCTA: string;
  statutoryWarningDisclaimer: string;

  // Modals & Comparison
  glossaryModalHeading: string;
  glossaryModalSub: string;
  glossarySearchPlaceholder: string;
  glossaryContextLabel: string;
  glossaryActionLabel: string;
  closeBtn: string;
  comparisonHeading: string;
  comparisonSub: string;
  schemeTitleCol: string;
  ministryCol: string;
  directFinancialBenefitCol: string;
  keyConditionsCol: string;
  applicationModeCol: string;
  actionCol: string;

  // Footer
  footerMission: string;
  footerVerificationPortals: string;
  footerCitizenResources: string;
  footerStatutoryNoticeTitle: string;
  disclaimerText: string;
  privacyBadge: string;
  footerCopyright: string;
  footerAccessibilityTagline: string;

  // Additional fields for complete interface localization
  searchSchemesPlaceholder: string;
  schemesForYouTitle: string;
  schemesForYouSub: string;
  printChecklist: string;
  copyChecklist: string;
  copiedSuccess: string;
  stopListening: string;
  listenToResults: string;
  whyThisResult: string;
  whatIsMissing: string;
  officialSource: string;

  // Extra UI tokens for full coverage
  statusLikelyEligible: string;
  statusNotEligible: string;
  statusNeedsInfo: string;
  filterPriorityLabel: string;
  allPriorities: string;
  clearBtn: string;
  citizenLabel: string;
  glossaryBadge: string;
  glossaryTitle: string;
  contextLabel: string;
  actionLabel: string;
  closeGlossary: string;
  schemeFoundSingular: string;
  schemeFoundPlural: string;
  backToBenefitsDashboard: string;
  readSummaryAloud: string;
  plainLanguageExplanation: string;
  officialGazetteLanguage: string;
  verifiedBenefitAmount: string;
  officialSourceDoc: string;
  verificationStatus: string;
  lastVerified: string;
  mandatory: string;
  optional: string;
  plainExplanation: string;
  evaluationAssessment: string;
  selectLanguage: string;
  searchLanguages: string;
  majorCitizenLanguages: string;
  allScheduledLanguages: string;
  fullSupportBadge: string;
  previewBadge: string;
}
