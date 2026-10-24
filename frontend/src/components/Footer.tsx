import React from 'react';
import { ShieldCheck, ExternalLink, Lock, Database, Eye } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

interface FooterProps {
  currentLang: Language;
  onOpenGlossary: () => void;
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onOpenGlossary, onReplayIntro }) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <footer className="w-full border-t border-[#E1E7EF] dark:border-slate-800/80 bg-white dark:bg-slate-950 pt-12 pb-16 text-xs text-[#667085] dark:text-slate-400 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="SchemeSaathi Logo"
                className="h-9 w-9 rounded-lg object-contain bg-white dark:bg-slate-900 border border-[#E1E7EF] dark:border-slate-800 p-0.5 shadow-sm"
              />
              <span className="text-base font-bold text-[#173B67] dark:text-white font-heading">
                Scheme<span className="text-[#168A83] dark:text-teal-400">Saathi</span>
              </span>
            </div>
            <p className="text-[#263445] dark:text-slate-400 leading-relaxed max-w-md text-xs">
              {t.footerMission}
            </p>
            {/* Privacy Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-400 text-[11px] font-semibold">
                <Lock className="h-3 w-3" />
                Zero Data Storage
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-400 text-[11px] font-semibold">
                <Eye className="h-3 w-3" />
                No Aadhaar Required
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF2FA] dark:bg-teal-950/30 border border-[#CBDFF5] dark:border-teal-900/50 text-[#173B67] dark:text-teal-400 text-[11px] font-semibold">
                <ShieldCheck className="h-3 w-3" />
                {t.privacyBadge}
              </span>
            </div>
          </div>

          {/* Quick Verification Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#173B67] dark:text-white uppercase tracking-wider">
              {t.footerVerificationPortals}
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'National Scholarship Portal (NSP)', href: 'https://scholarships.gov.in' },
                { label: 'PM-KISAN Samman Nidhi', href: 'https://pmkisan.gov.in' },
                { label: 'Apprenticeship India (NAPS)', href: 'https://apprenticeshipindia.gov.in' },
                { label: 'PM SVANidhi Portal', href: 'https://pmsvanidhi.mohua.gov.in' },
              ].map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#173B67] dark:hover:text-teal-300 hover:underline transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Citizen Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#173B67] dark:text-white uppercase tracking-wider">
              {t.footerCitizenResources}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenGlossary}
                  className="hover:text-[#173B67] dark:hover:text-teal-300 hover:underline transition-colors text-left cursor-pointer"
                >
                  {t.glossaryTitle || t.navCivicTerms}
                </button>
              </li>
              {[
                { label: 'DigiLocker Online Portal', href: 'https://digilocker.gov.in' },
                { label: 'UIDAI Aadhaar Services', href: 'https://myaadhaar.uidai.gov.in' },
              ].map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#173B67] dark:hover:text-teal-300 hover:underline transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-xl bg-[#EAF2FA] dark:bg-slate-900/60 border border-[#CBDFF5] dark:border-slate-800 text-[11px] text-[#263445] dark:text-slate-400 leading-relaxed mb-8">
          <strong className="text-[#173B67] dark:text-white">{t.footerStatutoryNoticeTitle}</strong>{' '}
          {t.disclaimerText}
        </div>

        {/* Bottom Credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E1E7EF] dark:border-slate-800/70 text-[11px] text-[#667085] dark:text-slate-500">
          <div>
            © {new Date().getFullYear()} SchemeSaathi — Open-Source Public Service Initiative (MIT License).
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">{t.footerAccessibilityTagline}</span>
            {onReplayIntro && (
              <button
                id="replay-intro-btn"
                onClick={onReplayIntro}
                title="Replay the cinematic intro for judges"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#CBDFF5] dark:border-teal-900/60 bg-[#EAF2FA] dark:bg-teal-950/40 hover:bg-[#D6EAFB] dark:hover:bg-teal-900/50 text-[#173B67] dark:text-teal-300 text-[11px] font-bold transition-all cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-[0.97]"
              >
                ▶&nbsp;Replay Intro
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
