import React from 'react';
import { SchemeEvaluation } from '../types/scheme';
import { Language, TRANSLATIONS } from '../data/translations';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  Calendar,
  FileText,
  BadgeAlert,
  Info
} from 'lucide-react';

interface EvidenceModalProps {
  evaluation: SchemeEvaluation | null;
  currentLang: Language;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  evaluation,
  currentLang,
  onClose
}) => {
  if (!evaluation) return null;

  const t = TRANSLATIONS[currentLang];
  const { scheme, conditionsMet, conditionsNotMet, conditionsUnknown } = evaluation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          aria-label="Close evidence panel"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-teal-400">
              Evidence-Backed Trust Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
              Why this result?
            </h2>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6">
          Every eligibility condition below is grounded in verified government notifications. No claims are hallucinated.
        </p>

        {/* Provenance Metadata Card */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Authoritative Source:</span>
            <span className="text-slate-200 font-semibold">{scheme.sourceTitle}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Source Type & Verification:</span>
            <span className="inline-flex items-center gap-1.5 text-teal-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              {scheme.sourceType} ({scheme.verificationStatus.toUpperCase()})
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Last Verified Date:</span>
            <span className="text-slate-200 font-mono flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {new Date(scheme.lastVerifiedAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* Detailed Condition-by-Condition Evidence */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Verified Eligibility Conditions ({scheme.rules.length})
          </h3>

          {scheme.rules.map(rule => {
            // Find evaluation result for this rule
            const met = conditionsMet.find(r => r.rule.id === rule.id);
            const notMet = conditionsNotMet.find(r => r.rule.id === rule.id);
            const unknown = conditionsUnknown.find(r => r.rule.id === rule.id);
            const result = met || notMet || unknown;
            const state = result ? result.state : 'UNKNOWN';

            return (
              <div
                key={rule.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-950/40 border border-slate-800/90 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-100">{rule.label}</span>
                    {rule.mandatory && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        Mandatory
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      state === 'MET'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : state === 'NOT MET'
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {state === 'MET' && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {state === 'NOT MET' && <XCircle className="h-3.5 w-3.5" />}
                    {state === 'UNKNOWN' && <HelpCircle className="h-3.5 w-3.5" />}
                    <span>{state}</span>
                  </span>
                </div>

                {/* Plain-Language Explanation */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Plain Explanation:</strong> {rule.simpleExplanation}
                </p>

                {/* System Reason for Evaluation */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <span className="text-slate-400 font-semibold block mb-0.5">Evaluation Assessment:</span>
                  {result ? result.reason : 'Pending user profile evaluation.'}
                </div>

                {/* Extracted Official Clause Quote */}
                <div className="p-3.5 rounded-xl bg-teal-950/20 border border-teal-500/20 text-xs">
                  <div className="flex items-center justify-between text-teal-400 font-semibold mb-1">
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      Official Source Citation:
                    </span>
                    <span className="text-[11px] font-mono text-teal-300/80">
                      {rule.evidenceLocation}
                    </span>
                  </div>
                  <blockquote className="italic text-slate-300 pl-2 border-l-2 border-teal-500/40">
                    "{rule.sourceEvidence}"
                  </blockquote>
                </div>
              </div>
            );
          })}
        </div>

        {/* Data Quality & Uncertainty Section */}
        {scheme.dataQualityNotes && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3 mb-6">
            <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <strong className="text-cyan-300">Data Quality & Trust Note:</strong>{' '}
              {scheme.dataQualityNotes}
            </div>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <a
            href={scheme.officialSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
          >
            <span>Verify Directly on Official Portal</span>
            <ExternalLink className="h-4 w-4" />
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all cursor-pointer"
          >
            Close Evidence Panel
          </button>
        </div>
      </div>
    </div>
  );
};
