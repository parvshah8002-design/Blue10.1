import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, FileSearch, Lock, Sparkles } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { DEMO_PERSONAS, DemoPersona } from '../data/personas';

interface HeroProps {
  currentLang: Language;
  onStartDiscovery: () => void;
  onSelectPersona: (persona: DemoPersona) => void;
  onScrollToHowItWorks: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentLang,
  onStartDiscovery,
  onSelectPersona,
  onScrollToHowItWorks
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="relative overflow-hidden pt-8 pb-12 lg:pt-14 lg:pb-20 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-teal-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Civic Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/30 text-teal-300 text-xs font-medium mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            <span>Civic Tech for 1.4 Billion Citizens</span>
            <span className="w-1 h-1 rounded-full bg-teal-400" />
            <span className="text-slate-300 font-normal">Zero Hallucinations Guarantee</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-5 font-heading">
            {currentLang === 'hi' ? (
              <>
                सरकारी योजनाएं, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400">
                  अब समझ में आने वाली भाषा में।
                </span>
              </>
            ) : (
              <>
                Government benefits, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400">
                  made understandable.
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            {t.heroSubtitle}
          </p>

          {/* Primary & Secondary Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
            <button
              onClick={onStartDiscovery}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{t.findBenefitsBtn}</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>

            <button
              onClick={onScrollToHowItWorks}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
            >
              <span>{t.howItWorksBtn}</span>
            </button>
          </div>

          {/* Instant 1-Click Persona Bar for Hackathon Judges */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 max-w-2xl mx-auto text-left backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />
                Instant Demo Profiles (1-Click Test Scenarios)
              </span>
              <span className="text-[11px] text-teal-400/90 font-mono">No typing required</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DEMO_PERSONAS.slice(0, 4).map(persona => (
                <button
                  key={persona.id}
                  onClick={() => onSelectPersona(persona)}
                  className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-teal-500/60 hover:bg-slate-800/80 transition-all text-left cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-slate-200 group-hover:text-teal-300 truncate">
                    {persona.name.split(' (')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {persona.tagline.split(',')[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Core Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-5xl mx-auto">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/90 hover:border-slate-700/80 transition-all">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-3">
              <FileSearch className="h-5 w-5 text-teal-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5 font-heading">
              100% Traceable Evidence
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every condition is directly linked to official government notifications, PDF clauses, and portal guidelines.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/90 hover:border-slate-700/80 transition-all">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5 font-heading">
              Honest 3-State Logic
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strict MET, NOT MET, and UNKNOWN rules. Missing information is never fabricated or assumed to be met.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/90 hover:border-slate-700/80 transition-all">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3">
              <Lock className="h-5 w-5 text-cyan-400" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5 font-heading">
              Civic Privacy Guarantee
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No Aadhaar, bank accounts, or sensitive logins. All evaluation runs client-side in your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
