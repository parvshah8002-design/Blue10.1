import React, { useState, useEffect } from 'react';
import {
  SchemeEvaluation,
  UserProfile,
  UserAccount,
  Scheme,
  UserPriority,
  LogicalState
} from '../types/scheme';
import { SortCriteria } from '../engine/evaluator';
import { Language, TRANSLATIONS, getSchemeText } from '../data/translations';
import { speechService } from '../utils/speech';
import { schemeNavigatorApi, SchemeSchema } from '../services/api';
import { SchemeScraperModal } from './SchemeScraperModal';
import {
  CheckCircle2,
  HelpCircle,
  XCircle,
  SlidersHorizontal,
  Search,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  Building2,
  FileCheck2,
  Volume2,
  VolumeX,
  Scale,
  UserCheck,
  Info,
  ShieldCheck,
  GraduationCap,
  Sprout,
  Briefcase,
  Store,
  Globe,
  RefreshCw,
  Filter,
  AlertTriangle,
  Check
} from 'lucide-react';
import { DEMO_PERSONAS, DemoPersona } from '../data/personas';
import { DisplayCards, DisplayCard } from './ui/display-cards';

interface DashboardProps {
  currentUser: UserAccount | null;
  profile: UserProfile;
  evaluatedSchemes: SchemeEvaluation[];
  summary: {
    totalEligibleOrLikely: number;
    totalAttentionNeeded: number;
    totalNotEligible: number;
    highPriorityGaps: string[];
  };
  currentLang: Language;
  onEditProfile: () => void;
  onSelectScheme: (scheme: Scheme) => void;
  onOpenGlossary: () => void;
  onOpenComparison: (schemes: Scheme[]) => void;
  onSelectPersona: (persona: DemoPersona) => void;
  onSortChange: (sortBy: SortCriteria) => void;
  currentSortBy: SortCriteria;
  onSchemeImported?: (scheme: SchemeSchema) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  profile,
  evaluatedSchemes,
  summary,
  currentLang,
  onEditProfile,
  onSelectScheme,
  onOpenGlossary,
  onOpenComparison,
  onSelectPersona,
  onSortChange,
  currentSortBy,
  onSchemeImported
}) => {
  const t = TRANSLATIONS[currentLang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [selectedStateFilter, setSelectedStateFilter] = useState<'all' | 'MET' | 'UNKNOWN' | 'NOT MET'>('all');
  const [selectedTierFilter, setSelectedTierFilter] = useState<'all' | 'tier1_passed' | 'eligible' | 'near_miss' | 'needs_info'>('all');
  const [comparedSchemeIds, setComparedSchemeIds] = useState<string[]>([]);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'stacked'>('grid');
  const [isScraperOpen, setIsScraperOpen] = useState(false);
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [isCheckingApi, setIsCheckingApi] = useState<boolean>(false);
  const [unconfirmedMiscMap, setUnconfirmedMiscMap] = useState<Record<string, string[]>>({});

  const toggleMiscCondition = (schemeId: string, condition: string) => {
    setUnconfirmedMiscMap(prev => {
      const current = prev[schemeId] || [];
      const exists = current.includes(condition);
      const updated = exists ? current.filter(c => c !== condition) : [...current, condition];
      return { ...prev, [schemeId]: updated };
    });
  };

  // Check health on mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    setIsCheckingApi(true);
    const health = await schemeNavigatorApi.checkHealth();
    setApiConnected(health.status === 'ok' || health.status === 'healthy');
    setIsCheckingApi(false);
  };

  const getCategoryIcon = (priority: string, group?: string) => {
    switch (priority) {
      case 'scholarships':
        return <GraduationCap className="h-4 w-4 text-[#168A83]" />;
      case 'farming':
        return <Sprout className="h-4 w-4 text-[#168A83]" />;
      case 'employment_skills':
        return <Briefcase className="h-4 w-4 text-[#168A83]" />;
      case 'micro_credit':
        return <Store className="h-4 w-4 text-[#168A83]" />;
      default:
        if (group === 'farmers') return <Sprout className="h-4 w-4 text-[#168A83]" />;
        if (group === 'students') return <GraduationCap className="h-4 w-4 text-[#168A83]" />;
        if (group === 'workers') return <Store className="h-4 w-4 text-[#168A83]" />;
        return <ShieldCheck className="h-4 w-4 text-[#168A83]" />;
    }
  };

  // Two-Tier Evaluation calculation helper for an item
  const getTwoTierClassification = (item: SchemeEvaluation) => {
    const demographicRules = item.scheme.rules.filter(r =>
      ['age', 'gender', 'state', 'annualFamilyIncome', 'socialCategory'].includes(r.field)
    );
    const failedDemographics = item.conditionsNotMet.filter(r =>
      demographicRules.some(dr => dr.id === r.rule.id)
    );
    const tier1Passed = failedDemographics.length === 0;

    const unconfirmedMisc = unconfirmedMiscMap[item.scheme.id] || [];
    const hasUnmetMisc = unconfirmedMisc.length > 0;

    let tier: 'eligible' | 'near_miss' | 'needs_info' | 'ineligible';
    let unlockHint = '';

    if (!tier1Passed) {
      tier = 'ineligible';
      unlockHint = `Demographic requirement unmet: ${failedDemographics.map(f => f.rule.label).join(', ')}`;
    } else if (hasUnmetMisc) {
      tier = 'near_miss';
      unlockHint = `Near miss: Self-verification condition unmet — ${unconfirmedMisc.join('; ')}`;
    } else if (item.overallState === 'MET') {
      tier = 'eligible';
      if ((item.scheme.has_misc_conditions || item.requires_misc_check) && (item.scheme.misc_conditions?.length || item.misc_conditions_to_verify?.length)) {
        unlockHint = 'Quick final check required below to self-verify additional conditions.';
      }
    } else if (item.conditionsNotMet.length === 1 && item.conditionsNotMet[0].rule.mandatory) {
      tier = 'near_miss';
      unlockHint = `Near miss: 1 condition requires attention — ${item.conditionsNotMet[0].rule.simpleExplanation}`;
    } else if (item.conditionsUnknown.length > 0 && item.conditionsNotMet.length === 0) {
      tier = 'needs_info';
      unlockHint = `Provide answers for: ${item.missingProfileFields.map(m => m.label).join(', ')}`;
    } else {
      tier = 'ineligible';
    }

    return { tier1Passed, tier, unlockHint, unconfirmedMisc, hasUnmetMisc };
  };

  // Two-Tier Aggregation Counts
  const twoTierStats = React.useMemo(() => {
    let tier1PassCount = 0;
    let eligibleCount = 0;
    let nearMissCount = 0;
    let needsInfoCount = 0;

    evaluatedSchemes.forEach(item => {
      const { tier1Passed, tier } = getTwoTierClassification(item);
      if (tier1Passed) tier1PassCount++;
      if (tier === 'eligible') eligibleCount++;
      if (tier === 'near_miss') nearMissCount++;
      if (tier === 'needs_info') needsInfoCount++;
    });

    return { tier1PassCount, eligibleCount, nearMissCount, needsInfoCount };
  }, [evaluatedSchemes, profile, unconfirmedMiscMap]);

  const toggleCompare = (schemeId: string) => {
    setComparedSchemeIds(prev =>
      prev.includes(schemeId)
        ? prev.filter(id => id !== schemeId)
        : prev.length < 3
        ? [...prev, schemeId]
        : prev
    );
  };

  const handleAudio = (evalItem: SchemeEvaluation) => {
    const { scheme, overallState, conditionsMet, conditionsUnknown } = evalItem;
    if (playingAudioId === scheme.id) {
      speechService.stop();
      setPlayingAudioId(null);
    } else {
      const summaryText = currentLang === 'hi'
        ? `${scheme.name}। ${scheme.tagline}। पात्रता स्थिति: ${
            overallState === 'MET' ? 'संभावित पात्र' : overallState === 'NOT MET' ? 'अपात्र' : 'सत्यापन शेष'
          }। ${conditionsMet.length} शर्तें पूरी हैं और ${conditionsUnknown.length} शर्तें जांची जानी बाकी हैं।`
        : `${scheme.name}. ${scheme.tagline}. Eligibility status: ${
            overallState === 'MET' ? 'Likely Eligible' : overallState === 'NOT MET' ? 'Not Eligible' : 'Needs Information'
          }. ${conditionsMet.length} conditions met, and ${conditionsUnknown.length} conditions require verification.`;

      const started = speechService.speak(summaryText, currentLang, () => {
        setPlayingAudioId(null);
      });
      if (started) setPlayingAudioId(scheme.id);
    }
  };

  const filteredList = evaluatedSchemes.filter(item => {
    const { tier1Passed, tier, hasUnmetMisc } = getTwoTierClassification(item);
    const effectiveState = hasUnmetMisc ? 'NOT MET' : item.overallState;

    // Apply Two-Tier Progressive Filter
    if (selectedTierFilter === 'tier1_passed' && !tier1Passed) return false;
    if (selectedTierFilter === 'eligible' && tier !== 'eligible') return false;
    if (selectedTierFilter === 'near_miss' && tier !== 'near_miss') return false;
    if (selectedTierFilter === 'needs_info' && tier !== 'needs_info') return false;

    if (selectedPriorityFilter !== 'all' && item.scheme.primaryPriority !== selectedPriorityFilter) {
      return false;
    }
    if (selectedStateFilter !== 'all' && effectiveState !== selectedStateFilter) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        item.scheme.name.toLowerCase().includes(q) ||
        item.scheme.simpleDescription.toLowerCase().includes(q) ||
        item.scheme.benefitAmountOrDescription.toLowerCase().includes(q) ||
        item.scheme.ministryOrDepartment.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const comparedSchemes = evaluatedSchemes
    .filter(item => comparedSchemeIds.includes(item.scheme.id))
    .map(item => item.scheme);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-white dark:bg-slate-900/60 border border-[#E1E7EF] dark:border-slate-800 shadow-sm dark:shadow-none animate-slideUp">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-[#168A83]">
              {t.personalizedPortalTitle}
            </span>
            <span className="text-[#667085]">•</span>
            <span className="text-xs text-[#667085]">
              {currentUser?.name ? `${currentLang === 'hi' ? 'नागरिक:' : 'Citizen:'} ${currentUser.name}` : t.activeSession}
            </span>
            <span className="text-[#667085]">•</span>
            {/* Backend API Connection Status */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-slate-50 border-slate-200">
              <span className={`h-2 w-2 rounded-full ${apiConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <span className={apiConnected ? 'text-emerald-700' : 'text-slate-600'}>
                {apiConnected ? 'API: FastAPI Connected' : 'API: Local Engine Fallback'}
              </span>
              <button
                type="button"
                onClick={checkBackendHealth}
                title="Refresh API Connection"
                className="hover:opacity-75 transition-opacity"
              >
                <RefreshCw className={`h-2.5 w-2.5 text-slate-400 ${isCheckingApi ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B67] font-heading">
            {t.dashboardHeadline}
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 max-w-2xl leading-relaxed">
            {t.dashboardSub}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => setIsScraperOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 text-xs font-bold text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-700/60 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs hover:scale-[1.02] active:scale-[0.98]"
            title="Scrape and ingest scheme directly via FastAPI backend"
          >
            <Globe className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span>Scrape Scheme</span>
          </button>
          <button
            onClick={onEditProfile}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-[#F5F8FC] dark:hover:bg-slate-800 text-xs font-bold text-[#173B67] dark:text-teal-300 border border-[#E1E7EF] dark:border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs hover:scale-[1.02] active:scale-[0.98]"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#168A83] dark:text-teal-400" />
            <span>{t.btnEditProfilePriorities}</span>
          </button>
        </div>
      </div>

      {/* Instant Demo Persona Switcher */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/50 border border-[#E1E7EF] dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#263445] dark:text-slate-200 font-semibold">
          <UserCheck className="h-4 w-4 text-[#168A83] dark:text-teal-400" />
          <span>{t.quickSwitchPersona}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {DEMO_PERSONAS.map(p => (
            <button
              key={p.id}
              onClick={() => onSelectPersona(p)}
              className="px-2.5 py-1 rounded-md bg-[#F5F8FC] dark:bg-slate-800 border border-[#E1E7EF] dark:border-slate-700 hover:border-[#173B67] dark:hover:border-teal-500 text-[11px] font-bold text-[#173B67] dark:text-teal-300 transition-colors cursor-pointer"
            >
              {p.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Count Cards (Actual Computed Counts Only) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Likely Eligible */}
        <div
          onClick={() => setSelectedStateFilter(selectedStateFilter === 'MET' ? 'all' : 'MET')}
          className={`p-5 rounded-xl bg-white dark:bg-slate-900/60 border transition-all cursor-pointer shadow-sm dark:shadow-none hover:-translate-y-0.5 ${
            selectedStateFilter === 'MET'
              ? 'border-emerald-500 dark:border-emerald-600 ring-2 ring-emerald-500/10'
              : 'border-[#E1E7EF] dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              {t.likelyEligibleTitle}
            </span>
            <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
              {summary.totalEligibleOrLikely}
            </span>
          </div>
          <p className="text-xs text-[#667085] dark:text-slate-400 leading-relaxed">
            {t.likelyEligibleSubtitle}
          </p>
        </div>

        {/* Needs Information */}
        <div
          onClick={() => setSelectedStateFilter(selectedStateFilter === 'UNKNOWN' ? 'all' : 'UNKNOWN')}
          className={`p-5 rounded-xl bg-white dark:bg-slate-900/60 border transition-all cursor-pointer shadow-sm dark:shadow-none hover:-translate-y-0.5 ${
            selectedStateFilter === 'UNKNOWN'
              ? 'border-amber-500 dark:border-amber-600 ring-2 ring-amber-500/10'
              : 'border-[#E1E7EF] dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" />
              {t.needsInfoTitle}
            </span>
            <span className="text-2xl font-extrabold text-amber-700 dark:text-amber-400 font-mono">
              {summary.totalAttentionNeeded}
            </span>
          </div>
          <p className="text-xs text-[#667085] dark:text-slate-400 leading-relaxed">
            {t.needsInfoSubtitle}
          </p>
        </div>

        {/* Unmet Mandatory Criteria */}
        <div
          onClick={() => setSelectedStateFilter(selectedStateFilter === 'NOT MET' ? 'all' : 'NOT MET')}
          className={`p-5 rounded-xl bg-white dark:bg-slate-900/60 border transition-all cursor-pointer shadow-sm dark:shadow-none hover:-translate-y-0.5 ${
            selectedStateFilter === 'NOT MET'
              ? 'border-rose-500 dark:border-rose-700 ring-2 ring-rose-500/10'
              : 'border-[#E1E7EF] dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-900'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <XCircle className="h-4 w-4" />
              {t.criteriaUnmetTitle}
            </span>
            <span className="text-2xl font-extrabold text-rose-700 dark:text-rose-400 font-mono">
              {summary.totalNotEligible}
            </span>
          </div>
          <p className="text-xs text-[#667085] dark:text-slate-400 leading-relaxed">
            {t.criteriaUnmetSubtitle}
          </p>
        </div>
      </div>

      {/* Two-Tier Progressive Filtering Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-[#E1E7EF] dark:border-slate-800 shadow-sm dark:shadow-none space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0F4F8] pb-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-[#EAF2FA] text-[#173B67]">
              <Layers className="h-4 w-4" />
            </span>
            <div>
              <div className="text-xs font-bold text-[#173B67] uppercase tracking-wider">
                Two-Tier Progressive Filtering
              </div>
              <p className="text-[11px] text-[#667085]">
                Tier 1 (Hard Demographics) + Tier 2 (Specific Eligibility Criteria)
              </p>
            </div>
          </div>
          {selectedTierFilter !== 'all' && (
            <button
              onClick={() => setSelectedTierFilter('all')}
              className="text-xs text-[#168A83] font-semibold hover:underline self-start sm:self-auto cursor-pointer"
            >
              Reset Tier Filter
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* All Schemes */}
          <button
            onClick={() => setSelectedTierFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedTierFilter === 'all'
                ? 'bg-[#173B67] text-white shadow-2xs'
                : 'bg-[#F5F8FC] text-[#263445] hover:bg-[#EAF2FA] border border-[#E1E7EF]'
            }`}
          >
            <span>All Schemes</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 font-mono">
              {evaluatedSchemes.length}
            </span>
          </button>

          {/* Tier 1 Demographics Passed */}
          <button
            onClick={() => setSelectedTierFilter(selectedTierFilter === 'tier1_passed' ? 'all' : 'tier1_passed')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedTierFilter === 'tier1_passed'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Tier 1: Demographics Passed</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-200/60 text-emerald-900 font-mono font-bold">
              {twoTierStats.tier1PassCount}
            </span>
          </button>

          {/* Tier 2: Eligible (Green) */}
          <button
            onClick={() => setSelectedTierFilter(selectedTierFilter === 'eligible' ? 'all' : 'eligible')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedTierFilter === 'eligible'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-300'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Tier 2: Eligible</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
              {twoTierStats.eligibleCount}
            </span>
          </button>

          {/* Tier 2: Near Miss (Amber) */}
          <button
            onClick={() => setSelectedTierFilter(selectedTierFilter === 'near_miss' ? 'all' : 'near_miss')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedTierFilter === 'near_miss'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
            <span>Tier 2: Near Miss</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-200/70 text-amber-900 font-mono font-bold">
              {twoTierStats.nearMissCount}
            </span>
          </button>

          {/* Tier 2: Needs Info (Blue) */}
          <button
            onClick={() => setSelectedTierFilter(selectedTierFilter === 'needs_info' ? 'all' : 'needs_info')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedTierFilter === 'needs_info'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-300'
            }`}
          >
            <Info className="h-3.5 w-3.5 text-blue-600" />
            <span>Tier 2: Needs Info</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-mono font-bold">
              {twoTierStats.needsInfoCount}
            </span>
          </button>
        </div>
      </div>

      {/* Filter & Need-Based Sorting Bar */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900/50 border border-[#E1E7EF] dark:border-slate-800 shadow-sm dark:shadow-none space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Keyword Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#667085]" />
            <input
              type="text"
              placeholder={t.searchSchemesPlaceholder || t.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#E1E7EF] focus:border-[#173B67] focus:ring-1 focus:ring-[#173B67] text-xs text-[#263445] placeholder-[#98A2B3] outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-[#667085] hover:text-[#263445] font-semibold"
              >
                {t.clearBtn}
              </button>
            )}
          </div>

          {/* Dedicated "Sort By" Control */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#263445] shrink-0">
              {t.sortByLabel}
            </span>
            <select
              value={currentSortBy}
              onChange={e => onSortChange(e.target.value as SortCriteria)}
              className="px-3 py-2 rounded-lg bg-[#F5F8FC] border border-[#E1E7EF] text-xs font-semibold text-[#173B67] outline-none focus:border-[#173B67]"
            >
              <option value="priority">{t.sortHighestPriority}</option>
              <option value="eligibility">{t.sortMaxFinancial}</option>
              <option value="needs_info">{t.sortEasiestProcess}</option>
              <option value="recent">{t.allSchemesFilter}</option>
            </select>
          </div>
        </div>

        {/* Priority Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs pt-1 border-t border-[#E1E7EF]">
          <span className="text-[#667085] font-bold shrink-0">
            {t.filterPriorityLabel}
          </span>
          <button
            onClick={() => setSelectedPriorityFilter('all')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer shrink-0 ${
              selectedPriorityFilter === 'all'
                ? 'bg-[#173B67] text-white shadow-2xs'
                : 'bg-[#F5F8FC] text-[#263445] hover:bg-[#EAF2FA] border border-[#E1E7EF]'
            }`}
          >
            {t.allPriorities}
          </button>
          <button
            onClick={() => setSelectedPriorityFilter('scholarships')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer shrink-0 ${
              selectedPriorityFilter === 'scholarships'
                ? 'bg-[#173B67] text-white shadow-2xs'
                : 'bg-[#F5F8FC] text-[#263445] hover:bg-[#EAF2FA] border border-[#E1E7EF]'
            }`}
          >
            🎓 {t.step4TitleLong?.split(' ')[0] || 'Education'}
          </button>
          <button
            onClick={() => setSelectedPriorityFilter('employment_skills')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer shrink-0 ${
              selectedPriorityFilter === 'employment_skills'
                ? 'bg-[#173B67] text-white shadow-2xs'
                : 'bg-[#F5F8FC] text-[#263445] hover:bg-[#EAF2FA] border border-[#E1E7EF]'
            }`}
          >
            💼 {t.occupationPrompt?.split(' ')[0] || 'Employment'}
          </button>
          <button
            onClick={() => setSelectedPriorityFilter('farming')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer shrink-0 ${
              selectedPriorityFilter === 'farming'
                ? 'bg-[#173B67] text-white shadow-2xs'
                : 'bg-[#F5F8FC] text-[#263445] hover:bg-[#EAF2FA] border border-[#E1E7EF]'
            }`}
          >
            🌾 {t.ownsLandCheck?.split(' ')[0] || 'Farming'}
          </button>
          <button
            onClick={() => setSelectedPriorityFilter('micro_credit')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer shrink-0 ${
              selectedPriorityFilter === 'micro_credit'
                ? 'bg-[#173B67] text-white shadow-2xs'
                : 'bg-[#F5F8FC] text-[#263445] hover:bg-[#EAF2FA] border border-[#E1E7EF]'
            }`}
          >
            🛒 {t.familyIncomeLabel?.split(' ')[0] || 'Vendors'}
          </button>
        </div>
      </div>

      {/* Floating Compare Action Bar when schemes selected */}
      {comparedSchemeIds.length > 0 && (
        <div className="sticky bottom-6 z-40 p-4 rounded-xl bg-[#173B67] text-white shadow-xl flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Scale className="h-4 w-4 text-[#EAF2FA]" />
            <span>
              {comparedSchemeIds.length} {t.compareBannerText}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setComparedSchemeIds([])}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white cursor-pointer"
            >
              {t.clearBtn}
            </button>
            <button
              onClick={() => onOpenComparison(comparedSchemes)}
              className="px-4 py-2 rounded-lg bg-white text-[#173B67] font-bold text-xs shadow-xs transition-all cursor-pointer hover:bg-[#EAF2FA]"
            >
              {t.btnCompareNow}
            </button>
          </div>
        </div>
      )}

      {/* Government Schemes Results Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#173B67] font-heading">
            {t.schemesForYouTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] mt-0.5">
            {t.schemesForYouSub}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-[#667085] bg-white px-3 py-1 rounded-full border border-[#E1E7EF]">
            {filteredList.length} {filteredList.length === 1 ? t.schemeFoundSingular : t.schemeFoundPlural}
          </span>
          {filteredList.length >= 2 && (
            <div className="inline-flex rounded-lg bg-white border border-[#E1E7EF] p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#173B67] text-white shadow-2xs'
                    : 'text-[#667085] hover:text-[#263445]'
                }`}
              >
                {t.allSchemesFilter}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('stacked')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  viewMode === 'stacked'
                    ? 'bg-[#173B67] text-white shadow-2xs'
                    : 'text-[#667085] hover:text-[#263445]'
                }`}
                title={t.formatStacked}
              >
                {t.formatStacked}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Results Display Cards */}
      {viewMode === 'stacked' ? (
        <div className="py-6 sm:py-10">
          <DisplayCards mode="stacked" className="mb-8">
            {filteredList.slice(0, 3).map((evalItem, index) => {
              const { scheme, overallState } = evalItem;
              const sInfo = getSchemeText(scheme.id, currentLang, {
                name: scheme.name,
                simpleDescription: scheme.simpleDescription,
                benefit: scheme.benefitAmountOrDescription,
                ministry: scheme.ministryOrDepartment
              });

              const statusText =
                overallState === 'MET'
                  ? t.statusLikelyEligible
                  : overallState === 'UNKNOWN'
                  ? t.statusNeedsInfo
                  : t.statusNotEligible;

              const statusVariant =
                overallState === 'MET'
                  ? 'match'
                  : overallState === 'UNKNOWN'
                  ? 'unknown'
                  : 'unmet';

              return (
                <DisplayCard
                  key={scheme.id}
                  icon={getCategoryIcon(scheme.primaryPriority, scheme.beneficiaryGroup)}
                  ministry={sInfo.ministry}
                  title={sInfo.name}
                  description={sInfo.simpleDescription || scheme.tagline}
                  benefitHighlight={sInfo.benefit}
                  status={statusText}
                  statusVariant={statusVariant}
                  date={scheme.lastVerifiedAt ? scheme.lastVerifiedAt.split('T')[0] : undefined}
                  actionLabel={t.btnViewDetails}
                  onAction={() => onSelectScheme(scheme)}
                  onClick={() => onSelectScheme(scheme)}
                  officialUrl={scheme.officialSourceUrl}
                  officialLabel={t.officialSource}
                  className={`[grid-area:1/1] transition-transform duration-200 ${
                    index === 0
                      ? 'z-30'
                      : index === 1
                      ? 'z-20 sm:translate-x-3 sm:translate-y-3 opacity-95'
                      : 'z-10 sm:translate-x-6 sm:translate-y-6 opacity-90'
                  }`}
                />
              );
            })}
          </DisplayCards>

          <div className="text-center mt-6">
            <button
              onClick={() => setViewMode('grid')}
              className="text-xs font-semibold text-[#173B67] hover:text-[#168A83] underline cursor-pointer"
            >
              {t.allSchemesFilter} ({filteredList.length})
            </button>
          </div>
        </div>
      ) : (
        <DisplayCards className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map(evalItem => {
            const { scheme, overallState, conditionsMet, conditionsNotMet, conditionsUnknown, relevanceReason } = evalItem;
            const { tier1Passed, tier, unlockHint, unconfirmedMisc, hasUnmetMisc } = getTwoTierClassification(evalItem);
            const miscList = scheme.misc_conditions?.length ? scheme.misc_conditions : (evalItem.misc_conditions_to_verify || []);
            const isCompared = comparedSchemeIds.includes(scheme.id);
            const isAudioPlaying = playingAudioId === scheme.id;
            const sInfo = getSchemeText(scheme.id, currentLang, {
              name: scheme.name,
              simpleDescription: scheme.simpleDescription,
              benefit: scheme.benefitAmountOrDescription,
              ministry: scheme.ministryOrDepartment
            });

            const statusText =
              hasUnmetMisc
                ? (currentLang === 'hi' ? 'निकट-चूक (सत्यापन शेष)' : 'Near Miss (Self-Check Unmet)')
                : overallState === 'MET'
                ? t.statusLikelyEligible
                : overallState === 'UNKNOWN'
                ? t.statusNeedsInfo
                : t.statusNotEligible;

            const statusVariant =
              hasUnmetMisc || overallState === 'NOT MET'
                ? 'unmet'
                : overallState === 'MET'
                ? 'match'
                : 'unknown';

            const isStateScheme = Boolean(
              scheme.rules?.some(r => r.field === 'state') ||
              (scheme as any).scheme_type === 'state' ||
              (scheme as any).scheme_type === 'State'
            );

            return (
              <DisplayCard
                key={scheme.id}
                icon={getCategoryIcon(scheme.primaryPriority, scheme.beneficiaryGroup)}
                ministry={sInfo.ministry}
                schemeType={isStateScheme ? 'state' : 'central'}
                title={sInfo.name}
                description={sInfo.simpleDescription || scheme.tagline}
                benefitHighlight={sInfo.benefit}
                status={statusText}
                statusVariant={statusVariant}
                date={scheme.lastVerifiedAt ? scheme.lastVerifiedAt.split('T')[0] : undefined}
                actionLabel={t.btnViewDetails}
                onAction={() => onSelectScheme(scheme)}
                onClick={() => onSelectScheme(scheme)}
                officialUrl={scheme.officialSourceUrl}
                officialLabel={t.officialSource}
              >
                {/* Two-Tier Progressive Filtering Badges */}
                <div className="mb-3 space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 shadow-xs ${
                      tier1Passed
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/60'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                    }`}>
                      <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      {tier1Passed ? 'Tier 1: Demographics Passed' : 'Tier 1: Demographics Unmet'}
                    </span>

                    {tier === 'eligible' && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700/60 shadow-xs">
                        Tier 2: Fully Eligible
                      </span>
                    )}
                    {tier === 'near_miss' && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/60 shadow-xs">
                        Tier 2: Near Miss {hasUnmetMisc ? '(Self-Check Unmet)' : '(1 Step Away)'}
                      </span>
                    )}
                    {tier === 'needs_info' && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700/60 shadow-xs">
                        Tier 2: Missing Information
                      </span>
                    )}
                  </div>

                  {unlockHint && (
                    <div className="text-[11px] p-2.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 leading-snug shadow-xs">
                      <strong className="font-semibold text-amber-950 dark:text-amber-100">Unlock Action: </strong>
                      {unlockHint}
                    </div>
                  )}
                </div>

                {/* Near-Miss / "Why Not" Callout: Amber border, Failed Criteria Tags & Gemma Diff Explanation */}
                {(tier === 'near_miss' || conditionsNotMet.length > 0) && (
                  <div className="mb-3.5 p-3 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-600/50 space-y-2 shadow-xs animate-fadeIn">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>Why Not Eligible Yet (Near Miss)</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/90 dark:bg-amber-900/70 text-amber-950 dark:text-amber-200 border border-amber-400 dark:border-amber-700/50">
                        {conditionsNotMet.length > 0 ? `${conditionsNotMet.length} Criteria Missing` : 'Self-Check Pending'}
                      </span>
                    </div>

                    {/* Clean Tags for Failed Criteria */}
                    {conditionsNotMet.length > 0 && (
                      <div className="space-y-1.5 pt-0.5">
                        <span className="text-[10px] font-bold text-amber-800/90 dark:text-amber-400 uppercase tracking-wider block">Unmet Criteria:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {conditionsNotMet.map((c, cIdx) => (
                            <span
                              key={cIdx}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900/90 border border-amber-300/80 dark:border-amber-700/70 text-amber-950 dark:text-amber-200 text-[11px] font-semibold shadow-xs"
                            >
                              <XCircle className="h-3 w-3 text-rose-500 shrink-0" />
                              <span>{c.rule.label}: <span className="font-normal text-amber-800 dark:text-amber-300/90">{c.reason}</span></span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Explainability Diff Note */}
                    <div className="pt-1 text-[11px] text-amber-950 dark:text-amber-200 leading-relaxed bg-amber-100/60 dark:bg-amber-950/60 p-2.5 rounded-lg border border-amber-200/90 dark:border-amber-800/50 flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-amber-950 dark:text-amber-100">Gemma Explainability: </strong>
                        {evalItem.why_not_explanation || (conditionsNotMet.length > 0 ? `To unlock this benefit, your profile needs to fulfill: ${conditionsNotMet.map(c => c.rule.label).join(', ')}.` : 'Complete the quick self-verification check below to restore full eligibility.')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Two-Tier Quick Final Check (Mint-Green Callout Box & Sleek Checkboxes) */}
                {miscList.length > 0 && (
                  <div className="mb-3.5 p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-400/40 dark:border-emerald-700/50 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-teal-950 dark:text-teal-200">
                        <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                        <span>Quick Final Check (Self-Verification)</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        hasUnmetMisc
                          ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60'
                          : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60'
                      }`}>
                        {hasUnmetMisc ? 'Moved to Near-Miss' : 'Verified'}
                      </span>
                    </div>
                    <p className="text-[11px] text-teal-900/90 dark:text-teal-300 leading-tight">
                      Confirm these scheme-specific exclusions. Unchecking any item dynamically moves this scheme to the Near-Miss / Why-Not bucket:
                    </p>
                    <div className="space-y-1.5 pt-1">
                      {miscList.map((cond, cIdx) => {
                        const isChecked = !unconfirmedMisc.includes(cond);
                        return (
                          <label
                            key={cIdx}
                            onClick={e => e.stopPropagation()}
                            className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-white dark:bg-slate-900/80 hover:bg-white/90 dark:hover:bg-slate-800/80 border border-teal-200/60 dark:border-teal-900/40 shadow-xs'
                                : 'bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleMiscCondition(scheme.id, cond)}
                              className="mt-0.5 rounded border-teal-500 text-teal-600 focus:ring-teal-500 cursor-pointer h-4 w-4"
                            />
                            <span className={`text-[11px] leading-snug ${
                              isChecked
                                ? 'text-slate-800 dark:text-teal-100 font-medium'
                                : 'text-rose-700 dark:text-rose-400 line-through'
                            }`}>
                              {cond}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Relevance explanation & metrics */}
                <div className="mb-4 space-y-3">
                  <div className="p-2.5 rounded-xl bg-[#F5F8FC] dark:bg-slate-950/60 border border-[#E1E7EF] dark:border-slate-800/80 text-xs text-[#263445] dark:text-slate-300 shadow-xs">
                    <div className="text-[11px] font-bold text-[#173B67] dark:text-white flex items-center gap-1.5 mb-1">
                      <Info className="h-3.5 w-3.5 text-[#168A83] dark:text-teal-400" />
                      <span>{t.whyThisResult}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#667085] dark:text-slate-400">
                      {relevanceReason}
                    </p>
                  </div>

                  {/* 3-State Condition summary */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 shadow-xs">
                      <div className="font-extrabold text-emerald-700 dark:text-emerald-400 font-mono text-sm">{conditionsMet.length}</div>
                      <div className="text-[10px] text-[#667085] dark:text-slate-400 font-medium">{t.statusMetBadge}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 shadow-xs">
                      <div className="font-extrabold text-rose-700 dark:text-rose-400 font-mono text-sm">{conditionsNotMet.length}</div>
                      <div className="text-[10px] text-[#667085] dark:text-slate-400 font-medium">{t.statusNotMetBadge}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 shadow-xs">
                      <div className="font-extrabold text-amber-700 dark:text-amber-400 font-mono text-sm">{conditionsUnknown.length}</div>
                      <div className="text-[10px] text-[#667085] dark:text-slate-400 font-medium">{t.statusUnknownBadge}</div>
                    </div>
                  </div>
                </div>

                {/* Compare & Speech Accessibility Row */}
                <div className="pt-2 mb-2 flex items-center justify-between text-xs border-t border-[#F0F4F8]">
                  <label
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#263445] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => toggleCompare(scheme.id)}
                      className="rounded border-[#CBD5E1] text-[#173B67] focus:ring-[#173B67]"
                    />
                    <span>{t.btnCompare}</span>
                  </label>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAudio(evalItem);
                    }}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold ${
                      isAudioPlaying
                        ? 'bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA] animate-pulse'
                        : 'bg-[#F5F8FC] text-[#173B67] hover:bg-[#EAF2FA] border border-[#E1E7EF]'
                    }`}
                    title={isAudioPlaying ? t.stopListening : t.listenToResults}
                  >
                    {isAudioPlaying ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                    <span>{isAudioPlaying ? t.stopListening : t.listenAudioBtn}</span>
                  </button>
                </div>
              </DisplayCard>
            );
          })}
        </DisplayCards>
      )}

      {/* Empty Filter State */}
      {filteredList.length === 0 && (
        <div className="text-center py-16 px-4 rounded-xl bg-white dark:bg-slate-900/50 border border-[#E1E7EF] dark:border-slate-800 animate-fadeIn">
          <Layers className="h-10 w-10 text-[#667085] dark:text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#173B67] dark:text-white mb-1">
            {t.noMatchingSchemes}
          </h3>
          <p className="text-xs text-[#667085] dark:text-slate-400 max-w-sm mx-auto mb-4">
            {t.noMatchingSchemes}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedPriorityFilter('all');
              setSelectedStateFilter('all');
              setSelectedTierFilter('all');
            }}
            className="px-4 py-2 rounded-lg bg-[#173B67] dark:bg-teal-600 hover:bg-[#112C4E] dark:hover:bg-teal-500 text-white font-bold text-xs cursor-pointer transition-colors"
          >
            {t.btnResetFilters}
          </button>
        </div>
      )}

      {/* Scheme Scraper Ingestion Modal */}
      <SchemeScraperModal
        isOpen={isScraperOpen}
        onClose={() => setIsScraperOpen(false)}
        currentLang={currentLang}
        onSchemeImported={onSchemeImported}
      />
    </div>
  );
};
