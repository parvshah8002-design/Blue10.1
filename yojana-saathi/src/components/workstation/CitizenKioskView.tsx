"use client";

import React, { useState } from "react";
import {
  CitizenProfileState,
  Language,
  SchemeEvaluation,
} from "@/types/workstation";
import { getNextBestQuestion } from "@/lib/workstationEngine";
import { demoPersonas, uiTranslations } from "@/lib/workstationData";

interface CitizenKioskViewProps {
  profile: CitizenProfileState;
  setProfile: React.Dispatch<React.SetStateAction<CitizenProfileState>>;
  evaluations: SchemeEvaluation[];
  language: Language;
  onOpenPrintModal: () => void;
  setActivePersonaId: (id: string | null) => void;
}

export const CitizenKioskView: React.FC<CitizenKioskViewProps> = ({
  profile,
  setProfile,
  evaluations,
  language,
  onOpenPrintModal,
  setActivePersonaId,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);

  const t = (key: keyof typeof uiTranslations) => uiTranslations[key][language];

  const nextQuestion = getNextBestQuestion(profile, evaluations);
  const eligibleSchemes = evaluations.filter((e) => e.tier === "ELIGIBLE");

  const handleSimulateVoice = () => {
    setIsListening(true);
    setTranscript(null);
    setTimeout(() => {
      setTranscript(
        language === "mr"
          ? "मी सविता, वय ४२, उत्पन्न ९० हजार रुपये, महाराष्ट्र."
          : "Savita, Age 42, Income ₹90,000, Maharashtra."
      );
      setTimeout(() => {
        const savita = demoPersonas.find((p) => p.id === "savita");
        if (savita) {
          setProfile({ ...savita.profile });
          setActivePersonaId("savita");
        }
        setIsListening(false);
      }, 1000);
    }, 1200);
  };

  const handleAnswer = (val: string) => {
    if (!nextQuestion) return;
    const field = nextQuestion.field;
    if (field === "annualHouseholdIncome" || field === "age" || field === "landHoldingAcres") {
      setProfile((prev) => ({ ...prev, [field]: Number(val) }));
    } else {
      setProfile((prev) => ({ ...prev, [field]: val }));
    }
    setActivePersonaId(null);
  };

  return (
    <div className="flex-1 flex overflow-hidden select-none bg-slate-950">
      {/* Main Guided Wizard (70% width) */}
      <div className="flex-1 p-8 flex flex-col justify-between overflow-y-auto custom-scrollbar">
        <div className="max-w-2xl mx-auto w-full space-y-6 my-auto">
          {/* Kiosk Mode Badge */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Citizen Touch Kiosk · Guided Mode
            </span>

            {/* Voice Mic Input */}
            <button
              onClick={handleSimulateVoice}
              disabled={isListening}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span>{isListening ? "Listening..." : "Speak Your Details (Voice Mic)"}</span>
            </button>
          </div>

          {/* Voice Listening Banner */}
          {isListening && (
            <div className="bg-indigo-950/90 border border-indigo-700 p-4 rounded-2xl text-center space-y-2 animate-fadeIn">
              <div className="flex justify-center items-center gap-1.5 h-6">
                <span className="w-1.5 h-6 bg-indigo-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-6 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-6 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                <span className="w-1.5 h-6 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.45s]" />
              </div>
              <p className="text-sm font-semibold text-white">
                {transcript ? `Recognized: "${transcript}"` : "Listening in your language..."}
              </p>
            </div>
          )}

          {/* Primary Question Card */}
          {nextQuestion ? (
            <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                  Question Step
                </span>
                <h2 className="text-2xl font-black text-white leading-tight">
                  {nextQuestion.title[language]}
                </h2>
                <p className="text-sm text-slate-400">{nextQuestion.helperText[language]}</p>
              </div>

              {/* Large Touch-Friendly Options */}
              {nextQuestion.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {nextQuestion.options.map((opt, idx) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(opt.value)}
                      className="group p-4 bg-slate-950 hover:bg-emerald-950/80 border-2 border-slate-800 hover:border-emerald-500 rounded-2xl text-left transition-all active:scale-98 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-slate-800 group-hover:bg-emerald-600 text-slate-300 group-hover:text-white flex items-center justify-center font-bold text-xs font-mono transition-colors">
                          {idx + 1}
                        </span>
                        <span className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {opt.label[language]}
                        </span>
                      </div>
                      <svg className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <h2 className="text-2xl font-black text-white">All Key Questions Answered!</h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Your profile is complete. Check the schemes unlocked for you on the right rail and print your takeaway slip.
              </p>
              <button
                onClick={onOpenPrintModal}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print Official Slip Now</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Live Unlock Rail (30% width) */}
      <div className="w-[380px] bg-slate-900 border-l border-slate-800 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-extrabold text-sm text-white">Live Unlocked Schemes</h3>
              <p className="text-xs text-slate-400">Updates dynamically</p>
            </div>
            <span className="text-sm font-mono font-bold bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full">
              {eligibleSchemes.length}
            </span>
          </div>

          <div className="space-y-3 mt-4 overflow-y-auto max-h-[calc(100vh-220px)] custom-scrollbar pr-1">
            {eligibleSchemes.length === 0 ? (
              <div className="text-center p-6 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                Answer the question on screen to discover eligible schemes.
              </div>
            ) : (
              eligibleSchemes.map((item) => (
                <div
                  key={item.scheme.id}
                  className="bg-slate-950 border border-emerald-500/40 rounded-xl p-3.5 shadow-sm space-y-1.5 animate-fadeIn"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      ELIGIBLE
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-300">
                      {item.scheme.monthlyOrYearlyAmount}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    {item.scheme.title[language]}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {item.scheme.benefitSummary[language]}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Print Takeaway CTA */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={onOpenPrintModal}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>{t("printCta")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
