import React, { useState, useMemo, useEffect } from 'react';
import {
  UserProfile,
  UserAccount,
  AppView,
  Scheme,
  SchemeEvaluation
} from './types/scheme';
import { VERIFIED_SCHEMES } from './data/schemes';
import { DEMO_PERSONAS, DemoPersona } from './data/personas';
import { evaluateAllSchemes, SortCriteria } from './engine/evaluator';
import { Language, SUPPORTED_LANGUAGES, isRTL } from './i18n';
import { schemeNavigatorApi, SchemeSchema, convertBackendSchemaToScheme } from './services/api';

// Components
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { ProfileWizard } from './components/ProfileWizard';
import { Dashboard } from './components/Dashboard';
import { SchemeDetailView } from './components/SchemeDetailView';
import { SchemeComparisonView } from './components/SchemeComparisonView';
import { CivicGlossaryModal } from './components/CivicGlossaryModal';
import { Footer } from './components/Footer';
import { IntroSplash } from './components/IntroSplash';

const SPLASH_SESSION_KEY = 'schemesaathi-intro-played';

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Intro splash — plays once per browser session
  const [showSplash, setShowSplash] = useState<boolean>(
    () => !sessionStorage.getItem(SPLASH_SESSION_KEY)
  );

  const handleSplashDone = () => {
    sessionStorage.setItem(SPLASH_SESSION_KEY, '1');
    setShowSplash(false);
  };

  const handleReplayIntro = () => {
    sessionStorage.removeItem(SPLASH_SESSION_KEY);
    setShowSplash(true);
  };

  // Global Language State (persisted across sessions & navigations)
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    const saved = localStorage.getItem('schemesaathi-lang') as Language;
    return saved && SUPPORTED_LANGUAGES.some(l => l.code === saved) ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('schemesaathi-lang', currentLang);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRTL(currentLang) ? 'rtl' : 'ltr';
  }, [currentLang]);

  // Dark Mode Theme State (defaults to true: dark mode enabled)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('schemesaathi-theme');
    return saved !== 'light';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('schemesaathi-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('schemesaathi-theme', 'light');
    }
  }, [isDarkMode]);

  // Auth & Session State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Profile State (initialized empty for fresh visitor; populated by onboarding or demo persona)
  const [profile, setProfile] = useState<UserProfile>({});

  // Sorting State
  const [currentSortBy, setCurrentSortBy] = useState<SortCriteria>('priority');

  // Selected Detail Scheme & Comparison Selection
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [comparedSchemes, setComparedSchemes] = useState<Scheme[]>([]);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  // Schemes state: initialized with VERIFIED_SCHEMES, dynamically synchronized with backend
  const [schemes, setSchemes] = useState<Scheme[]>(VERIFIED_SCHEMES);

  useEffect(() => {
    async function loadBackendSchemes() {
      try {
        const backendSchemes = await schemeNavigatorApi.getSchemes();
        if (backendSchemes && backendSchemes.length > 0) {
          setSchemes(prev => {
            const map = new Map<string, Scheme>();
            prev.forEach(s => map.set(s.id, s));
            backendSchemes.forEach(b => {
              const converted = convertBackendSchemaToScheme(b);
              map.set(converted.id, converted);
            });
            return Array.from(map.values());
          });
        }
      } catch (err) {
        console.warn('Backend schemes could not be loaded:', err);
      }
    }
    loadBackendSchemes();
  }, []);

  const handleSchemeImported = (scraped: SchemeSchema) => {
    const converted = convertBackendSchemaToScheme(scraped);
    setSchemes(prev => [converted, ...prev.filter(s => s.id !== converted.id)]);
  };

  // Evaluate schemes deterministically
  const evaluationSummary = useMemo(() => {
    return evaluateAllSchemes(schemes, profile, currentSortBy);
  }, [schemes, profile, currentSortBy]);

  // Handle Authentication
  const handleAuthenticate = (account: UserAccount) => {
    setCurrentUser(account);
    if (!account.profileCompleted) {
      setCurrentView('onboarding');
    } else {
      // Default to Priya's profile if demo account already completed
      if (Object.keys(profile).length === 0) {
        setProfile(DEMO_PERSONAS[0].profile);
      }
      setCurrentView('dashboard');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setProfile({});
    setCurrentView('landing');
  };

  // Handle 1-Click Fast Trial Scenario from Landing Page
  const handleQuickDemo = (personaId: string) => {
    const persona = DEMO_PERSONAS.find(p => p.id === personaId) || DEMO_PERSONAS[0];
    setProfile(persona.profile);
    setCurrentUser({
      id: `demo-${persona.id}`,
      name: persona.name.split(' (')[0],
      email: `${persona.id}@schemesaathi.demo`,
      isDemo: true,
      savedSchemeIds: ['pm-usp-csss'],
      profileCompleted: true
    });
    setCurrentView('dashboard');
  };

  // Handle Persona Switching inside Dashboard
  const handleSelectPersona = (persona: DemoPersona) => {
    setProfile(persona.profile);
    if (!currentUser) {
      setCurrentUser({
        id: `demo-${persona.id}`,
        name: persona.name.split(' (')[0],
        email: `${persona.id}@schemesaathi.demo`,
        isDemo: true,
        savedSchemeIds: ['pm-usp-csss'],
        profileCompleted: true
      });
    }
  };

  // Handle Onboarding Completion
  const handleOnboardingComplete = (completedProfile: UserProfile) => {
    setProfile(completedProfile);
    if (currentUser) {
      setCurrentUser({ ...currentUser, profileCompleted: true });
    } else {
      setCurrentUser({
        id: `user-${Date.now()}`,
        name: 'Citizen',
        email: 'citizen@schemesaathi.in',
        isDemo: true,
        savedSchemeIds: [],
        profileCompleted: true
      });
    }
    setCurrentView('dashboard');
  };

  // Update a single profile field (e.g. from detail view or gap analyzer)
  const handleUpdateProfileField = (key: keyof UserProfile, val: any) => {
    setProfile(prev => ({ ...prev, [key]: val }));
  };

  // Find evaluation for selected scheme
  const selectedSchemeEvaluation = useMemo(() => {
    if (!selectedScheme) return null;
    return (
      evaluationSummary.evaluatedSchemes.find(e => e.scheme.id === selectedScheme.id) ||
      evaluationSummary.evaluatedSchemes[0]
    );
  }, [selectedScheme, evaluationSummary]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC] dark:bg-black text-[#263445] dark:text-slate-200 font-sans selection:bg-[#168A83]/20 dark:selection:bg-teal-500/25 selection:text-[#173B67] dark:selection:text-teal-200 transition-colors duration-200">
      {/* Cinematic Intro Splash (plays once per session) */}
      {showSplash && <IntroSplash onDone={handleSplashDone} />}
      {/* Global Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {/* VIEW 1: PUBLIC LANDING PAGE */}
        {currentView === 'landing' && (
          <LandingPage
            currentLang={currentLang}
            onNavigate={setCurrentView}
            onQuickDemo={handleQuickDemo}
          />
        )}

        {/* VIEW 2: AUTHENTICATION (LOGIN & SIGNUP) */}
        {(currentView === 'login' || currentView === 'signup') && (
          <AuthPage
            initialMode={currentView}
            onAuthenticate={handleAuthenticate}
            onNavigate={setCurrentView}
            currentLang={currentLang}
          />
        )}

        {/* VIEW 3: MULTI-STEP PROFILE ONBOARDING WIZARD */}
        {currentView === 'onboarding' && (
          <ProfileWizard
            initialProfile={profile}
            onComplete={handleOnboardingComplete}
            onCancel={() => setCurrentView(currentUser?.profileCompleted ? 'dashboard' : 'landing')}
            currentLang={currentLang}
          />
        )}

        {/* VIEW 4: PERSONALIZED BENEFITS DASHBOARD */}
        {currentView === 'dashboard' && (
          <Dashboard
            currentUser={currentUser}
            profile={profile}
            evaluatedSchemes={evaluationSummary.evaluatedSchemes}
            summary={evaluationSummary}
            currentLang={currentLang}
            onEditProfile={() => setCurrentView('onboarding')}
            onSelectScheme={scheme => {
              setSelectedScheme(scheme);
              setCurrentView('scheme_detail');
            }}
            onOpenGlossary={() => setIsGlossaryOpen(true)}
            onOpenComparison={schemes => {
              setComparedSchemes(schemes);
              setCurrentView('compare');
            }}
            onSelectPersona={handleSelectPersona}
            onSortChange={setCurrentSortBy}
            currentSortBy={currentSortBy}
            onSchemeImported={handleSchemeImported}
          />
        )}

        {/* VIEW 5: DETAILED SCHEME EXPLANATION */}
        {currentView === 'scheme_detail' && selectedScheme && selectedSchemeEvaluation && (
          <SchemeDetailView
            scheme={selectedScheme}
            evaluation={selectedSchemeEvaluation}
            profile={profile}
            currentLang={currentLang}
            onBack={() => setCurrentView('dashboard')}
            onUpdateProfileField={handleUpdateProfileField}
          />
        )}

        {/* VIEW 6: SIDE-BY-SIDE SCHEME COMPARISON */}
        {currentView === 'compare' && (
          <SchemeComparisonView
            schemes={comparedSchemes.length > 0 ? comparedSchemes : VERIFIED_SCHEMES.slice(0, 2)}
            evaluations={evaluationSummary.evaluatedSchemes}
            onBack={() => setCurrentView('dashboard')}
            onSelectScheme={scheme => {
              setSelectedScheme(scheme);
              setCurrentView('scheme_detail');
            }}
            currentLang={currentLang}
          />
        )}
      </main>

      {/* Civic Terms Glossary Modal */}
      <CivicGlossaryModal
        isOpen={isGlossaryOpen}
        currentLang={currentLang}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onReplayIntro={handleReplayIntro}
      />
    </div>
  );
}

export default App;
