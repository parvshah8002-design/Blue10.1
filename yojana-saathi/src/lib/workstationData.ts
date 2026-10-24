// ============================================================
// YojanaSaathi — Workstation Mock Data with Verbatim Citations
// ============================================================

import type {
  CitizenProfileState,
  DemoPersona,
  DocumentInfo,
  SchemeData,
} from "../types/workstation.ts";

export const initialEmptyProfile: CitizenProfileState = {
  age: null,
  gender: null,
  state: null,
  annualHouseholdIncome: null,
  occupation: null,
  landHoldingAcres: null,
  rationCard: null,
  socialCategory: null,
  hasPuccaHouse: null,
  documentsAvailable: [],
};

// ---------------- DOCUMENTS CATALOG ----------------

export const documentsCatalog: Record<string, DocumentInfo> = {
  aadhaar_card: {
    id: "aadhaar_card",
    name: {
      en: "Aadhaar Card / Photo Identity Proof",
      hi: "आधार कार्ड / फोटो पहचान प्रमाण",
      mr: "आधार कार्ड / फोटो ओळखपत्र",
    },
    issuingAuthority: {
      en: "UIDAI / CSC Kendra",
      hi: "यूआईडीएआई / सीएससी केंद्र",
      mr: "UIDAI / सीएससी केंद्र",
    },
    howToGet: {
      en: "Available at any authorized UIDAI enrollment center or download e-Aadhaar online with registered mobile OTP.",
      hi: "किसी भी अधिकृत आधार केंद्र से प्राप्त करें या पंजीकृत मोबाइल ओटीपी के साथ ऑनलाइन ई-आधार डाउनलोड करें।",
      mr: "कोणत्याही अधिकृत आधार केंद्रावरून मिळवा किंवा नोंदणीकृत मोबाईल OTP द्वारे ऑनलाइन ई-आधार डाउनलोड करा.",
    },
    prerequisites: [],
  },
  ration_card: {
    id: "ration_card",
    name: {
      en: "Ration Card (Yellow/Orange/White)",
      hi: "राशन कार्ड (पीला/नारंगी/सफेद)",
      mr: "रेशन कार्ड (पिवळे/केशरी/पांढरे)",
    },
    issuingAuthority: {
      en: "Department of Food & Civil Supplies / Tehsil Office",
      hi: "खाद्य एवं नागरिक आपूर्ति विभाग / तहसील कार्यालय",
      mr: "अन्न व नागरी पुरवठा विभाग / तहसील कार्यालय",
    },
    howToGet: {
      en: "Apply through Aaple Sarkar / Tehsil Food Supplies desk with family photos and address proof.",
      hi: "पारिवारिक फोटो और पते के प्रमाण के साथ तहसील आपूर्ति कार्यालय में आवेदन करें।",
      mr: "कुटुंबाचे फोटो आणि रहिवासी पुराव्यासह तहसील पुरवठा विभागाकडे अर्ज करा.",
    },
    prerequisites: ["aadhaar_card"],
  },
  income_certificate: {
    id: "income_certificate",
    name: {
      en: "Income Certificate (उत्पन्नाचा दाखला)",
      hi: "आय प्रमाणपत्र (उत्पन्नाचा दाखला)",
      mr: "तहसीलदार उत्पन्नाचा दाखला",
    },
    issuingAuthority: {
      en: "Tehsildar Office / Maha e-Seva Kendra",
      hi: "तहसीलदार कार्यालय / महा ई-सेवा केंद्र",
      mr: "तहसीलदार कार्यालय / महा ई-सेवा केंद्र",
    },
    howToGet: {
      en: "Apply at local Maha e-Seva Kendra with Ration Card, Talathi income inquiry report, and Aadhaar card.",
      hi: "राशन कार्ड, तलाठी आय रिपोर्ट और आधार कार्ड के साथ महा ई-सेवा केंद्र पर आवेदन करें।",
      mr: "रेशन कार्ड, तलाठी उत्पन्न अहवाल व आधार कार्ड घेऊन महा ई-सेवा केंद्रात अर्ज करा.",
    },
    prerequisites: ["ration_card", "aadhaar_card"],
  },
  domicile_certificate: {
    id: "domicile_certificate",
    name: {
      en: "Domicile & Residence Certificate (अधिवास दाखला)",
      hi: "अधिवास एवं निवास प्रमाणपत्र (अधिवास दाखला)",
      mr: "अधिवास व रहिवासी प्रमाणपत्र (डोमिसाईल)",
    },
    issuingAuthority: {
      en: "Sub-Divisional Magistrate / Tehsildar",
      hi: "उप-विभागीय मजिस्ट्रेट / तहसीलदार",
      mr: "उपविभागीय अधिकारी / तहसीलदार कार्यालय",
    },
    howToGet: {
      en: "Submit 15-year Maharashtra residence proof (school leaving certificate, electricity bill) along with Ration Card.",
      hi: "15 वर्ष के महाराष्ट्र निवास प्रमाण (स्कूल टीसी, बिजली बिल) और राशन कार्ड के साथ आवेदन करें।",
      mr: "१५ वर्षांचा महाराष्ट्र रहिवासी पुरावा (शाळा सोडल्याचा दाखला, वीज बिल) आणि रेशन कार्डसह अर्ज करा.",
    },
    prerequisites: ["ration_card", "aadhaar_card"],
  },
  land_7_12: {
    id: "land_7_12",
    name: {
      en: "7/12 & 8A Land Extract (सातबारा आणि ८अ उतारा)",
      hi: "7/12 एवं 8A भूमि अभिलेख (सातबारा उतारा)",
      mr: "७/१२ आणि ८अ जमीन उतारा",
    },
    issuingAuthority: {
      en: "Talathi / Revenue Department (Mahabhulekh)",
      hi: "तलाठी / राजस्व विभाग (महाभूलेख)",
      mr: "तलाठी कार्यालय / महाभूलेख डिजिटल पोर्टल",
    },
    howToGet: {
      en: "Instant digitally signed extract available on bhulekh.mahabhumi.gov.in or directly from local Talathi.",
      hi: "bhulekh.mahabhumi.gov.in पर डिजिटल हस्ताक्षरित या स्थानीय तलाठी से प्राप्त करें।",
      mr: "bhulekh.mahabhumi.gov.in वरून डिजिटल स्वाक्षरी असलेला उतारा किंवा स्थानिक तलाठ्याकडून त्वरित मिळवा.",
    },
    prerequisites: ["aadhaar_card"],
  },
  bank_passbook: {
    id: "bank_passbook",
    name: {
      en: "Bank Passbook (Aadhaar DBT-Seeded)",
      hi: "बैंक पासबुक (आधार डीबीटी से जुड़ा हुआ)",
      mr: "बँक पासबुक (आधार डीबीटी लिंक असलेले)",
    },
    issuingAuthority: {
      en: "Nationalized or Cooperative Bank Branch",
      hi: "राष्ट्रीयकृत या सहकारी बैंक शाखा",
      mr: "राष्ट्रीयीकृत किंवा सहकारी बँक शाखा",
    },
    howToGet: {
      en: "Visit your bank branch with Aadhaar to ensure NPCI / DBT mapping is active on your savings account.",
      hi: "बचत खाते पर एनपीसीआई/डीबीटी मैपिंग सक्रिय करने के लिए आधार के साथ बैंक शाखा में जाएं।",
      mr: "बचत खात्यावर NPCI / DBT मॅपिंग सक्रिय असल्याची खात्री करण्यासाठी आधारसह बँकेत जा.",
    },
    prerequisites: ["aadhaar_card"],
  },
  caste_certificate: {
    id: "caste_certificate",
    name: {
      en: "Caste Certificate (जात प्रमाणपत्र)",
      hi: "जाति प्रमाणपत्र",
      mr: "सक्षम प्राधिकारी जात प्रमाणपत्र",
    },
    issuingAuthority: {
      en: "Sub-Divisional Officer (Revenue)",
      hi: "उप-विभागीय अधिकारी (राजस्व)",
      mr: "उपविभागीय अधिकारी (महसूल)",
    },
    howToGet: {
      en: "Requires family caste genealogy records prior to 1967/1961, school LC, and Domicile Certificate.",
      hi: "1967 से पूर्व के पारिवारिक जाति रिकॉर्ड, स्कूल टीसी और निवास प्रमाणपत्र के साथ आवेदन करें।",
      mr: "१९६७ पूर्वीचे वंशावळ पुरावे, प्राथमिक शाळा सोडल्याचा दाखला आणि रहिवासी प्रमाणपत्रासह अर्ज करा.",
    },
    prerequisites: ["aadhaar_card", "domicile_certificate"],
  },
  trade_certificate: {
    id: "trade_certificate",
    name: {
      en: "Artisan Trade Verification / GP Letter",
      hi: "कारीगर व्यापार सत्यापन / ग्राम पंचायत पत्र",
      mr: "पारंपारिक कारागीर ग्रामपंचायत शिफारस पत्र",
    },
    issuingAuthority: {
      en: "Gram Panchayat / Urban Local Body",
      hi: "ग्राम पंचायत / नगर पालिका",
      mr: "ग्रामपंचायत / स्थानिक स्वराज्य संस्था",
    },
    howToGet: {
      en: "Certified by Gram Sevak / Ward Officer verifying practice of one of 18 traditional artisan trades.",
      hi: "ग्राम सेवक या वार्ड अधिकारी द्वारा 18 पारंपरिक शिल्पों में कार्य करने का सत्यापन।",
      mr: "१८ पारंपारिक व्यवसायांपैकी एका व्यवसायात कार्यरत असल्याचे ग्रामसेवक किंवा प्रभाग अधिकाऱ्यांचे प्रमाणपत्र.",
    },
    prerequisites: ["aadhaar_card"],
  },
};

