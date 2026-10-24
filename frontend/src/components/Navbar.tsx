import React, { useState } from 'react';
import { AppView, UserAccount } from '../types/scheme';
import { Language, TRANSLATIONS } from '../data/translations';
import {
  FileCheck2,
  Menu,
  X,
  ChevronDown,
  BookOpen,
  ArrowRight,
  LogOut,
  Info,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: UserAccount | null;
  onLogout: () => void;
  onOpenGlossary: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentLang,
  onLanguageChange,
  currentUser,
  onLogout,
  onOpenGlossary,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const t = TRANSLATIONS[currentLang];

  const handleNav = (view: AppView, anchorId?: string) => {
    setMobileMenuOpen(false);
    onNavigate(view);
    if (anchorId) {
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-[#E1E7EF] dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl shadow-sm dark:shadow-none transition-colors duration-200">
      {/* Top Citizen Transparency Strip */}
      <div className="bg-[#EAF2FA] dark:bg-teal-950/30 border-b border-[#D8E6F5] dark:border-slate-800/60 px-4 py-1 text-[11px] text-[#263445] dark:text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#168A83] dark:text-teal-400" />
            <span>
              <strong className="dark:text-teal-300">{t.citizenAssistanceNotice.split(':')[0]}:</strong>{t.citizenAssistanceNotice.split(':')[1] || ''}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[#667085] dark:text-slate-500">
            <span>{t.zeroDataStorage}</span>
            <span>•</span>
            <span>{t.noAadhaar}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          {/* Left group — Branding */}
          <div
            onClick={() => handleNav('landing')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <img
              src="/logo.png"
              alt="SchemeSaathi Logo"
              className="h-10 w-10 rounded-lg object-contain bg-white dark:bg-gray-900 border border-[#E1E7EF] dark:border-gray-800 p-0.5 shadow-xs shrink-0"
            />
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[#173B67] dark:text-white font-heading whitespace-nowrap">
                  Scheme<span className="text-[#168A83]">Saathi</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EAF2FA] dark:bg-gray-800 text-[#173B67] dark:text-cyan-400 border border-[#CBDFF5] dark:border-gray-700 whitespace-nowrap">
                  {t.publicPortal}
                </span>
              </div>
              <p className="text-[11px] text-[#667085] dark:text-gray-400 hidden xl:block font-medium whitespace-nowrap">
                {t.appTagline}
              </p>
            </div>
          </div>

          {/* Center group — Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            <button
              onClick={() => handleNav('landing')}
              className={`h-9 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer inline-flex items-center justify-center ${
                currentView === 'landing'
                  ? 'bg-[#EAF2FA] text-[#173B67] dark:bg-gray-800 dark:text-[#EAF2FA]'
                  : 'text-[#263445] hover:text-[#173B67] hover:bg-[#F5F8FC] dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => handleNav('landing', 'how-it-works')}
              className="h-9 px-3 rounded-lg text-xs font-semibold whitespace-nowrap text-[#263445] hover:text-[#173B67] hover:bg-[#F5F8FC] dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors cursor-pointer inline-flex items-center justify-center"
            >
              {t.navHowItWorks}
            </button>
            <button
              onClick={() => handleNav('landing', 'features')}
              className="h-9 px-3 rounded-lg text-xs font-semibold whitespace-nowrap text-[#263445] hover:text-[#173B67] hover:bg-[#F5F8FC] dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors cursor-pointer inline-flex items-center justify-center"
            >
              {t.navServices}
            </button>
            <button
              onClick={() => handleNav('landing', 'trust')}
              className="h-9 px-3 rounded-lg text-xs font-semibold whitespace-nowrap text-[#263445] hover:text-[#173B67] hover:bg-[#F5F8FC] dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors cursor-pointer inline-flex items-center justify-center"
            >
              {t.navTrust}
            </button>
            <button
              onClick={onOpenGlossary}
              className="h-9 px-3 rounded-lg text-xs font-semibold whitespace-nowrap text-[#263445] hover:text-[#173B67] hover:bg-[#F5F8FC] dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#168A83]" />
              <span>{t.navCivicTerms}</span>
            </button>
          </nav>

          {/* Right group — User controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Multilingual Selector (English + 22 Eighth Schedule Languages) */}
            <LanguageSelector
              currentLang={currentLang}
              onLanguageChange={onLanguageChange}
              variant="navbar"
            />

            {/* Dark / Light Mode Toggle */}
            {onToggleDarkMode && (
              <button
                type="button"
                onClick={onToggleDarkMode}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                className="h-9 w-9 rounded-lg bg-[#F5F8FC] dark:bg-gray-900 border border-[#E1E7EF] dark:border-gray-800 hover:border-[#173B67] dark:hover:border-gray-700 text-[#173B67] dark:text-gray-200 transition-all cursor-pointer inline-flex items-center justify-center shadow-xs shrink-0"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-[#FCD34D]" />
                ) : (
                  <Moon className="h-4 w-4 text-[#173B67]" />
                )}
              </button>
            )}

            {/* Auth / Account Controls */}
            {currentUser ? (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  className={`h-9 hidden md:inline-flex items-center justify-center px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer border whitespace-nowrap shrink-0 ${
                    currentView === 'dashboard'
                      ? 'bg-[#173B67] text-white border-[#173B67]'
                      : 'bg-[#F5F8FC] dark:bg-gray-900 text-[#173B67] dark:text-gray-200 border-[#E1E7EF] dark:border-gray-800 hover:bg-[#EAF2FA] dark:hover:bg-gray-800'
                  }`}
                >
                  {t.navDashboard}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="h-9 inline-flex items-center gap-2 px-3 rounded-lg bg-[#F5F8FC] dark:bg-gray-900 border border-[#E1E7EF] dark:border-gray-800 hover:border-[#173B67] text-[#263445] dark:text-gray-200 text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <div className="h-5 w-5 rounded-full bg-[#173B67] text-white flex items-center justify-center text-[10px] font-bold">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline font-semibold">{currentUser.name}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-[#667085] dark:text-gray-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl bg-white dark:bg-gray-900 border border-[#E1E7EF] dark:border-gray-800 shadow-lg p-2 z-50">
                      <div className="px-3 py-2 border-b border-[#E1E7EF] dark:border-gray-800 text-xs">
                        <div className="font-bold text-[#173B67] dark:text-white">{currentUser.name}</div>
                        <div className="text-[11px] text-[#667085] dark:text-gray-400 truncate">{currentUser.email}</div>
                      </div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('dashboard');
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-[#263445] dark:text-gray-200 hover:bg-[#F5F8FC] dark:hover:bg-gray-800 rounded-md cursor-pointer font-medium"
                      >
                        {t.navDashboard}
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('onboarding');
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-[#263445] dark:text-gray-200 hover:bg-[#F5F8FC] dark:hover:bg-gray-800 rounded-md cursor-pointer font-medium"
                      >
                        {t.btnEditProfilePriorities}
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-[#B42318] hover:bg-[#FEF3F2] dark:hover:bg-red-950/30 rounded-md cursor-pointer flex items-center gap-1.5 mt-1 border-t border-[#E1E7EF] dark:border-gray-800 font-semibold"
                      >
                        <LogOut className="h-3 w-3" />
                        <span>{t.navSignOut}</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="h-9 px-3.5 inline-flex items-center justify-center text-xs font-bold text-[#173B67] dark:text-gray-200 bg-[#F5F8FC] dark:bg-gray-900 border border-[#E1E7EF] dark:border-gray-800 hover:border-[#173B67] hover:bg-[#EAF2FA] dark:hover:bg-gray-800 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  {t.navSignIn}
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="h-9 hidden sm:inline-flex items-center justify-center gap-1.5 px-4 rounded-lg bg-[#173B67] hover:bg-[#112C4E] text-white font-bold text-xs tracking-wide shadow-xs transition-all cursor-pointer border border-[#173B67] whitespace-nowrap shrink-0"
                >
                  <span>{t.navSignUp}</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.2]" />
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-[#F5F8FC] dark:bg-gray-900 border border-[#E1E7EF] dark:border-gray-800 text-[#263445] dark:text-gray-200 lg:hidden cursor-pointer shrink-0"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E1E7EF] dark:border-gray-800 bg-white dark:bg-black px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => handleNav('landing')}
            className="w-full text-left py-2 text-sm font-semibold text-[#173B67] dark:text-white"
          >
            {t.navHome}
          </button>
          <button
            onClick={() => handleNav('landing', 'how-it-works')}
            className="w-full text-left py-2 text-sm font-semibold text-[#263445] dark:text-gray-300"
          >
            {t.navHowItWorks}
          </button>
          <button
            onClick={() => handleNav('landing', 'features')}
            className="w-full text-left py-2 text-sm font-semibold text-[#263445] dark:text-gray-300"
          >
            {t.navServices}
          </button>
          <button
            onClick={() => handleNav('landing', 'trust')}
            className="w-full text-left py-2 text-sm font-semibold text-[#263445] dark:text-gray-300"
          >
            {t.navTrust}
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenGlossary();
            }}
            className="w-full text-left py-2 text-sm font-semibold text-[#168A83] flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            <span>{t.navCivicTerms}</span>
          </button>

          {onToggleDarkMode && (
            <button
              onClick={() => {
                onToggleDarkMode();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 text-sm font-semibold text-[#263445] dark:text-gray-300 flex items-center gap-2"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-[#FCD34D]" /> : <Moon className="h-4 w-4 text-[#173B67]" />}
              <span>{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
            </button>
          )}

          {/* Mobile Multilingual Selector */}
          <div className="py-2 border-t border-[#E1E7EF] dark:border-gray-800">
            <div className="text-[11px] font-bold text-[#667085] dark:text-gray-400 mb-1.5 px-1">
              {t.selectLanguage || 'Language / भाषा'}
            </div>
            <LanguageSelector
              currentLang={currentLang}
              onLanguageChange={lang => {
                onLanguageChange(lang);
                setMobileMenuOpen(false);
              }}
              variant="mobile"
            />
          </div>

          <div className="pt-3 border-t border-[#E1E7EF] dark:border-gray-800 flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  className="w-full py-2.5 rounded-lg bg-[#173B67] text-white font-bold text-xs text-center"
                >
                  {t.navDashboard} ({currentUser.name})
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2 text-[#B42318] text-xs text-center font-semibold"
                >
                  {t.navSignOut}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNav('login')}
                  className="w-full py-2.5 rounded-lg bg-[#F5F8FC] dark:bg-gray-900 border border-[#E1E7EF] dark:border-gray-800 text-[#173B67] dark:text-gray-200 text-xs font-bold"
                >
                  {t.navSignIn}
                </button>
                <button
                  onClick={() => handleNav('signup')}
                  className="w-full py-2.5 rounded-lg bg-[#173B67] text-white font-bold text-xs"
                >
                  {t.navSignUp}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
