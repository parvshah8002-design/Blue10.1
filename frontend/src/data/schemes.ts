import { Scheme } from '../types/scheme';

export const VERIFIED_SCHEMES: Scheme[] = [
  {
    id: 'pm-usp-csss',
    name: 'Central Sector Scheme of Scholarship for College and University Students (PM-USP CSSS)',
    hindiName: 'कॉलेज और विश्वविद्यालय के छात्रों के लिए केंद्रीय क्षेत्र छात्रवृत्ति योजना',
    ministryOrDepartment: 'Department of Higher Education, Ministry of Education, Government of India',
    beneficiaryGroup: 'students',
    primaryPriority: 'scholarships',
    tagline: 'Financial support of ₹12,000 to ₹20,000/year for meritorious higher education students from low-income families.',
    simpleDescription: 'If you scored in the top 20% (80th percentile) in your 12th board exams, your family income is under ₹4.5 Lakh/year, and you are enrolled in a regular college degree, this central scholarship pays ₹12,000/year during graduation and ₹20,000/year during post-graduation.',
    officialSummary: 'The scheme provides financial assistance to meritorious students from low-income families to meet a part of their day-to-day expenses while pursuing higher studies. Scholarships are awarded based on senior secondary examination results (80th percentile cutoff announced per board).',
    benefitAmountOrDescription: '₹12,000 per annum at graduation level for first 3 years; ₹20,000 per annum at post-graduation level directly via DBT.',
    officialSourceUrl: 'https://scholarships.gov.in',
    officialApplicationUrl: 'https://scholarships.gov.in/public/schemeGuidelines/Guidelines_DOHE_CSSS.pdf',
    sourceTitle: 'Guidelines for the Central Sector Scheme of Scholarship for College and University Students (PM-USP)',
    sourceType: 'Official Notification Guidelines',
    lastVerifiedAt: '2026-03-15T00:00:00Z',
    verificationStatus: 'verified',
    dataQualityNotes: 'Verified against official Ministry of Education PM-USP guidelines published on National Scholarship Portal (NSP). Quota is allocated among state boards based on 18-25 age population ratio.',
    rules: [
      {
        id: 'csss-r1-education',
        field: 'educationLevel',
        label: 'Higher Education Enrolment',
        operator: 'in_list',
        expectedValue: ['undergraduate', 'postgraduate'],
        mandatory: true,
        officialWording: 'Students who are pursuing regular degree courses in recognized Colleges/Universities across India.',
        simpleExplanation: 'You must be currently enrolled in a regular bachelor’s or master’s college program (distance/correspondence courses are not eligible).',
        sourceEvidence: 'Section 2.1: The applicant must be enrolled in a regular degree course and not in a correspondence or distance mode or diploma course.',
        evidenceLocation: 'Guidelines Section 2.1 (Scope & Coverage)',
        verificationStatus: 'verified'
      },
      {
        id: 'csss-r2-income',
        field: 'annualFamilyIncome',
        label: 'Annual Family Income Ceiling',
        operator: 'less_than_or_equal',
        expectedValue: 450000,
        mandatory: true,
        officialWording: 'Total annual family income from all sources should not exceed ₹4,50,000 per annum.',
        simpleExplanation: 'Your total household income from all family sources must be ₹4.5 Lakh or less per year.',
        sourceEvidence: 'Section 3.2 (Eligibility Conditions): The parental/family income ceiling is ₹4.5 Lakh per annum. An income certificate from the competent authority is mandatory.',
        evidenceLocation: 'Guidelines Section 3.2 (Income Criteria)',
        verificationStatus: 'verified'
      },
      {
        id: 'csss-r3-percentile',
        field: 'percentile12thOrMarks',
        label: '12th Board Percentile Cutoff',
        operator: 'greater_than_or_equal',
        expectedValue: 80,
        mandatory: true,
        officialWording: 'Students who are above 80th percentile of successful candidates in the relevant stream from the particular Board of Examination in Class XII.',
        simpleExplanation: 'You must have scored in the top 20% (at or above the 80th percentile cutoff) in your Class 12 board examination.',
        sourceEvidence: 'Section 3.1: Minimum 80th percentile in the respective examination board for Class 12th.',
        evidenceLocation: 'Guidelines Section 3.1 (Merit Criteria)',
        verificationStatus: 'verified'
      },
      {
        id: 'csss-r4-regular',
        field: 'enrolledInRegularCourse',
        label: 'Regular Full-time Mode',
        operator: 'boolean_is',
        expectedValue: true,
        mandatory: true,
        officialWording: 'Pursuing regular courses and not correspondence or distance education.',
        simpleExplanation: 'Your course must be full-time and on-campus.',
        sourceEvidence: 'Section 3.3: Students pursuing studies through Open Universities or Distance Education mode are not eligible.',
        evidenceLocation: 'Guidelines Section 3.3',
        verificationStatus: 'verified'
      }
    ],
    requiredDocuments: [
      {
        id: 'csss-doc-1',
        name: 'Class 12 Passing Marksheet & Board Rank/Roll Card',
        category: 'academic',
        whyRequired: 'Proves applicant achieved the 80th percentile board cutoff for the passing year.',
        status: 'confirmed',
        officialIssuingAuthority: 'Concerned State Education Board / CBSE / CISCE',
        howToObtain: 'Download digital copy instantly via DigiLocker or obtain physical certificate from school/board.',
        digilockerAvailable: true,
        verifiedSourceRef: 'PM-USP Guidelines Document Checklist Annexure I'
      },
      {
        id: 'csss-doc-2',
        name: 'Annual Family Income Certificate (Issued within last 6–12 months)',
        category: 'income',
        whyRequired: 'Verifies annual household income is below ₹4,50,000.',
        status: 'confirmed',
        officialIssuingAuthority: 'Tehsildar / Sub-Divisional Magistrate (SDM) / Revenue Authority',
        howToObtain: 'Apply through your state e-District / Citizen Service Center (CSC) portal.',
        digilockerAvailable: true,
        verifiedSourceRef: 'PM-USP Guidelines Section 3.2'
      },
      {
        id: 'csss-doc-3',
        name: 'College Bonafide Certificate & Admission Fee Receipt',
        category: 'academic',
        whyRequired: 'Confirms active regular enrollment in a recognized university/college.',
        status: 'confirmed',
        officialIssuingAuthority: 'Registrar / Dean of your enrolled College / University',
        howToObtain: 'Request from your college administrative office or student portal.',
        digilockerAvailable: false,
        verifiedSourceRef: 'National Scholarship Portal Verification Rules'
      },
      {
        id: 'csss-doc-4',
        name: 'Bank Passbook copy showing Aadhaar Seeding (DBT-enabled)',
        category: 'identity',
        whyRequired: 'Direct Benefit Transfer (DBT) requires active Aadhaar payment bridge (APBS) linking.',
        status: 'confirmed',
        officialIssuingAuthority: 'Your Bank Branch / NPCI Portal',
        howToObtain: 'Check status at resident.uidai.gov.in/bank-mapper or visit your bank branch to submit NPCI mandate form.',
        digilockerAvailable: false,
        verifiedSourceRef: 'DBT Bharat Mandate Notification 2023'
      }
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Check State Board Cutoff List',
        description: 'Verify your name or roll number appears in the official top 20th percentile list released by your 12th board on NSP.',
        verifiedUrl: 'https://scholarships.gov.in'
      },
      {
        stepNumber: 2,
        title: 'Register on National Scholarship Portal (NSP / OTR)',
        description: 'Complete One-Time Registration (OTR) using Aadhaar and generate your OTR Reference Number.',
        verifiedUrl: 'https://scholarships.gov.in'
      },
      {
        stepNumber: 3,
        title: 'Submit Application with Bonafide Document',
        description: 'Upload your Income Certificate and College Bonafide, select PM-USP CSSS, and submit before portal closing.',
        verifiedUrl: 'https://scholarships.gov.in'
      },
      {
        stepNumber: 4,
        title: 'Institutional Verification (INO)',
        description: 'Notify your college scholarship nodal officer (INO) to electronically verify your profile on the portal.',
      }
    ],
    deadlineNote: 'NSP registration cycles typically open annually around July/August and close between November and December. Always verify active year cycle dates on scholarships.gov.in.',
    has_misc_conditions: true,
    misc_conditions: [
      'Not availing any other government scholarship or fee concession concurrently',
      'Maintaining minimum 50% marks in annual college semester examinations for annual renewal'
    ]
  },
  {
    id: 'post-matric-sc',
    name: 'Post-Matric Scholarship Scheme for SC Students',
    hindiName: 'अनुसूचित जाति के छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति योजना',
    ministryOrDepartment: 'Ministry of Social Justice and Empowerment, Government of India',
    beneficiaryGroup: 'students',
    primaryPriority: 'scholarships',
    tagline: 'Full tuition fee reimbursement plus monthly maintenance allowance for Scheduled Caste students pursuing post-secondary education.',
    simpleDescription: 'If you belong to the Scheduled Caste (SC) category, have completed Class 10, and your household income is within ₹2.5 Lakh/year, this flagship scheme covers 100% of non-refundable tuition fees and pays monthly study allowances for your 11th, 12th, ITI, diploma, degree, or medical/engineering education.',
    officialSummary: 'Centrally Sponsored Scheme implemented through State Governments and UT Administrations. Provides comprehensive financial assistance to SC students studying at post-matriculation or post-secondary stage to enable them to complete their education.',
    benefitAmountOrDescription: 'Complete tuition and compulsory non-refundable fees reimbursement + monthly maintenance allowance up to ₹13,500/year depending on course group.',
    officialSourceUrl: 'https://socialjustice.gov.in',
    officialApplicationUrl: 'https://scholarships.gov.in',
    sourceTitle: 'Centrally Sponsored Scheme of Post Matric Scholarship for SC Students Revised Guidelines',
    sourceType: 'Official Notification Guidelines',
    lastVerifiedAt: '2026-03-10T00:00:00Z',
    verificationStatus: 'verified',
    dataQualityNotes: 'Centrally Sponsored Scheme operating on 60:40 fund-sharing between Central and State governments (90:10 for North Eastern states). Verified with MSJE guidelines.',
    rules: [
      {
        id: 'sc-r1-caste',
        field: 'socialCategory',
        label: 'Social Category (Caste)',
        operator: 'equals',
        expectedValue: 'SC',
        mandatory: true,
        officialWording: 'The scholarships are open to nationals of India belonging to Scheduled Castes only.',
        simpleExplanation: 'You must belong to a Scheduled Caste (SC) recognized in your state.',
        sourceEvidence: 'Section 4.1: The applicant must belong to a Scheduled Caste as notified by the President under Article 341 of the Constitution.',
        evidenceLocation: 'Guidelines Section 4 (Eligibility Criteria)',
        verificationStatus: 'verified'
      },
      {
        id: 'sc-r2-income',
        field: 'annualFamilyIncome',
        label: 'Annual Family Income Ceiling',
        operator: 'less_than_or_equal',
        expectedValue: 250000,
        mandatory: true,
        officialWording: 'Scholarships will be paid to students whose parents/guardians income from all sources does not exceed ₹2,50,000 per annum.',
        simpleExplanation: 'Your annual family income from all sources must not exceed ₹2.5 Lakh.',
        sourceEvidence: 'Section 4.3: Total income of the parents/guardians should not exceed ₹2,50,000 per annum.',
        evidenceLocation: 'Guidelines Section 4.3 (Income Ceiling)',
        verificationStatus: 'verified'
      },
      {
        id: 'sc-r3-education',
        field: 'educationLevel',
        label: 'Post-Matric Level Study',
        operator: 'in_list',
        expectedValue: ['12th_pass', 'diploma', 'undergraduate', 'postgraduate'],
        mandatory: true,
        officialWording: 'Pursuing recognized post-matriculation or post-secondary courses in recognized institutions.',
        simpleExplanation: 'You must have completed Class 10 (matriculation) and be studying in Class 11, 12, ITI, diploma, graduation, or post-graduation.',
        sourceEvidence: 'Section 3.1: Applicable only to studies at post-matriculation or post-secondary stage.',
        evidenceLocation: 'Guidelines Section 3',
        verificationStatus: 'verified'
      }
    ],
    requiredDocuments: [
      {
        id: 'sc-doc-1',
        name: 'Official Caste/Community Certificate (SC Category)',
        category: 'category',
        whyRequired: 'Statutory proof of Scheduled Caste status under Presidential Order.',
        status: 'confirmed',
        officialIssuingAuthority: 'Competent Revenue Officer / Tehsildar / Sub-Divisional Officer',
        howToObtain: 'Apply via State e-District portal or local Tehsil / CSC center.',
        digilockerAvailable: true,
        verifiedSourceRef: 'MSJE Guidelines Section 6.2'
      },
      {
        id: 'sc-doc-2',
        name: 'Income Certificate issued by Revenue Authority',
        category: 'income',
        whyRequired: 'Verifies annual family income does not exceed ₹2,50,000.',
        status: 'confirmed',
        officialIssuingAuthority: 'Tehsildar / Revenue Department',
        howToObtain: 'State e-District portal or Tehsil office with salary slip / affidavit.',
        digilockerAvailable: true,
        verifiedSourceRef: 'MSJE Guidelines Section 4.3'
      },
      {
        id: 'sc-doc-3',
        name: 'Previous Passed Class/Semester Marksheet',
        category: 'academic',
        whyRequired: 'Confirms academic progression and eligibility for subsequent semester/year.',
        status: 'confirmed',
        officialIssuingAuthority: 'School / University / Examination Board',
        howToObtain: 'College registrar or DigiLocker for board marksheets.',
        digilockerAvailable: true,
        verifiedSourceRef: 'Section 5.1 (Continuation of Awards)'
      },
      {
        id: 'sc-doc-4',
        name: 'Institutional Fee Structure / Fee Paid Receipt',
        category: 'academic',
        whyRequired: 'Determines the exact reimbursement amount of non-refundable compulsory fees.',
        status: 'confirmed',
        officialIssuingAuthority: 'Enrolled College / University Accounts Office',
        howToObtain: 'College fee counter or institutional student portal.',
        digilockerAvailable: false,
        verifiedSourceRef: 'MSJE Guidelines Section 5 (Components of Scholarship)'
      }
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Identify Your State Application Channel',
        description: 'Check whether your state routes SC Post-Matric through the National Scholarship Portal (scholarships.gov.in) or its own State Scholarship Portal (e.g. Mahadbt, UP Scholarship, SSP Karnataka).',
        verifiedUrl: 'https://scholarships.gov.in'
      },
      {
        stepNumber: 2,
        title: 'Upload Verified Caste & Income Certificates',
        description: 'Provide certificate application/acknowledgement numbers for online API validation against state revenue databases.',
      },
      {
        stepNumber: 3,
        title: 'Submit Enrolment & Fee Details',
        description: 'Enter your student roll number and submit application to the college scholarship committee.',
      },
      {
        stepNumber: 4,
        title: 'Direct Benefit Transfer (DBT)',
        description: 'Central and state shares are credited directly into your Aadhaar-seeded bank account via PFMS.',
      }
    ],
    deadlineNote: 'Application portals typically accept submissions from August to December each academic year.'
  },
  {
    id: 'pm-kisan',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    hindiName: 'प्रधानमंत्री किसान सम्मान निधि',
    ministryOrDepartment: 'Department of Agriculture and Farmers Welfare, Ministry of Agriculture',
    beneficiaryGroup: 'farmers',
    primaryPriority: 'farming',
    tagline: 'Guaranteed income support of ₹6,000 per year in three direct bank transfers for landholding farmer families.',
    simpleDescription: 'If your family owns cultivable farm land and no member is an income tax payer or government employee, you are entitled to ₹6,000 per year transferred directly to your bank account in three equal instalments of ₹2,000.',
    officialSummary: 'PM-KISAN provides income support to all landholding farmer families in the country having cultivable land, subject to certain exclusion criteria related to higher economic status (such as income tax payers and institutional landholders).',
    benefitAmountOrDescription: '₹6,000 per year in 3 equal four-monthly installments of ₹2,000 directly via Aadhaar-linked DBT.',
    officialSourceUrl: 'https://pmkisan.gov.in',
    officialApplicationUrl: 'https://pmkisan.gov.in/RegistrationFormNew.aspx',
    sourceTitle: 'Operational Guidelines of Pradhan Mantri Kisan Samman Nidhi Scheme',
    sourceType: 'Central Ministry Portal',
    lastVerifiedAt: '2026-03-12T00:00:00Z',
    verificationStatus: 'verified',
    dataQualityNotes: 'Mandatory exclusion criteria strictly enforced: institutional landholders, constitutional post holders, current/former ministers, government servants (except Multi Tasking Staff / Class IV / Group D), and anyone who paid income tax in last assessment year are excluded.',
    rules: [
      {
        id: 'pmk-r1-land',
        field: 'ownsCultivableLand',
        label: 'Cultivable Land Ownership',
        operator: 'boolean_is',
        expectedValue: true,
        mandatory: true,
        officialWording: 'The scheme covers all landholding farmer families having cultivable landholding in their names.',
        simpleExplanation: 'You or your family must hold cultivable agricultural land registered in official land revenue records.',
        sourceEvidence: 'Operational Guidelines Section 2: A landholder farmer family is defined as a family consisting of husband, wife and minor children who own cultivable land as per land records of the concerned State/UT.',
        evidenceLocation: 'Guidelines Section 2 (Definition of Beneficiary)',
        verificationStatus: 'verified'
      },
      {
        id: 'pmk-r2-tax',
        field: 'isTaxPayer',
        label: 'Income Tax Exclusion Check',
        operator: 'boolean_is',
        expectedValue: false,
        mandatory: true,
        officialWording: 'All persons who paid Income Tax in the last assessment year are excluded from the scheme.',
        simpleExplanation: 'No member of the beneficiary farmer family should have paid income tax in the last financial assessment year.',
        sourceEvidence: 'Operational Guidelines Section 3 (Exclusion Categories): (e) All Persons who paid Income Tax in last assessment year are ineligible.',
        evidenceLocation: 'Guidelines Section 3 (Exclusions)',
        verificationStatus: 'verified'
      }
    ],
    requiredDocuments: [
      {
        id: 'pmk-doc-1',
        name: 'Land Record Document (Khatauni / Jamabandi / RoR)',
        category: 'land',
        whyRequired: 'Statutory proof of cultivable land ownership registered under state land revenue records.',
        status: 'confirmed',
        officialIssuingAuthority: 'State Revenue / Land Records Department (Bhulekh Portal)',
        howToObtain: 'Download digital certified ROR from your state Bhulekh / Land records portal or Tehsil office.',
        digilockerAvailable: true,
        verifiedSourceRef: 'PM-KISAN Operational Guidelines Section 5'
      },
      {
        id: 'pmk-doc-2',
        name: 'Aadhaar Card with Mobile Number Linkage',
        category: 'identity',
        whyRequired: 'Mandatory for OTP-based eKYC and biometric verification on the PM-KISAN portal.',
        status: 'confirmed',
        officialIssuingAuthority: 'UIDAI',
        howToObtain: 'Visit any Aadhaar Seva Kendra or update mobile linkage online at uidai.gov.in.',
        digilockerAvailable: true,
        verifiedSourceRef: 'PM-KISAN Mandatory eKYC Directive'
      },
      {
        id: 'pmk-doc-3',
        name: 'Aadhaar-Seeded Bank Account (NPCI Direct Benefit Transfer)',
        category: 'identity',
        whyRequired: 'Funds are transferred exclusively via Aadhaar Payment Bridge (APB); traditional IFSC transfer is deprecated.',
        status: 'confirmed',
        officialIssuingAuthority: 'Your Bank / Post Office (IPPB)',
        howToObtain: 'Visit bank branch and submit DBT Aadhaar Seeding Consent form, or open an Indian Post Payments Bank account.',
        digilockerAvailable: false,
        verifiedSourceRef: 'PM-KISAN DBT Operational Circular'
      }
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Self-Registration on Farmer Portal',
        description: 'Visit pmkisan.gov.in and click "New Farmer Registration". Enter Aadhaar number and state.',
        verifiedUrl: 'https://pmkisan.gov.in/RegistrationFormNew.aspx'
      },
      {
        stepNumber: 2,
        title: 'Input Land Record & Khata Details',
        description: 'Enter your District, Sub-District, Block, Village, Survey/Khata Number, and upload landholding document.',
      },
      {
        stepNumber: 3,
        title: 'Complete Mandatory eKYC',
        description: 'Complete eKYC via Aadhaar OTP on the portal or facial recognition via PM-KISAN mobile app.',
        verifiedUrl: 'https://pmkisan.gov.in'
      },
      {
        stepNumber: 4,
        title: 'State Nodal Officer Verification',
        description: 'State revenue officials verify land records before approving your name into the beneficiary disbursement list.',
      }
    ],
    deadlineNote: 'Continuous scheme with no cutoff deadline. Applications can be submitted online 365 days a year.',
    has_misc_conditions: true,
    misc_conditions: [
      'No family member is an institutional land holder or income tax payer',
      'No family member is a current or retired government employee or constitutional post holder'
    ]
  },
  {
    id: 'naps-2',
    name: 'National Apprenticeship Promotion Scheme (NAPS-2)',
    hindiName: 'राष्ट्रीय शिक्षुता संवर्धन योजना (NAPS-2)',
    ministryOrDepartment: 'Ministry of Skill Development and Entrepreneurship (MSDE)',
    beneficiaryGroup: 'youth',
    primaryPriority: 'employment_skills',
    tagline: 'On-the-job industrial skill training with direct government stipend support of up to ₹1,500/month.',
    simpleDescription: 'If you are at least 14 years old and looking for practical work experience, NAPS-2 connects you to verified industrial apprenticeship opportunities across manufacturing, services, and IT, with guaranteed stipends partially funded by the government.',
    officialSummary: 'NAPS-2 promotes apprenticeship training across India by incentivizing employers and providing stipend support directly to apprentices through Direct Benefit Transfer (DBT). Helps bridge academic theory with industry requirements.',
    benefitAmountOrDescription: 'Direct stipend support of 25% of prescribed stipend up to ₹1,500 per month directly into apprentice bank account.',
    officialSourceUrl: 'https://apprenticeshipindia.gov.in',
    officialApplicationUrl: 'https://www.apprenticeshipindia.gov.in/candidate-registration',
    sourceTitle: 'National Apprenticeship Promotion Scheme 2 (NAPS-2) Guidelines',
    sourceType: 'National Scheme Guidelines',
    lastVerifiedAt: '2026-03-01T00:00:00Z',
    verificationStatus: 'verified',
    dataQualityNotes: 'Governed by The Apprentices Act 1961 and MSDE NAPS-2 operational guidelines. Stipend payments processed via DBT through NSDC portal.',
    rules: [
      {
        id: 'naps-r1-age',
        field: 'age',
        label: 'Minimum Age Requirement',
        operator: 'greater_than_or_equal',
        expectedValue: 14,
        mandatory: true,
        officialWording: 'The candidate should have completed at least 14 years of age (18 years for hazardous trades).',
        simpleExplanation: 'You must be at least 14 years old (or 18 years old for designated hazardous industries).',
        sourceEvidence: 'Apprentices Act 1961 Section 3: A person shall not be qualified for being engaged as an apprentice unless he has completed fourteen years of age.',
        evidenceLocation: 'The Apprentices Act 1961 Section 3',
        verificationStatus: 'verified'
      },
      {
        id: 'naps-r2-education',
        field: 'educationLevel',
        label: 'Minimum Educational Qualification',
        operator: 'in_list',
        expectedValue: ['below_10th', '10th_pass', '12th_pass', 'diploma', 'undergraduate'],
        mandatory: true,
        officialWording: 'Possesses minimum educational and physical fitness qualification as prescribed for the designated or optional trade.',
        simpleExplanation: 'Basic schooling (5th/8th pass to 10th/12th/ITI/diploma depending on the specific trade).',
        sourceEvidence: 'NAPS-2 Guidelines Section 4: Eligibility criteria defined as per curriculum requirements of the respective trade.',
        evidenceLocation: 'NAPS-2 Guidelines Section 4',
        verificationStatus: 'verified'
      }
    ],
    requiredDocuments: [
      {
        id: 'naps-doc-1',
        name: 'Proof of Age / Birth Certificate / Class 10 Certificate',
        category: 'identity',
        whyRequired: 'Statutory verification that applicant meets minimum age of 14 years under Apprentices Act.',
        status: 'confirmed',
        officialIssuingAuthority: 'Municipal Corporation / State Education Board',
        howToObtain: 'Download Class 10 certificate via DigiLocker or birth certificate from civil registry.',
        digilockerAvailable: true,
        verifiedSourceRef: 'Apprenticeship Rules Rule 3'
      },
      {
        id: 'naps-doc-2',
        name: 'Highest Educational Qualification Certificate / Marksheet',
        category: 'academic',
        whyRequired: 'Verifies eligibility for chosen apprentice trade (e.g. ITI, 10th pass, or Graduate Apprentice).',
        status: 'confirmed',
        officialIssuingAuthority: 'School / ITI / University',
        howToObtain: 'DigiLocker or school/college registrar.',
        digilockerAvailable: true,
        verifiedSourceRef: 'NAPS-2 Candidate Registration Guidelines'
      },
      {
        id: 'naps-doc-3',
        name: 'Aadhaar-Linked Bank Account Details',
        category: 'identity',
        whyRequired: 'Direct Benefit Transfer (DBT) of the government stipend component (up to ₹1,500/mo).',
        status: 'confirmed',
        officialIssuingAuthority: 'Bank / NPCI',
        howToObtain: 'Check active Aadhaar mapping with your bank.',
        digilockerAvailable: false,
        verifiedSourceRef: 'NAPS-2 DBT Guidelines Section 7'
      }
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Create Candidate Profile on Apprenticeship Portal',
        description: 'Register on apprenticeshipindia.gov.in with email, mobile, and Aadhaar.',
        verifiedUrl: 'https://www.apprenticeshipindia.gov.in/candidate-registration'
      },
      {
        stepNumber: 2,
        title: 'Complete eKYC & Profile Information',
        description: 'Complete 100% profile score by uploading education marksheets and resume.',
      },
      {
        stepNumber: 3,
        title: 'Search & Apply for Apprenticeship Vacancies',
        description: 'Browse opportunities by trade, location, and stipend, then apply directly to registered industry establishments.',
      },
      {
        stepNumber: 4,
        title: 'Sign Apprenticeship Contract & Start Training',
        description: 'Upon selection, electronically sign the tripartite apprenticeship contract.',
      }
    ],
    deadlineNote: 'Open year-round; industrial hiring runs on continuous cycles across states.'
  },
  {
    id: 'pm-svanidhi',
    name: 'PM Street Vendor’s AtmaNirbhar Nidhi (PM SVANidhi)',
    hindiName: 'पीएम स्वनिधि (प्रधानमंत्री स्ट्रीट वेंडर्स आत्मनिर्भर निधि)',
    ministryOrDepartment: 'Ministry of Housing and Urban Affairs (MoHUA), Government of India',
    beneficiaryGroup: 'workers',
    primaryPriority: 'micro_credit',
    tagline: 'Collateral-free working capital micro-loans of ₹10,000, ₹20,000, and ₹50,000 with 7% interest subsidy and digital cashback.',
    simpleDescription: 'If you are a street vendor, hawker, or informal small entrepreneur operating in urban or peri-urban areas, PM SVANidhi provides initial collateral-free working capital loan of ₹10,000, progressing to ₹20,000 and ₹50,000 upon timely repayment, with 7% interest subsidy directly deposited into your bank.',
    officialSummary: 'Special Micro-Credit Facility launched by MoHUA to provide affordable working capital loans to street vendors to resume their livelihoods. Features digital transaction incentives (up to ₹1,200/year cashback) and interest subsidy of 7% per annum.',
    benefitAmountOrDescription: 'Tranche 1: ₹10,000; Tranche 2: ₹20,000; Tranche 3: ₹50,000 collateral-free loan with 7% interest subsidy & up to ₹100/mo digital cashback.',
    officialSourceUrl: 'https://pmsvanidhi.mohua.gov.in',
    officialApplicationUrl: 'https://pmsvanidhi.mohua.gov.in/Home/PreApplication',
    sourceTitle: 'Scheme Guidelines for PM Street Vendor’s AtmaNirbhar Nidhi',
    sourceType: 'Official Notification Guidelines',
    lastVerifiedAt: '2026-03-14T00:00:00Z',
    verificationStatus: 'verified',
    dataQualityNotes: 'Identified vendors can be verified via Urban Local Body (ULB) vending census or Letter of Recommendation (LoR) issued by ULB/Town Vending Committee (TVC).',
    rules: [
      {
        id: 'svan-r1-occ',
        field: 'occupation',
        label: 'Occupation Status',
        operator: 'in_list',
        expectedValue: ['self_employed', 'employed'],
        mandatory: true,
        officialWording: 'The scheme is available for all street vendors engaged in vending in urban areas.',
        simpleExplanation: 'You must be engaged in vending of goods, articles, food, or street services in urban/peri-urban localities.',
        sourceEvidence: 'Section 3.1: Eligible beneficiaries are street vendors/hawkers operating on or before the cutoff date.',
        evidenceLocation: 'Guidelines Section 3 (Eligibility)',
        verificationStatus: 'verified'
      },
      {
        id: 'svan-r2-tax',
        field: 'isTaxPayer',
        label: 'Informal Worker Status (Not Income Tax Payer)',
        operator: 'boolean_is',
        expectedValue: false,
        mandatory: true,
        officialWording: 'Targeted towards informal micro-entrepreneurs not falling into formal tax brackets.',
        simpleExplanation: 'You should not be a formal corporate or income tax paying entity.',
        sourceEvidence: 'Scheme Guidelines Section 3: Targeted at low-income informal vendors.',
        evidenceLocation: 'Guidelines Section 3',
        verificationStatus: 'verified'
      }
    ],
    requiredDocuments: [
      {
        id: 'svan-doc-1',
        name: 'Vending Certificate / Identity Card / Letter of Recommendation (LoR)',
        category: 'category',
        whyRequired: 'Statutory proof of vending issued by Urban Local Body (ULB) / Town Vending Committee (TVC).',
        status: 'confirmed',
        officialIssuingAuthority: 'Municipal Corporation / Municipality / Nagar Panchayat',
        howToObtain: 'Request from your local municipal ward office or apply for LoR through pmsvanidhi portal.',
        digilockerAvailable: false,
        verifiedSourceRef: 'PM SVANidhi Operating Procedure Annexure B'
      },
      {
        id: 'svan-doc-2',
        name: 'Aadhaar Card Linked to Active Mobile Number',
        category: 'identity',
        whyRequired: 'Used for identity validation and e-signature of loan agreement.',
        status: 'confirmed',
        officialIssuingAuthority: 'UIDAI',
        howToObtain: 'Aadhaar center or online UIDAI portal.',
        digilockerAvailable: true,
        verifiedSourceRef: 'MoHUA Circular on Digital KYC'
      },
      {
        id: 'svan-doc-3',
        name: 'Bank Account Passbook / Statement',
        category: 'income',
        whyRequired: 'Account where loan funds are disbursed and interest subsidy is credited.',
        status: 'confirmed',
        officialIssuingAuthority: 'Commercial Bank / Regional Rural Bank / Cooperative Bank',
        howToObtain: 'Your branch bank passbook.',
        digilockerAvailable: false,
        verifiedSourceRef: 'Lending Institution Disbursement Guidelines'
      }
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Check Vendor Survey Status or Obtain LoR',
        description: 'Verify if your name is in the Municipal survey list. If not, submit an online request for a Letter of Recommendation (LoR).',
        verifiedUrl: 'https://pmsvanidhi.mohua.gov.in'
      },
      {
        stepNumber: 2,
        title: 'Apply Online with Aadhaar & Mobile',
        description: 'Fill out the simple 3-minute application on pmsvanidhi.mohua.gov.in or via Common Service Center (CSC).',
        verifiedUrl: 'https://pmsvanidhi.mohua.gov.in/Home/PreApplication'
      },
      {
        stepNumber: 3,
        title: 'Lender Approval & Digital Agreement',
        description: 'Your chosen bank or NBFC processes the loan without requiring any collateral or guarantee.',
      },
      {
        stepNumber: 4,
        title: 'Receive Funds & Earn Cashback',
        description: 'Receive ₹10,000 directly into your bank and start receiving ₹25–₹100 monthly cashbacks on digital QR collections.',
      }
    ],
    deadlineNote: 'Active nationwide across all statutory urban local bodies.',
    has_misc_conditions: true,
    misc_conditions: [
      'Must be engaged in street vending in urban areas on or before March 24, 2020',
      'Possesses a valid Certificate of Vending or Identity Card issued by Urban Local Bodies (ULBs) or a Letter of Recommendation (LoR)'
    ]
  }
];
