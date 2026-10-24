import React from 'react';
import { AppView } from '../types/scheme';
import { Language, TRANSLATIONS } from '../data/translations';
import {
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface LandingPageProps {
  currentLang: Language;
  onNavigate: (view: AppView) => void;
  onQuickDemo: (personaId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentLang,
  onNavigate
}) => {
  const t = TRANSLATIONS[currentLang];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#263445]">
      {/* HERO SECTION */}
      <section className="bg-white border-b border-[#E1E7EF] py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Small Label */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EAF2FA] border border-[#CBDFF5] text-[#173B67] text-xs font-bold uppercase tracking-wider mb-6">
            <ShieldCheck className="h-3.5 w-3.5 text-[#168A83]" />
            <span>{t.heroBadge}</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#173B67] tracking-tight leading-[1.15] mb-6 font-heading">
            {t.heroHeadline}
            <span className="text-[#168A83]">{t.heroHeadlineHighlight}</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-[#667085] max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
            {t.heroSubtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
            <button
              onClick={() => onNavigate('signup')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#173B67] hover:bg-[#112C4E] text-white font-bold text-sm tracking-wide shadow-xs transition-colors cursor-pointer"
            >
              <span>{t.findBenefitsBtn}</span>
              <ArrowRight className="h-4 w-4 stroke-[2.2]" />
            </button>

            <button
              onClick={() => scrollToSection('how-it-works')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF] hover:bg-[#EAF2FA] text-[#173B67] font-bold text-sm transition-colors cursor-pointer"
            >
              <span>{t.howItWorksBtn}</span>
            </button>
          </div>

          {/* Three Short Trust Points */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-[#667085] pt-2">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#168A83] stroke-[2.5]" />
              <span className="font-medium text-[#263445]">{t.trustClear}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#168A83] stroke-[2.5]" />
              <span className="font-medium text-[#263445]">{t.trustOfficial}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#168A83] stroke-[2.5]" />
              <span className="font-medium text-[#263445]">{t.trustPersonalized}</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-[#F5F8FC] border-b border-[#E1E7EF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B67] font-heading">
              {t.howItWorksHeading}
            </h2>
            <p className="text-sm text-[#667085] mt-2 font-normal">
              {t.howItWorksSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-xl border border-[#E1E7EF] p-6 shadow-2xs space-y-3">
              <div className="h-9 w-9 rounded-lg bg-[#EAF2FA] text-[#173B67] font-bold font-mono text-sm flex items-center justify-center border border-[#CBDFF5]">
                01
              </div>
              <h3 className="text-base font-bold text-[#173B67]">
                {t.step1Title}
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed font-normal">
                {t.step1Desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl border border-[#E1E7EF] p-6 shadow-2xs space-y-3">
              <div className="h-9 w-9 rounded-lg bg-[#EAF2FA] text-[#173B67] font-bold font-mono text-sm flex items-center justify-center border border-[#CBDFF5]">
                02
              </div>
              <h3 className="text-base font-bold text-[#173B67]">
                {t.step2Title}
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed font-normal">
                {t.step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl border border-[#E1E7EF] p-6 shadow-2xs space-y-3">
              <div className="h-9 w-9 rounded-lg bg-[#EAF2FA] text-[#173B67] font-bold font-mono text-sm flex items-center justify-center border border-[#CBDFF5]">
                03
              </div>
              <h3 className="text-base font-bold text-[#173B67]">
                {t.step3Title}
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed font-normal">
                {t.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST & INTEGRITY ANCHORS (For Navbar 'trust' and 'features') */}
      <section id="trust" className="py-12 sm:py-16 bg-white border-b border-[#E1E7EF]">
        <div id="features" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-[#0F172A]/10 dark:border-white/10 bg-transparent p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-bold text-[#168A83] mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span>{t.trustHeading}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white mb-2">
              {t.trustSubheading}
            </h3>
            <p className="text-xs sm:text-sm text-[#0F172A] dark:text-white leading-relaxed mb-4 font-normal">
              {t.policy1Desc} {t.policy2Desc} {t.policy3Desc}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#0F172A] dark:text-white font-semibold pt-3 border-t border-[#0F172A]/10 dark:border-white/10">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#168A83] stroke-[2.5]" />
                {t.policy1Title}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#168A83] stroke-[2.5]" />
                {t.policy3Title}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#168A83] stroke-[2.5]" />
                {t.policy2Title}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-16 sm:py-20 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B67] font-heading">
            {t.ctaHeading}
          </h2>
          <p className="text-sm text-[#667085] max-w-lg mx-auto leading-relaxed font-normal">
            {t.ctaDesc}
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('signup')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#173B67] hover:bg-[#112C4E] text-white font-bold text-sm tracking-wide shadow-xs transition-colors cursor-pointer"
            >
              <span>{t.findBenefitsBtn}</span>
              <ArrowRight className="h-4 w-4 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
