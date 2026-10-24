// ============================================================
// YojanaSaathi — Mock Data (DEMO ONLY)
// All data here is illustrative. Replace with real API later.
// ============================================================

import {
  Scheme,
  CitizenProfile,
  RuleEngineResult,
  DocumentChecklist,
  FormStep,
} from "@/types";

// --------------- MOCK SCHEMES ---------------

export const mockSchemes: Scheme[] = [
  {
    scheme_id: "pm-kisan",
    title_en: "PM-KISAN Samman Nidhi",
    title_hi: "पीएम-किसान सम्मान निधि",
    title_mr: "पीएम-किसान सन्मान निधी",
    department: "Ministry of Agriculture & Farmers Welfare",
    level: "central",
    state: null,
    category: "Agriculture",
    benefits: {
      en: "₹6,000 per year in three instalments directly to bank account for small and marginal farmers.",
      hi: "छोटे और सीमांत किसानों के बैंक खाते में सीधे तीन किस्तों में प्रति वर्ष ₹6,000।",
      mr: "लहान आणि अत्यल्प भूधारक शेतकऱ्यांच्या बँक खात्यात थेट तीन हप्त्यांमध्ये वार्षिक ₹6,000.",
    },
    eligibility_rules: [
      {
        id: "pk-r1",
        field: "isFarmer",
        operator: "eq",
        value: true,
        description: {
          en: "Must be a farmer",
          hi: "किसान होना चाहिए",
          mr: "शेतकरी असणे आवश्यक",
        },
      },
      {
        id: "pk-r2",
        field: "landHoldingAcres",
        operator: "gt",
        value: 0,
        description: {
          en: "Must own agricultural land",
          hi: "कृषि भूमि का स्वामी होना चाहिए",
          mr: "शेतजमीन असणे आवश्यक",
        },
      },
    ],
    matched_rules: [],
    failed_rules: [],
    missing_information: [],
    documents: [
      {
        documentId: "identity_card",
        name: {
          en: "Identity Proof (Aadhaar/Voter ID)",
          hi: "पहचान प्रमाण (आधार/मतदाता पहचान पत्र)",
          mr: "ओळखपत्र (आधार/मतदार ओळखपत्र)",
        },
        status: "unknown",
      },
      {
        documentId: "land_7_12",
        name: {
          en: "7/12 & 8A Land Extract (सातबारा उतारा)",
          hi: "7/12 एवं 8A भूमि अभिलेख (सातबारा उतारा)",
          mr: "7/12 व 8A उतारा (सातबारा उतारा)",
        },
        status: "unknown",
        issuingAuthority: {
          en: "Talathi Office / Mahabhulekh Portal",
          hi: "तलाठी कार्यालय / महाभूलेख पोर्टल",
          mr: "तलाठी कार्यालय / महाभूलेख पोर्टल",
        },
      },
      {
        documentId: "bank_passbook",
        name: {
          en: "Bank Account Passbook",
          hi: "बैंक खाता पासबुक",
          mr: "बँक खाते पासबुक",
        },
        status: "unknown",
      },
    ],
    official_apply_url: "https://pmkisan.gov.in/",
    source_url: "https://pmkisan.gov.in/",
    last_verified: "2026-09-15",
    result_status: "eligible",
  },
  {
    scheme_id: "ladki-bahin",
    title_en: "Mukhyamantri Majhi Ladki Bahin Yojana",
    title_hi: "मुख्यमंत्री माझी लाडकी बहीण योजना",
    title_mr: "मुख्यमंत्री माझी लाडकी बहीण योजना",
    department: "Women & Child Development, Maharashtra",
    level: "state",
    state: "Maharashtra",
    category: "Women Welfare",
    benefits: {
      en: "₹1,500 per month financial assistance to eligible women in Maharashtra.",
      hi: "महाराष्ट्र में पात्र महिलाओं को ₹1,500 प्रति माह वित्तीय सहायता।",
      mr: "महाराष्ट्रातील पात्र महिलांना दरमहा ₹1,500 आर्थिक मदत.",
    },
    eligibility_rules: [
      {
        id: "lb-r1",
        field: "gender",
        operator: "eq",
        value: "female",
        description: {
          en: "Must be female",
          hi: "महिला होनी चाहिए",
          mr: "महिला असणे आवश्यक",
        },
      },
      {
        id: "lb-r2",
        field: "state",
        operator: "eq",
        value: "Maharashtra",
        description: {
          en: "Must be a resident of Maharashtra",
          hi: "महाराष्ट्र का निवासी होना चाहिए",
          mr: "महाराष्ट्राचे रहिवासी असणे आवश्यक",
        },
      },
      {
        id: "lb-r3",
        field: "age",
        operator: "between",
        value: [21, 65],
        description: {
          en: "Age must be between 21 and 65 years",
          hi: "आयु 21 से 65 वर्ष के बीच होनी चाहिए",
          mr: "वय 21 ते 65 वर्षे दरम्यान असावे",
        },
      },
      {
        id: "lb-r4",
        field: "annualHouseholdIncome",
        operator: "lte",
        value: 250000,
        description: {
          en: "Annual household income must be ≤ ₹2,50,000",
          hi: "वार्षिक घरेलू आय ₹2,50,000 से कम या बराबर होनी चाहिए",
          mr: "वार्षिक कौटुंबिक उत्पन्न ₹2,50,000 पेक्षा कमी किंवा समान असावे",
        },
      },
    ],
    matched_rules: [],
    failed_rules: [],
    missing_information: [],
    documents: [
      {
        documentId: "identity_card",
        name: {
          en: "Identity Proof (Aadhaar/Voter ID)",
          hi: "पहचान प्रमाण (आधार/मतदाता पहचान पत्र)",
          mr: "ओळखपत्र (आधार/मतदार ओळखपत्र)",
        },
        status: "unknown",
      },
      {
        documentId: "income_certificate",
        name: {
          en: "Income Certificate (उत्पन्नाचा दाखला)",
          hi: "आय प्रमाणपत्र (उत्पन्नाचा दाखला)",
          mr: "उत्पन्नाचा दाखला",
        },
        status: "unknown",
        issuingAuthority: {
          en: "Tehsildar / Maha e-Seva Kendra",
          hi: "तहसीलदार / महा ई-सेवा केंद्र",
          mr: "तहसीलदार / महा ई-सेवा केंद्र",
        },
      },
      {
        documentId: "domicile_certificate",
        name: {
          en: "Domicile Certificate (अधिवास प्रमाणपत्र)",
          hi: "अधिवास प्रमाणपत्र",
          mr: "अधिवास प्रमाणपत्र / रहिवासी दाखला",
        },
        status: "unknown",
      },
      {
        documentId: "bank_passbook",
        name: {
          en: "Bank Account Passbook",
          hi: "बैंक खाता पासबुक",
          mr: "बँक खाते पासबुक",
        },
        status: "unknown",
      },
    ],
    official_apply_url: "https://womenchild.maharashtra.gov.in/",
    source_url: "https://womenchild.maharashtra.gov.in/",
    last_verified: "2026-09-20",
    result_status: "eligible",
  },
  {
    scheme_id: "pmay-gramin",
    title_en: "Pradhan Mantri Awas Yojana – Gramin (PMAY-G)",
    title_hi: "प्रधानमंत्री आवास योजना – ग्रामीण (PMAY-G)",
    title_mr: "प्रधानमंत्री आवास योजना – ग्रामीण (PMAY-G)",
    department: "Ministry of Rural Development",
    level: "central",
    state: null,
    category: "Housing",
    benefits: {
      en: "Financial assistance of ₹1,20,000 (plain areas) or ₹1,30,000 (hilly areas) for construction of pucca house.",
      hi: "पक्के मकान के निर्माण के लिए ₹1,20,000 (मैदानी क्षेत्र) या ₹1,30,000 (पहाड़ी क्षेत्र) की वित्तीय सहायता।",
      mr: "पक्क्या घराच्या बांधकामासाठी ₹1,20,000 (मैदानी भाग) किंवा ₹1,30,000 (डोंगरी भाग) आर्थिक मदत.",
    },
    eligibility_rules: [
      {
        id: "pmay-r1",
        field: "annualHouseholdIncome",
        operator: "lte",
        value: 300000,
        description: {
          en: "Annual household income must be ≤ ₹3,00,000",
          hi: "वार्षिक घरेलू आय ₹3,00,000 से कम या बराबर होनी चाहिए",
          mr: "वार्षिक कौटुंबिक उत्पन्न ₹3,00,000 पेक्षा कमी असावे",
        },
      },
    ],
    matched_rules: [],
    failed_rules: [],
    missing_information: [],
    documents: [
      {
        documentId: "identity_card",
        name: {
          en: "Identity Proof (Aadhaar/Voter ID)",
          hi: "पहचान प्रमाण",
          mr: "ओळखपत्र",
        },
        status: "unknown",
      },
      {
        documentId: "ration_card",
        name: {
          en: "Ration Card (BPL/Antyodaya)",
          hi: "राशन कार्ड (BPL/अंत्योदय)",
          mr: "रेशन कार्ड (BPL/अंत्योदय)",
        },
        status: "unknown",
      },
      {
        documentId: "bank_passbook",
        name: {
          en: "Bank Account Passbook",
          hi: "बैंक खाता पासबुक",
          mr: "बँक खाते पासबुक",
        },
        status: "unknown",
      },
    ],
    official_apply_url: "https://pmayg.nic.in/",
    source_url: "https://pmayg.nic.in/",
    last_verified: "2026-08-10",
    result_status: "possibly_eligible",
  },
  {
    scheme_id: "post-matric-obc",
    title_en: "Post-Matric Scholarship for OBC Students",
    title_hi: "ओबीसी छात्रों के लिए मैट्रिकोत्तर छात्रवृत्ति",
    title_mr: "ओबीसी विद्यार्थ्यांसाठी मॅट्रिकोत्तर शिष्यवृत्ती",
    department: "Ministry of Social Justice & Empowerment",
    level: "central",
    state: null,
    category: "Education",
    benefits: {
      en: "Full tuition fee reimbursement and maintenance allowance for OBC students pursuing post-matric education.",
      hi: "मैट्रिकोत्तर शिक्षा प्राप्त कर रहे ओबीसी छात्रों के लिए पूर्ण ट्यूशन शुल्क प्रतिपूर्ति और रखरखाव भत्ता।",
      mr: "मॅट्रिकोत्तर शिक्षण घेणाऱ्या ओबीसी विद्यार्थ्यांना संपूर्ण शिक्षण शुल्क प्रतिपूर्ती आणि निर्वाह भत्ता.",
    },
    eligibility_rules: [
      {
        id: "pms-r1",
        field: "socialCategory",
        operator: "eq",
        value: "obc",
        description: {
          en: "Must belong to OBC category",
          hi: "ओबीसी श्रेणी से संबंधित होना चाहिए",
          mr: "ओबीसी प्रवर्गातील असणे आवश्यक",
        },
      },
      {
        id: "pms-r2",
        field: "annualHouseholdIncome",
        operator: "lte",
        value: 250000,
        description: {
          en: "Annual household income must be ≤ ₹2,50,000",
          hi: "वार्षिक घरेलू आय ₹2,50,000 से कम या बराबर होनी चाहिए",
          mr: "वार्षिक कौटुंबिक उत्पन्न ₹2,50,000 पेक्षा कमी असावे",
        },
      },
      {
        id: "pms-r3",
        field: "educationLevel",
        operator: "in",
        value: ["12th_pass", "undergraduate", "postgraduate", "diploma"],
        description: {
          en: "Must be pursuing post-matric education (Class 12 or above)",
          hi: "मैट्रिकोत्तर शिक्षा (कक्षा 12 या उससे ऊपर) प्राप्त कर रहा हो",
          mr: "मॅट्रिकोत्तर शिक्षण (इयत्ता 12 किंवा त्यावरील) घेत असावे",
        },
      },
    ],
    matched_rules: [],
    failed_rules: [],
    missing_information: [],
    documents: [
      {
        documentId: "identity_card",
        name: {
          en: "Identity Proof",
          hi: "पहचान प्रमाण",
          mr: "ओळखपत्र",
        },
        status: "unknown",
      },
      {
        documentId: "caste_certificate",
        name: {
          en: "Caste Certificate (OBC) (जात प्रमाणपत्र)",
          hi: "जाति प्रमाणपत्र (ओबीसी)",
          mr: "जात प्रमाणपत्र (ओबीसी)",
        },
        status: "unknown",
        issuingAuthority: {
          en: "Tehsildar / District Magistrate",
          hi: "तहसीलदार / जिलाधिकारी",
          mr: "तहसीलदार / जिल्हाधिकारी",
        },
      },
      {
        documentId: "income_certificate",
        name: {
          en: "Income Certificate (उत्पन्नाचा दाखला)",
          hi: "आय प्रमाणपत्र",
          mr: "उत्पन्नाचा दाखला",
        },
        status: "unknown",
      },
      {
        documentId: "bonafide_receipt",
        name: {
          en: "College Bonafide & Fee Receipt",
          hi: "कॉलेज बोनाफाइड और शुल्क रसीद",
          mr: "कॉलेज बोनाफाईड आणि शुल्क पावती",
        },
        status: "unknown",
      },
    ],
    official_apply_url: "https://scholarships.gov.in/",
    source_url: "https://scholarships.gov.in/",
    last_verified: "2026-07-25",
    result_status: "not_eligible",
  },
  {
    scheme_id: "pm-vishwakarma",
    title_en: "PM Vishwakarma Yojana",
    title_hi: "पीएम विश्वकर्मा योजना",
    title_mr: "पीएम विश्वकर्मा योजना",
    department: "Ministry of Micro, Small & Medium Enterprises",
    level: "central",
    state: null,
    category: "Artisans & MSME",
    benefits: {
      en: "Up to ₹3 lakh collateral-free loan at 5% interest, skill training, toolkit, and digital incentives for traditional artisans.",
      hi: "पारंपरिक कारीगरों के लिए 5% ब्याज पर ₹3 लाख तक का बिना गारंटी ऋण, कौशल प्रशिक्षण, टूलकिट और डिजिटल प्रोत्साहन।",
      mr: "पारंपारिक कारागिरांसाठी 5% व्याजावर ₹3 लाखांपर्यंत बिनातारण कर्ज, कौशल्य प्रशिक्षण, टूलकिट आणि डिजिटल प्रोत्साहने.",
    },
    eligibility_rules: [
      {
        id: "pv-r1",
        field: "occupation",
        operator: "eq",
        value: "artisan_craftsperson",
        description: {
          en: "Must be a traditional artisan or craftsperson",
          hi: "पारंपरिक कारीगर या शिल्पकार होना चाहिए",
          mr: "पारंपारिक कारागीर किंवा हस्तकलाकार असणे आवश्यक",
        },
      },
      {
        id: "pv-r2",
        field: "age",
        operator: "gte",
        value: 18,
        description: {
          en: "Must be at least 18 years old",
          hi: "कम से कम 18 वर्ष का होना चाहिए",
          mr: "किमान 18 वर्षे वयाचे असावे",
        },
      },
    ],
    matched_rules: [],
    failed_rules: [],
    missing_information: [],
    documents: [
      {
        documentId: "identity_card",
        name: {
          en: "Identity Proof",
          hi: "पहचान प्रमाण",
          mr: "ओळखपत्र",
        },
        status: "unknown",
      },
      {
        documentId: "bank_passbook",
        name: {
          en: "Bank Account Passbook",
          hi: "बैंक खाता पासबुक",
          mr: "बँक खाते पासबुक",
        },
        status: "unknown",
      },
    ],
    official_apply_url: "https://pmvishwakarma.gov.in/",
    source_url: "https://pmvishwakarma.gov.in/",
    last_verified: "2026-09-01",
    result_status: "not_eligible",
  },
];

