import React, { useState } from 'react';
import { UserAccount, AppView } from '../types/scheme';
import { Language, TRANSLATIONS } from '../data/translations';
import {
  FileCheck2,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface AuthPageProps {
  initialMode: 'login' | 'signup';
  onAuthenticate: (account: UserAccount) => void;
  onNavigate: (view: AppView) => void;
  currentLang?: Language;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode,
  onAuthenticate,
  onNavigate,
  currentLang = 'en'
}) => {
  const t = TRANSLATIONS[currentLang];
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setError('Password should be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!acceptedTerms) {
        setError('Please accept the privacy policy to proceed.');
        return;
      }

      const newAccount: UserAccount = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        isDemo: true,
        savedSchemeIds: [],
        profileCompleted: false
      };
      onAuthenticate(newAccount);
    } else {
      // Login
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter your email address.');
        return;
      }
      if (!password) {
        setError('Please enter your password.');
        return;
      }

      const existingAccount: UserAccount = {
        id: 'user-default',
        name: email.split('@')[0],
        email: email.trim(),
        isDemo: true,
        savedSchemeIds: ['pm-usp-csss'],
        profileCompleted: true
      };
      onAuthenticate(existingAccount);
    }
  };

  const handleQuickDemoLogin = (demoName: string, demoEmail: string) => {
    const demoAccount: UserAccount = {
      id: `demo-${demoName.toLowerCase().replace(' ', '-')}`,
      name: demoName,
      email: demoEmail,
      isDemo: true,
      savedSchemeIds: ['pm-usp-csss', 'post-matric-sc'],
      profileCompleted: true
    };
    onAuthenticate(demoAccount);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#F5F8FC]">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center gap-2.5 cursor-pointer group"
          >
            <img
              src="/logo.png"
              alt="SchemeSaathi Logo"
              className="h-10 w-10 rounded-lg object-contain bg-white dark:bg-gray-900 border border-[#E1E7EF] dark:border-gray-800 p-0.5 shadow-xs"
            />
            <span className="text-xl font-bold tracking-tight text-[#173B67] dark:text-white font-heading">
              Scheme<span className="text-[#168A83]">Saathi</span>
            </span>
          </div>

          <h2 className="text-2xl font-bold text-[#173B67] font-heading mt-2">
            {mode === 'signup' ? t.authCreateAccount : t.authSignIn}
          </h2>
          <p className="text-xs text-[#667085] max-w-xs mx-auto">
            {mode === 'signup' ? t.authSignupSub : t.authLoginSub}
          </p>
        </div>

        {/* Prototype Transparency Notice */}
        <div className="p-3.5 rounded-lg bg-[#EAF2FA] border border-[#CBDFF5] text-xs text-[#173B67] flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-[#168A83] shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight">
            {t.authPrototypeNotice}
          </div>
        </div>

        {/* Auth Form Card */}
        <div className="p-7 rounded-xl bg-white border border-[#E1E7EF] shadow-md">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#FEF3F2] border border-[#FECDCA] text-[#B42318] text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-bold text-[#263445] block mb-1">
                  {t.authFullName}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-[#667085]" />
                  <input
                    type="text"
                    required
                    placeholder={t.authFullNamePlaceholder}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#E1E7EF] focus:border-[#173B67] focus:ring-1 focus:ring-[#173B67] text-xs text-[#263445] placeholder-[#98A2B3] outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-[#263445] block mb-1">
                {t.authEmail}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#667085]" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#E1E7EF] focus:border-[#173B67] focus:ring-1 focus:ring-[#173B67] text-xs text-[#263445] placeholder-[#98A2B3] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#263445] block mb-1">
                {t.authPassword}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#667085]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-white border border-[#E1E7EF] focus:border-[#173B67] focus:ring-1 focus:ring-[#173B67] text-xs text-[#263445] placeholder-[#98A2B3] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#667085] hover:text-[#263445] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="text-xs font-bold text-[#263445] block mb-1">
                  {t.authConfirmPassword}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#667085]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#E1E7EF] focus:border-[#173B67] focus:ring-1 focus:ring-[#173B67] text-xs text-[#263445] placeholder-[#98A2B3] outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {mode === 'login' ? (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-[#667085] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-[#CBD5E1] text-[#173B67] focus:ring-[#173B67]"
                  />
                  <span>{t.authRememberMe}</span>
                </label>
                <span className="text-[#98A2B3] text-[11px]">{t.authSimulatedSession}</span>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-xs pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={e => setAcceptedTerms(e.target.checked)}
                  className="rounded border-[#CBD5E1] text-[#173B67] focus:ring-[#173B67] mt-0.5"
                />
                <label htmlFor="terms" className="text-[#667085] text-[11px] leading-tight cursor-pointer">
                  {t.authTerms}
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#173B67] hover:bg-[#112C4E] text-white font-bold text-xs tracking-wide shadow-xs transition-all cursor-pointer mt-2"
            >
              {mode === 'signup' ? t.authCreateAccountBtn : t.authSignInBtn}
            </button>
          </form>

          {/* 1-Click Fast Trial Button */}
          <div className="mt-6 pt-5 border-t border-[#E1E7EF]">
            <div className="text-[11px] font-bold text-[#667085] uppercase tracking-wider text-center mb-2.5 flex items-center justify-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#168A83]" />
              <span>{t.authQuickDemo}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Priya Sharma', 'priya@student.in')}
                className="p-2 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF] hover:border-[#173B67] text-[11px] font-semibold text-[#173B67] transition-colors cursor-pointer text-center"
              >
                {t.authStudentAccount}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Rameshwar Patel', 'ramesh@kisan.in')}
                className="p-2 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF] hover:border-[#173B67] text-[11px] font-semibold text-[#173B67] transition-colors cursor-pointer text-center"
              >
                {t.authFarmerAccount}
              </button>
            </div>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-[#667085]">
          {mode === 'signup' ? (
            <p>
              {t.authAlreadyRegistered}{' '}
              <button
                onClick={() => {
                  setError(null);
                  setMode('login');
                }}
                className="text-[#173B67] hover:underline font-bold cursor-pointer"
              >
                {t.authSignIn}
              </button>
            </p>
          ) : (
            <p>
              {t.authNewCitizen}{' '}
              <button
                onClick={() => {
                  setError(null);
                  setMode('signup');
                }}
                className="text-[#173B67] hover:underline font-bold cursor-pointer"
              >
                {t.authCreateAccount}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
