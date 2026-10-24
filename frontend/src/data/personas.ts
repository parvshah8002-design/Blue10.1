import { UserProfile } from '../types/scheme';

export interface DemoPersona {
  id: string;
  name: string;
  tagline: string;
  avatarText: string;
  description: string;
  profile: UserProfile;
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'priya-merit-student',
    name: 'Priya Sharma (Merit College Student)',
    tagline: '1st Year B.Tech, 88% in 12th, ₹2.8L Family Income',
    avatarText: 'PS',
    description: 'High-performing student from Bareilly, UP pursuing regular bachelor degree. Low family income makes higher education costly.',
    profile: {
      age: 19,
      gender: 'female',
      state: 'Uttar Pradesh',
      district: 'Bareilly',
      socialCategory: 'General',
      annualFamilyIncome: 280000,
      occupation: 'student',
      educationLevel: 'undergraduate',
      currentCourse: 'B.Tech Computer Science',
      institutionType: 'Government Engineering College',
      percentile12thOrMarks: 88,
      enrolledInRegularCourse: true,
      ownsCultivableLand: false,
      isTaxPayer: false,
      priorities: ['scholarships']
    }
  },
  {
    id: 'rahul-sc-scholar',
    name: 'Rahul Jatav (Post-Matric SC Scholar)',
    tagline: 'SC Category, Polytechnic Diploma, ₹1.8L Income',
    avatarText: 'RJ',
    description: 'First-generation learner from Nagpur, Maharashtra enrolled in Mechanical Engineering diploma after completing Class 10.',
    profile: {
      age: 18,
      gender: 'male',
      state: 'Maharashtra',
      district: 'Nagpur',
      socialCategory: 'SC',
      annualFamilyIncome: 180000,
      occupation: 'student',
      educationLevel: 'diploma',
      currentCourse: 'Diploma in Mechanical Engineering',
      institutionType: 'Government Polytechnic Institute',
      percentile12thOrMarks: 68,
      enrolledInRegularCourse: true,
      ownsCultivableLand: false,
      isTaxPayer: false,
      priorities: ['scholarships', 'employment_skills']
    }
  },
  {
    id: 'ramesh-farmer',
    name: 'Rameshwar Patel (Small Farmer)',
    tagline: 'Family Owns 1.5 Ha Farm Land, Non-Taxpayer',
    avatarText: 'RP',
    description: 'Cultivator in Vidisha, Madhya Pradesh looking for direct income support to purchase seeds and fertilizer for kharif season.',
    profile: {
      age: 44,
      gender: 'male',
      state: 'Madhya Pradesh',
      district: 'Vidisha',
      socialCategory: 'OBC',
      annualFamilyIncome: 120000,
      occupation: 'farmer',
      educationLevel: '10th_pass',
      ownsCultivableLand: true,
      isTaxPayer: false,
      enrolledInRegularCourse: false,
      priorities: ['farming', 'financial_aid']
    }
  },
  {
    id: 'anita-vendor',
    name: 'Anita Devi (Urban Micro-Vendor)',
    tagline: 'Self-Employed Street Vendor, Working Capital Seeker',
    avatarText: 'AD',
    description: 'Informal micro-entrepreneur in Jaipur, Rajasthan running an artisan food stall; needs collateral-free capital to expand inventory.',
    profile: {
      age: 32,
      gender: 'female',
      state: 'Rajasthan',
      district: 'Jaipur',
      socialCategory: 'OBC',
      annualFamilyIncome: 140000,
      occupation: 'self_employed',
      educationLevel: '10th_pass',
      ownsCultivableLand: false,
      isTaxPayer: false,
      priorities: ['micro_credit', 'financial_aid']
    }
  },
  {
    id: 'incomplete-profile',
    name: 'Minimal Incomplete Profile (Asha)',
    tagline: 'Only Age & State entered — Tests Missing Gaps & UNKNOWN states',
    avatarText: '??',
    description: 'Simulates a citizen who only answered two basic questions. Tests that the system never assumes eligibility when data is missing.',
    profile: {
      age: 21,
      state: 'Bihar'
      // Income, category, education, land are deliberately omitted
    }
  }
];