// --------------- MOCK CITIZEN PROFILES ---------------

export const mockProfiles: { label: string; profile: CitizenProfile }[] = [
  {
    label: "Savita — Rural Woman Farmer",
    profile: {
      state: "Maharashtra",
      district: "Pune",
      age: 42,
      gender: "female",
      annualHouseholdIncome: 90000,
      occupation: "farmer",
      educationLevel: "10th_pass",
      socialCategory: "obc",
      disabilityStatus: false,
      isFarmer: true,
      landHoldingAcres: 1.5,
      documentsAvailable: ["identity_card", "ration_card", "bank_passbook"],
    },
  },
  {
    label: "Aarav — College Student",
    profile: {
      state: "Maharashtra",
      district: "Nagpur",
      age: 19,
      gender: "male",
      annualHouseholdIncome: 180000,
      occupation: "student",
      educationLevel: "undergraduate",
      socialCategory: "obc",
      disabilityStatus: false,
      isFarmer: false,
      landHoldingAcres: 0,
      documentsAvailable: [
        "identity_card",
        "bonafide_receipt",
        "bank_passbook",
      ],
    },
  },
  {
    label: "Ramesh — Senior Citizen",
    profile: {
      state: "Maharashtra",
      district: "Kolhapur",
      age: 68,
      gender: "male",
      annualHouseholdIncome: 60000,
      occupation: "retired",
      educationLevel: "8th_pass",
      socialCategory: "general",
      disabilityStatus: false,
      isFarmer: false,
      landHoldingAcres: 0,
      documentsAvailable: [
        "identity_card",
        "ration_card",
        "bank_passbook",
      ],
    },
  },
];