// ---------------- SCHEMES MASTER DATA ----------------

export const schemesData: SchemeData[] = [
  {
    id: "ladki-bahin",
    title: {
      en: "Mukhyamantri Majhi Ladki Bahin Yojana",
      hi: "मुख्यमंत्री माझी लाडकी बहीण योजना",
      mr: "मुख्यमंत्री माझी लाडकी बहीण योजना",
    },
    department: {
      en: "Women & Child Development Department, Govt of Maharashtra",
      hi: "महिला एवं बाल विकास विभाग, महाराष्ट्र शासन",
      mr: "महिला व बालविकास विभाग, महाराष्ट्र शासन",
    },
    level: "State (Maharashtra)",
    category: "Women Welfare",
    benefitSummary: {
      en: "₹1,500 monthly direct financial assistance deposited directly into beneficiary's Aadhaar-linked bank account.",
      hi: "पात्र महिलाओं के आधार लिंक बैंक खाते में प्रति माह ₹1,500 की सीधी आर्थिक सहायता।",
      mr: "पात्र महिलांच्या आधार लिंक बँक खात्यात दरमहा ₹१,५०० थेट आर्थिक सहाय्य जमा केले जाते.",
    },
    monthlyOrYearlyAmount: "₹1,500 / month",
    rules: [
      {
        id: "lb-gender",
        field: "gender",
        operator: "eq",
        value: "female",
        fixable: false,
        description: {
          en: "Beneficiary must be female",
          hi: "लाभार्थी महिला होनी चाहिए",
          mr: "लाभार्थी महिला असणे आवश्यक",
        },
        citation: {
          page: "Page 2, Para 2(a)",
          clause:
            "सदर योजना केवळ महाराष्ट्रातील पात्र महिला नागरिकांसाठी लागू राहील (Applicable exclusively to eligible female citizens of Maharashtra).",
          grNumber: "GR No. WCD-2024/CR-142/Desk-04",
        },
      },
      {
        id: "lb-state",
        field: "state",
        operator: "eq",
        value: "Maharashtra",
        fixable: false,
        description: {
          en: "Must be a permanent resident of Maharashtra",
          hi: "महाराष्ट्र का स्थायी निवासी होना अनिवार्य है",
          mr: "महाराष्ट्राचे कायमस्वरूपी रहिवासी असणे बंधनकारक",
        },
        citation: {
          page: "Page 2, Para 2(b)",
          clause:
            "अर्जदार महिला ही महाराष्ट्र राज्याची अधिवासी (Domicile) असणे आवश्यक आहे.",
          grNumber: "GR No. WCD-2024/CR-142/Desk-04",
        },
      },
      {
        id: "lb-age",
        field: "age",
        operator: "between",
        value: [21, 65],
        fixable: false,
        description: {
          en: "Age must be between 21 and 65 years",
          hi: "आयु 21 से 65 वर्ष के मध्य होनी चाहिए",
          mr: "वय २१ ते ६५ वर्षे दरम्यान असावे",
        },
        citation: {
          page: "Page 3, Clause 3(a)",
          clause:
            "अर्जदाराचे वय किमान २१ वर्षे पूर्ण व कमाल ६५ वर्षे पूर्ण नसावे (Age 21 to 65 inclusive as per official birth record).",
          grNumber: "GR No. WCD-2024/CR-142/Desk-04",
        },
      },
      {
        id: "lb-income",
        field: "annualHouseholdIncome",
        operator: "lte",
        value: 250000,
        fixable: true,
        description: {
          en: "Annual household income must not exceed ₹2,50,000",
          hi: "वार्षिक पारिवारिक आय ₹2,50,000 से अधिक नहीं होनी चाहिए",
          mr: "कुटुंबाचे एकत्रित वार्षिक उत्पन्न ₹२,५०,००० पेक्षा जास्त नसावे",
        },
        citation: {
          page: "Page 4, Clause 3(b)",
          clause:
            "अर्जदाराच्या कुटुंबाचे सर्व मार्गांनी मिळणारे एकत्रित वार्षिक उत्पन्न ₹२,५०,०००/- पेक्षा जास्त नसावे. पिवळे/केशरी रेशनकार्ड धारकांना उत्पन्नाचा दाखला सादर करण्याची आवश्यकता नाही.",
          grNumber: "GR No. WCD-2024/CR-142/Desk-04",
        },
      },
    ],
    documents: [
      documentsCatalog.aadhaar_card,
      documentsCatalog.ration_card,
      documentsCatalog.income_certificate,
      documentsCatalog.domicile_certificate,
      documentsCatalog.bank_passbook,
    ],
    officialApplyUrl: "https://ladakibahin.maharashtra.gov.in",
    sourceGuidelinesUrl: "https://womenchild.maharashtra.gov.in",
    lastVerifiedDate: "2026-09-20",
    verificationStatus: "verified",
  },
  {
    id: "pm-kisan",
    title: {
      en: "PM-KISAN Samman Nidhi",
      hi: "पीएम-किसान सम्मान निधि",
      mr: "पीएम-किसान सन्मान निधी",
    },
    department: {
      en: "Ministry of Agriculture & Farmers Welfare, Govt of India",
      hi: "कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार",
      mr: "कृषी व शेतकरी कल्याण मंत्रालय, भारत सरकार",
    },
    level: "Central",
    category: "Agriculture",
    benefitSummary: {
      en: "₹6,000 annually paid in three equal instalments of ₹2,000 directly via DBT to cultivable landholding farmer families.",
      hi: "कृषि योग्य भूमि वाले किसान परिवारों को ₹2,000 की तीन किस्तों में प्रति वर्ष ₹6,000 सीधे डीबीटी द्वारा।",
      mr: "शेतजमीन धारक शेतकरी कुटुंबांना ₹२,००० च्या तीन हप्त्यांमध्ये वार्षिक ₹६,००० थेट बँक खात्यात.",
    },
    monthlyOrYearlyAmount: "₹6,000 / year",
    rules: [
      {
        id: "pk-occupation",
        field: "occupation",
        operator: "eq",
        value: "farmer",
        fixable: false,
        description: {
          en: "Primary household occupation must be Farmer",
          hi: "परिवार का प्राथमिक व्यवसाय किसान होना चाहिए",
          mr: "कुटुंबाचा मुख्य व्यवसाय शेतकरी असणे आवश्यक",
        },
        citation: {
          page: "Page 4, Para 2.1",
          clause:
            "A small and marginal landholder farmer family is defined as a family comprising husband, wife and minor children who own cultivable land as per land records of the concerned State/UT.",
          grNumber: "PM-KISAN Guidelines 2019 (Rev. 2024)",
        },
      },
      {
        id: "pk-land",
        field: "landHoldingAcres",
        operator: "gt",
        value: 0,
        fixable: true,
        description: {
          en: "Must own cultivable agricultural land (> 0 acres)",
          hi: "कृषि योग्य भूमि का स्वामित्व होना चाहिए (> 0 एकड़)",
          mr: "स्वतःच्या नावावर लागवडीयोग्य शेतजमीन असणे आवश्यक (> ० एकर)",
        },
        citation: {
          page: "Page 6, Para 3.1",
          clause:
            "The beneficiaries will be identified on the basis of existing land-ownership records (RoR / 7/12 & 8A in Maharashtra) as of cut-off date.",
          grNumber: "PM-KISAN Guidelines 2019 (Rev. 2024)",
        },
      },
    ],
    documents: [
      documentsCatalog.aadhaar_card,
      documentsCatalog.land_7_12,
      documentsCatalog.bank_passbook,
    ],
    officialApplyUrl: "https://pmkisan.gov.in",
    sourceGuidelinesUrl: "https://pmkisan.gov.in/Documents/OperationalGuidelines.pdf",
    lastVerifiedDate: "2026-09-15",
    verificationStatus: "verified",
  },
  {
    id: "namo-shetkari",
    title: {
      en: "Namo Shetkari Mahasanman Nidhi Yojana",
      hi: "नमो शेतकरी महासन्मान निधि योजना",
      mr: "नमो शेतकरी महासन्मान निधी योजना",
    },
    department: {
      en: "Department of Agriculture, Govt of Maharashtra",
      hi: "कृषि विभाग, महाराष्ट्र शासन",
      mr: "कृषी विभाग, महाराष्ट्र शासन",
    },
    level: "State (Maharashtra)",
    category: "Agriculture",
    benefitSummary: {
      en: "Additional top-up of ₹6,000 per year by Maharashtra Govt (combines with PM-KISAN for total ₹12,000/year).",
      hi: "महाराष्ट्र सरकार द्वारा ₹6,000 प्रति वर्ष का अतिरिक्त टॉप-अप (पीएम-किसान के साथ कुल ₹12,000/वर्ष)।",
      mr: "महाराष्ट्र शासनातर्फे अतिरिक्त ₹६,००० वार्षिक अनुदान (पीएम-किसानसह एकूण ₹१२,०००/वर्ष).",
    },
    monthlyOrYearlyAmount: "₹6,000 / year (Add-on)",
    dependsOn: ["pm-kisan"],
    rules: [
      {
        id: "ns-state",
        field: "state",
        operator: "eq",
        value: "Maharashtra",
        fixable: false,
        description: {
          en: "Must reside and own farmland in Maharashtra",
          hi: "महाराष्ट्र का निवासी और भूमि स्वामी होना चाहिए",
          mr: "महाराष्ट्रातील शेतजमीन धारक व रहिवासी असणे आवश्यक",
        },
        citation: {
          page: "Page 2, Clause 2",
          clause:
            "केंद्र शासनाच्या प्रधानमंत्री किसान सन्मान निधी (PM-KISAN) योजनेच्या कार्यपद्धतीनुसार पात्र ठरलेल्या महाराष्ट्र राज्यातील शेतकऱ्यांनाच या योजनेचा लाभ अनुज्ञेय राहील.",
          grNumber: "GR No. AGRI-2023/CR-88/Desk-2",
        },
      },
      {
        id: "ns-occupation",
        field: "occupation",
        operator: "eq",
        value: "farmer",
        fixable: false,
        description: {
          en: "Must be an active farmer approved under PM-KISAN",
          hi: "पीएम-किसान के तहत अनुमोदित सक्रिय किसान होना चाहिए",
          mr: "पीएम-किसान योजनेत पात्र शेतकरी असणे बंधनकारक",
        },
        citation: {
          page: "Page 3, Clause 4(a)",
          clause:
            "PM-KISAN पोर्टलवर नोंदणीकृत व आधार प्रमाणीकरण पूर्ण झालेल्या शेतकऱ्यांना स्वतंत्र अर्ज करण्याची आवश्यकता नाही.",
          grNumber: "GR No. AGRI-2023/CR-88/Desk-2",
        },
      },
    ],
    documents: [
      documentsCatalog.aadhaar_card,
      documentsCatalog.land_7_12,
      documentsCatalog.bank_passbook,
    ],
    officialApplyUrl: "https://krishi.maharashtra.gov.in",
    sourceGuidelinesUrl: "https://krishi.maharashtra.gov.in",
    lastVerifiedDate: "2026-08-30",
    verificationStatus: "verified",
  },
  {
    id: "pmay-gramin",
    title: {
      en: "Pradhan Mantri Awas Yojana – Gramin (PMAY-G)",
      hi: "प्रधानमंत्री आवास योजना – ग्रामीण (PMAY-G)",
      mr: "प्रधानमंत्री आवास योजना – ग्रामीण (PMAY-G)",
    },
    department: {
      en: "Ministry of Rural Development, Govt of India",
      hi: "ग्रामीण विकास मंत्रालय, भारत सरकार",
      mr: "ग्रामीण विकास मंत्रालय, भारत सरकार",
    },
    level: "Central",
    category: "Housing",
    benefitSummary: {
      en: "Financial grant of ₹1,20,000 for building a pucca home, plus 90 days of MGNREGA wages and ₹12,000 for toilet construction.",
      hi: "पक्के घर के निर्माण के लिए ₹1,20,000 का अनुदान, मनरेगा मजदूरी और शौचालय के लिए ₹12,000।",
      mr: "पक्के घर बांधण्यासाठी ₹१,२०,००० थेट अनुदान, मनरेगा मजुरी आणि शौचालयासाठी ₹१२,०००.",
    },
    monthlyOrYearlyAmount: "₹1,20,000 (One-time)",
    rules: [
      {
        id: "pmay-income",
        field: "annualHouseholdIncome",
        operator: "lte",
        value: 300000,
        fixable: true,
        description: {
          en: "Annual household income must not exceed ₹3,00,000",
          hi: "वार्षिक घरेलू आय ₹3,00,000 से अधिक नहीं होनी चाहिए",
          mr: "वार्षिक कौटुंबिक उत्पन्न ₹३,००,००० पेक्षा कमी असावे",
        },
        citation: {
          page: "Page 11, Section 3.1",
          clause:
            "Households belonging to low-income category without pucca roof or wall identified through SECC list and Awas+ deprivation indicators.",
          grNumber: "PMAY-G Implementation Framework",
        },
      },
      {
        id: "pmay-ration",
        field: "rationCard",
        operator: "in",
        value: ["bpl", "antyodaya"],
        fixable: true,
        description: {
          en: "Must possess BPL or Antyodaya ration card",
          hi: "बीपीएल या अंत्योदय राशन कार्ड होना चाहिए",
          mr: "बीपीएल (BPL) किंवा अंत्योदय रेशन कार्ड असणे आवश्यक",
        },
        citation: {
          page: "Page 14, Clause 4.2",
          clause:
            "Priority given to beneficiaries holding Below Poverty Line (BPL) or Antyodaya Anna Yojana (AAY) ration cards without existing pucca dwelling.",
          grNumber: "PMAY-G Implementation Framework",
        },
      },
    ],
    documents: [
      documentsCatalog.aadhaar_card,
      documentsCatalog.ration_card,
      documentsCatalog.income_certificate,
      documentsCatalog.bank_passbook,
    ],
    officialApplyUrl: "https://pmayg.nic.in",
    sourceGuidelinesUrl: "https://pmayg.nic.in",
    lastVerifiedDate: "2026-08-10",
    verificationStatus: "verified",
  },
  {
    id: "pm-vishwakarma",
    title: {
      en: "PM Vishwakarma Yojana",
      hi: "पीएम विश्वकर्मा योजना",
      mr: "पीएम विश्वकर्मा योजना",
    },
    department: {
      en: "Ministry of MSME, Govt of India",
      hi: "सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय, भारत सरकार",
      mr: "सूक्ष्म, लघु व मध्यम उद्योग मंत्रालय, भारत सरकार",
    },
    level: "Central",
    category: "Artisans & MSME",
    benefitSummary: {
      en: "Collateral-free credit support up to ₹3 lakh at 5% concessional interest, ₹15,000 toolkit e-voucher, and free 5-day skill training.",
      hi: "5% रियायती ब्याज पर ₹3 लाख तक बिना गारंटी ऋण, ₹15,000 टूलकिट वाउचर और कौशल प्रशिक्षण।",
      mr: "५% सवलतीच्या व्याजाने ₹३ लाखांपर्यंत विनातारण कर्ज, ₹१५,००० टूलकिट व्हाउचर आणि कौशल्य प्रशिक्षण.",
    },
    monthlyOrYearlyAmount: "Up to ₹3,00,000 Loan",
    rules: [
      {
        id: "pv-occupation",
        field: "occupation",
        operator: "eq",
        value: "artisan_craftsperson",
        fixable: false,
        description: {
          en: "Must be a traditional artisan or craftsperson (18 designated trades)",
          hi: "पारंपरिक कारीगर या शिल्पकार होना चाहिए (18 पारंपरिक शिल्प)",
          mr: "पारंपारिक कारागीर किंवा हस्तकलाकार असणे आवश्यक (१८ पारंपारिक व्यवसाय)",
        },
        citation: {
          page: "Page 5, Para 4.1",
          clause:
            "An artisan or craftsperson working with their hands and tools engaged in one of the 18 family-based traditional trades mentioned in Annexure-I.",
          grNumber: "PM Vishwakarma Scheme Guidelines",
        },
      },
      {
        id: "pv-age",
        field: "age",
        operator: "gte",
        value: 18,
        fixable: false,
        description: {
          en: "Must be at least 18 years of age",
          hi: "न्यूनतम आयु 18 वर्ष होनी चाहिए",
          mr: "किमान वय १८ वर्षे पूर्ण असावे",
        },
        citation: {
          page: "Page 6, Para 4.2",
          clause:
            "The minimum age of the beneficiary should be 18 years on the date of registration.",
          grNumber: "PM Vishwakarma Scheme Guidelines",
        },
      },
    ],
    documents: [
      documentsCatalog.aadhaar_card,
      documentsCatalog.trade_certificate,
      documentsCatalog.bank_passbook,
    ],
    officialApplyUrl: "https://pmvishwakarma.gov.in",
    sourceGuidelinesUrl: "https://pmvishwakarma.gov.in",
    lastVerifiedDate: "2026-09-01",
    verificationStatus: "verified",
  },
  {
    id: "post-matric-obc",
    title: {
      en: "Post-Matric Scholarship for OBC Students",
      hi: "ओबीसी छात्रों के लिए मैट्रिकोत्तर छात्रवृत्ति",
      mr: "ओबीसी विद्यार्थ्यांसाठी मॅट्रिकोत्तर शिष्यवृत्ती",
    },
    department: {
      en: "Social Justice & Special Assistance Dept, Govt of Maharashtra",
      hi: "सामाजिक न्याय एवं विशेष सहायता विभाग, महाराष्ट्र",
      mr: "सामाजिक न्याय व विशेष सहाय्य विभाग, महाराष्ट्र शासन",
    },
    level: "State (Maharashtra)",
    category: "Education",
    benefitSummary: {
      en: "100% tuition fee reimbursement plus annual maintenance allowance up to ₹10,000 for OBC students.",
      hi: "ओबीसी छात्रों के लिए 100% ट्यूशन फीस प्रतिपूर्ति और ₹10,000 तक वार्षिक निर्वाह भत्ता।",
      mr: "ओबीसी विद्यार्थ्यांना १००% शिक्षण शुल्क प्रतिपूर्ती आणि ₹१०,००० पर्यंत वार्षिक निर्वाह भत्ता.",
    },
    monthlyOrYearlyAmount: "100% Tuition Fee",
    rules: [
      {
        id: "pms-category",
        field: "socialCategory",
        operator: "eq",
        value: "obc",
        fixable: false,
        description: {
          en: "Must belong to Other Backward Classes (OBC)",
          hi: "अन्य पिछड़ा वर्ग (ओबीसी) से संबंधित होना चाहिए",
          mr: "इतर मागासवर्गीय (OBC) प्रवर्गातील असणे आवश्यक",
        },
        citation: {
          page: "Page 2, Para 3.1",
          clause:
            "अर्जदार विद्यार्थी हा इतर मागास वर्ग (OBC) प्रवर्गातील असावा व अधिकृत सक्षम प्राधिकाऱ्यांचे जात प्रमाणपत्र असणे अनिवार्य राहील.",
          grNumber: "MahaDBT Post-Matric Guidelines",
        },
      },
      {
        id: "pms-income",
        field: "annualHouseholdIncome",
        operator: "lte",
        value: 250000,
        fixable: true,
        description: {
          en: "Family annual income must not exceed ₹2,50,000",
          hi: "पारिवारिक वार्षिक आय ₹2,50,000 से अधिक नहीं होनी चाहिए",
          mr: "पालकांचे एकत्रित वार्षिक उत्पन्न ₹२,५०,००० पेक्षा जास्त नसावे",
        },
        citation: {
          page: "Page 3, Para 4.2",
          clause:
            "विद्यार्थ्याच्या पालकांचे सर्व मार्गांनी मिळणारे वार्षिक उत्पन्न ₹२.५० लाख किंवा त्यापेक्षा कमी असणे बंधनकारक आहे.",
          grNumber: "MahaDBT Post-Matric Guidelines",
        },
      },
    ],
    documents: [
      documentsCatalog.aadhaar_card,
      documentsCatalog.caste_certificate,
      documentsCatalog.income_certificate,
      documentsCatalog.domicile_certificate,
      documentsCatalog.bank_passbook,
    ],
    officialApplyUrl: "https://mahadbt.maharashtra.gov.in",
    sourceGuidelinesUrl: "https://mahadbt.maharashtra.gov.in",
    lastVerifiedDate: "2026-07-25",
    verificationStatus: "verified",
  },
];

