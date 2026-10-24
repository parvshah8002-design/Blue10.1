'use client';

import React, { useState } from "react";
import {
  CitizenProfileState,
  Language,
  SchemeEvaluation,
} from "@/types/workstation";
import { uiTranslations } from "@/lib/workstationData";

interface InspectorDrawerPaneProps {
  evaluation: SchemeEvaluation;
  profile: CitizenProfileState;
  setProfile: React.Dispatch<React.SetStateAction<CitizenProfileState>>;
  language: Language;
}

export const InspectorDrawerPane: React.FC<InspectorDrawerPaneProps> = ({
  evaluation,
  profile,
  setProfile,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<"citation" | "doctree">("citation");

  const t = (key: keyof typeof uiTranslations) => uiTranslations[key][language];

  const { scheme, checks, tier } = evaluation;

  // Toggle document availability in profile
  const toggleDocument = (docId: string) => {
    setProfile((prev) => {
      const exists = prev.documentsAvailable.includes(docId);
      const updated = exists
        ? prev.documentsAvailable.filter((id) => id !== docId)
        : [...prev.documentsAvailable, docId];
      return { ...prev, documentsAvailable: updated };
    });
  };

  const ownedCount = scheme.documents.filter((d) =>
    profile.documentsAvailable.includes(d.id)
  ).length;
  const totalDocs = scheme.documents.length;
  const docReadyPercent = totalDocs > 0 ? Math.round((ownedCount / totalDocs) * 100) : 0;

  return (
    <div className="h-full flex flex-col bg-slate-900/50 border-l border-slate-800 overflow-hidden select-none">
      {/* Pane Top Header */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {scheme.category}
          </span>
          <span
            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
              tier === "ELIGIBLE"
                ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                : tier === "NEAR_MISS"
                ? "bg-amber-950/80 text-amber-300 border-amber-500/40"
                : tier === "PARTIAL_MATCH"
                ? "bg-blue-950/80 text-blue-300 border-blue-500/40"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            {tier}
          </span>
        </div>

        <h2 className="text-base font-bold text-white mt-1.5 leading-snug">
          {scheme.title[language]}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
          {scheme.department[language]}
        </p>

        {/* Benefits Callout */}
        <div className="mt-2.5 bg-slate-950/60 border border-slate-800 rounded-lg p-2 text-xs text-slate-300">
          <div className="font-semibold text-emerald-400 mb-0.5">Scheme Benefit:</div>
          <p className="text-[11px] leading-relaxed text-slate-300">
            {scheme.benefitSummary[language]}
          </p>
        </div>

        {/* Inspector Navigation Tabs */}
        <div className="flex border-b border-slate-800 mt-3 pt-1">
          <button
            onClick={() => setActiveTab("citation")}
            className={`flex-1 pb-2 text-xs font-semibold text-center transition-all relative ${
              activeTab === "citation"
                ? "text-emerald-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t("tabRuleProof")}
            {activeTab === "citation" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("doctree")}
            className={`flex-1 pb-2 text-xs font-semibold text-center transition-all relative flex items-center justify-center gap-1.5 ${
              activeTab === "doctree"
                ? "text-emerald-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>{t("tabDocTree")}</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full border border-slate-700 font-mono">
              {ownedCount}/{totalDocs}
            </span>
            {activeTab === "doctree" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Tab 1: Rule Citation & Verbatim Proof */}
      {activeTab === "citation" && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 custom-scrollbar">
          {/* Official Verification Header */}
          <div className="flex items-center justify-between text-[11px] bg-emerald-950/30 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg text-emerald-300">
            <span className="flex items-center gap-1.5 font-bold">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t("verifiedBadge")}
            </span>
            <span className="font-mono text-slate-400">{scheme.lastVerifiedDate}</span>
          </div>

          {/* Rule Evaluation Checks */}
          <div className="space-y-3">
            {checks.map((c) => (
              <div
                key={c.ruleId}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-sm space-y-2"
              >
                {/* Rule Status Pill & Field Title */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <span className="text-xs font-bold text-white block">
                      {c.description[language]}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      Rule ID: {c.ruleId} · Field: {c.field}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded border shrink-0 ${
                      c.status === "PASSED"
                        ? "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                        : c.status === "FAILED"
                        ? "bg-rose-950 text-rose-300 border-rose-500/50"
                        : "bg-amber-950 text-amber-300 border-amber-500/50"
                    }`}
                  >
                    {c.status === "PASSED"
                      ? t("rulePassed")
                      : c.status === "FAILED"
                      ? t("ruleFailed")
                      : t("ruleMissing")}
                  </span>
                </div>

                {/* Values Comparison: Citizen Value vs Required Value */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">
                      Citizen Value
                    </span>
                    <span className="font-mono font-medium text-slate-200">
                      {c.userValue ?? "Missing (null)"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">
                      Requirement
                    </span>
                    <span className="font-mono font-medium text-emerald-400">
                      {c.requiredValue}
                    </span>
                  </div>
                </div>

                {/* Official Verbatim PDF Citation Card */}
                <div className="bg-slate-950/90 border border-slate-800/90 rounded-lg p-2.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-1">
                    <span className="text-amber-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      {c.citation.grNumber ?? "Official Resolution"}
                    </span>
                    <span className="font-mono text-slate-500">{c.citation.page}</span>
                  </div>

                  <p className="text-[11px] italic text-slate-300 font-serif leading-relaxed border-l-2 border-amber-500/60 pl-2">
                    &ldquo;{c.citation.clause}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Official Apply Button */}
          <div className="pt-2">
            <a
              href={scheme.officialApplyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <span>{t("officialApplyBtn")}</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      )}

      {/* Tab 2: Document Tree & Prerequisites */}
      {activeTab === "doctree" && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 custom-scrollbar">
          {/* Readiness Progress Bar */}
          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Document Readiness</span>
              <span className="text-emerald-400 font-mono">{docReadyPercent}% Ready</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${docReadyPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              {ownedCount} of {totalDocs} required documents marked as available in citizen&apos;s possession.
            </p>
          </div>

          {/* Document Tree Checklist */}
          <div className="space-y-3">
            {scheme.documents.map((doc) => {
              const isOwned = profile.documentsAvailable.includes(doc.id);

              return (
                <div
                  key={doc.id}
                  className={`border rounded-xl p-3 transition-all ${
                    isOwned
                      ? "bg-emerald-950/20 border-emerald-500/40 shadow-sm"
                      : "bg-slate-900/80 border-slate-800"
                  }`}
                >
                  {/* Document Header & Checkbox */}
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id={`doc-${doc.id}`}
                      checked={isOwned}
                      onChange={() => toggleDocument(doc.id)}
                      className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900 bg-slate-950 border-slate-700 cursor-pointer"
                    />

                    <div className="flex-1">
                      <label
                        htmlFor={`doc-${doc.id}`}
                        className={`text-xs font-bold cursor-pointer transition-colors block ${
                          isOwned ? "text-emerald-300" : "text-white"
                        }`}
                      >
                        {doc.name[language]}
                      </label>

                      {/* Issuing Authority */}
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <span className="text-slate-500">Authority:</span>
                        <span>{doc.issuingAuthority[language]}</span>
                      </div>

                      {/* Prerequisite Document Badges */}
                      {doc.prerequisites.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-800/80">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                            Prerequisites needed first:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {doc.prerequisites.map((prereqId) => (
                              <span
                                key={prereqId}
                                className="text-[10px] bg-amber-950/60 border border-amber-500/40 text-amber-300 px-1.5 py-0.5 rounded font-mono"
                              >
                                ↳ Requires {prereqId.replace("_", " ")}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* How To Get Instructions */}
                      <p className="text-[11px] text-slate-400 mt-2 bg-slate-950/60 p-2 rounded border border-slate-800/60 leading-relaxed">
                        <span className="text-slate-300 font-semibold block mb-0.5">
                          How to obtain:
                        </span>
                        {doc.howToGet[language]}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
