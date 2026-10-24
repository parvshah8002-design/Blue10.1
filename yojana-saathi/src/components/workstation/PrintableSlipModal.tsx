"use client";

import React, { useState, useEffect } from "react";
import {
  CitizenProfileState,
  Language,
  SchemeEvaluation,
} from "@/types/workstation";
import { uiTranslations } from "@/lib/workstationData";
import { formatFieldValue } from "@/lib/workstationEngine";

interface PrintableSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CitizenProfileState;
  evaluations: SchemeEvaluation[];
  language: Language;
}

export const PrintableSlipModal: React.FC<PrintableSlipModalProps> = ({
  isOpen,
  onClose,
  profile,
  evaluations,
  language,
}) => {
  const [format, setFormat] = useState<"a4" | "thermal">("a4");
  const slipDate = "24/10/2026";
  const slipRef = "YS-849201";

  const t = (key: keyof typeof uiTranslations) => uiTranslations[key][language];

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const eligibleSchemes = evaluations.filter((e) => e.tier === "ELIGIBLE");
  const nearMissSchemes = evaluations.filter((e) => e.tier === "NEAR_MISS");

  // Aggregate required documents across all eligible schemes
  const allRequiredDocs = Array.from(
    new Map(
      eligibleSchemes.flatMap((e) => e.scheme.documents.map((d) => [d.id, d]))
    ).values()
  );

  const handlePrint = () => {
    window.print();
  };

  // Generate WhatsApp Share message
  const generateWhatsAppUrl = () => {
    const eligibleTitles = eligibleSchemes
      .map((e) => `• ${e.scheme.title[language]} (${e.scheme.monthlyOrYearlyAmount || "Beneficiary"})`)
      .join("%0A");

    const text = encodeURIComponent(
      `*YojanaSaathi Scheme Eligibility Summary*%0A` +
        `--------------------------------%0A` +
        `*Citizen Profile:* Age: ${profile.age || "-"}, State: ${profile.state || "-"}, Income: ₹${profile.annualHouseholdIncome?.toLocaleString("en-IN") || "-"}%0A%0A` +
        `*Eligible Schemes (${eligibleSchemes.length}):*%0A${eligibleTitles}%0A%0A` +
        `Verify official details and apply at nearest CSC Kendra.`
    );
    return `https://wa.me/?text=${text}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="printSlipTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Modal Controls Bar (Hidden during Print) */}
        <div className="no-print p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 id="printSlipTitle" className="font-bold text-white text-sm">
              Citizen Takeaway Slip
            </h3>
            <span className="text-xs text-slate-400">· Ready to print</span>
          </div>

          {/* Format Toggle: A4 vs 80mm Thermal */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-950 p-1 rounded-lg border border-slate-700 flex text-xs">
              <button
                type="button"
                onClick={() => setFormat("a4")}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  format === "a4"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t("a4SummaryTitle")}
              </button>
              <button
                type="button"
                onClick={() => setFormat("thermal")}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  format === "thermal"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t("thermalReceiptTitle")}
              </button>
            </div>

            {/* Print Now CTA */}
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>{t("printNow")}</span>
            </button>

            {/* WhatsApp Share CTA */}
            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.179.182-.077.357.101.174.449.741.964 1.2.662.589 1.221.771 1.394.858.173.086.274.072.375-.044.101-.116.433-.506.549-.679.116-.173.231-.144.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
              </svg>
              <span>{t("shareWhatsApp")}</span>
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Printable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40 custom-scrollbar flex justify-center">
          {/* Format 1: A4 Official Summary Layout */}
          {format === "a4" && (
            <div
              id="printableSlipA4"
              className="w-full max-w-[210mm] bg-white text-slate-900 p-8 rounded-lg shadow-md border border-slate-200 text-xs space-y-6 font-sans print:shadow-none print:border-none print:p-0"
            >
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xl tracking-tight text-slate-950">
                      {t("appTitle")}
                    </span>
                    <span className="text-[10px] font-bold uppercase bg-slate-900 text-white px-2 py-0.5 rounded">
                      Official Citizen Guidance Slip
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Common Service Center (CSC) / Village Helpdesk Scheme Navigator
                  </p>
                </div>
                <div className="text-right text-[11px] text-slate-500 font-mono">
                  <div>Date: {slipDate}</div>
                  <div>Slip Ref: {slipRef}</div>
                </div>
              </div>

              {/* Citizen Demographic Snapshot Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
                  1. Citizen Profile Snapshot
                </h4>
                <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Age</span>
                    <span className="font-semibold">{formatFieldValue("age", profile.age)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Gender</span>
                    <span className="font-semibold">{formatFieldValue("gender", profile.gender)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">State</span>
                    <span className="font-semibold">{formatFieldValue("state", profile.state)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Annual Income</span>
                    <span className="font-semibold">
                      {formatFieldValue("annualHouseholdIncome", profile.annualHouseholdIncome)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Occupation</span>
                    <span className="font-semibold">
                      {formatFieldValue("occupation", profile.occupation)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Landholding</span>
                    <span className="font-semibold">
                      {formatFieldValue("landHoldingAcres", profile.landHoldingAcres)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Ration Card</span>
                    <span className="font-semibold">
                      {formatFieldValue("rationCard", profile.rationCard)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Qualified Schemes Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1 flex justify-between items-center">
                  <span>2. Qualified Government Schemes ({eligibleSchemes.length})</span>
                  <span className="text-emerald-700 font-semibold text-[11px]">100% Deterministic Match</span>
                </h4>

                {eligibleSchemes.length === 0 ? (
                  <p className="text-slate-500 italic p-3 bg-slate-50 rounded">
                    No schemes fully qualified yet. Check Near-Miss suggestions below or complete unanswered questions.
                  </p>
                ) : (
                  <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-700">
                      <tr>
                        <th className="p-2.5 border-b">Scheme Name</th>
                        <th className="p-2.5 border-b">Jurisdiction</th>
                        <th className="p-2.5 border-b">Financial Benefit</th>
                        <th className="p-2.5 border-b">Application Channel</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {eligibleSchemes.map((item) => (
                        <tr key={item.scheme.id} className="text-xs">
                          <td className="p-2.5 font-bold text-slate-950">
                            {item.scheme.title[language]}
                            <span className="block text-[10px] font-normal text-slate-500">
                              {item.scheme.department[language]}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-600">{item.scheme.level}</td>
                          <td className="p-2.5 font-bold text-emerald-800 font-mono">
                            {item.scheme.monthlyOrYearlyAmount || "Direct Welfare Grant"}
                          </td>
                          <td className="p-2.5 text-slate-700 font-mono text-[11px]">
                            {item.scheme.officialApplyUrl}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Near-Miss Advice Section */}
              {nearMissSchemes.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2 border-b border-slate-200 pb-1">
                    3. Near-Miss Potential Schemes (Requires 1 Fixable Update)
                  </h4>
                  <div className="space-y-2">
                    {nearMissSchemes.map((item) => (
                      <div
                        key={item.scheme.id}
                        className="bg-amber-50 border border-amber-300 rounded-lg p-2.5 text-xs text-amber-950"
                      >
                        <span className="font-bold">{item.scheme.title[language]}</span>
                        <div className="text-[11px] mt-0.5 text-amber-900">
                          {item.unlockHint?.[language]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Master Document Checklist to Bring */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b border-slate-200 pb-1">
                  4. Required Documents Checklist to Carry to CSC
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {allRequiredDocs.map((doc) => {
                    const isHeld = profile.documentsAvailable.includes(doc.id);
                    return (
                      <div
                        key={doc.id}
                        className={`p-2.5 rounded border flex items-start gap-2 ${
                          isHeld ? "bg-emerald-50 border-emerald-300" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <span className="font-bold text-sm">
                          {isHeld ? "☑" : "☐"}
                        </span>
                        <div>
                          <span className={`font-semibold ${isHeld ? "text-emerald-900" : "text-slate-900"}`}>
                            {doc.name[language]}
                          </span>
                          <span className="block text-[10px] text-slate-500 mt-0.5">
                            Authority: {doc.issuingAuthority[language]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Official Disclaimer & Signatures */}
              <div className="pt-4 border-t-2 border-slate-200 text-[10px] text-slate-500 space-y-4">
                <p className="italic">{t("disclaimerText")}</p>
                <div className="flex justify-between pt-6 text-slate-700 font-medium">
                  <div>Operator Signature / Stamp: _____________________</div>
                  <div>Citizen Signature: _____________________</div>
                </div>
              </div>
            </div>
          )}

          {/* Format 2: 80mm Thermal Receipt Layout */}
          {format === "thermal" && (
            <div
              id="printableSlipThermal"
              className="w-[80mm] max-w-[80mm] bg-white text-black p-4 font-mono text-[11px] leading-tight shadow-md border border-slate-300 rounded print:border-none print:shadow-none print:p-0"
            >
              <div className="text-center pb-2 border-b border-dashed border-black">
                <div className="font-black text-sm tracking-widest uppercase">
                  *** YOJANASAATHI ***
                </div>
                <div className="text-[10px]">{t("appSubtitle")}</div>
                <div className="text-[9px] mt-1">{slipDate}</div>
              </div>

              {/* Citizen Details */}
              <div className="py-2 border-b border-dashed border-black text-[10px] space-y-0.5">
                <div className="font-bold uppercase tracking-wider">CITIZEN PROFILE:</div>
                <div className="flex justify-between">
                  <span>Age:</span>
                  <span>{profile.age || "-"} yrs</span>
                </div>
                <div className="flex justify-between">
                  <span>Gender:</span>
                  <span>{profile.gender || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span>State:</span>
                  <span>{profile.state || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Income:</span>
                  <span>₹{profile.annualHouseholdIncome?.toLocaleString("en-IN") || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Occupation:</span>
                  <span>{profile.occupation || "-"}</span>
                </div>
              </div>

              {/* Eligible Schemes List */}
              <div className="py-2 border-b border-dashed border-black space-y-1.5">
                <div className="font-bold uppercase tracking-wider text-[10px]">
                  ELIGIBLE SCHEMES ({eligibleSchemes.length}):
                </div>
                {eligibleSchemes.length === 0 ? (
                  <div className="italic text-[10px]">No schemes qualified yet</div>
                ) : (
                  eligibleSchemes.map((e, idx) => (
                    <div key={e.scheme.id} className="text-[10px]">
                      <div className="font-bold">
                        {idx + 1}. {e.scheme.title[language]}
                      </div>
                      <div className="pl-3 font-semibold text-[9px]">
                        Benefit: {e.scheme.monthlyOrYearlyAmount || "Direct Cash DBT"}
                      </div>
                      <div className="pl-3 text-[9px] text-gray-700">
                        Portal: {e.scheme.officialApplyUrl}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Documents to bring */}
              <div className="py-2 border-b border-dashed border-black space-y-1 text-[10px]">
                <div className="font-bold uppercase tracking-wider">DOCUMENTS NEEDED:</div>
                {allRequiredDocs.map((doc) => {
                  const isHeld = profile.documentsAvailable.includes(doc.id);
                  return (
                    <div key={doc.id} className="flex items-start gap-1">
                      <span>[{isHeld ? "X" : " "}]</span>
                      <span className="text-[9px] leading-tight">
                        {doc.name[language]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Thermal Footer */}
              <div className="text-center pt-2 text-[9px] leading-tight">
                <div>* INDICATIVE GUIDANCE ONLY *</div>
                <div className="mt-1">Visit nearest CSC or Talathi office for final scheme registration.</div>
                <div className="mt-2 text-[8px]">================================</div>
                <div className="text-[8px]">POWERED BY YOJANASAATHI OPEN ENGINE</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
