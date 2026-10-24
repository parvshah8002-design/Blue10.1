'use client';

import React, { useState, useMemo } from "react";
import {
  CitizenProfileState,
  Language,
  WorkstationMode,
} from "@/types/workstation";
import { initialEmptyProfile } from "@/lib/workstationData";
import { evaluateAllSchemes } from "@/lib/workstationEngine";
import { TopCommandBar } from "@/components/workstation/TopCommandBar";
import { RapidIntakePane } from "@/components/workstation/RapidIntakePane";
import { LiveSchemeMatrixPane } from "@/components/workstation/LiveSchemeMatrixPane";
import { InspectorDrawerPane } from "@/components/workstation/InspectorDrawerPane";
import { CitizenKioskView } from "@/components/workstation/CitizenKioskView";
import { PrintableSlipModal } from "@/components/workstation/PrintableSlipModal";

export default function WorkstationPage() {
  // Desktop Workstation Top-Level State
  const [mode, setMode] = useState<WorkstationMode>("volunteer");
  const [language, setLanguage] = useState<Language>("en");
  const [profile, setProfile] = useState<CitizenProfileState>({ ...initialEmptyProfile });
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>("ladki-bahin");
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null);

  // Deterministic 0ms Client-Side Rule Engine Evaluation
  const evaluations = useMemo(() => {
    return evaluateAllSchemes(profile);
  }, [profile]);

  // Selected scheme evaluation for Right Pane
  const activeEvaluation = useMemo(() => {
    const found = evaluations.find((e) => e.scheme.id === selectedSchemeId);
    return found || evaluations[0];
  }, [evaluations, selectedSchemeId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Command Bar (Sticky) */}
      <TopCommandBar
        mode={mode}
        setMode={setMode}
        language={language}
        setLanguage={setLanguage}
        profile={profile}
        setProfile={setProfile}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        activePersonaId={activePersonaId}
        setActivePersonaId={setActivePersonaId}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col h-[calc(100vh-61px)]">
        {mode === "volunteer" ? (
          /* Volunteer Workstation Mode: Single-Screen 3-Pane Split (1280px–1920px) */
          <div className="w-full h-full flex flex-row overflow-hidden max-w-[1920px] mx-auto">
            {/* Left Pane (30% width) - Rapid Intake & Next Best Question */}
            <aside className="w-[30%] min-w-[340px] max-w-[500px] h-full">
              <RapidIntakePane
                profile={profile}
                setProfile={setProfile}
                evaluations={evaluations}
                language={language}
                setActivePersonaId={setActivePersonaId}
              />
            </aside>

            {/* Center Pane (40% width) - Live Scheme Matrix (4 Tiers) */}
            <section className="flex-1 min-w-[420px] h-full">
              <LiveSchemeMatrixPane
                evaluations={evaluations}
                selectedSchemeId={selectedSchemeId}
                setSelectedSchemeId={setSelectedSchemeId}
                language={language}
              />
            </section>

            {/* Right Pane (30% width) - Sticky Inspector (Citations & Document Tree) */}
            <aside className="w-[30%] min-w-[340px] max-w-[500px] h-full">
              <InspectorDrawerPane
                evaluation={activeEvaluation}
                profile={profile}
                setProfile={setProfile}
                language={language}
              />
            </aside>
          </div>
        ) : (
          /* Citizen Guided Kiosk Mode */
          <CitizenKioskView
            profile={profile}
            setProfile={setProfile}
            evaluations={evaluations}
            language={language}
            onOpenPrintModal={() => setIsPrintModalOpen(true)}
            setActivePersonaId={setActivePersonaId}
          />
        )}
      </main>

      {/* Printable Slip Modal (A4 Summary & 80mm Thermal Receipt) */}
      <PrintableSlipModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        profile={profile}
        evaluations={evaluations}
        language={language}
      />
    </div>
  );
}
