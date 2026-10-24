export interface CivicTerm {
  term: string;
  hindiTerm: string;
  shortDefinition: string;
  detailedExplanation: string;
  officialContext: string;
  howToEnsureCompliance: string;
}

export const CIVIC_GLOSSARY: CivicTerm[] = [
  {
    term: 'DBT (Direct Benefit Transfer)',
    hindiTerm: 'प्रत्यक्ष लाभ अंतरण',
    shortDefinition: 'Direct transfer of government subsidies into the citizen’s bank account without middlemen.',
    detailedExplanation: 'Under DBT, scholarship stipends and scheme funds are credited electronically through PFMS straight to your Aadhaar-linked savings account, preventing leakages and administrative delays.',
    officialContext: 'Mandated by Government of India for all Central Sector and Centrally Sponsored schemes.',
    howToEnsureCompliance: 'Ensure your active bank account is linked to your Aadhaar and enabled for NPCI direct transfers.'
  },
  {
    term: 'Bonafide Certificate',
    hindiTerm: 'वास्तविक छात्र प्रमाण पत्र',
    shortDefinition: 'An official document issued by your college proving you are an active, regular student.',
    detailedExplanation: 'It confirms your admission status, academic year, degree course name, and that you are not pursuing your degree via distance education.',
    officialContext: 'Required by National Scholarship Portal (NSP) for CSSS and state post-matric schemes.',
    howToEnsureCompliance: 'Request your college administrative desk or download from the student ERP portal signed by the Head of Institution.'
  },
  {
    term: 'DigiLocker',
    hindiTerm: 'डिजिलॉकर (डिजिटल लॉकर)',
    shortDefinition: 'Government of India digital document repository holding legally valid electronic records.',
    detailedExplanation: 'Under Rule 9A of the Information Technology Rules, documents pushed into DigiLocker (marksheets, driving license, caste certificates) are legally on par with original physical paper certificates.',
    officialContext: 'Accepted by all major government scholarship and welfare application portals.',
    howToEnsureCompliance: 'Create a free account on digilocker.gov.in using your mobile-linked Aadhaar.'
  },
  {
    term: 'Khatauni / Jamabandi / RoR',
    hindiTerm: 'खतौनी / जमाबंदी / अधिकार अभिलेख',
    shortDefinition: 'Official land record extract showing ownership, land size, and cultivation details.',
    detailedExplanation: 'Record of Rights (RoR) maintained by the State Revenue Department verifying that agricultural land is in the applicant or family head name.',
    officialContext: 'Mandatory verification document for PM-KISAN and agricultural credit schemes.',
    howToEnsureCompliance: 'Can be downloaded with digital seal from state Bhulekh portal (e.g., upbhulekh.gov.in, mahabhulekh.maharashtra.gov.in).'
  },
  {
    term: 'One-Time Registration (OTR)',
    hindiTerm: 'एकल पंजीकरण (ओटीआर)',
    shortDefinition: 'A 14-digit unique identifier for students applying on the National Scholarship Portal.',
    detailedExplanation: 'Introduced on scholarships.gov.in to eliminate repeated entry of demographic details. Uses Aadhaar biometric / facial eKYC to lock your identity.',
    officialContext: 'Mandatory before submitting any central higher education or post-matric scholarship.',
    howToEnsureCompliance: 'Register at scholarships.gov.in/otr with Aadhaar linked to your mobile phone number.'
  },
  {
    term: 'eKYC (Electronic Know Your Customer)',
    hindiTerm: 'ई-केवाईसी (इलेक्ट्रॉनिक ग्राहक पहचान)',
    shortDefinition: 'Paperless, instantaneous verification of citizen identity using Aadhaar authentication.',
    detailedExplanation: 'Can be completed via OTP sent to your Aadhaar-registered mobile number, biometric fingerprint scanner at a CSC, or AI face-authentication on official mobile apps.',
    officialContext: 'Compulsory periodic requirement for schemes like PM-KISAN, NSP, and PM SVANidhi.',
    howToEnsureCompliance: 'Keep your mobile number updated in UIDAI Aadhaar database at any Aadhaar Seva Kendra.'
  }
];