// --------------- MOCK ELIGIBILITY RESULTS (per profile) ---------------
// These simulate what the rule engine would return for Savita's profile.

export function getMockResultsForProfile(
  _profile: CitizenProfile
): RuleEngineResult[] {
  return [
    {
      schemeId: "pm-kisan",
      status: "eligible",
      scorePercent: 100,
      matchedRules: [
        {
          ruleId: "pk-r1",
          passed: true,
          userValue: "Yes (farmer)",
          requiredValue: "Must be a farmer",
          description: {
            en: "You are registered as a farmer.",
            hi: "आप किसान के रूप में पंजीकृत हैं।",
            mr: "तुम्ही शेतकरी म्हणून नोंदणीकृत आहात.",
          },
        },
        {
          ruleId: "pk-r2",
          passed: true,
          userValue: "1.5 acres",
          requiredValue: "> 0 acres",
          description: {
            en: "You own agricultural land (1.5 acres).",
            hi: "आपके पास कृषि भूमि है (1.5 एकड़)।",
            mr: "तुमच्याकडे शेतजमीन आहे (1.5 एकर).",
          },
        },
      ],
      failedRules: [],
      missingInformation: [],
    },
    {
      schemeId: "ladki-bahin",
      status: "eligible",
      scorePercent: 100,
      matchedRules: [
        {
          ruleId: "lb-r1",
          passed: true,
          userValue: "Female",
          requiredValue: "Female",
          description: {
            en: "You are female.",
            hi: "आप महिला हैं।",
            mr: "तुम्ही महिला आहात.",
          },
        },
        {
          ruleId: "lb-r2",
          passed: true,
          userValue: "Maharashtra",
          requiredValue: "Maharashtra",
          description: {
            en: "You are a resident of Maharashtra.",
            hi: "आप महाराष्ट्र के निवासी हैं।",
            mr: "तुम्ही महाराष्ट्राचे रहिवासी आहात.",
          },
        },
        {
          ruleId: "lb-r3",
          passed: true,
          userValue: "42 years",
          requiredValue: "21–65 years",
          description: {
            en: "Your age (42) is within the required range (21–65).",
            hi: "आपकी आयु (42) आवश्यक सीमा (21–65) में है।",
            mr: "तुमचे वय (42) आवश्यक मर्यादेत (21–65) आहे.",
          },
        },
        {
          ruleId: "lb-r4",
          passed: true,
          userValue: "₹90,000",
          requiredValue: "≤ ₹2,50,000",
          description: {
            en: "Your household income (₹90,000) is within the limit.",
            hi: "आपकी घरेलू आय (₹90,000) सीमा के भीतर है।",
            mr: "तुमचे कौटुंबिक उत्पन्न (₹90,000) मर्यादेत आहे.",
          },
        },
      ],
      failedRules: [],
      missingInformation: [],
    },
    {
      schemeId: "pmay-gramin",
      status: "possibly_eligible",
      scorePercent: 60,
      matchedRules: [
        {
          ruleId: "pmay-r1",
          passed: true,
          userValue: "₹90,000",
          requiredValue: "≤ ₹3,00,000",
          description: {
            en: "Your household income meets the requirement.",
            hi: "आपकी घरेलू आय आवश्यकता पूरी करती है।",
            mr: "तुमचे कौटुंबिक उत्पन्न आवश्यकता पूर्ण करते.",
          },
        },
      ],
      failedRules: [],
      missingInformation: [
        "Whether you currently have a pucca (permanent) house",
        "Your ration card type (BPL/Antyodaya required)",
      ],
    },
    {
      schemeId: "post-matric-obc",
      status: "not_eligible",
      scorePercent: 33,
      matchedRules: [
        {
          ruleId: "pms-r1",
          passed: true,
          userValue: "OBC",
          requiredValue: "OBC",
          description: {
            en: "You belong to OBC category.",
            hi: "आप ओबीसी श्रेणी से हैं।",
            mr: "तुम्ही ओबीसी प्रवर्गातील आहात.",
          },
        },
      ],
      failedRules: [
        {
          ruleId: "pms-r3",
          passed: false,
          userValue: "10th pass",
          requiredValue: "12th pass or above",
          description: {
            en: "You need to be pursuing post-matric education (Class 12 or above). Your current education level is 10th pass.",
            hi: "आपको मैट्रिकोत्तर शिक्षा (कक्षा 12 या उससे ऊपर) प्राप्त करना चाहिए। आपकी वर्तमान शिक्षा 10वीं पास है।",
            mr: "तुम्हाला मॅट्रिकोत्तर शिक्षण (इयत्ता 12 किंवा त्यावरील) घेत असावे लागते. तुमची सध्याची शिक्षण पातळी 10वी पास आहे.",
          },
        },
      ],
      missingInformation: [],
    },
    {
      schemeId: "pm-vishwakarma",
      status: "not_eligible",
      scorePercent: 50,
      matchedRules: [
        {
          ruleId: "pv-r2",
          passed: true,
          userValue: "42 years",
          requiredValue: "≥ 18 years",
          description: {
            en: "Your age (42) meets the minimum requirement.",
            hi: "आपकी आयु (42) न्यूनतम आवश्यकता पूरी करती है।",
            mr: "तुमचे वय (42) किमान आवश्यकता पूर्ण करते.",
          },
        },
      ],
      failedRules: [
        {
          ruleId: "pv-r1",
          passed: false,
          userValue: "Farmer",
          requiredValue: "Traditional artisan or craftsperson",
          description: {
            en: "This scheme is for traditional artisans and craftspersons. Your occupation is farmer.",
            hi: "यह योजना पारंपरिक कारीगरों और शिल्पकारों के लिए है। आपका व्यवसाय किसान है।",
            mr: "ही योजना पारंपारिक कारागिरांसाठी आहे. तुमचा व्यवसाय शेतकरी आहे.",
          },
        },
      ],
      missingInformation: [],
    },
  ];
}

