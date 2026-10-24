"use client";

import React from "react";
import {
  Language,
  MatchTier,
  SchemeEvaluation,
} from "@/types/workstation";
import { uiTranslations } from "@/lib/workstationData";

interface LiveSchemeMatrixPaneProps {
  evaluations: SchemeEvaluation[];
  selectedSchemeId: string;
  setSelectedSchemeId: (id: string) => void;
  language: Language;
}

export const LiveSchemeMatrixPane: React.FC<LiveSchemeMatrixPaneProps> = ({
  evaluations,
  selectedSchemeId,
  setSelectedSchemeId,
  language,
}) => {
  const t = (key: keyof typeof uiTranslations) => uiTranslations[key][language];

  // Group evaluations by tier
  const eligible = evaluations.filter((e) => e.tier === "ELIGIBLE");
  const nearMiss = evaluations.filter((e) => e.tier === "NEAR_MISS");
  const partial = evaluations.filter((e) => e.tier === "PARTIAL_MATCH");
  const ineligible = evaluations.filter((e) => e.tier === "INELIGIBLE");

  const tierSections: {
    tier: MatchTier;
    label: string;
    items: SchemeEvaluation[];
    badgeBg: string;
    borderCol: string;
    countBg: string;
  }[] = [
    {
      tier: "ELIGIBLE",
      label: t("tierEligible"),
      items: eligible,
      badgeBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      borderCol: "border-emerald-500/40",
      countBg: "bg-emerald-500 text-slate-950",
    },
    {
      tier: "NEAR_MISS",
      label: t("tierNearMiss"),
      items: nearMiss,
      badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      borderCol: "border-amber-500/40",
      countBg: "bg-amber-500 text-slate-950",
    },
    {
      tier: "PARTIAL_MATCH",
      label: t("tierPartialMatch"),
      items: partial,
      badgeBg: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      borderCol: "border-blue-500/40",
      countBg: "bg-blue-500 text-slate-950",
    },
    {
      tier: "INELIGIBLE",
      label: t("tierIneligible"),
      items: ineligible,
      badgeBg: "bg-slate-700/30 text-slate-400 border-slate-700",
      borderCol: "border-slate-800",
      countBg: "bg-slate-700 text-slate-300",
    },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-900/60 border-r border-slate-800 overflow-hidden select-none">
      {/* Pane Header */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {t("schemeMatrixHeader")}
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-emerald-400 font-semibold">{eligible.length} Qualified</span>
          <span className="text-slate-600">·</span>
          <span className="text-amber-400 font-semibold">{nearMiss.length} Near Miss</span>
        </div>
      </div>

      {/* Live Matrix Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-5 custom-scrollbar">
        {tierSections.map((section) => {
          if (section.items.length === 0) return null;

          return (
            <div key={section.tier} className="space-y-2.5">
              {/* Tier Section Header Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md border flex items-center gap-1.5 ${section.badgeBg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${section.countBg}`} />
                  {section.label}
                  <span className={`ml-1 px-1.5 py-0.2 rounded text-[10px] ${section.countBg}`}>
                    {section.items.length}
                  </span>
                </span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>

              {/* Cards Grid */}
              <div className="space-y-2">
                {section.items.map((item) => {
                  const isSelected = item.scheme.id === selectedSchemeId;

                  return (
                    <div
                      key={item.scheme.id}
                      onClick={() => setSelectedSchemeId(item.scheme.id)}
                      className={`group relative p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? `bg-slate-800/90 ${section.borderCol} ring-1 ${section.borderCol} shadow-md`
                          : "bg-slate-900/80 border-slate-800/90 hover:border-slate-700 hover:bg-slate-800/40"
                      }`}
                    >
                      {/* Active Indicator Bar */}
                      {isSelected && (
                        <div className="absolute left-0 top-3 bottom-3 w-1 bg-emerald-500 rounded-r-full" />
                      )}

                      <div className="pl-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/60">
                                {item.scheme.level}
                              </span>
                              <span className="text-[10px] font-medium text-slate-400">
                                {item.scheme.category}
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                              {item.scheme.title[language]}
                            </h3>
                          </div>

                          {/* Benefit Pill */}
                          {item.scheme.monthlyOrYearlyAmount && (
                            <span className="text-xs font-bold font-mono px-2 py-0.5 bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 rounded-md shrink-0">
                              {item.scheme.monthlyOrYearlyAmount}
                            </span>
                          )}
                        </div>

                        {/* Department Subtitle */}
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                          {item.scheme.department[language]}
                        </p>

                        {/* Unlock Hint for Near-Miss */}
                        {item.tier === "NEAR_MISS" && item.unlockHint && (
                          <div className="mt-2 text-xs bg-amber-950/40 border border-amber-500/40 rounded-lg p-2 text-amber-300 flex items-start gap-1.5">
                            <span className="font-bold shrink-0">{t("unlockHintPrefix")}</span>
                            <span>{item.unlockHint[language]}</span>
                          </div>
                        )}

                        {/* Missing Fields Chips for Partial Match */}
                        {item.tier === "PARTIAL_MATCH" && item.missingFields.length > 0 && (
                          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] uppercase font-bold text-blue-400">
                              Needs:
                            </span>
                            {item.missingFields.map((field) => (
                              <span
                                key={field}
                                className="text-[10px] bg-blue-950/60 border border-blue-500/30 text-blue-300 px-1.5 py-0.5 rounded font-mono"
                              >
                                {field}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer Details: Match Score & Action Hint */}
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">Rules match:</span>
                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  item.tier === "ELIGIBLE"
                                    ? "bg-emerald-500"
                                    : item.tier === "NEAR_MISS"
                                    ? "bg-amber-500"
                                    : item.tier === "PARTIAL_MATCH"
                                    ? "bg-blue-500"
                                    : "bg-slate-600"
                                }`}
                                style={{ width: `${item.scorePercent}%` }}
                              />
                            </div>
                            <span className="text-slate-300 font-mono font-medium">
                              {item.scorePercent}%
                            </span>
                          </div>

                          <span className="text-emerald-400/80 group-hover:text-emerald-300 flex items-center gap-0.5 font-medium">
                            <span>Inspect Proof</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
