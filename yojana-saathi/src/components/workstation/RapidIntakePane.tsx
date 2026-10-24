'use client';

import React, { useState } from "react";
import {
  CitizenProfileState,
  GenderType,
  Language,
  RationCardType,
  SchemeEvaluation,
} from "@/types/workstation";
import { getNextBestQuestion } from "@/lib/workstationEngine";
import { demoPersonas, uiTranslations } from "@/lib/workstationData";

interface RapidIntakePaneProps {
  profile: CitizenProfileState;
  setProfile: React.Dispatch<React.SetStateAction<CitizenProfileState>>;
  evaluations: SchemeEvaluation[];
  language: Language;
  setActivePersonaId: (id: string | null) => void;
}

export const RapidIntakePane: React.FC<RapidIntakePaneProps> = ({
  profile,
  setProfile,
  evaluations,
  language,
  setActivePersonaId,
}) => {
  const [isSimulatingVoice, setIsSimulatingVoice] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string | null>(null);

  const t = (key: keyof typeof uiTranslations) => uiTranslations[key][language];

  const nextQuestion = getNextBestQuestion(profile, evaluations);

  const handleSimulateVoice = () => {
    setIsSimulatingVoice(true);
    setVoiceTranscript(null);

    // Step 1: Listening animation
    setTimeout(() => {
      setVoiceTranscript(
        language === "mr"
          ? "मी सविता पाटील, वय ४२, वार्षिक उत्पन्न ९० हजार रुपये, गाव बारामती, महाराष्ट्र."
          : language === "hi"
          ? "मैं सविता पाटिल, आयु 42, वार्षिक पारिवारिक आय ₹90,000, महाराष्ट्र निवासी।"
          : "Savita Patil, Age 42, Annual Family Income ₹90,000, Resident of Maharashtra."
      );

      // Step 2: Auto-populate profile after listening
      setTimeout(() => {
        const savitaPersona = demoPersonas.find((p) => p.id === "savita");
        if (savitaPersona) {
          setProfile({ ...savitaPersona.profile });
          setActivePersonaId("savita");
        }
        setIsSimulatingVoice(false);
      }, 1000);
    }, 1200);
  };

  const updateField = <K extends keyof CitizenProfileState>(
    field: K,
    value: CitizenProfileState[K]
  ) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setActivePersonaId(null);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/40 border-r border-slate-800 overflow-hidden select-none">
      {/* Pane Header & Voice Action */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-900/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {t("rapidIntakeHeader")}
          </h2>
        </div>

        {/* Simulate Voice Intake Button */}
        <button
          onClick={handleSimulateVoice}
          disabled={isSimulatingVoice}
          className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
            isSimulatingVoice
              ? "bg-rose-600 text-white animate-pulse"
              : "bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95"
          }`}
          title="Simulate speech-to-text intake for rapid operator profiling"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <span>{isSimulatingVoice ? "Listening..." : t("simulateVoiceIntake")}</span>
        </button>
      </div>

      {/* Voice Simulation Banner */}
      {isSimulatingVoice && (
        <div className="bg-indigo-950/80 border-b border-indigo-700/60 p-3 text-xs text-indigo-200 animate-fadeIn">
          <div className="flex items-center gap-2 font-medium mb-1">
            <span className="flex space-x-1">
              <span className="w-1.5 h-4 bg-indigo-400 animate-bounce" />
              <span className="w-1.5 h-4 bg-indigo-400 animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-4 bg-indigo-400 animate-bounce [animation-delay:0.3s]" />
            </span>
            <span className="text-white font-semibold">
              {voiceTranscript ? "Speech Recognized — Extracting Profile..." : "Listening to audio stream..."}
            </span>
          </div>
          {voiceTranscript && (
            <p className="italic text-slate-300 font-mono text-[11px] bg-slate-900/60 p-2 rounded border border-indigo-800/40">
              &ldquo;{voiceTranscript}&rdquo;
            </p>
          )}
        </div>
      )}

      {/* Pane Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 custom-scrollbar">
        {/* Next Best Question Card */}
        {nextQuestion && (
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-slate-900 border border-amber-500/40 rounded-xl p-3 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider rounded-bl-lg">
              Top Impact
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                ?
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                  {t("nextBestQuestionTitle")}
                </span>
                <p className="text-sm font-semibold text-white leading-snug">
                  {nextQuestion.title[language]}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {nextQuestion.helperText[language]}
                </p>

                {/* Quick 1-Click Answer Pills */}
                {nextQuestion.options && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {nextQuestion.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          if (nextQuestion.field === "annualHouseholdIncome" || nextQuestion.field === "age" || nextQuestion.field === "landHoldingAcres") {
                            updateField(nextQuestion.field, Number(opt.value));
                          } else {
                            updateField(nextQuestion.field, opt.value as unknown as CitizenProfileState[typeof nextQuestion.field]);
                          }
                        }}
                        className="text-xs bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-amber-500/30 font-medium px-2.5 py-1 rounded-md transition-all active:scale-95"
                      >
                        {opt.label[language]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Compact Operator Intake Form */}
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-3 space-y-3.5">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Profile Parameters
            </span>
            <span className="text-[11px] text-slate-500">
              {Object.values(profile).filter((v) => v !== null && (!Array.isArray(v) || v.length > 0)).length} answered
            </span>
          </div>

          {/* Row 1: Age & Gender */}
          <div className="grid grid-cols-2 gap-3">
            {/* Age */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Age</label>
                {profile.age !== null && (
                  <button
                    onClick={() => updateField("age", null)}
                    className="text-[10px] text-slate-500 hover:text-slate-300"
                  >
                    Clear
                  </button>
                )}
              </div>
              <input
                type="number"
                min="0"
                max="120"
                placeholder="e.g. 42"
                value={profile.age ?? ""}
                onChange={(e) => updateField("age", e.target.value === "" ? null : Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>

            {/* Gender */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Gender</label>
                {profile.gender !== null && (
                  <button
                    onClick={() => updateField("gender", null)}
                    className="text-[10px] text-slate-500 hover:text-slate-300"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex rounded-lg bg-slate-950 border border-slate-700 p-0.5 text-xs">
                {(["female", "male"] as GenderType[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => updateField("gender", g)}
                    className={`flex-1 py-1 rounded text-center font-medium capitalize transition-colors ${
                      profile.gender === g
                        ? "bg-emerald-600 text-white font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: State Resident */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">State of Residence</label>
              {profile.state !== null && (
                <button
                  onClick={() => updateField("state", null)}
                  className="text-[10px] text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex rounded-lg bg-slate-950 border border-slate-700 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => updateField("state", "Maharashtra")}
                className={`flex-1 py-1 rounded text-center font-medium transition-colors ${
                  profile.state === "Maharashtra"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Maharashtra
              </button>
              <button
                type="button"
                onClick={() => updateField("state", "Other")}
                className={`flex-1 py-1 rounded text-center font-medium transition-colors ${
                  profile.state === "Other"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Other State
              </button>
            </div>
          </div>

          {/* Row 3: Annual Household Income */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">
                Annual Household Income (₹)
              </label>
              {profile.annualHouseholdIncome !== null && (
                <button
                  onClick={() => updateField("annualHouseholdIncome", null)}
                  className="text-[10px] text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-2.5 top-1.5 text-slate-500 text-xs font-mono">₹</span>
              <input
                type="number"
                step="1000"
                placeholder="e.g. 90000"
                value={profile.annualHouseholdIncome ?? ""}
                onChange={(e) =>
                  updateField(
                    "annualHouseholdIncome",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-6 pr-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            {/* Quick Income Chips */}
            <div className="flex gap-1.5 mt-1.5">
              {[
                { label: "₹90k (Savita)", val: 90000 },
                { label: "₹2.0L", val: 200000 },
                { label: "₹2.6L (Near Miss)", val: 260000 },
              ].map((chip) => (
                <button
                  key={chip.val}
                  type="button"
                  onClick={() => updateField("annualHouseholdIncome", chip.val)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                    profile.annualHouseholdIncome === chip.val
                      ? "bg-emerald-900/60 border-emerald-500 text-emerald-300 font-bold"
                      : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: Occupation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">Occupation</label>
              {profile.occupation !== null && (
                <button
                  onClick={() => updateField("occupation", null)}
                  className="text-[10px] text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
            <select
              value={profile.occupation ?? ""}
              onChange={(e) => updateField("occupation", e.target.value === "" ? null : e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">-- Select Occupation (Unknown) --</option>
              <option value="farmer">Farmer / Agriculture (शेतकरी)</option>
              <option value="homemaker">Homemaker (गृहिणी)</option>
              <option value="artisan_craftsperson">Traditional Artisan / Craftsperson (कारागीर)</option>
              <option value="student">Student (विद्यार्थी)</option>
              <option value="daily_wage">Daily Wage Worker (मजूर)</option>
              <option value="other">Other / Self-Employed</option>
            </select>
          </div>

          {/* Row 5: Landholding (Acres) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">
                Landholding (Acres)
              </label>
              {profile.landHoldingAcres !== null && (
                <button
                  onClick={() => updateField("landHoldingAcres", null)}
                  className="text-[10px] text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 1.5"
                value={profile.landHoldingAcres ?? ""}
                onChange={(e) =>
                  updateField(
                    "landHoldingAcres",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                type="button"
                onClick={() => updateField("landHoldingAcres", 0)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                  profile.landHoldingAcres === 0
                    ? "bg-slate-700 border-slate-500 text-white font-bold"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                0 (None)
              </button>
              <button
                type="button"
                onClick={() => updateField("landHoldingAcres", 1.5)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                  profile.landHoldingAcres === 1.5
                    ? "bg-emerald-900 border-emerald-500 text-emerald-300 font-bold"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                1.5 acres
              </button>
            </div>
          </div>

          {/* Row 6: Ration Card Type */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">Ration Card</label>
              {profile.rationCard !== null && (
                <button
                  onClick={() => updateField("rationCard", null)}
                  className="text-[10px] text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(["bpl", "apl", "antyodaya", "none"] as RationCardType[]).map((rc) => (
                <button
                  key={rc}
                  type="button"
                  onClick={() => updateField("rationCard", rc)}
                  className={`py-1 text-center text-xs rounded border uppercase font-medium transition-colors ${
                    profile.rationCard === rc
                      ? "bg-emerald-600 border-emerald-500 text-white font-bold"
                      : "bg-slate-950 border-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  {rc}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
