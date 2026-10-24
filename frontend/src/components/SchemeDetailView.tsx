import React, { useState } from 'react';
import { Scheme, SchemeEvaluation, UserProfile } from '../types/scheme';
import { Language, TRANSLATIONS, getSchemeText } from '../data/translations';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  FileText,
  FileCheck2,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Volume2,
  VolumeX,
  Info
} from 'lucide-react';
import { speechService } from '../utils/speech';

interface SchemeDetailViewProps {
  scheme: Scheme;
  evaluation: SchemeEvaluation;
  profile: UserProfile;
  currentLang: Language;
  onBack: () => void;
  onUpdateProfileField: (key: keyof UserProfile, val: any) => void;
}

export const SchemeDetailView: React.FC<SchemeDetailViewProps> = ({
  scheme,
  evaluation,
  profile,
  currentLang,
  onBack,
  onUpdateProfileField
}) => {
  const t = TRANSLATIONS[currentLang];
  const [wordingMode, setWordingMode] = useState<'simple' | 'official'>('simple');
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const sInfo = getSchemeText(scheme.id, currentLang, {
    name: scheme.name,
    simpleDescription: scheme.simpleDescription,
    benefit: scheme.benefitAmountOrDescription,
    ministry: scheme.ministryOrDepartment
  });

  const toggleDoc = (id: string) => {
    setCheckedDocs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalDocs = scheme.requiredDocuments.length;
  const readyDocsCount = Object.values(checkedDocs).filter(Boolean).length;
  const progressPercent = totalDocs > 0 ? Math.round((readyDocsCount / totalDocs) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const lines = [
      `SchemeSaathi Official Document Readiness Checklist`,
      `Scheme: ${sInfo.name}`,
      `Ministry: ${sInfo.ministry}`,
      `Ready: ${readyDocsCount}/${totalDocs} documents (${progressPercent}%)`,
      `--------------------------------------------------`,
      ...scheme.requiredDocuments.map((doc, idx) => {
        const status = checkedDocs[doc.id] ? '[✓] READY' : '[ ] MISSING';
        return `${idx + 1}. ${status}: ${doc.name}\n   Authority: ${doc.officialIssuingAuthority}\n   How to obtain: ${doc.howToObtain}`;
      }),
      `--------------------------------------------------`,
      `Official Portal: ${scheme.officialSourceUrl}`
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAudio = () => {
    if (isAudioPlaying) {
      speechService.stop();
      setIsAudioPlaying(false);
    } else {
      const text = currentLang === 'hi'
        ? `${sInfo.name}। ${sInfo.simpleDescription}। पात्रता स्थिति: ${
            evaluation.overallState === 'MET' ? 'संभावित पात्र' : evaluation.overallState === 'NOT MET' ? 'अपात्र' : 'सत्यापन शेष'
          }। ${evaluation.conditionsMet.length} शर्तें पूरी हैं और ${evaluation.conditionsUnknown.length} शर्तें जांची जानी बाकी हैं।`
        : `${sInfo.name}. ${sInfo.simpleDescription} Overall eligibility: ${
            evaluation.overallState === 'MET' ? 'Likely Eligible' : evaluation.overallState === 'NOT MET' ? 'Not Eligible' : 'Needs Information'
          }. ${evaluation.conditionsMet.length} conditions met, and ${evaluation.conditionsUnknown.length} require verification.`;
      const started = speechService.speak(text, currentLang, () => setIsAudioPlaying(false));
      if (started) setIsAudioPlaying(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#F5F8FC]">
      {/* Top Back Navigation & Controls */}
      <div className="no-print flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#E1E7EF] hover:border-[#173B67] text-xs font-bold text-[#173B67] cursor-pointer transition-all shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.backToDashboardBtn}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Audio Reader */}
          <button
            onClick={handleAudio}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              isAudioPlaying
                ? 'bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA] animate-pulse'
                : 'bg-white text-[#173B67] border border-[#E1E7EF] hover:bg-[#F5F8FC]'
            }`}
            title={t.readSummaryAloud}
          >
            {isAudioPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* Mode Switcher */}
          <div className="inline-flex rounded-lg bg-white border border-[#E1E7EF] p-0.5 text-xs">
            <button
              onClick={() => setWordingMode('simple')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                wordingMode === 'simple'
                  ? 'bg-[#173B67] text-white'
                  : 'text-[#667085] hover:text-[#263445]'
              }`}
            >
              {t.wordingSimpleBtn}
            </button>
            <button
              onClick={() => setWordingMode('official')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                wordingMode === 'official'
                  ? 'bg-[#173B67] text-white'
                  : 'text-[#667085] hover:text-[#263445]'
              }`}
            >
              {t.wordingOfficialBtn}
            </button>
          </div>
        </div>
      </div>

      {/* Scheme Hero Header Card */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#E1E7EF] shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#667085] font-semibold">
            <Building2 className="h-4 w-4 text-[#168A83]" />
            <span>{sInfo.ministry}</span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-bold ${
              evaluation.overallState === 'MET'
                ? 'bg-[#ECFDF3] text-[#027A48] border-[#ABEFC6]'
                : evaluation.overallState === 'NOT MET'
                ? 'bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]'
                : 'bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]'
            }`}
          >
            {evaluation.overallState === 'MET' && <CheckCircle2 className="h-3.5 w-3.5" />}
            {evaluation.overallState === 'NOT MET' && <XCircle className="h-3.5 w-3.5" />}
            {evaluation.overallState === 'UNKNOWN' && <HelpCircle className="h-3.5 w-3.5" />}
            <span>
              {evaluation.overallState === 'MET'
                ? t.statusLikelyEligible
                : evaluation.overallState === 'NOT MET'
                ? t.statusNotEligible
                : t.statusNeedsInfo}
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B67] font-heading">
          {sInfo.name}
        </h1>

        <div className="p-4 rounded-lg bg-[#EAF2FA] border border-[#CBDFF5] text-xs sm:text-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#173B67] block mb-0.5">
            {t.verifiedBenefitAmount}
          </span>
          <span className="font-bold text-[#173B67]">
            {sInfo.benefit}
          </span>
        </div>

        {/* Provenance Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-[#667085]">
          <div>
            <span className="block text-[#98A2B3]">
              {t.officialSourceDoc}
            </span>
            <span className="text-[#263445] font-semibold">{scheme.sourceTitle}</span>
          </div>
          <div>
            <span className="block text-[#98A2B3]">
              {t.verificationStatus}
            </span>
            <span className="text-[#027A48] font-mono font-bold">100% {scheme.verificationStatus.toUpperCase()}</span>
          </div>
          <div>
            <span className="block text-[#98A2B3]">
              {t.lastVerified}
            </span>
            <span className="text-[#263445] font-mono font-medium">
              {new Date(scheme.lastVerifiedAt).toLocaleDateString(currentLang, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION: EXPLAIN IT SIMPLY (The 8 Key Questions) */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#E1E7EF] shadow-xs space-y-6">
        <div className="border-b border-[#E1E7EF] pb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#173B67] font-heading flex items-center gap-2">
            <Info className="h-4 w-4 text-[#168A83]" />
            <span>{t.questionsHeading}</span>
          </h2>
          <span className="text-xs text-[#667085] font-semibold">
            {wordingMode === 'simple'
              ? t.plainLanguageExplanation
              : t.officialGazetteLanguage}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
          {/* Q1: What is this scheme? */}
          <div className="p-4 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF] space-y-1.5">
            <div className="font-bold text-[#173B67]">
              {t.q1Title}
            </div>
            <p className="text-[#263445] leading-relaxed">
              {wordingMode === 'simple' ? sInfo.simpleDescription : scheme.officialSummary}
            </p>
          </div>

          {/* Q2: Who is it for? */}
          <div className="p-4 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF] space-y-1.5">
            <div className="font-bold text-[#173B67]">
              {t.q2Title}
            </div>
            <p className="text-[#263445] leading-relaxed">
              {scheme.beneficiaryGroup}
            </p>
          </div>

          {/* Q3: What benefits does it provide? */}
          <div className="p-4 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF] space-y-1.5">
            <div className="font-bold text-[#173B67]">
              {t.q3Title}
            </div>
            <p className="text-[#263445] leading-relaxed">
              {sInfo.benefit}
            </p>
          </div>

          {/* Q4: Why might it be relevant to me? */}
          <div className="p-4 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF] space-y-1.5">
            <div className="font-bold text-[#173B67]">
              {t.q4Title}
            </div>
            <p className="text-[#263445] leading-relaxed">
              {evaluation.relevanceReason}
            </p>
          </div>

          {/* Q5: What are the published conditions? */}
          <div className="p-4 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF] space-y-1.5">
            <div className="font-bold text-[#173B67]">
              {t.q5Title}
            </div>
            <p className="text-[#263445] leading-relaxed">
              {evaluation.conditionsMet.length} / {scheme.rules.length} {t.statusMetBadge}
            </p>
          </div>

          {/* Q6: What information is still missing? */}
          <div className="p-4 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF] space-y-1.5">
            <div className="font-bold text-[#173B67]">
              {t.q6Title}
            </div>
            <p className="text-[#263445] leading-relaxed">
              {evaluation.conditionsUnknown.length > 0
                ? `${evaluation.conditionsUnknown.length} ${t.statusNeedsInfo}: ${evaluation.conditionsUnknown.map(c => c.rule.label).join(', ')}`
                : t.statusLikelyEligible}
            </p>
          </div>

          {/* Q7: What documents are required? */}
          <div className="p-4 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF] space-y-1.5">
            <div className="font-bold text-[#173B67]">
              {t.q7Title}
            </div>
            <p className="text-[#263445] leading-relaxed">
              {scheme.requiredDocuments.length} {t.documentsHeading}
            </p>
          </div>

          {/* Q8: How do I proceed? */}
          <div className="p-4 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF] space-y-1.5">
            <div className="font-bold text-[#173B67]">
              {t.q8Title}
            </div>
            <p className="text-[#263445] leading-relaxed">
              {t.applicationStepsHeading}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION: ELIGIBILITY BREAKDOWN & EVIDENCE */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#E1E7EF] shadow-xs space-y-6">
        <div className="border-b border-[#E1E7EF] pb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#173B67] font-heading flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#168A83]" />
            <span>{t.eligibilityRulesHeading}</span>
          </h2>
          <span className="text-xs text-[#173B67] font-bold">
            {evaluation.conditionsMet.length} / {scheme.rules.length} {t.statusMetBadge}
          </span>
        </div>

        <div className="space-y-4">
          {scheme.rules.map(rule => {
            const met = evaluation.conditionsMet.find(r => r.rule.id === rule.id);
            const notMet = evaluation.conditionsNotMet.find(r => r.rule.id === rule.id);
            const unknown = evaluation.conditionsUnknown.find(r => r.rule.id === rule.id);
            const res = met || notMet || unknown;
            const state = res ? res.state : 'UNKNOWN';

            return (
              <div
                key={rule.id}
                className="p-5 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF] space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#173B67]">{rule.label}</span>
                    {rule.mandatory && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]">
                        {t.mandatory}
                      </span>
                    )}
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                      state === 'MET'
                        ? 'bg-[#ECFDF3] text-[#027A48] border border-[#ABEFC6]'
                        : state === 'NOT MET'
                        ? 'bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]'
                        : 'bg-[#FFFAEB] text-[#B54708] border border-[#FEDF89]'
                    }`}
                  >
                    {state === 'MET' && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {state === 'NOT MET' && <XCircle className="h-3.5 w-3.5" />}
                    {state === 'UNKNOWN' && <HelpCircle className="h-3.5 w-3.5" />}
                    <span>
                      {state === 'MET'
                        ? t.statusMetBadge
                        : state === 'NOT MET'
                        ? t.statusNotMetBadge
                        : t.statusUnknownBadge}
                    </span>
                  </span>
                </div>

                <p className="text-xs text-[#263445] leading-relaxed">
                  <strong>{t.plainExplanation}</strong> {rule.simpleExplanation}
                </p>

                <div className="p-3 rounded-md bg-white border border-[#E1E7EF] text-xs text-[#263445]">
                  <span className="text-[#667085] font-semibold block mb-0.5">
                    {t.evaluationAssessment}
                  </span>
                  {res?.reason || t.statusNeedsInfo}
                </div>

                {/* Official Source Excerpt */}
                <div className="p-3 rounded-md bg-[#EAF2FA] border border-[#CBDFF5] text-xs">
                  <div className="flex items-center justify-between text-[#173B67] font-bold mb-1">
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-[#168A83]" />
                      {t.officialGazetteEvidence}
                    </span>
                    <span className="text-[11px] font-mono text-[#667085]">
                      {rule.evidenceLocation}
                    </span>
                  </div>
                  <blockquote className="italic text-[#263445] pl-2 border-l-2 border-[#173B67]">
                    "{rule.sourceEvidence}"
                  </blockquote>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION: TWO-TIER MISCELLANEOUS CONDITIONS (Step 2 Self-Verification) */}
      {scheme.has_misc_conditions && scheme.misc_conditions && scheme.misc_conditions.length > 0 && (
        <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#E1E7EF] shadow-xs space-y-4">
          <div className="border-b border-[#E1E7EF] pb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#173B67] font-heading flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#168A83]" />
              <span>Two-Tier Verification: Miscellaneous Conditions & Exclusions</span>
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-bold">
              Tier 2 Verification Check
            </span>
          </div>
          <p className="text-xs text-[#667085] leading-relaxed">
            In addition to statutory demographic criteria, this scheme specifies additional statutory exclusions. Verify whether each statement applies to your household:
          </p>
          <div className="space-y-3 pt-1">
            {scheme.misc_conditions.map((cond, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-teal-50/60 border border-teal-200/70 flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-teal-950">{cond}</div>
                  <div className="text-[11px] text-[#667085] mt-0.5">Self-certified condition required before final DBT grant disbursement.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: DOCUMENT READINESS ASSISTANT */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#E1E7EF] shadow-xs space-y-6">
        <div className="border-b border-[#E1E7EF] pb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#173B67] font-heading flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-[#168A83]" />
              <span>{t.documentsHeading}</span>
            </h2>
            <p className="text-xs text-[#667085] mt-0.5">
              {t.docProgressLabel}
            </p>
          </div>

          <div className="no-print flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF] hover:bg-[#EAF2FA] text-xs font-bold text-[#173B67] cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>{t.printChecklistBtn}</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF] hover:bg-[#EAF2FA] text-xs font-bold text-[#173B67] cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#027A48]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? t.copiedSuccessText : t.copyChecklistBtn}</span>
            </button>
          </div>
        </div>

        {/* Readiness Progress Bar */}
        <div className="p-4 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF]">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-[#263445]">
              {t.docProgressLabel}: {readyDocsCount} / {totalDocs} ({progressPercent}%)
            </span>
            <span className="text-[#168A83] font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#E1E7EF] overflow-hidden">
            <div
              className="h-full bg-[#168A83] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Document Checklist Items */}
        <div className="space-y-3">
          {scheme.requiredDocuments.map(doc => {
            const isReady = !!checkedDocs[doc.id];
            return (
              <div
                key={doc.id}
                className={`p-4 rounded-lg border transition-all ${
                  isReady
                    ? 'bg-[#ECFDF3] border-[#ABEFC6]'
                    : 'bg-[#F5F8FC] border-[#E1E7EF]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={`doc-detail-${doc.id}`}
                    checked={isReady}
                    onChange={() => toggleDoc(doc.id)}
                    className="h-4 w-4 rounded border-[#CBD5E1] text-[#173B67] focus:ring-[#173B67] mt-1 cursor-pointer shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label
                        htmlFor={`doc-detail-${doc.id}`}
                        className={`text-xs font-bold cursor-pointer ${
                          isReady ? 'text-[#027A48] line-through' : 'text-[#173B67]'
                        }`}
                      >
                        {doc.name}
                      </label>
                      {doc.digilockerAvailable && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#EAF2FA] text-[#173B67] border border-[#CBDFF5]">
                          {t.digilockerBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#263445]">
                      <strong>{t.whyThisRuleMatches}:</strong> {doc.whyRequired}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 text-[#667085]">
                      <div>
                        <span>{t.authorityLabel}: </span>
                        <span className="text-[#263445] font-semibold">{doc.officialIssuingAuthority}</span>
                      </div>
                      <div>
                        <span>{t.howToObtainLabel}: </span>
                        <span className="text-[#168A83] font-semibold">{doc.howToObtain}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION: OFFICIAL APPLICATION INSTRUCTIONS */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-[#E1E7EF] shadow-xs space-y-6">
        <div className="border-b border-[#E1E7EF] pb-3">
          <h2 className="text-lg font-bold text-[#173B67] font-heading flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-[#168A83]" />
            <span>{t.applicationStepsHeading}</span>
          </h2>
          <p className="text-xs text-[#667085] mt-0.5">
            {t.applicationStepsHeading}
          </p>
        </div>

        <div className="space-y-3">
          {scheme.applicationSteps.map(step => (
            <div
              key={step.stepNumber}
              className="p-4 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF] flex items-start gap-3.5"
            >
              <div className="h-7 w-7 rounded-lg bg-[#EAF2FA] text-[#173B67] font-bold font-mono text-xs flex items-center justify-center shrink-0 border border-[#CBDFF5] mt-0.5">
                {step.stepNumber}
              </div>
              <div className="flex-1 space-y-1 text-xs">
                <div className="font-bold text-[#173B67] text-sm">{step.title}</div>
                <p className="text-[#263445] leading-relaxed">{step.description}</p>
                {step.verifiedUrl && (
                  <a
                    href={step.verifiedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#173B67] hover:underline font-bold pt-1"
                  >
                    <span>{t.officialSource}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="p-6 rounded-xl bg-[#EAF2FA] border border-[#CBDFF5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#173B67]">
              {t.visitOfficialPortalCTA}
            </div>
            <div className="text-xs text-[#667085] mt-0.5">
              {t.statutoryWarningDisclaimer}
            </div>
          </div>

          <a
            href={scheme.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#173B67] hover:bg-[#112C4E] text-white font-bold text-xs tracking-wide shadow-xs transition-all cursor-pointer shrink-0"
          >
            <span>{t.visitOfficialPortalCTA}</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
