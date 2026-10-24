import React, { useState } from 'react';
import { SchemeEvaluation, LogicalState } from '../types/scheme';
import { Language, TRANSLATIONS, getSchemeText } from '../data/translations';
import { speechService } from '../utils/speech';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  FileText,
  AlertTriangle,
  Volume2,
  VolumeX,
  FileCheck2,
  Building2,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface SchemeCardProps {
  evaluation: SchemeEvaluation;
  currentLang: Language;
  onOpenEvidence: (evaluation: SchemeEvaluation) => void;
  onOpenGaps: (evaluation: SchemeEvaluation) => void;
  onOpenDocuments: (evaluation: SchemeEvaluation) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  evaluation,
  currentLang,
  onOpenEvidence,
  onOpenGaps,
  onOpenDocuments
}) => {
  const t = TRANSLATIONS[currentLang];
  const { scheme, overallState, conditionsMet, conditionsNotMet, conditionsUnknown } = evaluation;
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [viewWording, setViewWording] = useState<'simple' | 'official'>('simple');

  const sInfo = getSchemeText(scheme.id, currentLang, {
    name: scheme.name,
    simpleDescription: scheme.simpleDescription,
    benefit: scheme.benefitAmountOrDescription,
    ministry: scheme.ministryOrDepartment
  });

  // Handle Text-to-speech for regional accessibility
  const handleToggleSpeech = () => {
    if (isAudioPlaying) {
      speechService.stop();
      setIsAudioPlaying(false);
    } else {
      const summaryText = `${sInfo.name}। ${sInfo.benefit}। ${
        overallState === 'MET' ? t.statusLikelyEligible : overallState === 'NOT MET' ? t.statusNotEligible : t.statusNeedsInfo
      }।`;

      const started = speechService.speak(summaryText, currentLang, () => {
        setIsAudioPlaying(false);
      });
      if (started) {
        setIsAudioPlaying(true);
      }
    }
  };

  // State styling helper
  const getStateBadge = (state: LogicalState) => {
    switch (state) {
      case 'MET':
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
          dot: 'bg-emerald-400',
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />,
          label: t.statusLikelyEligible || 'Likely Eligible (Conditions Met)'
        };
      case 'NOT MET':
        return {
          bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
          dot: 'bg-rose-400',
          icon: <XCircle className="h-4 w-4 text-rose-400 shrink-0" />,
          label: t.statusNotEligible || 'Not Eligible (Published Rules Unmet)'
        };
      case 'UNKNOWN':
      default:
        return {
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
          dot: 'bg-amber-400',
          icon: <HelpCircle className="h-4 w-4 text-amber-400 shrink-0" />,
          label: t.statusNeedsInfo || 'Needs Information (Verification Pending)'
        };
    }
  };

  const badge = getStateBadge(overallState);
  const isStateScheme = Boolean(
    scheme.rules?.some(r => r.field === 'state') ||
    (scheme as any).scheme_type === 'state' ||
    (scheme as any).scheme_type === 'State'
  );

  const cardBorderClass =
    overallState === 'MET'
      ? 'border-emerald-500/30 hover:border-emerald-400/70 hover:shadow-[0_0_28px_-4px_rgba(52,211,153,0.22)]'
      : overallState === 'NOT MET'
      ? 'border-amber-500/40 hover:border-amber-400/80 hover:shadow-[0_0_24px_-4px_rgba(245,158,11,0.25)]'
      : 'border-slate-800 hover:border-slate-700 hover:shadow-[0_0_24px_-4px_rgba(45,212,191,0.18)]';

  return (
    <div className={`rounded-3xl bg-slate-900/80 border ${cardBorderClass} p-6 sm:p-7 shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col justify-between`}>
      <div>
        {/* Top Header: Authority, Central/State Level & Eligibility State Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Building2 className="h-3.5 w-3.5 text-teal-400 shrink-0" />
            <span className="truncate max-w-xs">{sInfo.ministry}</span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-xs shrink-0 ${
                isStateScheme
                  ? 'bg-purple-950/60 text-purple-300 border-purple-800/60'
                  : 'bg-sky-950/60 text-sky-300 border-sky-800/60'
              }`}
            >
              {isStateScheme ? '📍 State Scheme' : '🏛️ Central Scheme'}
            </span>
          </div>

          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold shadow-xs ${badge.bg}`}>
            {badge.icon}
            <span>{badge.label}</span>
          </div>
        </div>

        {/* Scheme Name & Tagline */}
        <h3 className="text-xl font-bold text-white mb-2 leading-tight font-heading group-hover:text-teal-200 transition-colors">
          {sInfo.name}
        </h3>
        {currentLang !== 'en' && sInfo.name !== scheme.name && (
          <p className="text-xs font-medium text-slate-400 mb-2 font-mono">
            Official: {scheme.name}
          </p>
        )}

        {/* Benefit Highlight Box — Prominent Accent Styling */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-500/15 via-emerald-500/10 to-teal-500/5 border border-teal-500/30 mb-4 flex items-center justify-between gap-3 shadow-xs">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
              Direct Benefit Support
            </div>
            <div className="text-sm sm:text-base font-extrabold text-emerald-300 font-mono tracking-tight mt-0.5">
              {scheme.benefitAmountOrDescription}
            </div>
          </div>
          <button
            onClick={handleToggleSpeech}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              isAudioPlaying
                ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40 animate-pulse'
                : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:text-teal-400 hover:border-teal-500/40'
            }`}
            title={isAudioPlaying ? t.stopListening : t.listenToResults}
          >
            {isAudioPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>

        {/* Near-Miss / "Why Not" Callout: Amber border, Failed Criteria Tags & Gemma Explainability */}
        {conditionsNotMet.length > 0 && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-2 shadow-xs animate-fadeIn">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>Why Not Eligible Yet (Near Miss)</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-200 border border-amber-700/60">
                {conditionsNotMet.length} Criteria Missing
              </span>
            </div>

            {/* Clean Tags for Failed Criteria */}
            <div className="space-y-1.5 pt-0.5">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Unmet Criteria:</span>
              <div className="flex flex-wrap gap-1.5">
                {conditionsNotMet.map((c, cIdx) => (
                  <span
                    key={cIdx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-amber-500/50 text-amber-200 text-[11px] font-semibold shadow-xs"
                  >
                    <XCircle className="h-3 w-3 text-rose-400 shrink-0" />
                    <span>{c.rule.label}: <span className="font-normal text-amber-300/80">{c.reason}</span></span>
                  </span>
                ))}
              </div>
            </div>

            {/* Gemma Explainability Diff */}
            <div className="pt-1 text-[11px] text-amber-200 leading-relaxed bg-amber-950/60 p-2.5 rounded-xl border border-amber-800/50 flex items-start gap-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-100">Gemma Explainability: </strong>
                {evaluation.why_not_explanation || `To qualify, your profile needs to fulfill: ${conditionsNotMet.map(c => c.rule.label).join(', ')}.`}
              </div>
            </div>
          </div>
        )}

        {/* Tier-2 Quick Final Check (Mint-Green Callout Box) */}
        {scheme.has_misc_conditions && scheme.misc_conditions && scheme.misc_conditions.length > 0 && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-300">
              <Sparkles className="h-3.5 w-3.5 text-teal-400" />
              <span>Quick Final Check (Self-Verification)</span>
            </div>
            <p className="text-[11px] text-teal-300/90 leading-tight">
              Please verify statutory exclusions applicable to this scheme:
            </p>
            <div className="space-y-1.5 pt-1">
              {scheme.misc_conditions.map((cond, cIdx) => (
                <div
                  key={cIdx}
                  className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/80 border border-teal-500/20 text-[11px] text-teal-100"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>{cond}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explanation Toggle & Description */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Description:</span>
            <div className="inline-flex rounded-lg bg-slate-950 border border-slate-800 p-0.5 text-[11px]">
              <button
                onClick={() => setViewWording('simple')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  viewWording === 'simple' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Simple
              </button>
              <button
                onClick={() => setViewWording('official')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  viewWording === 'official' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Official
              </button>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {viewWording === 'simple' ? scheme.simpleDescription : scheme.officialSummary}
          </p>
        </div>

        {/* 3-State Condition Summary Metrics */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 mb-5 text-center">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="text-base font-extrabold text-emerald-400 font-mono">
              {conditionsMet.length}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Conditions Met</div>
          </div>

          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30">
            <div className="text-base font-extrabold text-rose-400 font-mono">
              {conditionsNotMet.length}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Unmet Criteria</div>
          </div>

          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="text-base font-extrabold text-amber-400 font-mono">
              {conditionsUnknown.length}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Pending Data</div>
          </div>
        </div>

        {/* Responsible Anti-Hallucination Disclaimer Line */}
        <p className="text-[11px] text-slate-400 italic mb-6 leading-tight">
          "Based on your profile, you appear to meet published conditions. Remaining conditions require verification."
        </p>
      </div>

      {/* Action Footer Buttons */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Why this result? button */}
          <button
            onClick={() => onOpenEvidence(evaluation)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-teal-500/15 border border-teal-500/35 hover:bg-teal-500/25 text-teal-300 font-bold text-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{t.whyThisResult.split('(')[0]}</span>
          </button>

          {/* What is missing? button */}
          <button
            onClick={() => onOpenGaps(evaluation)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/35 hover:bg-amber-500/25 text-amber-300 font-bold text-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>{t.whatIsMissing.split('(')[0]}</span>
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          {/* Document Checklist trigger */}
          <button
            onClick={() => onOpenDocuments(evaluation)}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-teal-300 font-semibold cursor-pointer transition-colors"
          >
            <FileCheck2 className="h-4 w-4 text-teal-400" />
            <span>Documents ({scheme.requiredDocuments.length})</span>
          </button>

          {/* Real Official External Source Link */}
          <a
            href={scheme.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-medium"
            title="Open official government portal in new window"
          >
            <span>{t.officialSource}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
