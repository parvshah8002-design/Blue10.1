import React from 'react';
import { SchemeEvaluation, UserProfile } from '../types/scheme';
import { Language, TRANSLATIONS } from '../data/translations';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  FileQuestion,
  Sparkles
} from 'lucide-react';

interface GapAnalyzerModalProps {
  evaluation: SchemeEvaluation | null;
  currentLang: Language;
  onClose: () => void;
  onUpdateProfileField: (key: keyof UserProfile, val: any) => void;
}

export const GapAnalyzerModal: React.FC<GapAnalyzerModalProps> = ({
  evaluation,
  currentLang,
  onClose,
  onUpdateProfileField
}) => {
  if (!evaluation) return null;

  const t = TRANSLATIONS[currentLang];
  const { scheme, overallState, conditionsMet, conditionsNotMet, conditionsUnknown } = evaluation;

  // Calculate gaps
  const missingFields = conditionsUnknown;
  const unmetMandatory = conditionsNotMet.filter(c => c.rule.mandatory);
  const totalGaps = missingFields.length + unmetMandatory.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          aria-label="Close gap analyzer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Actionable Gap Analyzer
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
              What is missing?
            </h2>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6">
          Specific missing information, unmet mandatory criteria, and suggested actions to progress your application for{' '}
          <strong className="text-white">{scheme.name}</strong>.
        </p>

        {/* Gap Summary Progress Bar */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 mb-6">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300">
              Resolved Criteria: {conditionsMet.length} of {scheme.rules.length} verified conditions
            </span>
            <span className="text-teal-400 font-mono">
              {evaluation.scorePercentage}% Progress
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${evaluation.scorePercentage}%` }}
            />
          </div>
        </div>

        {/* Section 1: Missing Profile Information */}
        {missingFields.length > 0 && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-300 uppercase tracking-wider">
              <FileQuestion className="h-4 w-4" />
              <span>Missing Profile Information ({missingFields.length})</span>
            </div>
            <p className="text-xs text-slate-400">
              You haven’t entered these details in your profile. Providing them enables an instant eligibility decision.
            </p>

            <div className="space-y-3">
              {missingFields.map(gap => (
                <div
                  key={gap.rule.id}
                  className="p-4 rounded-2xl bg-slate-950/50 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-amber-400 shrink-0" />
                      <span className="text-sm font-semibold text-white">{gap.rule.label}</span>
                      {gap.rule.mandatory && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{gap.rule.simpleExplanation}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 italic">
                      Official Source: {gap.rule.evidenceLocation}
                    </p>
                  </div>

                  {/* Inline Action to Resolve Gap */}
                  <div className="shrink-0">
                    <button
                      onClick={onClose}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>Update in Profile</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Unmet Mandatory Criteria */}
        {unmetMandatory.length > 0 && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-rose-400 uppercase tracking-wider">
              <XCircle className="h-4 w-4" />
              <span>Unmet Mandatory Criteria ({unmetMandatory.length})</span>
            </div>
            <p className="text-xs text-slate-400">
              The information in your profile contradicts these official published conditions.
            </p>

            <div className="space-y-3">
              {unmetMandatory.map(unmet => (
                <div
                  key={unmet.rule.id}
                  className="p-4 rounded-2xl bg-slate-950/50 border border-rose-500/20"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-rose-300">{unmet.rule.label}</span>
                    <span className="text-xs text-rose-400 font-mono font-medium">Contradicted</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-2">{unmet.reason}</p>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                    <strong>Suggested Action:</strong> If your profile details were entered in error, click 'Edit Profile' to correct them. Otherwise, this scheme cannot be claimed under current rules.
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: All Criteria Satisfied state */}
        {totalGaps === 0 && (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-base font-bold text-white mb-1">
              No Eligibility Gaps Identified!
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              You appear to satisfy all published conditions evaluated by SchemeSaathi. Next, prepare your required documents.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
