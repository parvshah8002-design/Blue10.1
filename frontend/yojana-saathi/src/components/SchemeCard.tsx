"use client";

import Link from "next/link";
import ResultBadge from "./ResultBadge";
import ExpandableSection from "./ExpandableSection";
import { Scheme, RuleEngineResult, Language } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { uiStrings } from "@/lib/mockData";

interface SchemeCardProps {
  scheme: Scheme;
  result?: RuleEngineResult;
}

export default function SchemeCard({ scheme, result }: SchemeCardProps) {
  const { language } = useAppContext();
  const t = uiStrings[language];

  const title =
    language === "hi"
      ? scheme.title_hi
      : language === "mr"
      ? scheme.title_mr
      : scheme.title_en;

  const benefits = scheme.benefits[language] || scheme.benefits.en;
  const status = result?.status || scheme.result_status;

  const borderColor =
    status === "eligible"
      ? "border-l-emerald-500"
      : status === "possibly_eligible"
      ? "border-l-amber-500"
      : "border-l-red-400";

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 border-l-4 ${borderColor} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-bold text-gray-900 text-base leading-tight">
            {title}
          </h3>
          <ResultBadge status={status} size="sm" />
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {scheme.department}
          </span>
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            {scheme.category}
          </span>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          {benefits}
        </p>

        {/* Missing info for possibly eligible */}
        {status === "possibly_eligible" &&
          result &&
          result.missingInformation.length > 0 && (
            <div className="bg-amber-50 rounded-lg px-3 py-2 mb-3">
              <p className="text-xs font-semibold text-amber-700 mb-1">
                {t.missingInfo}:
              </p>
              <ul className="text-xs text-amber-600 list-disc list-inside">
                {result.missingInformation.map((info, i) => (
                  <li key={i}>{info}</li>
                ))}
              </ul>
            </div>
          )}

        {/* Failed rules for not eligible */}
        {status === "not_eligible" &&
          result &&
          result.failedRules.length > 0 && (
            <ExpandableSection title={`${t.why}`}>
              <div className="space-y-2">
                {result.failedRules.map((rule) => (
                  <div key={rule.ruleId} className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">✕</span>
                    <div>
                      <p className="text-sm text-gray-700">
                        {rule.description[language] || rule.description.en}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Your value: {rule.userValue || "—"} · Required:{" "}
                        {rule.requiredValue}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ExpandableSection>
          )}

        <div className="mt-3">
          <Link
            href={`/scheme/${scheme.scheme_id}`}
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            {t.viewDetails} →
          </Link>
        </div>
      </div>
    </div>
  );
}
