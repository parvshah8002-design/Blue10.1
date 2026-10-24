import React, { useState } from 'react';
import { SchemeEvaluation, RequiredDocument } from '../types/scheme';
import { Language, TRANSLATIONS } from '../data/translations';
import {
  X,
  FileCheck2,
  Printer,
  Copy,
  Check,
  Download,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface DocumentReadinessModalProps {
  evaluation: SchemeEvaluation | null;
  currentLang: Language;
  onClose: () => void;
}

export const DocumentReadinessModal: React.FC<DocumentReadinessModalProps> = ({
  evaluation,
  currentLang,
  onClose
}) => {
  if (!evaluation) return null;

  const t = TRANSLATIONS[currentLang];
  const { scheme } = evaluation;

  // Track user-checked documents
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleDoc = (docId: string) => {
    setCheckedDocs(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  };

  const totalDocs = scheme.requiredDocuments.length;
  const readyCount = Object.values(checkedDocs).filter(Boolean).length;
  const progressPercent = totalDocs > 0 ? Math.round((readyCount / totalDocs) * 100) : 0;

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Copy checklist function
  const handleCopy = () => {
    const textLines = [
      `SchemeSaathi Document Readiness Checklist`,
      `Scheme: ${scheme.name}`,
      `Generated Date: ${new Date().toLocaleDateString('en-IN')}`,
      `Readiness Progress: ${readyCount}/${totalDocs} documents prepared (${progressPercent}%)`,
      `--------------------------------------------------`,
      ...scheme.requiredDocuments.map((doc, idx) => {
        const isReady = checkedDocs[doc.id] ? '[✓] READY' : '[ ] MISSING';
        return `${idx + 1}. ${isReady}: ${doc.name}\n   Status: ${doc.status.toUpperCase()} | Authority: ${doc.officialIssuingAuthority}\n   How to obtain: ${doc.howToObtain}`;
      }),
      `--------------------------------------------------`,
      `Note: Official verification and final acceptance is subject to the respective application authority.`
    ];

    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="no-print absolute top-6 right-6 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          aria-label="Close document readiness panel"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <FileCheck2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-teal-400">
              Document Readiness Assistant
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
              Official Document Checklist
            </h2>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-4">
          Verified documents required for{' '}
          <strong className="text-white">{scheme.name}</strong>. Mark the ones you already have.
        </p>

        {/* Progress Bar & Summary */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 mb-6">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300">
              Readiness Status: {readyCount} of {totalDocs} Documents Ready
            </span>
            <span className="text-teal-400 font-mono font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Document Cards */}
        <div className="space-y-4 mb-6">
          {scheme.requiredDocuments.map(doc => {
            const isChecked = !!checkedDocs[doc.id];
            return (
              <div
                key={doc.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isChecked
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-slate-950/40 border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <input
                    type="checkbox"
                    id={`doc-${doc.id}`}
                    checked={isChecked}
                    onChange={() => toggleDoc(doc.id)}
                    className="h-5 w-5 rounded text-teal-500 focus:ring-teal-500 border-slate-700 bg-slate-900 mt-1 cursor-pointer shrink-0"
                  />

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label
                        htmlFor={`doc-${doc.id}`}
                        className={`text-sm font-bold cursor-pointer transition-colors ${
                          isChecked ? 'text-emerald-300 line-through' : 'text-slate-100'
                        }`}
                      >
                        {doc.name}
                      </label>

                      <div className="flex items-center gap-2">
                        {doc.digilockerAvailable && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            DigiLocker Available
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {doc.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300">
                      <strong>Why required:</strong> {doc.whyRequired}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Issuing Authority:</span>
                        <span className="text-slate-200">{doc.officialIssuingAuthority}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Practical Step to Obtain:</span>
                        <span className="text-teal-300">{doc.howToObtain}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 italic">
                      Source Ref: {doc.verifiedSourceRef}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Authority reminder box */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 mb-6 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Official Notice:</strong> Final document acceptance and format validation rests with the competent application nodal authority.
          </span>
        </div>

        {/* Actions Bar */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            {/* Print Action */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>{t.printChecklist}</span>
            </button>

            {/* Copy Action */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? t.copiedSuccess : t.copyChecklist}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md shadow-teal-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
