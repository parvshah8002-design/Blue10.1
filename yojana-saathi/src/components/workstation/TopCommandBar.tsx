"use client";

import React from "react";
import {
  Language,
  WorkstationMode,
  CitizenProfileState,
} from "@/types/workstation";
import { demoPersonas, initialEmptyProfile, uiTranslations } from "@/lib/workstationData";

interface TopCommandBarProps {
  mode: WorkstationMode;
  setMode: (mode: WorkstationMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  profile: CitizenProfileState;
  setProfile: (profile: CitizenProfileState) => void;
  onOpenPrintModal: () => void;
  activePersonaId: string | null;
  setActivePersonaId: (id: string | null) => void;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  mode,
  setMode,
  language,
  setLanguage,
  setProfile,
  onOpenPrintModal,
  activePersonaId,
  setActivePersonaId,
}) => {
  const t = (key: keyof typeof uiTranslations) => uiTranslations[key][language];

  const handleSelectPersona = (id: string) => {
    const persona = demoPersonas.find((p) => p.id === id);
    if (persona) {
      setProfile({ ...persona.profile });
      setActivePersonaId(id);
    }
  };

  const handleReset = () => {
    setProfile({ ...initialEmptyProfile });
    setActivePersonaId(null);
  };

  return (
    <header className="no-print bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 select-none shadow-md">
      <div className="max-w-[1920px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Branding & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xl shadow-inner">
            <svg
              className="w-6 h-6 text-slate-950"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">
                {t("appTitle")}
              </span>
              <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                v1.0 Desktop
              </span>
            </div>
            <p className="text-xs text-slate-400 -mt-0.5">{t("appSubtitle")}</p>
          </div>
        </div>

        {/* Center: Mode Toggle & 1-Click Demo Personas */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Mode Switcher */}
          <div className="bg-slate-800 p-1 rounded-lg border border-slate-700/80 flex items-center">
            <button
              onClick={() => setMode("volunteer")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                mode === "volunteer"
                  ? "bg-emerald-600 text-white shadow-sm font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
              title="3-Pane Widescreen Operator Layout"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <span>{t("volunteerMode")}</span>
            </button>
            <button
              onClick={() => setMode("kiosk")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                mode === "kiosk"
                  ? "bg-emerald-600 text-white shadow-sm font-semibold"
                  : "text-slate-300 hover:text-white"
              }`}
              title="Citizen Guided Touch Kiosk"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>{t("kioskMode")}</span>
            </button>
          </div>

          <div className="h-5 w-px bg-slate-700 mx-1 hidden lg:block" />

          {/* 1-Click Demo Personas */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 hidden xl:inline">
              Personas:
            </span>
            <button
              onClick={() => handleSelectPersona("savita")}
              className={`px-2.5 py-1.5 text-xs rounded-md border transition-all flex items-center gap-1.5 ${
                activePersonaId === "savita"
                  ? "bg-pink-950/80 border-pink-500 text-pink-200 font-semibold ring-1 ring-pink-500"
                  : "bg-slate-800/80 border-slate-700 text-slate-200 hover:border-pink-500/50 hover:bg-slate-800"
              }`}
              title="Savita (42F, ₹90k, Maharashtra) -> Unlocks Majhi Ladki Bahin"
            >
              <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" />
              <span>Savita (42F, ₹90k, MH)</span>
            </button>

            <button
              onClick={() => handleSelectPersona("ramesh")}
              className={`px-2.5 py-1.5 text-xs rounded-md border transition-all flex items-center gap-1.5 ${
                activePersonaId === "ramesh"
                  ? "bg-amber-950/80 border-amber-500 text-amber-200 font-semibold ring-1 ring-amber-500"
                  : "bg-slate-800/80 border-slate-700 text-slate-200 hover:border-amber-500/50 hover:bg-slate-800"
              }`}
              title="Ramesh Patil (50M, Farmer, 1.5 acres) -> Unlocks PM-KISAN"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span>Ramesh Patil (50M, Farmer)</span>
            </button>

            <button
              onClick={handleReset}
              className="px-2.5 py-1.5 text-xs rounded-md border border-slate-700 bg-slate-800 text-slate-300 hover:text-red-400 hover:border-red-500/40 hover:bg-slate-800/90 transition-all flex items-center gap-1"
              title="Clear all fields to null state"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{t("resetProfile")}</span>
            </button>
          </div>
        </div>

        {/* Right: Language Selector & Print CTA */}
        <div className="flex items-center gap-2.5">
          {/* Language Selector */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-0.5 flex text-xs">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 rounded transition-colors ${
                language === "en" ? "bg-slate-700 text-emerald-400 font-bold" : "text-slate-300 hover:text-white"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`px-2 py-1 rounded transition-colors ${
                language === "hi" ? "bg-slate-700 text-emerald-400 font-bold" : "text-slate-300 hover:text-white"
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage("mr")}
              className={`px-2 py-1 rounded transition-colors ${
                language === "mr" ? "bg-slate-700 text-emerald-400 font-bold" : "text-slate-300 hover:text-white"
              }`}
            >
              मराठी
            </button>
          </div>

          {/* Print / Thermal Receipt CTA */}
          <button
            onClick={onOpenPrintModal}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-transform active:scale-95"
            title="Generate A4 Summary or 80mm Thermal Slip"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>{t("printCta")}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
