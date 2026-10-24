import React, { useState } from 'react';
import { UserProfile, UserPriority } from '../types/scheme';
import { Language, TRANSLATIONS } from '../data/translations';
import {
  MapPin,
  GraduationCap,
  Banknote,
  SlidersHorizontal,
  FileCheck2,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Lock,
  Info
} from 'lucide-react';

interface ProfileWizardProps {
  initialProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
  onCancel: () => void;
  currentLang?: Language;
}

export const ProfileWizard: React.FC<ProfileWizardProps> = ({
  initialProfile,
  onComplete,
  onCancel,
  currentLang = 'en'
}) => {
  const t = TRANSLATIONS[currentLang];
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof UserProfile, val: any) => {
    setProfile(prev => ({ ...prev, [key]: val }));
    setError(null);
  };

  const togglePriority = (p: UserPriority) => {
    const existing = profile.priorities || [];
    if (existing.includes(p)) {
      update('priorities', existing.filter(x => x !== p));
    } else {
      update('priorities', [...existing, p]);
    }
  };

  const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi (NCT)', 'Jammu & Kashmir'
  ];

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (profile.age && (profile.age < 5 || profile.age > 110)) {
        setError(currentLang === 'hi' ? 'कृपया 5 से 110 वर्ष के बीच एक मान्य आयु दर्ज करें।' : 'Please enter a valid age between 5 and 110.');
        return;
      }
    }
    if (step === 2) {
      if (!profile.occupation) {
        setError(currentLang === 'hi' ? 'कृपया अपना प्राथमिक व्यवसाय चुनें।' : 'Please select your current primary occupation.');
        return;
      }
    }
    if (step === 3) {
      if (profile.annualFamilyIncome !== undefined && profile.annualFamilyIncome < 0) {
        setError(currentLang === 'hi' ? 'आय ऋणात्मक नहीं हो सकती।' : 'Income cannot be negative.');
        return;
      }
    }
    if (step === 4) {
      if (!profile.priorities || profile.priorities.length === 0) {
        setError(currentLang === 'hi' ? 'कृपया सहायता का कम से कम एक प्राथमिकता क्षेत्र चुनें।' : 'Please select at least one priority area of support.');
        return;
      }
    }
    setStep(s => Math.min(5, s + 1));
  };

  const handleBack = () => {
    setError(null);
    setStep(s => Math.max(1, s - 1));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Wizard Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#168A83] dark:text-teal-400">
          {t.wizardStep} {step} {t.wizardStepOf} 5 — {t.navProfile}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white mt-1 font-heading">
          {t.wizardTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] dark:text-slate-400 mt-1.5 max-w-xl mx-auto">
          {t.wizardSub}
        </p>

        {/* Multi-step Progress Bar */}
        <div className="flex items-center justify-center gap-2 mt-6 max-w-md mx-auto">
          {[1, 2, 3, 4, 5].map(idx => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${idx === step
                  ? 'bg-[#173B67] dark:bg-teal-500'
                  : idx < step
                    ? 'bg-teal-500 dark:bg-teal-700'
                    : 'bg-[#E1E7EF] dark:bg-slate-800'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="p-6 sm:p-8 rounded-xl bg-white dark:bg-slate-900/80 border border-[#E1E7EF] dark:border-slate-800 shadow-md dark:shadow-none animate-slideUp">
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-[#FEF3F2] dark:bg-rose-950/30 border border-[#FECDCA] dark:border-rose-800/50 text-[#B42318] dark:text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* STEP 1: Basic Demographics */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#173B67] dark:text-white uppercase tracking-wider border-b border-[#E1E7EF] dark:border-slate-800 pb-3">
              <MapPin className="h-4 w-4 text-[#168A83] dark:text-teal-400" />
              <span>{currentLang === 'hi' ? 'चरण 1: बुनियादी जनसांख्यिकी और निवास' : 'Step 1: Basic Demographics & Domicile'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-[#263445] dark:text-slate-200 block mb-1">
                  {currentLang === 'hi' ? 'आयु (वर्ष)' : 'Age (Years)'}
                </label>
                <input
                  type="number"
                  placeholder={currentLang === 'hi' ? 'उदा. 19' : 'e.g. 19'}
                  value={profile.age ?? ''}
                  onChange={e => update('age', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-950/70 border border-[#E1E7EF] dark:border-slate-700 focus:border-[#173B67] dark:focus:border-teal-500 focus:ring-1 focus:ring-[#173B67] dark:focus:ring-teal-500 text-xs text-[#263445] dark:text-white placeholder-[#98A2B3] dark:placeholder-slate-600 outline-none transition-all"
                />
                <p className="text-[11px] text-[#667085] dark:text-slate-500 mt-1">
                  {currentLang === 'hi'
                    ? 'आवश्यकता: वैधानिक न्यूनतम आयु के सत्यापन हेतु (जैसे अप्रेंटिसशिप न्यूनतम 14 वर्ष)।'
                    : 'Why needed: Verified against statutory minimum ages (e.g. Apprenticeship min 14 yrs).'}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#263445] dark:text-slate-200 block mb-1">
                  {currentLang === 'hi' ? 'राज्य / केंद्र शासित प्रदेश' : 'State / Union Territory'}
                </label>
                <select
                  value={profile.state ?? ''}
                  onChange={e => update('state', e.target.value || undefined)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-950/70 border border-[#E1E7EF] dark:border-slate-700 focus:border-[#173B67] dark:focus:border-teal-500 focus:ring-1 focus:ring-[#173B67] dark:focus:ring-teal-500 text-xs text-[#263445] dark:text-white outline-none transition-all"
                >
                  <option value="">{currentLang === 'hi' ? 'राज्य चुनें' : 'Select State'}</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <p className="text-[11px] text-[#667085] dark:text-slate-500 mt-1">
                  {currentLang === 'hi'
                    ? 'आवश्यकता: केंद्रीय पोर्टल पर क्षेत्रीय कोटे और पात्रता निर्धारण हेतु।'
                    : 'Why needed: Determines regional quota allocation on central scholarship portals.'}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#263445] dark:text-slate-200 block mb-1">
                  {currentLang === 'hi' ? 'जिला (वैकल्पिक)' : 'District (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder={currentLang === 'hi' ? 'उदा. बरेली या नागपुर' : 'e.g. Bareilly or Nagpur'}
                  value={profile.district ?? ''}
                  onChange={e => update('district', e.target.value || undefined)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-950/70 border border-[#E1E7EF] dark:border-slate-700 focus:border-[#173B67] dark:focus:border-teal-500 focus:ring-1 focus:ring-[#173B67] dark:focus:ring-teal-500 text-xs text-[#263445] dark:text-white placeholder-[#98A2B3] dark:placeholder-slate-600 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#263445] dark:text-slate-200 block mb-1">
                  {currentLang === 'hi' ? 'सामाजिक वर्ग (आरक्षण / श्रेणी)' : 'Social Category (Affirmative Action)'}
                </label>
                <select
                  value={profile.socialCategory ?? ''}
                  onChange={e => update('socialCategory', e.target.value || undefined)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-950/70 border border-[#E1E7EF] dark:border-slate-700 focus:border-[#173B67] dark:focus:border-teal-500 focus:ring-1 focus:ring-[#173B67] dark:focus:ring-teal-500 text-xs text-[#263445] dark:text-white outline-none transition-all"
                >
                  <option value="">{currentLang === 'hi' ? 'वर्ग चुनें' : 'Select Category'}</option>
                  <option value="General">{currentLang === 'hi' ? 'General (सामान्य)' : 'General (Unreserved)'}</option>
                  <option value="SC">{currentLang === 'hi' ? 'SC (अनुसूचित जाति)' : 'SC (Scheduled Caste)'}</option>
                  <option value="ST">{currentLang === 'hi' ? 'ST (अनुसूचित जनजाति)' : 'ST (Scheduled Tribe)'}</option>
                  <option value="OBC">{currentLang === 'hi' ? 'OBC (अन्य पिछड़ा वर्ग)' : 'OBC (Other Backward Class)'}</option>
                  <option value="EWS">{currentLang === 'hi' ? 'EWS (आर्थिक रूप से कमजोर वर्ग)' : 'EWS (Economically Weaker Section)'}</option>
                </select>
                <p className="text-[11px] text-[#667085] mt-1">
                  {currentLang === 'hi'
                    ? 'आवश्यकता: लक्षित सहायता वाली योजनाओं के लिए आवश्यक (उदा. पोस्ट-मैट्रिक एससी छात्रवृत्ति)।'
                    : 'Why needed: Required for schemes offering affirmative assistance (e.g. Post-Matric SC).'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Occupation & Education */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#173B67] dark:text-white uppercase tracking-wider border-b border-[#E1E7EF] dark:border-slate-800 pb-3">
              <GraduationCap className="h-4 w-4 text-[#168A83] dark:text-teal-400" />
              <span>{currentLang === 'hi' ? 'चरण 2: वर्तमान स्थिति और शिक्षा' : 'Step 2: Life Situation & Education'}</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#263445] dark:text-slate-200 block mb-2">
                  {currentLang === 'hi' ? 'वर्तमान में कौन सा विकल्प आपकी स्थिति का सबसे अच्छा वर्णन करता है?' : 'What best describes your current occupation?'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: 'student',
                      label: currentLang === 'hi' ? 'विद्यार्थी / छात्र' : 'Student',
                      sub: currentLang === 'hi' ? 'स्कूल, कॉलेज, विश्वविद्यालय या आईटीआई' : 'School, college, university, or ITI'
                    },
                    {
                      id: 'farmer',
                      label: currentLang === 'hi' ? 'किसान / कृषक' : 'Farmer / Cultivator',
                      sub: currentLang === 'hi' ? 'कृषि भूमि धारक या उत्पादक' : 'Agricultural landholder or grower'
                    },
                    {
                      id: 'self_employed',
                      label: currentLang === 'hi' ? 'स्व-नियोजित / विक्रेता' : 'Self-Employed / Vendor',
                      sub: currentLang === 'hi' ? 'स्ट्रीट वेंडर, कारीगर, दुकानदार' : 'Street vendor, artisan, shopkeeper'
                    },
                    {
                      id: 'unemployed',
                      label: currentLang === 'hi' ? 'रोजगार की तलाश' : 'Job Seeker',
                      sub: currentLang === 'hi' ? 'नौकरी या कौशल प्रशिक्षण के इच्छुक' : 'Looking for employment or skill training'
                    },
                    {
                      id: 'apprentice_seeker',
                      label: currentLang === 'hi' ? 'अप्रेंटिसशिप के इच्छुक' : 'Apprenticeship Seeker',
                      sub: currentLang === 'hi' ? 'व्यावसायिक औद्योगिक कौशल प्रशिक्षण' : 'Seeking industrial skill training'
                    },
                    {
                      id: 'employed',
                      label: currentLang === 'hi' ? 'नियोजित कर्मचारी' : 'Employed Worker',
                      sub: currentLang === 'hi' ? 'संगठित या असंगठित क्षेत्र' : 'Formal or informal sector wage earner'
                    }
                  ].map(occ => (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => {
                        // Set occupation + clear/set boolean flags in one shot
                        setProfile(prev => ({
                          ...prev,
                          occupation: occ.id as UserProfile['occupation'],
                          is_student: occ.id === 'student' || occ.id === 'apprentice_seeker',
                          is_farmer: occ.id === 'farmer',
                        }));
                        setError(null);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
                        profile.occupation === occ.id
                          ? 'bg-[#EAF2FA] dark:bg-teal-950/40 border-[#173B67] dark:border-teal-500 ring-1 ring-[#173B67] dark:ring-teal-500 shadow-xs'
                          : 'bg-[#F5F8FC] dark:bg-slate-950/60 border-[#E1E7EF] dark:border-slate-800 hover:border-[#173B67] dark:hover:border-slate-700'
                      }`}
                    >
                      <div className={`text-xs font-bold ${profile.occupation === occ.id ? 'text-[#173B67] dark:text-teal-300' : 'text-[#173B67] dark:text-white'}`}>{occ.label}</div>
                      <div className="text-[11px] text-[#667085] dark:text-slate-400 mt-0.5">{occ.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}


        {/* STEP 3: Financial & Economic Details */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#173B67] dark:text-white uppercase tracking-wider border-b border-[#E1E7EF] dark:border-slate-800 pb-3">
              <Banknote className="h-4 w-4 text-[#168A83] dark:text-teal-400" />
              <span>{currentLang === 'hi' ? 'चरण 3: आय और भूमि विवरण' : 'Step 3: Income & Landholding Circumstances'}</span>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-[#263445] dark:text-slate-200 block mb-1">
                  {currentLang === 'hi' ? 'कुल वार्षिक पारिवारिक आय (रुपये ₹ / वर्ष)' : 'Total Annual Family Income (INR ₹ / Year)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-[#667085] dark:text-slate-400 font-mono text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder={currentLang === 'hi' ? 'उदा. 250000' : 'e.g. 250000'}
                    value={profile.annualFamilyIncome ?? ''}
                    onChange={e => update('annualFamilyIncome', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-white dark:bg-slate-950/70 border border-[#E1E7EF] dark:border-slate-700 focus:border-[#173B67] dark:focus:border-teal-500 focus:ring-1 focus:ring-[#173B67] dark:focus:ring-teal-500 text-xs text-[#263445] dark:text-white font-mono outline-none transition-all"
                  />
                </div>
                <p className="text-[11px] text-[#667085] dark:text-slate-400 mt-1">
                  {currentLang === 'hi'
                    ? 'आय सीमा: योजनाओं में वैधानिक सीमाएं होती हैं (जैसे एससी छात्रवृत्ति के लिए ₹2.5 लाख, पीएम-यूएसपी के लिए ₹4.5 लाख)।'
                    : 'Why income matters: Schemes have statutory ceilings (e.g. ₹2.5L for SC Scholarship, ₹4.5L for PM-USP).'}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#263445] dark:text-slate-200 block mb-1">
                  {currentLang === 'hi' ? 'क्या आपके परिवार में किसी ने पिछले वर्ष आयकर का भुगतान किया?' : 'Did anyone in your family pay Income Tax in the last assessment year?'}
                </label>
                <select
                  value={profile.isTaxPayer === undefined ? '' : profile.isTaxPayer ? 'yes' : 'no'}
                  onChange={e => {
                    const v = e.target.value;
                    if (v === '') update('isTaxPayer', undefined);
                    else update('isTaxPayer', v === 'yes');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-950/70 border border-[#E1E7EF] dark:border-slate-700 focus:border-[#173B67] dark:focus:border-teal-500 text-xs text-[#263445] dark:text-white outline-none transition-all"
                >
                  <option value="">{currentLang === 'hi' ? 'स्थिति चुनें' : 'Select Status'}</option>
                  <option value="no">
                    {currentLang === 'hi'
                      ? 'नहीं — परिवार आयकर नहीं देता (कल्याणकारी योजनाओं के लिए पात्र)'
                      : 'No — Family does NOT pay income tax (Eligible for welfare)'}
                  </option>
                  <option value="yes">
                    {currentLang === 'hi'
                      ? 'हाँ — परिवार आयकर देता है (वैधानिक बहिष्करण लागू होता है)'
                      : 'Yes — Family pays income tax (Statutory exclusion applies)'}
                  </option>
                </select>
                <p className="text-[11px] text-[#667085] dark:text-slate-400 mt-1">
                  {currentLang === 'hi'
                    ? 'पीएम-किसान धारा 3 के अंतर्गत आयकर दाताओं को बाहर रखा गया है।'
                    : 'PM-KISAN Section 3 excludes income tax payers.'}
                </p>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F5F8FC] dark:bg-slate-950/60 border border-[#E1E7EF] dark:border-slate-800">
                <input
                  type="checkbox"
                  id="land-check"
                  checked={profile.ownsCultivableLand === true}
                  onChange={e => update('ownsCultivableLand', e.target.checked)}
                  className="rounded border-[#CBD5E1] dark:border-slate-700 text-[#173B67] dark:text-teal-500 focus:ring-[#173B67] mt-0.5 cursor-pointer"
                />
                <label htmlFor="land-check" className="text-xs text-[#263445] dark:text-slate-300 font-medium cursor-pointer">
                  {currentLang === 'hi' ? (
                    <>
                      <strong>मेरे परिवार के पास कृषि योग्य भूमि है</strong> (पीएम-किसान के लिए आवश्यक; राज्य भूलेख अभिलेखों से सत्यापित)।
                    </>
                  ) : (
                    <>
                      <strong>My family owns cultivable agricultural land</strong> (Required for PM-KISAN; verified against state Bhulekh records).
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Needs & Priorities */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#173B67] dark:text-white uppercase tracking-wider border-b border-[#E1E7EF] dark:border-slate-800 pb-3">
              <SlidersHorizontal className="h-4 w-4 text-[#168A83] dark:text-teal-400" />
              <span>{currentLang === 'hi' ? 'चरण 4: आपकी आवश्यकताएं और प्राथमिकताएं' : 'Step 4: Your Needs & Support Priorities'}</span>
            </div>

            <div>
              <p className="text-xs text-[#667085] dark:text-slate-400 leading-relaxed mb-4">
                {currentLang === 'hi'
                  ? 'आप मुख्य रूप से किस प्रकार की सहायता चाहते हैं? एक या अधिक प्राथमिकताएं चुनें। स्कीमसाथी आपकी प्राथमिकताओं के आधार पर योजनाओं को क्रमबद्ध करेगा।'
                  : 'What are you primarily looking for? Select one or more priority areas. SchemeSaathi uses these to rank schemes according to your needs.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'scholarships' as UserPriority,
                    title: currentLang === 'hi' ? 'छात्रवृत्ति और उच्च शिक्षा' : 'Scholarships & Higher Education',
                    desc: currentLang === 'hi' ? 'कॉलेज शुल्क सहायता, योग्यता छात्रवृत्ति और फीस प्रतिपूर्ति' : 'College tuition support, merit scholarships, and post-matric fee reimbursement'
                  },
                  {
                    id: 'employment_skills' as UserPriority,
                    title: currentLang === 'hi' ? 'रोजगार और कौशल प्रशिक्षण' : 'Employment & Skill Training',
                    desc: currentLang === 'hi' ? 'औद्योगिक अप्रेंटिसशिप, मासिक सरकारी वजीफा और युवा कौशल प्रशिक्षण' : 'Industrial apprenticeships, monthly government stipends, and youth trades'
                  },
                  {
                    id: 'farming' as UserPriority,
                    title: currentLang === 'hi' ? 'कृषि और किसान कल्याण' : 'Agriculture & Farmer Support',
                    desc: currentLang === 'hi' ? 'गारंटीड नकद सहायता (पीएम-किसान), बीज सहायता और कृषि कल्याण' : 'Guaranteed cash transfers (PM-KISAN), seed assistance, and agricultural welfare'
                  },
                  {
                    id: 'micro_credit' as UserPriority,
                    title: currentLang === 'hi' ? 'सूक्ष्म-ऋण और वेंडर सहायता' : 'Micro-Credit & Informal Workers',
                    desc: currentLang === 'hi' ? 'बिना गारंटी कार्यशील पूंजी, स्ट्रीट वेंडर सूक्ष्म-ऋण और डिजिटल कैशबैक' : 'Collateral-free working capital, street vendor micro-loans, and digital cashback'
                  },
                  {
                    id: 'financial_aid' as UserPriority,
                    title: currentLang === 'hi' ? 'सामान्य सामाजिक सुरक्षा सहायता' : 'General Social Security Assistance',
                    desc: currentLang === 'hi' ? 'सामाजिक सुरक्षा कवच, आपातकालीन सहायता और आजीविका अनुदान' : 'Social safety nets, emergency assistance, and livelihood grants'
                  }
                ].map(item => {
                  const isSelected = (profile.priorities || []).includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => togglePriority(item.id)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 hover:scale-[1.01] active:scale-[0.99] ${isSelected
                          ? 'bg-[#EAF2FA] dark:bg-teal-950/40 border-[#173B67] dark:border-teal-500 ring-1 ring-[#173B67] dark:ring-teal-500 shadow-xs'
                          : 'bg-[#F5F8FC] dark:bg-slate-950/60 border-[#E1E7EF] dark:border-slate-800 hover:border-[#173B67] dark:hover:border-slate-700'
                        }`}
                    >
                      <div
                        className={`h-5 w-5 rounded flex items-center justify-center shrink-0 mt-0.5 border ${isSelected
                            ? 'bg-[#173B67] dark:bg-teal-500 border-[#173B67] dark:border-teal-500 text-white'
                            : 'border-[#CBD5E1] dark:border-slate-700 bg-white dark:bg-slate-900'
                          }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? 'text-[#173B67] dark:text-teal-300' : 'text-[#173B67] dark:text-white'}`}>{item.title}</div>
                        <div className="text-[11px] text-[#667085] dark:text-slate-400 mt-1">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Discover */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#173B67] dark:text-white uppercase tracking-wider border-b border-[#E1E7EF] dark:border-slate-800 pb-3">
              <FileCheck2 className="h-4 w-4 text-[#168A83] dark:text-teal-400" />
              <span>{currentLang === 'hi' ? 'चरण 5: विवरण की समीक्षा और योजनाएं खोजें' : 'Step 5: Review Answers & Discover Matches'}</span>
            </div>

            <p className="text-xs text-[#667085] dark:text-slate-400">
              {currentLang === 'hi'
                ? 'सटीक मूल्यांकन शुरू करने से पहले अपने विवरण की जांच करें। आप किसी भी समय बदलाव कर सकते हैं।'
                : 'Review your details before running the deterministic evaluation. You can edit any answer anytime.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F5F8FC] dark:bg-slate-950/60 border border-[#E1E7EF] dark:border-slate-800">
                <div className="text-[#667085] dark:text-slate-400">{currentLang === 'hi' ? 'जनसांख्यिकी:' : 'Demographics:'}</div>
                <div className="text-[#173B67] dark:text-teal-300 font-bold mt-0.5">
                  {currentLang === 'hi'
                    ? `आयु: ${profile.age || 'निर्दिष्ट नहीं'} | ${profile.state || 'कोई भी राज्य'} (${profile.socialCategory || 'सामान्य'})`
                    : `Age: ${profile.age || 'Not specified'} | ${profile.state || 'Any State'} (${profile.socialCategory || 'General'})`}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F5F8FC] dark:bg-slate-950/60 border border-[#E1E7EF] dark:border-slate-800">
                <div className="text-[#667085] dark:text-slate-400">{currentLang === 'hi' ? 'व्यवसाय व शिक्षा:' : 'Occupation & Study:'}</div>
                <div className="text-[#173B67] dark:text-teal-300 font-bold mt-0.5">
                  {profile.occupation || (currentLang === 'hi' ? 'निर्दिष्ट नहीं' : 'Not specified')} ({profile.educationLevel || (currentLang === 'hi' ? 'सामान्य' : 'General')})
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F5F8FC] dark:bg-slate-950/60 border border-[#E1E7EF] dark:border-slate-800">
                <div className="text-[#667085] dark:text-slate-400">{currentLang === 'hi' ? 'पारिवारिक वार्षिक आय:' : 'Annual Family Income:'}</div>
                <div className="text-[#173B67] dark:text-teal-300 font-bold mt-0.5 font-mono">
                  {profile.annualFamilyIncome ? `₹${profile.annualFamilyIncome.toLocaleString('en-IN')}` : (currentLang === 'hi' ? 'प्रदान नहीं की गई' : 'Not provided')}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F5F8FC] dark:bg-slate-950/60 border border-[#E1E7EF] dark:border-slate-800">
                <div className="text-[#667085] dark:text-slate-400">{currentLang === 'hi' ? 'चयनित प्राथमिकताएं:' : 'Selected Priorities:'}</div>
                <div className="text-[#168A83] dark:text-teal-400 font-bold mt-0.5">
                  {(profile.priorities || []).join(', ') || (currentLang === 'hi' ? 'सामान्य खोज' : 'General Discovery')}
                </div>
              </div>
            </div>

            {/* Privacy Assurance Box */}
            <div className="p-3.5 rounded-xl bg-[#EAF2FA] dark:bg-teal-950/30 border border-[#CBDFF5] dark:border-teal-900/40 text-xs text-[#173B67] dark:text-teal-300 flex items-start gap-2.5">
              <Lock className="h-4 w-4 text-[#168A83] dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong>{currentLang === 'hi' ? 'गोपनीयता सुरक्षा:' : 'Privacy Guarantee:'}</strong>{' '}
                {currentLang === 'hi'
                  ? 'आपके उत्तर केवल आपके डिवाइस पर स्थानीय रूप से सुरक्षित रहते हैं। कोई भी व्यक्तिगत डेटा अनधिकृत पक्षों के साथ साझा नहीं किया जाता।'
                  : 'Answers remain stored locally on your device. Zero personal data is shared with unverified commercial third parties.'}
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-[#E1E7EF] dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-slate-800 border border-[#E1E7EF] dark:border-slate-700 hover:bg-[#EAF2FA] dark:hover:bg-slate-700 text-xs font-bold text-[#173B67] dark:text-slate-200 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t.btnBack || (currentLang === 'hi' ? 'पीछे' : 'Back')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-xs font-bold text-[#667085] hover:text-[#263445] dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer transition-colors"
            >
              {t.btnCancel || (currentLang === 'hi' ? 'रद्द करें' : 'Cancel')}
            </button>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#173B67] dark:bg-teal-600 hover:bg-[#112C4E] dark:hover:bg-teal-500 text-white font-bold text-xs shadow-xs cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{t.btnContinue || (currentLang === 'hi' ? 'आगे बढ़ें' : 'Continue')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onComplete(profile)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#173B67] dark:bg-teal-600 hover:bg-[#112C4E] dark:hover:bg-teal-500 text-white font-bold text-xs tracking-wide shadow-md cursor-pointer transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              <Sparkles className="h-4 w-4" />
              <span>{t.btnDiscover || (currentLang === 'hi' ? 'मेरी योजनाएं खोजें' : 'Discover My Schemes')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
