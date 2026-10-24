import React, { useState } from 'react';
import { UserProfile } from '../types/scheme';
import { Language, TRANSLATIONS } from '../data/translations';
import {
  HelpCircle,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  Users,
  MapPin,
  Tractor,
  Banknote,
  Sparkles
} from 'lucide-react';

interface ProfileFormProps {
  currentLang: Language;
  profile: UserProfile;
  onChangeProfile: (updated: UserProfile) => void;
  onResetProfile: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  currentLang,
  profile,
  onChangeProfile,
  onResetProfile
}) => {
  const t = TRANSLATIONS[currentLang];
  const [activeTab, setActiveTab] = useState<'basics' | 'education' | 'economic'>('basics');
  const [incomeError, setIncomeError] = useState<string | null>(null);

  const updateField = (key: keyof UserProfile, val: any) => {
    const updated = { ...profile, [key]: val };
    onChangeProfile(updated);
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === '') {
      setIncomeError(null);
      updateField('annualFamilyIncome', undefined);
      return;
    }
    const num = Number(rawVal);
    if (isNaN(num) || num < 0) {
      setIncomeError('Please enter a valid positive income amount in ₹.');
    } else if (num > 100000000) {
      setIncomeError('Please verify the income amount.');
    } else {
      setIncomeError(null);
      updateField('annualFamilyIncome', num);
    }
  };

  // Indian States list for dropdown
  const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi (NCT)', 'Jammu & Kashmir'
  ];

  return (
    <div id="profile-section" className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
      {/* Header & Privacy Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-heading flex items-center gap-2">
            <Users className="h-5 w-5 text-teal-400" />
            <span>{currentLang === 'hi' ? 'नागरिक प्रोफाइल विवरण' : 'Citizen Eligibility Profile'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {currentLang === 'hi'
              ? 'सटीक पात्रता जांचने के लिए प्रासंगिक जानकारी प्रदान करें। सभी आंकड़े केवल आपके ब्राउज़र में संसाधित होते हैं।'
              : 'Answer a few questions to evaluate official scheme rules. Missing fields will remain UNKNOWN without guessing.'}
          </p>
        </div>

        {/* Privacy badge */}
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs">
          <ShieldAlert className="h-4 w-4 shrink-0 text-teal-400" />
          <span className="leading-tight">
            <strong>Civic Privacy:</strong> Never enter Aadhaar, passwords, or bank numbers.
          </span>
        </div>
      </div>

      {/* Progressive Disclosure Section Tabs */}
      <div className="flex items-center gap-2 mt-6 mb-6 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('basics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === 'basics'
              ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
        >
          <MapPin className="h-3.5 w-3.5" />
          <span>1. Demographics & State</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === 'education'
              ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          <span>2. Education & Occupation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('economic')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === 'economic'
              ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
        >
          <Banknote className="h-3.5 w-3.5" />
          <span>3. Income & Landholding</span>
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* TAB 1: Basics */}
        {activeTab === 'basics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
            {/* Age */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Age (Years) <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <span
                  className="text-slate-400 hover:text-teal-400 cursor-help"
                  title="Why needed: Verifies minimum age requirements (e.g., Apprenticeship mandates minimum 14 years)."
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </span>
              </div>
              <input
                type="number"
                min="0"
                max="120"
                placeholder="e.g. 19"
                value={profile.age ?? ''}
                onChange={e => updateField('age', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
              />
              <p className="text-[11px] text-slate-500 mt-1">Checked against minimum statutory ages.</p>
            </div>

            {/* State */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  State / Union Territory <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <span
                  className="text-slate-400 hover:text-teal-400 cursor-help"
                  title="Why needed: Determines regional quota allocation on the National Scholarship Portal."
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </span>
              </div>
              <select
                value={profile.state ?? ''}
                onChange={e => updateField('state', e.target.value || undefined)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-slate-100 outline-none transition-all"
              >
                <option value="">Select State (Optional)</option>
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">Used for state domicile eligibility.</p>
            </div>

            {/* Social Category */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Social Category <span className="text-slate-500 font-normal">(Affirmative Action)</span>
                </label>
                <span
                  className="text-slate-400 hover:text-teal-400 cursor-help"
                  title="Why needed: Required for affirmative action welfare schemes (such as Post-Matric SC Scholarship)."
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </span>
              </div>
              <select
                value={profile.socialCategory ?? ''}
                onChange={e => updateField('socialCategory', e.target.value || undefined)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-slate-100 outline-none transition-all"
              >
                <option value="">Select Category</option>
                <option value="General">General (Unreserved)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="OBC">OBC (Other Backward Class)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">Never shared outside your browser.</p>
            </div>
          </div>
        )}

        {/* TAB 2: Education & Occupation */}
        {activeTab === 'education' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
            {/* Occupation */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Primary Occupation
                </label>
                <span
                  className="text-slate-400 hover:text-teal-400 cursor-help"
                  title="Why needed: Separates student scholarships, farmer income support, and worker welfare."
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </span>
              </div>
              <select
                value={profile.occupation ?? ''}
                onChange={e => updateField('occupation', e.target.value || undefined)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-slate-100 outline-none transition-all"
              >
                <option value="">Select Occupation</option>
                <option value="student">Student (Enrolled in School / College / ITI)</option>
                <option value="farmer">Farmer / Agricultural Cultivator</option>
                <option value="self_employed">Self-Employed / Street Vendor / Artisan</option>
                <option value="unemployed">Unemployed / Job Seeker</option>
                <option value="apprentice_seeker">Seeking Apprenticeship / Skill Training</option>
                <option value="employed">Employed in Formal Sector</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">Helps surface relevant scheme categories.</p>
            </div>

            {/* Education Level */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Current / Highest Education Level
                </label>
                <span
                  className="text-slate-400 hover:text-teal-400 cursor-help"
                  title="Why needed: Central scholarships specify exact thresholds (e.g. undergraduate degree vs diploma vs 10th pass)."
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </span>
              </div>
              <select
                value={profile.educationLevel ?? ''}
                onChange={e => updateField('educationLevel', e.target.value || undefined)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-slate-100 outline-none transition-all"
              >
                <option value="">Select Education Level</option>
                <option value="below_10th">Below 10th Standard</option>
                <option value="10th_pass">10th Pass (Matriculation)</option>
                <option value="12th_pass">12th Pass (Higher Secondary)</option>
                <option value="diploma">Polytechnic / ITI / Diploma</option>
                <option value="undergraduate">Undergraduate Degree (B.A., B.Sc., B.Tech, etc.)</option>
                <option value="postgraduate">Postgraduate Degree (M.A., M.Sc., M.Tech, etc.)</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">Validated against course criteria.</p>
            </div>

            {/* 12th Percentile or Score */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  12th Board Percentile / % <span className="text-slate-500 font-normal">(Merit)</span>
                </label>
                <span
                  className="text-slate-400 hover:text-teal-400 cursor-help"
                  title="Why needed: PM-USP Higher Education Scholarship mandates scoring in the top 20% (>= 80th percentile) of your 12th board."
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </span>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="e.g. 88"
                value={profile.percentile12thOrMarks ?? ''}
                onChange={e => updateField('percentile12thOrMarks', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
              />
              <p className="text-[11px] text-slate-500 mt-1">80+ percentile required for PM-USP CSSS.</p>
            </div>

            {/* Regular Enrolment */}
            <div className="md:col-span-3 flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <input
                id="regular-course"
                type="checkbox"
                checked={profile.enrolledInRegularCourse === true}
                onChange={e => updateField('enrolledInRegularCourse', e.target.checked)}
                className="h-4 w-4 rounded text-teal-500 focus:ring-teal-500 border-slate-700 bg-slate-900 cursor-pointer"
              />
              <label htmlFor="regular-course" className="text-xs text-slate-300 cursor-pointer">
                <strong>Enrolled in a Regular, Full-Time Course</strong> (Distance/correspondence mode courses are ineligible under central scholarship guidelines).
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: Income & Landholding */}
        {activeTab === 'economic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
            {/* Annual Family Income */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Total Annual Family Income (₹ INR per Year)
                </label>
                <span
                  className="text-slate-400 hover:text-teal-400 cursor-help"
                  title="Why needed: Compared against statutory caps (₹2.5 Lakh for SC Post-Matric, ₹4.5 Lakh for PM-USP)."
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-500 font-mono text-sm">₹</span>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 250000"
                  value={profile.annualFamilyIncome ?? ''}
                  onChange={handleIncomeChange}
                  className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border ${incomeError ? 'border-rose-500' : 'border-slate-800'
                    } focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all font-mono`}
                />
              </div>
              {incomeError ? (
                <p className="text-[11px] text-rose-400 mt-1">{incomeError}</p>
              ) : (
                <p className="text-[11px] text-slate-500 mt-1">
                  {profile.annualFamilyIncome
                    ? `Equivalent to ₹${(profile.annualFamilyIncome / 100000).toFixed(2)} Lakhs / year.`
                    : 'Must be verified by official Tehsildar income certificate.'}
                </p>
              )}
            </div>

            {/* Income Tax Payer Exclusion Check */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-200">
                  Income Tax Status (Exclusion Test)
                </label>
                <span
                  className="text-slate-400 hover:text-teal-400 cursor-help"
                  title="Why needed: PM-KISAN guidelines Section 3 strictly exclude all citizens who paid income tax in the last assessment year."
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </span>
              </div>
              <select
                value={profile.isTaxPayer === undefined ? '' : profile.isTaxPayer ? 'yes' : 'no'}
                onChange={e => {
                  const val = e.target.value;
                  if (val === '') updateField('isTaxPayer', undefined);
                  else updateField('isTaxPayer', val === 'yes');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-slate-100 outline-none transition-all"
              >
                <option value="">Select Tax Status</option>
                <option value="no">No — Family does NOT pay income tax (Eligible for welfare)</option>
                <option value="yes">Yes — Family paid income tax in last assessment year</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">Checked for statutory welfare exclusions.</p>
            </div>

            {/* Cultivable Land Ownership */}
            <div className="md:col-span-2 flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <input
                id="land-ownership"
                type="checkbox"
                checked={profile.ownsCultivableLand === true}
                onChange={e => updateField('ownsCultivableLand', e.target.checked)}
                className="h-4 w-4 rounded text-teal-500 focus:ring-teal-500 border-slate-700 bg-slate-900 cursor-pointer"
              />
              <label htmlFor="land-ownership" className="text-xs text-slate-300 cursor-pointer flex-1">
                <strong>Family owns cultivable agricultural land</strong> (Required for PM-KISAN; verified against state Bhulekh/Khatauni land records).
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
