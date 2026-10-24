import React from 'react';
import { Scheme } from '../types/scheme';
import { Language, TRANSLATIONS } from '../data/translations';
import {
  X,
  ExternalLink,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface OfficialNextStepsModalProps {
  scheme: Scheme | null;
  currentLang: Language;
  onClose: () => void;
}

export const OfficialNextStepsModal: React.FC<OfficialNextStepsModalProps> = ({
  scheme,
  currentLang,
  onClose
}) => {
  if (!scheme) return null;

  const t = TRANSLATIONS[currentLang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          aria-label="Close next steps panel"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-teal-400">
              Official Application Workflow
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
              Official Next Steps
            </h2>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6">
          Step-by-step instructions to proceed with your application for{' '}
          <strong className="text-white">{scheme.name}</strong>.
        </p>

        {/* Nodal Authority Card */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 mb-6 space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <span className="text-slate-400">Department / Ministry:</span>
            <span className="text-slate-200 font-semibold">{scheme.ministryOrDepartment}</span>
          </div>

          {scheme.deadlineNote && (
            <div className="flex items-start gap-2 text-amber-300 pt-2 border-t border-slate-800">
              <Calendar className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                <strong>Application Timeline:</strong> {scheme.deadlineNote}
              </span>
            </div>
          )}
        </div>

        {/* Step-by-Step Application Guide */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Preparation & Submission Sequence
          </h3>

          {scheme.applicationSteps.map(step => (
            <div
              key={step.stepNumber}
              className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-start gap-3.5"
            >
              <div className="h-7 w-7 rounded-xl bg-teal-500/10 text-teal-400 font-bold font-mono text-sm flex items-center justify-center shrink-0 mt-0.5 border border-teal-500/20">
                {step.stepNumber}
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-sm font-bold text-slate-100">{step.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
                {step.verifiedUrl && (
                  <div className="pt-1.5">
                    <a
                      href={step.verifiedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 font-medium"
                    >
                      <span>Open Verified Portal Link</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust & Application Advisory */}
        <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/20 text-xs text-slate-300 mb-6 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-teal-300 block mb-0.5">Application Security Reminder:</strong>
            Only apply through official <code className="text-teal-200">.gov.in</code> or <code className="text-teal-200">.nic.in</code> domains. Never pay fees to private agents or intermediaries. Government scholarships and DBT registrations do not charge commission fees.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          {scheme.officialApplicationUrl ? (
            <a
              href={scheme.officialApplicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-teal-500/20"
            >
              <span>Go to Official Application Portal</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <span className="text-xs text-slate-500">
              Direct application portal link pending verification.
            </span>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