// ---------------- 1-CLICK DEMO PERSONAS ----------------

export const demoPersonas: DemoPersona[] = [
  {
    id: "savita",
    name: "Savita (42F, ₹90k, Maharashtra)",
    tagline: {
      en: "42-year-old rural woman, ₹90,000 family income, Maharashtra resident",
      hi: "42 वर्षीय ग्रामीण महिला, ₹90,000 वार्षिक आय, महाराष्ट्र निवासी",
      mr: "४२ वर्षांची ग्रामीण महिला, ₹९०,००० वार्षिक उत्पन्न, महाराष्ट्र रहिवासी",
    },
    targetSchemeUnlocked: "ladki-bahin",
    profile: {
      age: 42,
      gender: "female",
      state: "Maharashtra",
      annualHouseholdIncome: 90000,
      occupation: "homemaker",
      landHoldingAcres: 0,
      rationCard: "bpl",
      socialCategory: "obc",
      hasPuccaHouse: false,
      documentsAvailable: ["aadhaar_card", "ration_card", "bank_passbook"],
    },
  },
  {
    id: "ramesh",
    name: "Ramesh Patil (50M, Farmer, 1.5 acres)",
    tagline: {
      en: "50-year-old farmer, 1.5 acres landholding, Maharashtra",
      hi: "50 वर्षीय किसान, 1.5 एकड़ भूमि स्वामी, महाराष्ट्र",
      mr: "५० वर्षीय शेतकरी, १.५ एकर शेतजमीन, महाराष्ट्र",
    },
    targetSchemeUnlocked: "pm-kisan",
    profile: {
      age: 50,
      gender: "male",
      state: "Maharashtra",
      annualHouseholdIncome: 120000,
      occupation: "farmer",
      landHoldingAcres: 1.5,
      rationCard: "apl",
      socialCategory: "general",
      hasPuccaHouse: true,
      documentsAvailable: ["aadhaar_card", "land_7_12", "bank_passbook"],
    },
  },
];