// --------------- MOCK DOCUMENT CHECKLISTS ---------------

export function getMockDocumentChecklist(
  schemeId: string,
  profile: CitizenProfile
): DocumentChecklist {
  const scheme = mockSchemes.find((s) => s.scheme_id === schemeId);
  if (!scheme) {
    return {
      schemeId,
      schemeName: { en: "Unknown Scheme" },
      items: [],
      confirmedCount: 0,
      totalRequired: 0,
    };
  }

  const items = scheme.documents.map((doc) => ({
    ...doc,
    status: profile.documentsAvailable.includes(doc.documentId)
      ? ("available" as const)
      : ("missing" as const),
  }));

  return {
    schemeId,
    schemeName: {
      en: scheme.title_en,
      hi: scheme.title_hi,
      mr: scheme.title_mr,
    },
    items,
    confirmedCount: items.filter((i) => i.status === "available").length,
    totalRequired: items.length,
  };
}

// --------------- FORM STEPS ---------------

export const formSteps: FormStep[] = [
  {
    id: "location",
    title: {
      en: "Where are you from?",
      hi: "आप कहाँ से हैं?",
      mr: "तुम्ही कुठचे आहात?",
    },
    fields: [
      {
        name: "state",
        label: { en: "State", hi: "राज्य", mr: "राज्य" },
        type: "select",
        required: true,
        options: [
          {
            value: "Maharashtra",
            label: { en: "Maharashtra", hi: "महाराष्ट्र", mr: "महाराष्ट्र" },
          },
          {
            value: "Uttar Pradesh",
            label: {
              en: "Uttar Pradesh",
              hi: "उत्तर प्रदेश",
              mr: "उत्तर प्रदेश",
            },
          },
          {
            value: "Madhya Pradesh",
            label: {
              en: "Madhya Pradesh",
              hi: "मध्य प्रदेश",
              mr: "मध्य प्रदेश",
            },
          },
          {
            value: "Rajasthan",
            label: { en: "Rajasthan", hi: "राजस्थान", mr: "राजस्थान" },
          },
          {
            value: "Gujarat",
            label: { en: "Gujarat", hi: "गुजरात", mr: "गुजरात" },
          },
        ],
      },
      {
        name: "district",
        label: { en: "District", hi: "जिला", mr: "जिल्हा" },
        type: "text",
        required: true,
        placeholder: {
          en: "e.g. Pune, Nagpur",
          hi: "जैसे पुणे, नागपुर",
          mr: "जसे पुणे, नागपूर",
        },
      },
    ],
  },
  {
    id: "demographics",
    title: {
      en: "Tell us about yourself",
      hi: "अपने बारे में बताएं",
      mr: "स्वतःबद्दल सांगा",
    },
    fields: [
      {
        name: "age",
        label: { en: "Age (years)", hi: "आयु (वर्ष)", mr: "वय (वर्षे)" },
        type: "number",
        required: true,
        placeholder: { en: "e.g. 35", hi: "जैसे 35", mr: "जसे 35" },
      },
      {
        name: "gender",
        label: { en: "Gender", hi: "लिंग", mr: "लिंग" },
        type: "radio",
        required: true,
        options: [
          { value: "male", label: { en: "Male", hi: "पुरुष", mr: "पुरुष" } },
          {
            value: "female",
            label: { en: "Female", hi: "महिला", mr: "महिला" },
          },
          { value: "other", label: { en: "Other", hi: "अन्य", mr: "इतर" } },
        ],
      },
    ],
  },
  {
    id: "income",
    title: {
      en: "Household Income",
      hi: "घरेलू आय",
      mr: "कौटुंबिक उत्पन्न",
    },
    fields: [
      {
        name: "annualHouseholdIncome",
        label: {
          en: "Annual household income (₹)",
          hi: "वार्षिक घरेलू आय (₹)",
          mr: "वार्षिक कौटुंबिक उत्पन्न (₹)",
        },
        type: "number",
        required: true,
        helperText: {
          en: "Total income of all earning members in your household per year. Example: If monthly income is ₹10,000, annual income is ₹1,20,000.",
          hi: "आपके परिवार के सभी कमाने वाले सदस्यों की कुल वार्षिक आय। उदाहरण: यदि मासिक आय ₹10,000 है, तो वार्षिक आय ₹1,20,000 है।",
          mr: "तुमच्या कुटुंबातील सर्व कमावत्या सदस्यांचे एकूण वार्षिक उत्पन्न. उदाहरण: मासिक उत्पन्न ₹10,000 असल्यास, वार्षिक उत्पन्न ₹1,20,000.",
        },
        placeholder: {
          en: "e.g. 120000",
          hi: "जैसे 120000",
          mr: "जसे 120000",
        },
      },
    ],
  },
  {
    id: "occupation",
    title: {
      en: "Occupation & Education",
      hi: "व्यवसाय और शिक्षा",
      mr: "व्यवसाय आणि शिक्षण",
    },
    fields: [
      {
        name: "occupation",
        label: { en: "Occupation", hi: "व्यवसाय", mr: "व्यवसाय" },
        type: "select",
        required: true,
        options: [
          {
            value: "farmer",
            label: { en: "Farmer", hi: "किसान", mr: "शेतकरी" },
          },
          {
            value: "artisan_craftsperson",
            label: {
              en: "Artisan / Craftsperson",
              hi: "कारीगर / शिल्पकार",
              mr: "कारागीर / हस्तकलाकार",
            },
          },
          {
            value: "daily_wage_labourer",
            label: {
              en: "Daily Wage Labourer",
              hi: "दिहाड़ी मजदूर",
              mr: "रोजंदारी मजूर",
            },
          },
          {
            value: "self_employed",
            label: {
              en: "Self-Employed",
              hi: "स्वरोजगार",
              mr: "स्वयंरोजगार",
            },
          },
          {
            value: "salaried",
            label: {
              en: "Salaried Employee",
              hi: "वेतनभोगी कर्मचारी",
              mr: "पगारदार कर्मचारी",
            },
          },
          {
            value: "student",
            label: { en: "Student", hi: "छात्र", mr: "विद्यार्थी" },
          },
          {
            value: "homemaker",
            label: { en: "Homemaker", hi: "गृहिणी", mr: "गृहिणी" },
          },
          {
            value: "retired",
            label: { en: "Retired", hi: "सेवानिवृत्त", mr: "सेवानिवृत्त" },
          },
          {
            value: "unemployed",
            label: { en: "Unemployed", hi: "बेरोजगार", mr: "बेरोजगार" },
          },
        ],
      },
      {
        name: "educationLevel",
        label: {
          en: "Education Level",
          hi: "शिक्षा स्तर",
          mr: "शिक्षण पातळी",
        },
        type: "select",
        required: true,
        options: [
          {
            value: "no_formal",
            label: {
              en: "No Formal Education",
              hi: "कोई औपचारिक शिक्षा नहीं",
              mr: "औपचारिक शिक्षण नाही",
            },
          },
          {
            value: "primary",
            label: {
              en: "Primary (1st–5th)",
              hi: "प्राथमिक (1–5वीं)",
              mr: "प्राथमिक (1ली–5वी)",
            },
          },
          {
            value: "8th_pass",
            label: {
              en: "Middle School (8th pass)",
              hi: "मिडिल स्कूल (8वीं पास)",
              mr: "माध्यमिक (8वी पास)",
            },
          },
          {
            value: "10th_pass",
            label: {
              en: "10th Pass (SSC)",
              hi: "10वीं पास (SSC)",
              mr: "10वी पास (SSC)",
            },
          },
          {
            value: "12th_pass",
            label: {
              en: "12th Pass (HSC)",
              hi: "12वीं पास (HSC)",
              mr: "12वी पास (HSC)",
            },
          },
          {
            value: "diploma",
            label: { en: "Diploma / ITI", hi: "डिप्लोमा / ITI", mr: "डिप्लोमा / ITI" },
          },
          {
            value: "undergraduate",
            label: {
              en: "Undergraduate (BA/BSc/BCom etc.)",
              hi: "स्नातक (BA/BSc/BCom आदि)",
              mr: "पदवी (BA/BSc/BCom इ.)",
            },
          },
          {
            value: "postgraduate",
            label: {
              en: "Postgraduate (MA/MSc/MBA etc.)",
              hi: "स्नातकोत्तर (MA/MSc/MBA आदि)",
              mr: "पदव्युत्तर (MA/MSc/MBA इ.)",
            },
          },
        ],
      },
    ],
  },
  {
    id: "social",
    title: {
      en: "Social Category",
      hi: "सामाजिक श्रेणी",
      mr: "सामाजिक प्रवर्ग",
    },
    fields: [
      {
        name: "socialCategory",
        label: {
          en: "Social Category",
          hi: "सामाजिक श्रेणी",
          mr: "सामाजिक प्रवर्ग",
        },
        type: "radio",
        required: true,
        options: [
          {
            value: "general",
            label: { en: "General", hi: "सामान्य", mr: "सामान्य" },
          },
          { value: "obc", label: { en: "OBC", hi: "ओबीसी", mr: "ओबीसी" } },
          { value: "sc", label: { en: "SC", hi: "अनुसूचित जाति", mr: "अनुसूचित जाती" } },
          { value: "st", label: { en: "ST", hi: "अनुसूचित जनजाति", mr: "अनुसूचित जमाती" } },
          { value: "ews", label: { en: "EWS", hi: "ईडब्ल्यूएस", mr: "ईडब्ल्यूएस" } },
        ],
      },
    ],
  },
  {
    id: "disability",
    title: {
      en: "Disability Status",
      hi: "दिव्यांगता स्थिति",
      mr: "अपंगत्व स्थिती",
    },
    fields: [
      {
        name: "disabilityStatus",
        label: {
          en: "Do you have any disability?",
          hi: "क्या आपको कोई दिव्यांगता है?",
          mr: "तुम्हाला कोणतेही अपंगत्व आहे का?",
        },
        type: "radio",
        required: true,
        options: [
          { value: "true", label: { en: "Yes", hi: "हाँ", mr: "हो" } },
          { value: "false", label: { en: "No", hi: "नहीं", mr: "नाही" } },
        ],
      },
    ],
  },
  {
    id: "farming",
    title: {
      en: "Farming & Land",
      hi: "खेती और भूमि",
      mr: "शेती आणि जमीन",
    },
    fields: [
      {
        name: "isFarmer",
        label: {
          en: "Are you a farmer?",
          hi: "क्या आप किसान हैं?",
          mr: "तुम्ही शेतकरी आहात का?",
        },
        type: "radio",
        required: true,
        options: [
          { value: "true", label: { en: "Yes", hi: "हाँ", mr: "हो" } },
          { value: "false", label: { en: "No", hi: "नहीं", mr: "नाही" } },
        ],
      },
      {
        name: "landHoldingAcres",
        label: {
          en: "Land holding (acres)",
          hi: "भूमि (एकड़)",
          mr: "जमीन (एकर)",
        },
        type: "number",
        required: false,
        helperText: {
          en: "How much agricultural land do you own? Enter 0 if none. 1 acre ≈ 0.4 hectare.",
          hi: "आपके पास कितनी कृषि भूमि है? यदि नहीं है तो 0 लिखें। 1 एकड़ ≈ 0.4 हेक्टेयर।",
          mr: "तुमच्याकडे किती शेतजमीन आहे? नसल्यास 0 लिहा. 1 एकर ≈ 0.4 हेक्टर.",
        },
        placeholder: { en: "e.g. 2.5", hi: "जैसे 2.5", mr: "जसे 2.5" },
      },
    ],
  },
  {
    id: "documents",
    title: {
      en: "Documents You Have",
      hi: "आपके पास कौन से दस्तावेज हैं?",
      mr: "तुमच्याकडे कोणती कागदपत्रे आहेत?",
    },
    fields: [
      {
        name: "documentsAvailable",
        label: {
          en: "Select all documents you currently have",
          hi: "वे सभी दस्तावेज चुनें जो आपके पास वर्तमान में हैं",
          mr: "तुमच्याकडे सध्या असलेली सर्व कागदपत्रे निवडा",
        },
        type: "multi-select",
        required: false,
        options: [
          {
            value: "identity_card",
            label: {
              en: "Aadhaar Card / Voter ID",
              hi: "आधार कार्ड / मतदाता पहचान पत्र",
              mr: "आधार कार्ड / मतदार ओळखपत्र",
            },
          },
          {
            value: "ration_card",
            label: {
              en: "Ration Card",
              hi: "राशन कार्ड",
              mr: "रेशन कार्ड",
            },
          },
          {
            value: "income_certificate",
            label: {
              en: "Income Certificate",
              hi: "आय प्रमाणपत्र",
              mr: "उत्पन्नाचा दाखला",
            },
          },
          {
            value: "domicile_certificate",
            label: {
              en: "Domicile Certificate",
              hi: "अधिवास प्रमाणपत्र",
              mr: "अधिवास प्रमाणपत्र",
            },
          },
          {
            value: "caste_certificate",
            label: {
              en: "Caste Certificate",
              hi: "जाति प्रमाणपत्र",
              mr: "जात प्रमाणपत्र",
            },
          },
          {
            value: "land_7_12",
            label: {
              en: "7/12 Land Extract (सातबारा)",
              hi: "7/12 भूमि अभिलेख (सातबारा)",
              mr: "7/12 उतारा (सातबारा)",
            },
          },
          {
            value: "bank_passbook",
            label: {
              en: "Bank Passbook",
              hi: "बैंक पासबुक",
              mr: "बँक पासबुक",
            },
          },
          {
            value: "bonafide_receipt",
            label: {
              en: "College Bonafide & Fee Receipt",
              hi: "कॉलेज बोनाफाइड और शुल्क रसीद",
              mr: "कॉलेज बोनाफाईड आणि शुल्क पावती",
            },
          },
        ],
      },
    ],
  },
];