// ---------------- LOCALIZATION STRINGS ----------------

export const uiTranslations = {
  appTitle: {
    en: "YojanaSaathi",
    hi: "योजनासाथी",
    mr: "योजनासाथी",
  },
  appSubtitle: {
    en: "Scheme Eligibility Navigator",
    hi: "सरकारी योजना पात्रता मार्गदर्शक",
    mr: "शासकीय योजना पात्रता मार्गदर्शक",
  },
  volunteerMode: {
    en: "Volunteer Workstation (3-Pane)",
    hi: "स्वयंसेवक वर्कस्टेशन (3-फलक)",
    mr: "मदत केंद्र वर्कस्टेशन (३-फलक)",
  },
  kioskMode: {
    en: "Citizen Kiosk",
    hi: "नागरिक कियोस्क",
    mr: "नागरिक किऑस्क",
  },
  resetProfile: {
    en: "Reset Profile",
    hi: "प्रोफ़ाइल रीसेट",
    mr: "माहिती पूर्ववत करा",
  },
  printCta: {
    en: "Print / Thermal Receipt",
    hi: "प्रिंट / रसीद निकालें",
    mr: "प्रिंट / पावती काढा",
  },
  nextBestQuestionTitle: {
    en: "Next Best Question",
    hi: "अगला सबसे महत्वपूर्ण प्रश्न",
    mr: "पुढील महत्त्वाचा प्रश्न",
  },
  simulateVoiceIntake: {
    en: "Simulate Voice Intake",
    hi: "वॉइस इनटेक अनुकरण",
    mr: "आवाज इनटेक (Voice Intake)",
  },
  rapidIntakeHeader: {
    en: "Rapid Intake (Operator Form)",
    hi: "त्वरित प्रविष्टि (ऑपरेटर फॉर्म)",
    mr: "जलद माहिती नोंदणी (ऑपरेटर फॉर्म)",
  },
  schemeMatrixHeader: {
    en: "Live Scheme Matrix",
    hi: "लाइव योजना मैट्रिक्स",
    mr: "थेट योजना यादी (Live Scheme Matrix)",
  },
  inspectorHeader: {
    en: "Scheme Inspector",
    hi: "योजना विश्लेषक",
    mr: "योजना सविस्तर तपशील",
  },
  tabRuleProof: {
    en: "Rule Citation & Proof",
    hi: "नियम प्रमाण एवं उद्धरण",
    mr: "नियम पुरावा व सरकारी निर्णय",
  },
  tabDocTree: {
    en: "Document Tree & Prerequisites",
    hi: "दस्तावेज़ आवश्यकता वृक्ष",
    mr: "कागदपत्रे व आवश्यक पूर्वअटी",
  },
  tierEligible: {
    en: "ELIGIBLE",
    hi: "पात्र (ELIGIBLE)",
    mr: "पात्र (ELIGIBLE)",
  },
  tierNearMiss: {
    en: "NEAR MISS",
    hi: "निकटतम (NEAR MISS)",
    mr: "अटी जवळ (NEAR MISS)",
  },
  tierPartialMatch: {
    en: "PARTIAL MATCH",
    hi: "आंशिक मेल (PARTIAL MATCH)",
    mr: "अपूर्ण माहिती (PARTIAL MATCH)",
  },
  tierIneligible: {
    en: "INELIGIBLE",
    hi: "अपात्र (INELIGIBLE)",
    mr: "अपात्र (INELIGIBLE)",
  },
  unlockHintPrefix: {
    en: "Unlock Hint:",
    hi: "अनलॉक संकेत:",
    mr: "पात्र होण्यासाठी संकेत:",
  },
  rulePassed: {
    en: "PASSED",
    hi: "उत्तीर्ण",
    mr: "पात्र",
  },
  ruleFailed: {
    en: "FAILED",
    hi: "विफल",
    mr: "अपात्र",
  },
  ruleMissing: {
    en: "MISSING INFO",
    hi: "जानकारी शेष",
    mr: "माहिती आवश्यक",
  },
  verifiedBadge: {
    en: "VERIFIED BY OFFICIAL GR",
    hi: "आधिकारिक शासनादेश द्वारा सत्यापित",
    mr: "अधिकृत शासन निर्णयानुसार पडताळणीकृत",
  },
  officialApplyBtn: {
    en: "Open Official Portal",
    hi: "आधिकारिक पोर्टल खोलें",
    mr: "अधिकृत पोर्टल उघडा",
  },
  thermalReceiptTitle: {
    en: "80mm Thermal Receipt",
    hi: "80mm थर्मल रसीद",
    mr: "८० मिमी थर्मल पावती",
  },
  a4SummaryTitle: {
    en: "A4 Official Summary",
    hi: "A4 आधिकारिक सारांश",
    mr: "A4 अधिकृत सारांश",
  },
  printNow: {
    en: "Print Slip (Ctrl+P)",
    hi: "प्रिंट करें (Ctrl+P)",
    mr: "प्रिंट करा (Ctrl+P)",
  },
  shareWhatsApp: {
    en: "Share on WhatsApp Web",
    hi: "व्हाट्सएप पर भेजें",
    mr: "व्हॉट्सॲपवर पाठवा",
  },
  disclaimerText: {
    en: "Indicative guidance only. Scheme rules are subject to change. Citizen must verify with official department or CSC before formal submission.",
    hi: "केवल सांकेतिक मार्गदर्शन। योजना के नियम परिवर्तनशील हैं। औपचारिक आवेदन से पूर्व नागरिक संबंधित विभाग अथवा सीएससी से पुष्टि अवश्य करें।",
    mr: "केवळ मार्गदर्शक माहिती. योजनांचे नियम बदलू शकतात. अधिकृत अर्ज सादर करण्यापूर्वी संबंधित शासकीय विभाग किंवा सीएससी केंद्रातून खात्री करावी.",
  },
};