// --------------- UI STRINGS ---------------

export const uiStrings = {
  en: {
    appName: "YojanaSaathi",
    tagline: "Find government schemes you may qualify for.",
    checkForMyself: "Check schemes for myself",
    helpSomeoneElse: "Help someone else",
    homeDescription:
      "Answer a few simple questions to discover government welfare schemes that match your profile. We do not collect or store any personal data.",
    disclaimer:
      "This is guidance only. Please verify with the official department before applying.",
    next: "Next",
    back: "Back",
    submit: "Check My Eligibility",
    eligible: "Eligible",
    possiblyEligible: "Possibly Eligible",
    notEligible: "Not Eligible",
    viewDetails: "View Details",
    why: "Why?",
    filterAll: "All",
    searchPlaceholder: "Search schemes...",
    benefits: "Benefits",
    department: "Department",
    level: "Level",
    lastVerified: "Last Verified",
    matchedRules: "Rules You Meet",
    failedRules: "Rules Not Met",
    missingInfo: "Missing Information",
    requiredDocuments: "Required Documents",
    officialLink: "Apply on Official Website",
    sourceUrl: "View Official Source",
    viewChecklist: "View Document Checklist",
    reportWrong: "Report Wrong Information",
    documentAvailable: "Available",
    documentMissing: "Missing",
    documentUnknown: "Unknown",
    documentNotRequired: "Not Required",
    readinessSummary: "You have confirmed {count} of {total} documents.",
    printChecklist: "Download / Print Checklist",
    volunteerBanner: "You are helping another person.",
    startNewAssistance: "Start New Assistance",
    shareSummary: "Share Summary",
    feedbackTitle: "Report an Issue",
    feedbackSubmit: "Submit Feedback",
    feedbackSuccess: "Thank you! Your feedback has been submitted.",
    wrongEligibilityRule: "Wrong eligibility rule",
    outdatedInformation: "Outdated information",
    brokenApplicationLink: "Broken application link",
    translationIssue: "Translation issue",
    missingDocument: "Missing document",
    commentPlaceholder: "Add any additional comments (optional)...",
    central: "Central",
    state: "State",
    selectLanguage: "Choose your language",
    step: "Step",
    of: "of",
    eligibilityResult: "Eligibility Result",
    resultsSummary: "Based on your profile, here are the schemes available:",
  },
  hi: {
    appName: "योजनासाथी",
    tagline: "सरकारी योजनाएं खोजें जिनके लिए आप पात्र हो सकते हैं।",
    checkForMyself: "मेरे लिए योजनाएं जांचें",
    helpSomeoneElse: "किसी और की मदद करें",
    homeDescription:
      "कुछ सरल सवालों का जवाब दें और अपने प्रोफाइल से मेल खाने वाली सरकारी कल्याणकारी योजनाएं खोजें। हम कोई भी व्यक्तिगत डेटा एकत्र या संग्रहीत नहीं करते।",
    disclaimer:
      "यह केवल मार्गदर्शन है। आवेदन करने से पहले कृपया आधिकारिक विभाग से सत्यापित करें।",
    next: "आगे",
    back: "पीछे",
    submit: "मेरी पात्रता जांचें",
    eligible: "पात्र",
    possiblyEligible: "संभवतः पात्र",
    notEligible: "अपात्र",
    viewDetails: "विवरण देखें",
    why: "क्यों?",
    filterAll: "सभी",
    searchPlaceholder: "योजनाएं खोजें...",
    benefits: "लाभ",
    department: "विभाग",
    level: "स्तर",
    lastVerified: "अंतिम सत्यापन",
    matchedRules: "पूरे किए गए नियम",
    failedRules: "पूरे नहीं किए गए नियम",
    missingInfo: "अनुपलब्ध जानकारी",
    requiredDocuments: "आवश्यक दस्तावेज",
    officialLink: "आधिकारिक वेबसाइट पर आवेदन करें",
    sourceUrl: "आधिकारिक स्रोत देखें",
    viewChecklist: "दस्तावेज चेकलिस्ट देखें",
    reportWrong: "गलत जानकारी की रिपोर्ट करें",
    documentAvailable: "उपलब्ध",
    documentMissing: "अनुपलब्ध",
    documentUnknown: "अज्ञात",
    documentNotRequired: "आवश्यक नहीं",
    readinessSummary: "आपने {total} में से {count} दस्तावेज़ की पुष्टि की है।",
    printChecklist: "चेकलिस्ट डाउनलोड / प्रिंट करें",
    volunteerBanner: "आप किसी और की मदद कर रहे हैं।",
    startNewAssistance: "नई सहायता शुरू करें",
    shareSummary: "सारांश साझा करें",
    feedbackTitle: "समस्या की रिपोर्ट करें",
    feedbackSubmit: "प्रतिक्रिया भेजें",
    feedbackSuccess: "धन्यवाद! आपकी प्रतिक्रिया भेज दी गई है।",
    wrongEligibilityRule: "गलत पात्रता नियम",
    outdatedInformation: "पुरानी जानकारी",
    brokenApplicationLink: "टूटा हुआ आवेदन लिंक",
    translationIssue: "अनुवाद समस्या",
    missingDocument: "अनुपलब्ध दस्तावेज",
    commentPlaceholder: "कोई अतिरिक्त टिप्पणी जोड़ें (वैकल्पिक)...",
    central: "केंद्रीय",
    state: "राज्य",
    selectLanguage: "अपनी भाषा चुनें",
    step: "चरण",
    of: "का",
    eligibilityResult: "पात्रता परिणाम",
    resultsSummary: "आपकी प्रोफ़ाइल के आधार पर, ये योजनाएं उपलब्ध हैं:",
  },
  mr: {
    appName: "योजनासाथी",
    tagline: "तुम्हाला पात्र असलेल्या सरकारी योजना शोधा.",
    checkForMyself: "माझ्यासाठी योजना तपासा",
    helpSomeoneElse: "दुसऱ्याला मदत करा",
    homeDescription:
      "काही सोप्या प्रश्नांची उत्तरे द्या आणि तुमच्या प्रोफाइलशी जुळणाऱ्या सरकारी कल्याणकारी योजना शोधा. आम्ही कोणताही वैयक्तिक डेटा गोळा किंवा संग्रहित करत नाही.",
    disclaimer:
      "हे केवळ मार्गदर्शन आहे. अर्ज करण्यापूर्वी कृपया अधिकृत विभागाकडून खात्री करा.",
    next: "पुढे",
    back: "मागे",
    submit: "माझी पात्रता तपासा",
    eligible: "पात्र",
    possiblyEligible: "कदाचित पात्र",
    notEligible: "अपात्र",
    viewDetails: "तपशील पहा",
    why: "का?",
    filterAll: "सर्व",
    searchPlaceholder: "योजना शोधा...",
    benefits: "फायदे",
    department: "विभाग",
    level: "स्तर",
    lastVerified: "शेवटचे सत्यापन",
    matchedRules: "पूर्ण केलेले नियम",
    failedRules: "पूर्ण न केलेले नियम",
    missingInfo: "अनुपलब्ध माहिती",
    requiredDocuments: "आवश्यक कागदपत्रे",
    officialLink: "अधिकृत वेबसाइटवर अर्ज करा",
    sourceUrl: "अधिकृत स्रोत पहा",
    viewChecklist: "कागदपत्र चेकलिस्ट पहा",
    reportWrong: "चुकीची माहिती कळवा",
    documentAvailable: "उपलब्ध",
    documentMissing: "अनुपलब्ध",
    documentUnknown: "अज्ञात",
    documentNotRequired: "आवश्यक नाही",
    readinessSummary:
      "तुम्ही {total} पैकी {count} कागदपत्रांची पुष्टी केली आहे.",
    printChecklist: "चेकलिस्ट डाउनलोड / प्रिंट करा",
    volunteerBanner: "तुम्ही दुसऱ्या व्यक्तीला मदत करत आहात.",
    startNewAssistance: "नवीन मदत सुरू करा",
    shareSummary: "सारांश शेअर करा",
    feedbackTitle: "समस्या कळवा",
    feedbackSubmit: "अभिप्राय पाठवा",
    feedbackSuccess: "धन्यवाद! तुमचा अभिप्राय पाठवला गेला आहे.",
    wrongEligibilityRule: "चुकीचा पात्रता नियम",
    outdatedInformation: "जुनी माहिती",
    brokenApplicationLink: "तुटलेला अर्ज दुवा",
    translationIssue: "भाषांतर समस्या",
    missingDocument: "अनुपलब्ध कागदपत्र",
    commentPlaceholder: "काही अतिरिक्त टिप्पण्या जोडा (पर्यायी)...",
    central: "केंद्रीय",
    state: "राज्य",
    selectLanguage: "तुमची भाषा निवडा",
    step: "पाऊल",
    of: "पैकी",
    eligibilityResult: "पात्रता निकाल",
    resultsSummary:
      "तुमच्या प्रोफाइलच्या आधारे, या योजना उपलब्ध आहेत:",
  },
};
