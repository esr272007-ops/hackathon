import React, { useState, useEffect, useRef } from "react";
import "./App.css";

/* =========================
   DATA (single source of truth)
========================= */
const USER = {
  patient: "E. Sai Charan",
  doctor: "Dr. A. Sharma",
  hospital: "Hospital Administrator",
};

const ROLES = {
  patient: {
    icon: "👤",
    Icon: PatientIcon,
    title: "Patient",
    sub: "Aadhaar + OTP Login",
    heading: "Patient Login",
    tagline: "Authenticate using Aadhaar and OTP",
    badge: "👤 Patient",
    desc: "Manage your unified health information",
  },
  doctor: {
    icon: "👨‍⚕️",
    Icon: DoctorTeamIcon,
    title: "Doctor / Hospital Staff",
    sub: "Professional Login",
    heading: "Doctor / Hospital Staff",
    tagline: "Healthcare professional login",
    badge: "👨‍⚕️ Doctor / Staff",
    desc: "Access authorized patient healthcare information",
  },
  hospital: {
    icon: "🏥",
    title: "Hospital Management",
    sub: "Admin Login",
    heading: "Hospital Management",
    tagline: "Hospital administrator login",
    badge: "🏥 Hospital Admin",
    desc: "Manage hospital healthcare operations",
  },
};

const LOGIN_FIELDS = {
  doctor: [
    ["pid", "Professional ID (HPR)", "text"],
    ["hid", "Hospital ID (HFR)", "text"],
    ["pin", "PIN", "password"],
  ],
  hospital: [
    ["aid", "Hospital Admin ID", "text"],
    ["hid", "Hospital ID (HFR)", "text"],
    ["pw", "Password", "password"],
  ],
};

const NAV = {
  patient: [
    ["dashboard", "🏠", "Dashboard"],
    ["records", "📋", "Medical Records"],
    ["medications", "💊", "Medications"],
    ["consent", "🔐", "Consent Manager"],
    ["ai", <AssistantIcon />, "AI Health Assistant"],
    ["profile", "👤", "Health Profile"],
  ],
  doctor: [
    ["dashboard", "🏠", "Dashboard"],
    ["patients", "👥", "Patient Verification"],
    ["records", "📋", "Health Records"],
    ["emergencyRecords", "🚨", "Emergency & Unidentified Records"],
    ["encounter", "🩺", "New Encounter"],
    ["sharing", "🔐", "Secure Sharing"],
  ],
  hospital: [
    ["dashboard", "🏠", "Dashboard"],
    ["patients", "👥", "Patient Registry"],
    ["consent", "🔐", "Consent Management"],
    ["records", "📋", "Medical Records"],
    ["staff", "👨‍⚕️", "Doctors & Staff"],
    ["emergency", "🚨", "Emergency Access"],
    ["audit", "📊", "Audit Logs"],
  ],
};

/* Simple list pages: [description, [[icon, title, text], ...]]
   (patient "profile" is a special page: see PatientProfile) */
const GENERIC = {
  patient: {
    records: [
      "Your complete healthcare record timeline.",
      [
        ["🧪", "Blood Test", "Apollo Hospitals • 18 Sep 2026"],
        ["💊", "Prescription", "Apollo Hospitals • 15 Sep 2026"],
        ["🩻", "Chest Imaging", "Apollo Hospitals • 02 Sep 2026"],
        ["💉", "Vaccination", "Health Centre • 20 Aug 2026"],
      ],
    ],
    medications: [
      "Your active and recent medications.",
      [
        ["💊", "Azithromycin 500mg", "Once daily • 3 days remaining • Prescribed by Dr. A. Sharma, 15 Sep 2026"],
        ["💊", "Cetirizine 10mg", "Once at night • Ongoing, for seasonal allergy • Prescribed by Dr. A. Sharma, 15 Sep 2026"],
      ],
    ],
    ai: [
      "Understand your medical reports in simple language.",
      [
        ["🧪", "Hemoglobin: 11.5 g/dL", "Slightly below the typical range."],
        ["💡", "AI Explanation", "Consult a doctor for clinical interpretation."],
      ],
    ],
  },
  doctor: {
    records: [
      "Access records only after appropriate patient authorization.",
      [
        ["🧪", "Lab Reports", "Patient-authorized laboratory reports"],
        ["💊", "Prescriptions", "Current and previous prescriptions"],
        ["🩻", "Imaging", "Available diagnostic imaging"],
        ["💉", "Vaccinations", "Patient vaccination history"],
      ],
    ],
    encounter: [
      "Create a new patient medical encounter.",
      [
        ["📝", "Symptoms", "Record current patient symptoms"],
        ["❤️", "Vitals", "Record blood pressure, pulse and temperature"],
        ["💊", "Prescription", "Add a new prescription"],
        ["🧪", "Lab Test", "Order a laboratory test"],
      ],
    ],
    sharing: [
      "Share authorized health information securely.",
      [
        ["📋", "Medical History", "Select information to share"],
        ["🧪", "Lab Reports", "Choose laboratory records"],
        ["⏱", "Access Duration", "Set time-limited access"],
        ["🚫", "Revoke Access", "Remove access when required"],
      ],
    ],
  },
  hospital: {
    patients: [
      "Hospital patient registry.",
      [
        ["👤", "E. Sai Charan", "MEDX-9988-7766 • Active"],
        ["👤", "Patient 002", "MEDX-1234-5678 • Active"],
        ["👤", "Patient 003", "MEDX-8765-4321 • Active"],
      ],
    ],
    consent: [
      "Monitor consent requests and access permissions.",
      [
        ["⏳", "Pending Requests", "12 consent requests pending"],
        ["✓", "Active Consent", "48 active consent sessions"],
        ["🚫", "Revoked Access", "6 access permissions revoked"],
      ],
    ],
    records: [
      "Hospital-level health record management.",
      [
        ["📋", "Patient Records", "2,480 registered records"],
        ["🧪", "Lab Reports", "Available through authorized access"],
        ["🩻", "Imaging", "Available through authorized access"],
      ],
    ],
    staff: [
      "Manage authorized hospital professionals.",
      [
        ["👨‍⚕️", "Doctors", "124 active doctors"],
        ["👩‍⚕️", "Nurses", "42 active nurses"],
        ["🧑‍💼", "Staff", "20 authorized staff members"],
      ],
    ],
    emergency: [
      "Monitor emergency access sessions.",
      [
        ["🚨", "Emergency Session #001", "Active • ICU"],
        ["🚨", "Emergency Session #002", "Active • Emergency Ward"],
      ],
    ],
    audit: [
      "Track access to patient healthcare records.",
      [
        ["👨‍⚕️", "Dr. A. Sharma", "Accessed patient records • 18 Sep"],
        ["👩‍⚕️", "Staff Member", "Viewed lab report • 18 Sep"],
        ["🏥", "Hospital Admin", "Reviewed consent • 17 Sep"],
      ],
    ],
  },
};

/* =========================
   APP-WIDE TEXT (chosen once on the first page, applies everywhere)
========================= */
const PAGE_TEXT = {
  en: {
    dashboardWord: "Dashboard",
    logout: "Logout",
    footer: "Prototype developed for Smart India Hackathon • Demo data only",
    nav: {
      patient: { dashboard: "Dashboard", records: "Medical Records", medications: "Medications", consent: "Consent Manager", ai: "AI Health Assistant", profile: "Health Profile" },
      doctor: { dashboard: "Dashboard", patients: "Patient Verification", records: "Health Records", emergencyRecords: "Emergency & Unidentified Records", encounter: "New Encounter", sharing: "Secure Sharing" },
      hospital: { dashboard: "Dashboard", patients: "Patient Registry", consent: "Consent Management", records: "Medical Records", staff: "Doctors & Staff", emergency: "Emergency Access", audit: "Audit Logs" },
    },
    locked: {
      title: "Patient approval needed",
      body: "Verify a patient with their Aadhaar number and OTP first. Records stay locked until the patient approves access.",
      button: "Verify a patient",
    },
    common: {
      openRecords: "Open health records",
      startEncounter: "Start new encounter",
      verifyPatient: "Verify a patient",
      searchLabel: "Search by name or Health ID",
      showAll: (n) => `Show all ${n} patients`,
      showFewer: "Show fewer",
      sortByVisits: "Sort by number of visits",
      sortedByVisits: "Showing: most visits first",
      noResult: (q) => `No patient found for "${q}".`,
      totalVisits: (n) => `${n} visit${n === 1 ? "" : "s"}`,
      lastVisit: "Last visit",
    },
    patientDash: {
      welcomeBack: "Welcome back",
      healthIdLabel: "Unified Health ID",
      quickAccess: "Quick Access",
      recentRecord: "Recent Medical Record",
      currentMed: "Current Medication",
      allergyTitle: "⚠ Allergy Alert",
      allergyBody: "Penicillin allergy recorded in your health profile.",
    },
    doctorDash: {
      todaysOverview: "Today's Overview",
      verifyTitle: "🪪 Verify with Aadhaar OTP",
      verifyDesc: "Enter the patient's Aadhaar number. The OTP goes to the patient's registered mobile, and the patient shares it with you to approve access. Access is time-limited.",
      recentPatients: "Recent Patients",
      todaysPatients: (n) => `Today's Patients (${n} verified)`,
    },
    hospitalDash: {
      overviewTitle: "Hospital Overview",
      managementTitle: "Hospital Management",
      emergencyTitle: "🚨 Emergency Access",
      emergencyBody: "2 emergency record-access sessions are currently active.",
      registryTitle: "Hospital Patient Registry",
      registryIntro: "Visit counts include OPD, IPD and emergency records at this hospital.",
    },
  },
  hi: {
    dashboardWord: "डैशबोर्ड",
    logout: "लॉगआउट",
    footer: "Smart India Hackathon के लिए बनाया गया प्रोटोटाइप • केवल डेमो डेटा",
    nav: {
      patient: { dashboard: "डैशबोर्ड", records: "मेडिकल रिकॉर्ड", medications: "दवाइयां", consent: "सहमति प्रबंधक", ai: "AI स्वास्थ्य सहायक", profile: "स्वास्थ्य प्रोफ़ाइल" },
      doctor: { dashboard: "डैशबोर्ड", patients: "मरीज़ सत्यापन", records: "स्वास्थ्य रिकॉर्ड", emergencyRecords: "आपातकालीन और अज्ञात रिकॉर्ड", encounter: "नई एनकाउंटर", sharing: "सुरक्षित साझाकरण" },
      hospital: { dashboard: "डैशबोर्ड", patients: "मरीज़ रजिस्ट्री", consent: "सहमति प्रबंधन", records: "मेडिकल रिकॉर्ड", staff: "डॉक्टर और स्टाफ", emergency: "आपातकालीन पहुंच", audit: "ऑडिट लॉग" },
    },
    locked: {
      title: "मरीज़ की स्वीकृति आवश्यक है",
      body: "पहले मरीज़ को उसके आधार नंबर और OTP से सत्यापित करें। जब तक मरीज़ पहुंच स्वीकृत नहीं करता, रिकॉर्ड लॉक रहेंगे।",
      button: "मरीज़ को सत्यापित करें",
    },
    common: {
      openRecords: "स्वास्थ्य रिकॉर्ड खोलें",
      startEncounter: "नई एनकाउंटर शुरू करें",
      verifyPatient: "मरीज़ को सत्यापित करें",
      searchLabel: "नाम या हेल्थ ID से खोजें",
      showAll: (n) => `सभी ${n} मरीज़ दिखाएं`,
      showFewer: "कम दिखाएं",
      sortByVisits: "यात्राओं की संख्या के अनुसार क्रमबद्ध करें",
      sortedByVisits: "दिखा रहे हैं: सबसे अधिक यात्राएं पहले",
      noResult: (q) => `"${q}" के लिए कोई मरीज़ नहीं मिला।`,
      totalVisits: (n) => `${n} बार आए`,
      lastVisit: "अंतिम यात्रा",
    },
    patientDash: {
      welcomeBack: "वापसी पर स्वागत है",
      healthIdLabel: "यूनिफाइड हेल्थ ID",
      quickAccess: "त्वरित पहुंच",
      recentRecord: "हालिया मेडिकल रिकॉर्ड",
      currentMed: "मौजूदा दवा",
      allergyTitle: "⚠ एलर्जी चेतावनी",
      allergyBody: "आपकी स्वास्थ्य प्रोफ़ाइल में पेनिसिलिन से एलर्जी दर्ज है।",
    },
    doctorDash: {
      todaysOverview: "आज का अवलोकन",
      verifyTitle: "🪪 आधार OTP से सत्यापित करें",
      verifyDesc: "मरीज़ का आधार नंबर दर्ज करें। OTP मरीज़ के पंजीकृत मोबाइल पर जाएगा, और मरीज़ पहुंच स्वीकृत करने के लिए वह आपसे साझा करेगा। पहुंच समय-सीमित है।",
      recentPatients: "हाल के मरीज़",
      todaysPatients: (n) => `आज के मरीज़ (${n} सत्यापित)`,
    },
    hospitalDash: {
      overviewTitle: "अस्पताल अवलोकन",
      managementTitle: "अस्पताल प्रबंधन",
      emergencyTitle: "🚨 आपातकालीन पहुंच",
      emergencyBody: "2 आपातकालीन रिकॉर्ड-पहुंच सत्र वर्तमान में सक्रिय हैं।",
      registryTitle: "अस्पताल मरीज़ रजिस्ट्री",
      registryIntro: "यात्राओं की संख्या में इस अस्पताल के OPD, IPD और आपातकालीन रिकॉर्ड शामिल हैं।",
    },
  },
  te: {
    dashboardWord: "డాష్‌బోర్డ్",
    logout: "లాగ్ అవుట్",
    footer: "Smart India Hackathon కోసం రూపొందించిన ప్రోటోటైప్ • డెమో డేటా మాత్రమే",
    nav: {
      patient: { dashboard: "డాష్‌బోర్డ్", records: "వైద్య రికార్డులు", medications: "మందులు", consent: "సమ్మతి నిర్వాహకుడు", ai: "AI ఆరోగ్య సహాయకుడు", profile: "ఆరోగ్య ప్రొఫైల్" },
      doctor: { dashboard: "డాష్‌బోర్డ్", patients: "రోగి ధృవీకరణ", records: "ఆరోగ్య రికార్డులు", emergencyRecords: "అత్యవసర & గుర్తించని రికార్డులు", encounter: "కొత్త ఎన్‌కౌంటర్", sharing: "సురక్షిత భాగస్వామ్యం" },
      hospital: { dashboard: "డాష్‌బోర్డ్", patients: "రోగి రిజిస్ట్రీ", consent: "సమ్మతి నిర్వహణ", records: "వైద్య రికార్డులు", staff: "డాక్టర్లు & సిబ్బంది", emergency: "అత్యవసర యాక్సెస్", audit: "ఆడిట్ లాగ్‌లు" },
    },
    locked: {
      title: "రోగి ఆమోదం అవసరం",
      body: "మొదట రోగిని వారి ఆధార్ నంబర్ మరియు OTP తో ధృవీకరించండి. రోగి యాక్సెస్‌ను ఆమోదించే వరకు రికార్డులు లాక్‌గా ఉంటాయి.",
      button: "రోగిని ధృవీకరించండి",
    },
    common: {
      openRecords: "ఆరోగ్య రికార్డులు తెరవండి",
      startEncounter: "కొత్త ఎన్‌కౌంటర్ ప్రారంభించండి",
      verifyPatient: "రోగిని ధృవీకరించండి",
      searchLabel: "పేరు లేదా హెల్త్ ID ద్వారా వెతకండి",
      showAll: (n) => `మొత్తం ${n} మంది రోగులను చూపించు`,
      showFewer: "తక్కువగా చూపించు",
      sortByVisits: "సందర్శనల సంఖ్య ప్రకారం క్రమబద్ధీకరించండి",
      sortedByVisits: "చూపిస్తోంది: ఎక్కువ సందర్శనలు ముందుగా",
      noResult: (q) => `"${q}" కోసం ఏ రోగి కనుగొనబడలేదు.`,
      totalVisits: (n) => `${n} సార్లు వచ్చారు`,
      lastVisit: "చివరి సందర్శన",
    },
    patientDash: {
      welcomeBack: "తిరిగి స్వాగతం",
      healthIdLabel: "యూనిఫైడ్ హెల్త్ ID",
      quickAccess: "త్వరిత యాక్సెస్",
      recentRecord: "ఇటీవలి వైద్య రికార్డ్",
      currentMed: "ప్రస్తుత మందు",
      allergyTitle: "⚠ అలర్జీ హెచ్చరిక",
      allergyBody: "మీ ఆరోగ్య ప్రొఫైల్‌లో పెన్సిలిన్ అలర్జీ నమోదు చేయబడింది.",
    },
    doctorDash: {
      todaysOverview: "నేటి అవలోకనం",
      verifyTitle: "🪪 ఆధార్ OTP తో ధృవీకరించండి",
      verifyDesc: "రోగి ఆధార్ నంబర్ నమోదు చేయండి. OTP రోగి నమోదిత మొబైల్‌కు వెళుతుంది, మరియు యాక్సెస్‌ను ఆమోదించడానికి రోగి దానిని మీతో పంచుకుంటారు. యాక్సెస్ సమయ-పరిమితం.",
      recentPatients: "ఇటీవలి రోగులు",
      todaysPatients: (n) => `నేటి రోగులు (${n} ధృవీకరించబడ్డారు)`,
    },
    hospitalDash: {
      overviewTitle: "హాస్పిటల్ అవలోకనం",
      managementTitle: "హాస్పిటల్ మేనేజ్‌మెంట్",
      emergencyTitle: "🚨 అత్యవసర యాక్సెస్",
      emergencyBody: "2 అత్యవసర రికార్డ్-యాక్సెస్ సెషన్‌లు ప్రస్తుతం యాక్టివ్‌గా ఉన్నాయి.",
      registryTitle: "హాస్పిటల్ రోగి రిజిస్ట్రీ",
      registryIntro: "సందర్శనల సంఖ్యలో ఈ హాస్పిటల్‌లోని OPD, IPD మరియు అత్యవసర రికార్డులు ఉంటాయి.",
    },
  },
};

/* =========================
   SMALL SHARED PIECES
========================= */
const Ico = ({ children, className }) => (
  <span className={className} aria-hidden="true">
    {children}
  </span>
);

const MicIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
    <rect x="8.5" y="2" width="7" height="12" rx="3.5" fill="currentColor" />
    <path d="M4.5 10.5v1a7.5 7.5 0 0 0 15 0v-1" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M12 19v3.5" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const ClipIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
    <path
      d="M16.5 6.5v9a4.5 4.5 0 0 1-9 0V6a3 3 0 0 1 6 0v9a1.5 1.5 0 0 1-3 0V7"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    />
  </svg>
);

const EyeIcon = ({ visible }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
    <path
      d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
    {visible && <line x1="3" y1="21" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
  </svg>
);

function DoctorTeamIcon() {
  return (
    <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="32" cy="11.5" rx="5.6" ry="7" />
        <path d="M17.5 35c.6-5.5 4.2-9 9.5-11" />
        <path d="M46.5 35c-.6-5.5-4.2-9-9.5-11" />
        <path d="M25.6 26c-1.2 3.4-.5 6.6 1.9 8" />
        <circle cx="29.6" cy="35" r="1.4" />
        <path d="M40.2 29v5.6M37.4 31.8H43" />
        <circle cx="15" cy="45" r="4.6" />
        <path d="M6.5 61.5V61c0-5.5 3.8-9.5 8.5-9.5s8.5 4 8.5 9.5v.5" />
        <circle cx="49" cy="45" r="4.6" />
        <path d="M40.5 61.5V61c0-5.5 3.8-9.5 8.5-9.5s8.5 4 8.5 9.5v.5" />
        <circle cx="32" cy="50.2" r="3.3" />
        <path d="M25.6 61.5v-.3c0-3.9 2.8-6.6 6.4-6.6s6.4 2.7 6.4 6.6v.3" />
      </g>
      <path d="M26 10.5C25.4 5 28.4 2 32 2s6.6 3 6 8.5c-1.2-2.6-3.4-4-6-4s-4.8 1.4-6 4z" fill="currentColor" />
      <path d="M28.3 23.2 32 30l3.7-6.8z" fill="currentColor" />
    </svg>
  );
}

function PatientIcon() {
  const front = (
    <>
      <ellipse cx="24" cy="32" rx="9.5" ry="11.5" />
      <rect x="19.5" y="41" width="9" height="8" />
      <path d="M7 61v-2c0-8 6.5-12 17-12s17 4 17 12v2z" />
    </>
  );
  return (
    <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true" focusable="false">
      <defs>
        <mask id="patient-icon-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
          <rect width="64" height="64" fill="#fff" />
          <g fill="#000" stroke="#000" strokeWidth="3.6" strokeLinejoin="round">{front}</g>
        </mask>
      </defs>
      <g fill="currentColor" mask="url(#patient-icon-cut)">
        <ellipse cx="40" cy="25" rx="8.5" ry="10.5" />
        <rect x="35.5" y="33" width="9" height="8" />
        <path d="M24 56v-2c0-8 6-12.5 16-12.5s16 4.5 16 12.5v2z" />
      </g>
      <g fill="currentColor">{front}</g>
      <path d="M52 4.5v10M47 9.5h10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* Shows the drawn icon for patient / doctor, emoji for hospital */
function RoleIcon({ role }) {
  const r = ROLES[role];
  return r.Icon ? <r.Icon /> : r.icon;
}

function AssistantIcon() {
  return (
    <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true" focusable="false" color="#0b3b8c">
      <circle cx="15" cy="42.5" r="5.4" fill="#fff" stroke="currentColor" strokeWidth="3" />
      <circle cx="49" cy="42.5" r="5.4" fill="#fff" stroke="currentColor" strokeWidth="3" />
      <line x1="32" y1="10" x2="32" y2="16.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="7.6" r="3" fill="#7fc4ff" stroke="currentColor" strokeWidth="2.4" />
      <rect x="12.5" y="16.5" width="39" height="35.5" rx="12" fill="#e7edf6" stroke="currentColor" strokeWidth="3.2" />
      <path
        d="M26.5 16.5v5.3a2.8 2.8 0 0 0 2.8 2.8h5.4a2.8 2.8 0 0 0 2.8-2.8v-5.3"
        fill="#5c6b85"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <rect x="18" y="22.8" width="28" height="23" rx="8" fill="#fff" stroke="currentColor" strokeWidth="3.2" />
      <ellipse cx="26.5" cy="34" rx="4.4" ry="5.2" fill="currentColor" />
      <ellipse cx="25.1" cy="31.9" rx="1.3" ry="1.7" fill="#fff" />
      <ellipse cx="37.5" cy="34" rx="4.4" ry="5.2" fill="currentColor" />
      <ellipse cx="36.1" cy="31.9" rx="1.3" ry="1.7" fill="#fff" />
      <path d="M26 41.8c1.7 2.8 8.3 2.8 12 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Logo() {
  return (
    <div className="logo">
      <Ico className="logo-icon">✚</Ico>
      <div>
        <strong className="logo-name">SMART-MEDX</strong>
        <p>India's Public Health Portal</p>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  as: Tag = "input",
  showPasswordLabel = "Show password",
  hidePasswordLabel = "Hide password",
  ...props
}) {
  const [reveal, setReveal] = useState(false);
  const isPassword = props.type === "password";

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className={isPassword ? "field-with-toggle" : undefined}>
        <Tag
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          {...props}
          {...(isPassword ? { type: reveal ? "text" : "password" } : null)}
        />
        {isPassword && (
          <button
            type="button"
            className="pw-toggle"
            aria-label={reveal ? hidePasswordLabel : showPasswordLabel}
            aria-pressed={reveal}
            onClick={() => setReveal(!reveal)}
          >
            <EyeIcon visible={reveal} />
          </button>
        )}
      </div>
      {error && (
        <p className="field-error" id={`${id}-err`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================
   DIGIT BOXES (Aadhaar + OTP): used in the PATIENT login only
========================= */
function DigitBoxes({ id, label, groups, value, onChange, error, otp = false, autoFocus = false }) {
  const total = groups.reduce((a, b) => a + b, 0);
  const refs = useRef([]);

  const focusBox = (i) => {
    const el = refs.current[Math.max(0, Math.min(i, total - 1))];
    if (el) el.focus();
  };

  useEffect(() => {
    if (autoFocus) focusBox(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (i, e) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) return; // deleting is handled in onKeyDown
    const d = raw.length > 1 ? raw.replace(value[i] || "", "").slice(0, 1) || raw.slice(-1) : raw;
    const next = i < value.length ? value.slice(0, i) + d + value.slice(i + 1) : value + d;
    onChange(next.slice(0, total));
    focusBox(i + 1);
  };

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const t = i < value.length ? i : value.length - 1;
      if (t >= 0) {
        onChange(value.slice(0, t) + value.slice(t + 1));
        focusBox(t);
      }
    } else if (e.key === "Delete") {
      e.preventDefault();
      if (i < value.length) onChange(value.slice(0, i) + value.slice(i + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(Math.min(i + 1, value.length));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const digits = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, total);
    if (!digits) return;
    onChange(digits);
    focusBox(digits.length);
  };

  let start = 0;
  return (
    <div className="digit-field">
      <span className="box-label" id={`${id}-label`}>{label}</span>

      <div
        className="digit-groups"
        role="group"
        aria-labelledby={`${id}-label`}
        aria-describedby={error ? `${id}-err` : undefined}
      >
        {groups.map((g, gi) => {
          const s = start;
          start += g;
          return (
            <div className="digit-group" key={gi}>
              {Array.from({ length: g }, (_, k) => {
                const i = s + k;
                return (
                  <input
                    key={i}
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    className={value[i] ? "digit-box filled" : "digit-box"}
                    type="text"
                    inputMode="numeric"
                    autoComplete={otp && i === 0 ? "one-time-code" : "off"}
                    aria-label={`${label}, digit ${i + 1} of ${total}`}
                    aria-invalid={!!error}
                    value={value[i] || ""}
                    onChange={(e) => handleChange(i, e)}
                    onKeyDown={(e) => handleKey(i, e)}
                    onPaste={handlePaste}
                    onFocus={(e) => {
                      if (i > value.length) focusBox(value.length);
                      else e.target.select();
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {error && (
        <p className="field-error" id={`${id}-err`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* `active` (optional): true/false when the card toggles a details panel */
function StatCard({ icon, title, text, onClick, active }) {
  const inner = (
    <>
      <Ico className="stat-icon">{icon}</Ico>
      <h3>{title}</h3>
      <p>{text}</p>
    </>
  );
  return onClick ? (
    <button
      type="button"
      className={active ? "stat-card clickable active" : "stat-card clickable"}
      aria-expanded={active === undefined ? undefined : active}
      onClick={onClick}
    >
      {inner}
    </button>
  ) : (
    <div className="stat-card">{inner}</div>
  );
}

function Banner({ variant, hello, name, meta, status }) {
  return (
    <section className={`welcome-banner ${variant || ""}`}>
      <div>
        <p>{hello}</p>
        <h2 className="banner-name">{name}</h2>
        <span>{meta}</span>
      </div>
      <div className="health-status">
        <Ico className="dot">●</Ico> {status}
      </div>
    </section>
  );
}

/* =========================
   GOVERNMENT STRIP + ACCESSIBILITY TOOLS
========================= */
function GovStrip({ size, setSize, contrast, setContrast }) {
  const skip = (e) => {
    e.preventDefault();
    const el = document.getElementById("main");
    if (el) el.focus();
  };

  return (
    <>
      <a href="#main" className="skip-link" onClick={skip}>
        Skip to main content
      </a>
      <div className="gov-strip">
        <div className="gov-left">
          <Ico>🇮🇳</Ico>
          <span lang="hi">भारत सरकार</span>
          <span className="gov-sep">|</span>
          <span>Government of India</span>
          <span className="gov-ministry">
            Ministry of Health &amp; Family Welfare
          </span>
        </div>

        <div className="gov-tools" role="group" aria-label="Accessibility tools">
          <button
            type="button"
            aria-label="Decrease text size"
            disabled={size === 0}
            onClick={() => setSize(size - 1)}
          >
            A-
          </button>
          <button
            type="button"
            aria-label="Default text size"
            onClick={() => setSize(1)}
          >
            A
          </button>
          <button
            type="button"
            aria-label="Increase text size"
            disabled={size === 2}
            onClick={() => setSize(size + 1)}
          >
            A+
          </button>
          <button
            type="button"
            aria-pressed={contrast}
            onClick={() => setContrast(!contrast)}
          >
            ◐ Contrast
          </button>
        </div>
      </div>
    </>
  );
}

/* =========================
   LANGUAGE OPTIONS (login / role-selection screens only)
========================= */
const AUTH_LANGS = [
  ["en", "English"],
  ["hi", "हिन्दी"],
  ["te", "తెలుగు"],
];

const AUTH_TEXT = {
  en: {
    welcome: "Welcome to SMART-MEDX",
    welcomeSub: "Select your login type to continue",
    security: "Secure healthcare access powered by SMART-MEDX",
    back: "Back to role selection",
    roleTitle: { patient: "Patient", doctor: "Doctor / Hospital Staff", hospital: "Hospital Management" },
    roleSub: { patient: "Aadhaar + OTP Login", doctor: "Professional Login", hospital: "Admin Login" },
    heading: { patient: "Patient Login", doctor: "Doctor / Hospital Staff", hospital: "Hospital Management" },
    tagline: {
      patient: "Authenticate using Aadhaar and OTP",
      doctor: "Healthcare professional login",
      hospital: "Hospital administrator login",
    },
    aadhaar: "Aadhaar Number",
    sendOtp: "Send OTP",
    otpInfo: "OTP sent to your registered mobile number.",
    enterOtp: "Enter OTP",
    verify: "Verify and continue",
    changeAadhaar: "Change Aadhaar Number",
    demoOtp: "Demo prototype: any 6-digit OTP is accepted.",
    demoFields: "Demo prototype: enter any values.",
    login: "Login",
    fields: { pid: "Professional ID (HPR)", hid: "Hospital ID (HFR)", pin: "PIN", aid: "Hospital Admin ID", pw: "Password" },
    desc: {
      patient: "Manage your unified health information",
      doctor: "Access authorized patient healthcare information",
      hospital: "Manage hospital healthcare operations",
    },
    showPassword: "Show password",
    hidePassword: "Hide password",
  },
  hi: {
    welcome: "SMART-MEDX में आपका स्वागत है",
    welcomeSub: "जारी रखने के लिए अपना लॉगिन प्रकार चुनें",
    security: "SMART-MEDX द्वारा सुरक्षित स्वास्थ्य सेवा पहुंच",
    back: "भूमिका चयन पर वापस जाएं",
    roleTitle: { patient: "मरीज़", doctor: "डॉक्टर / अस्पताल स्टाफ", hospital: "अस्पताल प्रबंधन" },
    roleSub: { patient: "आधार + OTP लॉगिन", doctor: "व्यावसायिक लॉगिन", hospital: "एडमिन लॉगिन" },
    heading: { patient: "मरीज़ लॉगिन", doctor: "डॉक्टर / अस्पताल स्टाफ", hospital: "अस्पताल प्रबंधन" },
    tagline: {
      patient: "आधार और OTP का उपयोग करके सत्यापित करें",
      doctor: "स्वास्थ्य सेवा पेशेवर लॉगिन",
      hospital: "अस्पताल प्रशासक लॉगिन",
    },
    aadhaar: "आधार नंबर",
    sendOtp: "OTP भेजें",
    otpInfo: "आपके पंजीकृत मोबाइल नंबर पर OTP भेजा गया है।",
    enterOtp: "OTP दर्ज करें",
    verify: "सत्यापित करें और जारी रखें",
    changeAadhaar: "आधार नंबर बदलें",
    demoOtp: "डेमो प्रोटोटाइप: कोई भी 6 अंकों का OTP स्वीकार किया जाएगा।",
    demoFields: "डेमो प्रोटोटाइप: कोई भी मान दर्ज करें।",
    login: "लॉगिन करें",
    fields: { pid: "व्यावसायिक ID (HPR)", hid: "अस्पताल ID (HFR)", pin: "पिन", aid: "अस्पताल एडमिन ID", pw: "पासवर्ड" },
    desc: {
      patient: "अपनी एकीकृत स्वास्थ्य जानकारी प्रबंधित करें",
      doctor: "अधिकृत मरीज़ स्वास्थ्य जानकारी तक पहुंचें",
      hospital: "अस्पताल स्वास्थ्य सेवा संचालन प्रबंधित करें",
    },
    showPassword: "पासवर्ड दिखाएं",
    hidePassword: "पासवर्ड छिपाएं",
  },
  te: {
    welcome: "SMART-MEDX కు స్వాగతం",
    welcomeSub: "కొనసాగించడానికి మీ లాగిన్ రకాన్ని ఎంచుకోండి",
    security: "SMART-MEDX ద్వారా సురక్షిత ఆరోగ్య సేవ యాక్సెస్",
    back: "పాత్ర ఎంపికకు తిరిగి వెళ్ళండి",
    roleTitle: { patient: "రోగి", doctor: "డాక్టర్ / హాస్పిటల్ సిబ్బంది", hospital: "హాస్పిటల్ మేనేజ్‌మెంట్" },
    roleSub: { patient: "ఆధార్ + OTP లాగిన్", doctor: "ప్రొఫెషనల్ లాగిన్", hospital: "అడ్మిన్ లాగిన్" },
    heading: { patient: "రోగి లాగిన్", doctor: "డాక్టర్ / హాస్పిటల్ సిబ్బంది", hospital: "హాస్పిటల్ మేనేజ్‌మెంట్" },
    tagline: {
      patient: "ఆధార్ మరియు OTP ఉపయోగించి ధృవీకరించండి",
      doctor: "ఆరోగ్య సంరక్షణ నిపుణుల లాగిన్",
      hospital: "హాస్పిటల్ అడ్మినిస్ట్రేటర్ లాగిన్",
    },
    aadhaar: "ఆధార్ నంబర్",
    sendOtp: "OTP పంపండి",
    otpInfo: "మీ నమోదిత మొబైల్ నంబర్‌కు OTP పంపబడింది.",
    enterOtp: "OTP నమోదు చేయండి",
    verify: "ధృవీకరించి కొనసాగించండి",
    changeAadhaar: "ఆధార్ నంబర్ మార్చండి",
    demoOtp: "డెమో ప్రోటోటైప్: ఏదైనా 6 అంకెల OTP ఆమోదించబడుతుంది.",
    demoFields: "డెమో ప్రోటోటైప్: ఏవైనా విలువలు నమోదు చేయండి.",
    login: "లాగిన్",
    fields: { pid: "ప్రొఫెషనల్ ID (HPR)", hid: "హాస్పిటల్ ID (HFR)", pin: "పిన్", aid: "హాస్పిటల్ అడ్మిన్ ID", pw: "పాస్‌వర్డ్" },
    desc: {
      patient: "మీ యూనిఫైడ్ ఆరోగ్య సమాచారాన్ని నిర్వహించండి",
      doctor: "అధీకృత రోగి ఆరోగ్య సమాచారాన్ని యాక్సెస్ చేయండి",
      hospital: "హాస్పిటల్ ఆరోగ్య సేవల నిర్వహణ",
    },
    showPassword: "పాస్‌వర్డ్ చూపించు",
    hidePassword: "పాస్‌వర్డ్ దాచు",
  },
};

function LangBar({ lang, setLang }) {
  return (
    <div className="lang-bar" role="group" aria-label="Choose language">
      {AUTH_LANGS.map(([code, label]) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={lang === code}
          className={lang === code ? "on" : ""}
          onClick={() => setLang(code)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* =========================
   AUTH
========================= */
function RoleSelection({ onSelect, lang, setLang }) {
  return (
    <div className="auth-page" id="main" tabIndex={-1}>
      <div className="auth-card role-card">
        <Logo />

        <LangBar lang={lang} setLang={setLang} />

        <div className="welcome">
          <h1>{AUTH_TEXT[lang].welcome}</h1>
          <p>{AUTH_TEXT[lang].welcomeSub}</p>
        </div>

        <div className="role-grid">
          {Object.keys(ROLES).map((key) => (
            <button
              key={key}
              type="button"
              className="role-option"
              onClick={() => onSelect(key)}
            >
              <Ico className={`role-icon ${key}-icon`}>
                <RoleIcon role={key} />
              </Ico>
              <div>
                <h2 lang={lang}>{AUTH_TEXT[lang].roleTitle[key]}</h2>
                <p lang={lang}>{AUTH_TEXT[lang].roleSub[key]}</p>
              </div>
              <Ico className="chev">›</Ico>
            </button>
          ))}
        </div>

        <div className="security-note" lang={lang}>
          <Ico>🔒</Ico> {AUTH_TEXT[lang].security}
        </div>
      </div>
    </div>
  );
}

function AuthShell({ role, onBack, lang, children }) {
  const t = AUTH_TEXT[lang];
  return (
    <div className="auth-page" id="main" tabIndex={-1}>
      <div className="auth-card login-card">
        <button type="button" className="back-btn" onClick={onBack}>
          ← {t.back}
        </button>

        <Logo />

        <div className="login-title" lang={lang}>
          <Ico className="big-role-icon">
            <RoleIcon role={role} />
          </Ico>
          <h1>{t.heading[role]}</h1>
          <p>{t.tagline[role]}</p>
        </div>

        {children}
      </div>
    </div>
  );
}

function PatientLogin({ onBack, onLogin, lang }) {
  const t = AUTH_TEXT[lang];
  const [aadhaar, setAadhaar] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();

    if (!otpMode) {
      if (aadhaar.replace(/\D/g, "").length !== 12) {
        setError("Enter a valid 12-digit Aadhaar number.");
        return;
      }
      setError("");
      setOtpMode(true);
      return;
    }

    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    onLogin();
  };

  return (
    <AuthShell role="patient" onBack={onBack} lang={lang}>
      <form onSubmit={submit} noValidate>
        {!otpMode ? (
          <Field
            id="aadhaar"
            label={t.aadhaar}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="XXXX XXXX XXXX"
            maxLength={14}
            value={aadhaar}
            error={error}
            onChange={(e) => setAadhaar(fmtAadhaar(e.target.value))}
          />
        ) : (
          <>
            <div className="otp-info" role="status" lang={lang}>
              {t.otpInfo}
            </div>
            <DigitBoxes
              id="otp"
              label={t.enterOtp}
              groups={[6]}
              otp
              autoFocus
              value={otp}
              onChange={setOtp}
              error={error}
            />
          </>
        )}

        <button className="primary-btn" type="submit" lang={lang}>
          {otpMode ? t.verify : t.sendOtp}
        </button>

        {otpMode && (
          <button
            type="button"
            className="text-btn"
            lang={lang}
            onClick={() => {
              setOtpMode(false);
              setOtp("");
              setError("");
            }}
          >
            {t.changeAadhaar}
          </button>
        )}
      </form>

      <p className="demo-note" lang={lang}>{t.demoOtp}</p>
    </AuthShell>
  );
}

function LoginForm({ role, onBack, onLogin, lang }) {
  const t = AUTH_TEXT[lang];
  const fields = LOGIN_FIELDS[role];
  const [vals, setVals] = useState({});
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    fields.forEach(([key, label]) => {
      if (!(vals[key] || "").trim()) err[key] = `${t.fields[key] || label} is required.`;
    });
    setErrors(err);
    if (!Object.keys(err).length) onLogin();
  };

  return (
    <AuthShell role={role} onBack={onBack} lang={lang}>
      <form onSubmit={submit} noValidate>
        {fields.map(([key, label, type]) => {
          const shownLabel = t.fields[key] || label;
          return (
            <Field
              key={key}
              id={`${role}-${key}`}
              label={shownLabel}
              type={type}
              placeholder={`Enter ${shownLabel}`}
              value={vals[key] || ""}
              error={errors[key]}
              showPasswordLabel={t.showPassword}
              hidePasswordLabel={t.hidePassword}
              onChange={(e) => setVals({ ...vals, [key]: e.target.value })}
            />
          );
        })}

        <button className="primary-btn" type="submit" lang={lang}>
          {t.login}
        </button>
      </form>

      <p className="demo-note" lang={lang}>{t.demoFields}</p>
    </AuthShell>
  );
}

/* =========================
   SHELL: SIDEBAR + TOPBAR
========================= */
function Sidebar({ role, page, setPage, logout, open, onClose, lang }) {
  return (
    <>
      {open && <div className="overlay" onClick={onClose} aria-hidden="true" />}

      <aside className={open ? "sidebar open" : "sidebar"}>
        <Logo />

        <div className="role-badge">
          <Ico className="badge-icon">
            <RoleIcon role={role} />
          </Ico>
          {ROLES[role].badge.replace(/^\S+\s/, "")}
        </div>

        <nav aria-label="Main navigation">
          {NAV[role].map(([id, icon]) => (
            <button
              key={id}
              type="button"
              className={page === id ? "nav-item active" : "nav-item"}
              aria-current={page === id ? "page" : undefined}
              lang={lang}
              onClick={() => {
                setPage(id);
                onClose();
              }}
            >
              <Ico>{icon}</Ico>
              {PAGE_TEXT[lang].nav[role][id]}
            </button>
          ))}
        </nav>

        <button type="button" className="logout-btn" lang={lang} onClick={logout}>
          ↪ {PAGE_TEXT[lang].logout}
        </button>
      </aside>
    </>
  );
}

function TopBar({ role, title, onMenu, lang }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="menu-btn"
          aria-label="Open navigation menu"
          onClick={onMenu}
        >
          ☰
        </button>
        <div>
          <h1 lang={lang}>{title}</h1>
          <p lang={lang}>{AUTH_TEXT[lang].desc[role]}</p>
        </div>
      </div>

      <div className="top-user">{USER[role]}</div>
    </header>
  );
}

/* =========================
   DASHBOARDS
========================= */
const BLANK_CONTACT = {
  mobile: "9876543210",
  ecName: "R. Lakshmi",
  ecPhone: "9876500001",
  ec2Name: "K. Prasad",
  ec2Phone: "9876511112",
  ec2Rel: "Parent",
};

const isTenDigitPhone = (v) => /^\d{10}$/.test((v || "").replace(/\D/g, ""));

/* `data` / `setData` live in App root so the Health Profile page shows the same details */
function ContactEmergencyCard({ data, setData }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data);
  const [errors, setErrors] = useState({});

  const startEdit = () => {
    setDraft(data);
    setErrors({});
    setEditing(true);
  };

  const cancel = () => {
    setDraft(data);
    setErrors({});
    setEditing(false);
  };

  const set = (k) => (e) => setDraft({ ...draft, [k]: e.target.value });

  const save = (e) => {
    e.preventDefault();
    const err = {};
    if (!isTenDigitPhone(draft.mobile)) err.mobile = "Enter a valid 10-digit mobile number.";
    if (!draft.ecName.trim()) err.ecName = "Enter the primary emergency contact's name.";
    if (!isTenDigitPhone(draft.ecPhone)) err.ecPhone = "Enter a valid 10-digit mobile number.";
    if (draft.ec2Name.trim() && !isTenDigitPhone(draft.ec2Phone)) {
      err.ec2Phone = "Enter a valid 10-digit mobile number, or clear the secondary contact's name.";
    }
    setErrors(err);
    if (Object.keys(err).length) return;
    setData(draft);
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="generic-card contact-card">
        <div className="contact-card-head">
          <h2>📞 Contact &amp; Emergency Details</h2>
          <button type="button" className="secondary-btn small-btn" onClick={startEdit}>
            ✎ Edit
          </button>
        </div>

        <dl className="summary-list">
          <div>
            <dt>Primary mobile number</dt>
            <dd>{data.mobile}</dd>
          </div>
          <div>
            <dt>Primary emergency contact</dt>
            <dd>{data.ecName} • {data.ecPhone}</dd>
          </div>
          <div>
            <dt>Secondary emergency contact</dt>
            <dd>
              {data.ec2Name
                ? `${data.ec2Name} • ${data.ec2Phone} • ${data.ec2Rel}`
                : "Not added"}
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <form className="generic-card contact-card" onSubmit={save} noValidate>
      <div className="contact-card-head">
        <h2>📞 Contact &amp; Emergency Details</h2>
      </div>

      <Field
        id="cd-mobile"
        label="Primary mobile number"
        inputMode="numeric"
        maxLength={10}
        value={draft.mobile}
        error={errors.mobile}
        onChange={set("mobile")}
      />

      <h3 className="contact-subhead">Primary emergency contact</h3>
      <div className="grid-2">
        <Field id="cd-ecname" label="Name" value={draft.ecName} error={errors.ecName} onChange={set("ecName")} />
        <Field
          id="cd-ecphone"
          label="Phone number"
          inputMode="numeric"
          maxLength={10}
          value={draft.ecPhone}
          error={errors.ecPhone}
          onChange={set("ecPhone")}
        />
      </div>

      <h3 className="contact-subhead">Secondary emergency contact (optional)</h3>
      <div className="grid-3">
        <Field id="cd-ec2name" label="Name" value={draft.ec2Name} onChange={set("ec2Name")} />
        <Field
          id="cd-ec2phone"
          label="Phone number"
          inputMode="numeric"
          maxLength={10}
          value={draft.ec2Phone}
          error={errors.ec2Phone}
          onChange={set("ec2Phone")}
        />
        <div className="field">
          <label htmlFor="cd-ec2rel">Relationship</label>
          <select id="cd-ec2rel" value={draft.ec2Rel} onChange={set("ec2Rel")}>
            {["Spouse", "Parent", "Sibling", "Child", "Friend", "Other"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="action-row">
        <button type="submit" className="primary-btn small-btn">💾 Save</button>
        <button type="button" className="secondary-btn" onClick={cancel}>Cancel</button>
      </div>
    </form>
  );
}

function PatientDashboard({ goTo, onAssistant, lang, contact, setContact }) {
  const t = PAGE_TEXT[lang].patientDash;
  return (
    <>
      <Banner
        hello={t.welcomeBack}
        name={USER.patient}
        meta={`${t.healthIdLabel}: MEDX-9988-7766`}
        status="Health Profile Active"
      />

      <div className="alert-card" role="note" lang={lang}>
        <strong>{t.allergyTitle}</strong>
        <p>{t.allergyBody}</p>
      </div>

      <ContactEmergencyCard data={contact} setData={setContact} />

      <h2 className="section-title" lang={lang}>{t.quickAccess}</h2>

      <div className="stats-grid">
        <StatCard icon="📋" title="Medical Records" text="12 records" onClick={() => goTo("records")} />
        <StatCard icon="💊" title="Medications" text="2 active" onClick={() => goTo("medications")} />
        <StatCard icon="🔐" title="Consent" text="2 active requests" onClick={() => goTo("consent")} />
        <StatCard icon={<AssistantIcon />} title="AI Assistant" text="Ask about your reports" onClick={onAssistant} />
      </div>

      <h2 className="section-title" lang={lang}>{t.recentRecord}</h2>

      <div className="record-card">
        <Ico className="record-icon">🧪</Ico>
        <div className="record-info">
          <h3>Blood Test</h3>
          <p>Apollo Hospitals • 18 Sep 2026</p>
          <span>Dr. A. Sharma</span>
        </div>
        <span className="status-badge">FHIR / PDF</span>
      </div>

      <div className="medication-card">
        <h3 lang={lang}>
          <Ico>💊</Ico> {t.currentMed}
        </h3>
        <strong>Azithromycin 500mg</strong>
        <p>Once daily • 3 days remaining</p>
        <span className="status-badge">✓ No allergy conflict found</span>
      </div>
    </>
  );
}

/* Health Profile: shows the real emergency contact details */
function PatientProfile({ contact, goTo }) {
  const second = contact.ec2Name
    ? `${contact.ec2Name} • ${contact.ec2Phone} • ${contact.ec2Rel}`
    : "Not added";
  return (
    <>
      <GenericPage
        description="Your unified health information."
        items={[
          ["🪪", "Health ID", "MEDX-9988-7766"],
          ["🎂", "Age", "28 years"],
          ["🩸", "Blood Group", "B+"],
          ["⚠", "Allergy", "Penicillin"],
          ["📱", "Primary mobile number", contact.mobile],
          ["📞", "Emergency Contact (primary)", `${contact.ecName} • ${contact.ecPhone}`],
          ["📞", "Emergency Contact (secondary)", second],
        ]}
      />
      <button type="button" className="secondary-btn show-all" onClick={() => goTo("dashboard")}>
        ✎ Edit contact details
      </button>
    </>
  );
}

function HospitalDashboard({ goTo, lang, encounters }) {
  const t = PAGE_TEXT[lang].hospitalDash;
  const emergencyCount = encounters.filter((e) => e.emergency).length;
  const cards = [
    ["👥", PAGE_TEXT[lang].nav.hospital.patients, "Search and manage registered patients.", "Open Registry", "patients"],
    ["🔐", PAGE_TEXT[lang].nav.hospital.consent, "Monitor patient consent and record access.", "Manage Consent", "consent"],
    ["👨‍⚕️", PAGE_TEXT[lang].nav.hospital.staff, "Manage authorized healthcare professionals.", "View Staff", "staff"],
    ["📊", PAGE_TEXT[lang].nav.hospital.audit, "Track access to patient healthcare records.", "View Logs", "audit"],
  ];

  return (
    <>
      <Banner
        variant="hospital-banner"
        hello="Welcome"
        name="Hospital Management"
        meta="Apollo Hospitals • Hyderabad"
        status="Hospital Verified"
      />

      <h2 className="section-title" lang={lang}>{t.overviewTitle}</h2>

      <div className="stats-grid">
        <StatCard icon="👥" title="Patients" text="2,480 registered" />
        <StatCard icon="👨‍⚕️" title="Doctors & Staff" text="186 active" />
        <StatCard icon="🔐" title="Consent Requests" text="12 pending" />
        <StatCard
          icon="🚨"
          title="Emergency Access"
          text={`${emergencyCount} case${emergencyCount === 1 ? "" : "s"} recorded`}
          onClick={() => goTo("emergency")}
        />
      </div>

      <h2 className="section-title" lang={lang}>{t.managementTitle}</h2>

      <div className="management-grid">
        {cards.map(([icon, title, text, btn, target]) => (
          <div className="management-card" key={title}>
            <Ico className="mgmt-icon">{icon}</Ico>
            <h3>{title}</h3>
            <p>{text}</p>
            <button type="button" className="secondary-btn" onClick={() => goTo(target)}>
              {btn}
            </button>
          </div>
        ))}
      </div>

      <div className="hospital-alert" role="alert" lang={lang}>
        <strong>{t.emergencyTitle}</strong>
        <p>
          {emergencyCount > 0
            ? `${emergencyCount} emergency case${emergencyCount === 1 ? "" : "s"} recorded by doctors. Open Emergency Access for details.`
            : "No emergency cases have been recorded yet."}
        </p>
      </div>
    </>
  );
}

/* =========================
   INTERACTIVE PAGES
========================= */
function ConsentManager() {
  const [items, setItems] = useState([
    { id: 1, icon: "👨‍⚕️", name: "Dr. R. K. Patel", scope: "Medical History + Lab Reports", active: true },
    { id: 2, icon: "🏥", name: "City Care Hospital", scope: "Temporary access • 2 hours", active: true },
  ]);

  const toggle = (id) =>
    setItems(items.map((i) => (i.id === id ? { ...i, active: !i.active } : i)));

  return (
    <div className="generic-card">
      <h2>Manage who can access your health records.</h2>

      {items.map((i) => (
        <div className="generic-row" key={i.id}>
          <Ico className="row-icon">{i.icon}</Ico>
          <div className="row-text">
            <h3>{i.name}</h3>
            <p>{i.scope}</p>
          </div>
          <span className={i.active ? "status-badge" : "status-badge off"} role="status">
            {i.active ? "Access granted" : "Access revoked"}
          </span>
          <button type="button" className="secondary-btn" onClick={() => toggle(i.id)}>
            {i.active ? "Revoke" : "Grant again"}
          </button>
        </div>
      ))}
    </div>
  );
}

/* =========================
   DOCTOR: ZERO STANDING ACCESS
   Aadhaar number -> OTP goes to the PATIENT -> patient shares it -> time-limited access
========================= */
const fmtAadhaar = (v) =>
  v.replace(/\D/g, "").slice(0, 12).replace(/(\d{4})(?=\d)/g, "$1 ");

const SCOPES = [
  ["history", "📋", "Medical history"],
  ["labs", "🧪", "Lab reports"],
  ["rx", "💊", "Prescriptions"],
  ["imaging", "🩻", "Imaging"],
];

const DURATIONS = [
  [1, "1 minute (demo)"],
  [30, "30 minutes"],
  [60, "1 hour"],
  [120, "2 hours"],
];

const RECORD_DATA = {
  history: ["📋", "Medical History", "Allergy: Penicillin • Blood group B+ • Vaccination: 20 Aug 2026"],
  labs: ["🧪", "Lab Reports", "Blood Test • Apollo Hospitals • 18 Sep 2026 • Hemoglobin 11.5 g/dL"],
  rx: ["💊", "Prescriptions", "Azithromycin 500mg • Dr. A. Sharma • 15 Sep 2026"],
  imaging: ["🩻", "Imaging", "Chest imaging • Apollo Hospitals • 02 Sep 2026"],
};

function useNow() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

const fmtTime = (s) => {
  const p = (n) => String(n).padStart(2, "0");
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h ? `${h}:${p(m)}:${p(s % 60)}` : `${p(m)}:${p(s % 60)}`;
};

function SessionBar({ session, onEnd, onExpire }) {
  const now = useNow();
  const hasLimit = !session.emergency && session.expiresAt != null;
  const left = hasLimit ? Math.max(0, Math.ceil((session.expiresAt - now) / 1000)) : null;

  useEffect(() => {
    if (hasLimit && left === 0) onExpire();
  }, [left, hasLimit]); // eslint-disable-line react-hooks/exhaustive-deps

  const cls = ["session-bar", session.emergency ? "emergency" : left !== null && left < 300 ? "low" : ""].join(" ");

  return (
    <div className={cls} role="region" aria-label="Active patient access">
      <div>
        <strong>{session.emergency ? "🚨 Emergency access" : "🔓 Access active"}</strong>
        {" • "}
        {session.name} ({session.healthId})
      </div>
      <div className="session-right">
        {hasLimit ? (
          <span className="timer">⏱ {fmtTime(left)} left</span>
        ) : (
          <span className="timer">⏱ No time limit</span>
        )}
        <button type="button" className="end-btn" onClick={onEnd}>
          {session.emergency ? "Save & next patient" : "End access now"}
        </button>
      </div>
    </div>
  );
}

function Locked({ goTo, lang }) {
  const t = PAGE_TEXT[lang].locked;
  return (
    <div className="generic-card locked" lang={lang}>
      <Ico className="lock-icon">🔒</Ico>
      <h2>{t.title}</h2>
      <p>{t.body}</p>
      <button type="button" className="primary-btn small-btn" onClick={() => goTo("patients")}>
        {t.button}
      </button>
    </div>
  );
}

/* =========================
   DOCTOR DASHBOARD + TODAY'S PATIENTS
========================= */
const PATIENT_NAMES = [
  "E. Sai Charan", "K. Lakshmi Devi", "P. Ravi Teja", "S. Anitha", "M. Venkata Rao", "G. Sunitha",
  "B. Suresh Kumar", "N. Padmavathi", "R. Harish", "D. Kavitha", "T. Srinivas", "V. Mounika",
  "A. Prasad", "Y. Swathi", "C. Nagaraju", "L. Bhavani", "J. Karthik", "S. Fatima",
  "U. Manohar", "K. Rajesh", "P. Deepika", "M. Abdul Rahman", "B. Jyothi", "R. Naveen",
];

const slotTime = (i) => {
  const m = 9 * 60 + i * 15;
  const h = Math.floor(m / 60);
  return `${((h + 11) % 12) + 1}:${String(m % 60).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

const TODAY_PATIENTS = PATIENT_NAMES.map((name, i) => {
  const words = name.split(" ");
  return {
    name,
    id: i === 0 ? "MEDX-9988-7766" : `MEDX-${1200 + i * 173}-${3100 + i * 241}`,
    initials: words[0][0] + words[words.length - 1][0],
    time: slotTime(i),
    done: i < 8, // 8 encounters completed, matches the overview card
  };
});

function genVisitDates(count, lastDay, seed) {
  const dates = [];
  let d = new Date(2026, 8, lastDay); // month 8 = September (0-indexed)
  for (let i = 0; i < count; i++) {
    dates.push(d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }));
    const gap = 8 + ((seed + i * 5) % 15); // 8-22 day gaps, deterministic
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - gap);
  }
  return dates;
}

const HOSPITAL_PATIENTS = PATIENT_NAMES.map((name, i) => {
  const words = name.split(" ");
  const visits = ((i * 7 + 3) % 18) + 1; // deterministic demo count, 1-18
  const lastDay = 24 - (i % 20);
  const aadhaarDigits = String(900000000000 + i * 876543).padStart(12, "0").slice(-12);
  const visitDates = genVisitDates(visits, lastDay, i);
  return {
    name,
    id: i === 0 ? "MEDX-9988-7766" : `MEDX-${1200 + i * 173}-${3100 + i * 241}`,
    initials: words[0][0] + words[words.length - 1][0],
    visits: visitDates.length,
    visitDates,
    lastVisit: visitDates[0],
    aadhaarDigits,
    aadhaar: "XXXX XXXX " + aadhaarDigits.slice(8),
  };
});

/* =========================
   DOCTORS & STAFF DIRECTORY (demo data)
========================= */
const STAFF_DIRECTORY = [
  { name: "Dr. A. Sharma", role: "Doctor", dept: "Cardiology", id: "HPR-10234", status: "Active", shift: "On Duty - ICU Block B", ext: "2201", assigned: 18 },
  { name: "Dr. R. K. Patel", role: "Doctor", dept: "Cardiology", id: "HPR-10235", status: "Active", shift: "On Duty - OPD Block A", ext: "2202", assigned: 14 },
  { name: "Dr. S. Reddy", role: "Doctor", dept: "Pathology", id: "HPR-10236", status: "Active", shift: "On Duty - Lab Block C", ext: "2203", assigned: 9 },
  { name: "Dr. M. Iyer", role: "Doctor", dept: "Orthopedics", id: "HPR-10237", status: "Active", shift: "On Duty - Ortho Ward", ext: "2204", assigned: 12 },
  { name: "Dr. N. Fernandes", role: "Doctor", dept: "Pediatrics", id: "HPR-10238", status: "On leave", shift: "On Leave - returns Mon", ext: "2205", assigned: 0 },
  { name: "Dr. V. Krishnan", role: "Doctor", dept: "General Medicine", id: "HPR-10239", status: "Active", shift: "On Duty - General Ward", ext: "2206", assigned: 21 },
  { name: "K. Lakshmi", role: "Nurse", dept: "ICU", id: "HFR-20114", status: "Active", shift: "On Duty - ICU Block B", ext: "3101", assigned: 8 },
  { name: "P. Sunanda", role: "Nurse", dept: "Emergency Ward", id: "HFR-20115", status: "Active", shift: "On Duty - Emergency Ward", ext: "3102", assigned: 11 },
  { name: "V. Ramesh", role: "Nurse", dept: "General Ward", id: "HFR-20116", status: "Active", shift: "On Duty - General Ward", ext: "3103", assigned: 15 },
  { name: "A. Farida", role: "Nurse", dept: "Maternity Ward", id: "HFR-20117", status: "On leave", shift: "On Leave - returns Wed", ext: "3104", assigned: 0 },
  { name: "S. Manoj", role: "Lab Technician", dept: "Pathology", id: "STF-30021", status: "Active", shift: "On Duty - Lab Block C", ext: "4001", assigned: 6 },
  { name: "T. Divya", role: "Radiology Technician", dept: "Radiology", id: "STF-30022", status: "Active", shift: "On Duty - Radiology Wing", ext: "4002", assigned: 5 },
  { name: "B. Kiran", role: "Pharmacist", dept: "Pharmacy", id: "STF-30023", status: "Active", shift: "On Duty - Pharmacy Counter", ext: "4003", assigned: 0 },
  { name: "R. Anjali", role: "Receptionist", dept: "Front Desk", id: "STF-30024", status: "Active", shift: "On Duty - Front Desk", ext: "4004", assigned: 0 },
  { name: "G. Prasanna", role: "Ward Boy", dept: "General Ward", id: "STF-30025", status: "Active", shift: "On Duty - General Ward", ext: "4005", assigned: 0 },
];

const genPatientId = () =>
  `MEDX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

const todayLabel = () =>
  new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

function NewPatientForm({ onAdd, onCancel }) {
  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Female");
  const [blood, setBlood] = useState("O+");
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const digits = aadhaar.replace(/\D/g, "");
    const err = {};
    if (!name.trim()) err.name = "Enter the patient's full name.";
    if (digits && digits.length !== 12) err.aadhaar = "Enter a valid 12-digit Aadhaar number, or leave it blank.";
    setErrors(err);
    if (Object.keys(err).length) return;

    const words = name.trim().split(/\s+/);
    onAdd({
      name: name.trim(),
      id: genPatientId(),
      aadhaarDigits: digits || null,
      aadhaar: digits ? "XXXX XXXX " + digits.slice(8) : "",
      initials: (words[0][0] + words[words.length - 1][0]).toUpperCase(),
      age: age || "—",
      gender,
      blood,
      visits: 1,
      visitDates: [todayLabel()],
      lastVisit: todayLabel(),
    });
  };

  return (
    <form className="generic-card" onSubmit={submit} noValidate>
      <h2>➕ Add new patient</h2>
      <p className="demo-note left">Register a new patient in the hospital records.</p>

      <Field id="np-name" label="Full name" value={name} error={errors.name} onChange={(e) => setName(e.target.value)} />
      <Field
        id="np-aadhaar"
        label="Aadhaar number (optional)"
        inputMode="numeric"
        autoComplete="off"
        placeholder="XXXX XXXX XXXX"
        maxLength={14}
        value={aadhaar}
        error={errors.aadhaar}
        onChange={(e) => setAadhaar(fmtAadhaar(e.target.value))}
      />

      <div className="grid-3">
        <Field id="np-age" label="Age" type="number" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
        <div className="field">
          <label htmlFor="np-gender">Gender</label>
          <select id="np-gender" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="np-blood">Blood group</label>
          <select id="np-blood" value={blood} onChange={(e) => setBlood(e.target.value)}>
            {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="action-row">
        <button className="primary-btn small-btn" type="submit">Save patient</button>
        <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function PatientRegistry({ lang, patients, onAdd, encounters }) {
  const t = PAGE_TEXT[lang];
  const [q, setQ] = useState("");
  const [sorted, setSorted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const term = q.trim().toLowerCase();
  let list = patients.filter((p) => (p.name + p.id).toLowerCase().includes(term));
  if (sorted) list = [...list].sort((a, b) => b.visits - a.visits);

  const emergencyCasesFor = (id) => encounters.filter((e) => e.healthId === id && e.emergency);

  return (
    <>
      <h2 className="section-title" lang={lang}>{t.hospitalDash.registryTitle}</h2>
      <p className="demo-note left" lang={lang}>{t.hospitalDash.registryIntro}</p>

      <div className="field tp-search">
        <label htmlFor="hp-q" lang={lang}>{t.common.searchLabel}</label>
        <input id="hp-q" type="search" placeholder="e.g. Lakshmi" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="verification-actions">
        <button
          type="button"
          className="secondary-btn show-all"
          aria-pressed={sorted}
          lang={lang}
          onClick={() => setSorted(!sorted)}
        >
          {sorted ? t.common.sortedByVisits : t.common.sortByVisits}
        </button>
        <button type="button" className="primary-btn small-btn" onClick={() => setAdding(!adding)}>
          {adding ? "✕ Cancel" : "➕ Add new patient"}
        </button>
      </div>

      {adding && (
        <NewPatientForm
          onAdd={(p) => {
            onAdd(p);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      <ul className="plain-list">
        {list.map((p) => {
          const open = expanded === p.id;
          const emCases = emergencyCasesFor(p.id);
          return (
            <li key={p.id}>
              <button
                type="button"
                className="patient-row patient-row-btn"
                aria-expanded={open}
                onClick={() => setExpanded(open ? null : p.id)}
              >
                <div className="avatar" aria-hidden="true">{p.initials}</div>
                <div>
                  <h3>{p.name}</h3>
                  <p lang={lang}>{p.id} • {t.common.lastVisit}: {p.lastVisit}</p>
                </div>
                <span className="status-badge visits-badge" lang={lang}>
                  🔁 {t.common.totalVisits(p.visits)}
                </span>
              </button>

              {open && (
                <div className="patient-detail">
                  <p><strong>Aadhaar:</strong> {p.aadhaar || "Not on record"}</p>
                  <p><strong>Total visits:</strong> {p.visits}</p>
                  <p><strong>Last visit:</strong> {p.lastVisit}</p>

                  <h4>📅 Visit dates</h4>
                  {p.visitDates && p.visitDates.length > 0 ? (
                    <ul className="visit-dates">
                      {p.visitDates.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="demo-note left">No individual visit dates on record.</p>
                  )}

                  <h4>🚨 Emergency cases ({emCases.length})</h4>
                  {emCases.length === 0 ? (
                    <p className="demo-note left">No emergency cases recorded for this patient.</p>
                  ) : (
                    emCases.map((e) => (
                      <div className="generic-row" key={e.id}>
                        <Ico className="row-icon">🚨</Ico>
                        <div className="row-text">
                          <h3>{e.time}</h3>
                          <p>{e.symptoms || "No symptoms recorded"} • Attended by {USER.doctor}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {list.length === 0 && <p className="demo-note left" lang={lang}>{t.common.noResult(q)}</p>}
    </>
  );
}

function StaffDetailModal({ staff, onClose }) {
  const initials = staff.name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`${staff.name} details`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h2>{staff.name}</h2>
            <p className="demo-note left">{staff.role} • {staff.dept}</p>
          </div>
          <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>✕</button>
        </div>

        <div className="patient-row">
          <div className="avatar" aria-hidden="true">{initials}</div>
          <div>
            <h3>{staff.name}</h3>
            <p>{staff.role} • {staff.dept}</p>
          </div>
          <span className={staff.status === "Active" ? "status-badge" : "status-badge wait"}>{staff.status}</span>
        </div>

        <dl className="summary-list">
          <div>
            <dt>Staff ID</dt>
            <dd>{staff.id}</dd>
          </div>
          <div>
            <dt>Department</dt>
            <dd>{staff.dept}</dd>
          </div>
          <div>
            <dt>Duty shift / schedule status</dt>
            <dd>{staff.shift}</dd>
          </div>
          <div>
            <dt>Contact extension</dt>
            <dd>Ext. {staff.ext}</dd>
          </div>
          <div>
            <dt>Assigned patient count</dt>
            <dd>{staff.assigned} patient{staff.assigned === 1 ? "" : "s"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function StaffDirectory() {
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState(null); // null | "Doctor" | "Nurse" | "Other"
  const [selected, setSelected] = useState(null);

  const term = q.trim().toLowerCase();
  const doctors = STAFF_DIRECTORY.filter((s) => s.role === "Doctor").length;
  const nurses = STAFF_DIRECTORY.filter((s) => s.role === "Nurse").length;
  const others = STAFF_DIRECTORY.length - doctors - nurses;

  let list = STAFF_DIRECTORY.filter((s) => (s.name + s.role + s.dept).toLowerCase().includes(term));
  if (roleFilter === "Doctor") list = list.filter((s) => s.role === "Doctor");
  else if (roleFilter === "Nurse") list = list.filter((s) => s.role === "Nurse");
  else if (roleFilter === "Other") list = list.filter((s) => s.role !== "Doctor" && s.role !== "Nurse");

  const initialsOf = (name) =>
    name
      .replace(/^Dr\.\s*/, "")
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const toggleFilter = (r) => setRoleFilter(roleFilter === r ? null : r);

  return (
    <>
      <h2 className="section-title">Doctors &amp; Staff directory</h2>
      <p className="demo-note left">Manage authorized hospital professionals. Click a card to filter, click a row for full details.</p>

      <div className="stats-grid">
        <StatCard icon="👨‍⚕️" title="Doctors" text={`${doctors} active${roleFilter === "Doctor" ? " • showing" : ""}`} onClick={() => toggleFilter("Doctor")} />
        <StatCard icon="👩‍⚕️" title="Nurses" text={`${nurses} active${roleFilter === "Nurse" ? " • showing" : ""}`} onClick={() => toggleFilter("Nurse")} />
        <StatCard icon="🧑‍💼" title="Other staff" text={`${others} active${roleFilter === "Other" ? " • showing" : ""}`} onClick={() => toggleFilter("Other")} />
      </div>

      <div className="field tp-search">
        <label htmlFor="st-q">Search staff</label>
        <input
          id="st-q"
          type="search"
          placeholder="e.g. Sharma or Cardiology"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {roleFilter && (
        <button type="button" className="secondary-btn show-all" onClick={() => setRoleFilter(null)}>
          ✕ Clear filter ({roleFilter})
        </button>
      )}

      <ul className="plain-list">
        {list.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className="patient-row patient-row-btn"
              onClick={() => setSelected(s)}
            >
              <div className="avatar" aria-hidden="true">{initialsOf(s.name)}</div>
              <div>
                <h3>{s.name}</h3>
                <p>{s.role} • {s.dept} • {s.id}</p>
              </div>
              <span className={s.status === "Active" ? "status-badge" : "status-badge wait"}>{s.status}</span>
            </button>
          </li>
        ))}
      </ul>

      {list.length === 0 && <p className="demo-note left">No staff match &ldquo;{q}&rdquo;.</p>}

      {selected && <StaffDetailModal staff={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

const isIdentifiedId = (healthId) => !healthId.startsWith("UNK-");

function EmergencyAccessLog({ encounters }) {
  const list = encounters.filter((e) => e.emergency);

  return (
    <div className="generic-card emergency-folder">
      <h2>🚨 Emergency access sessions</h2>
      <p className="demo-note left">
        Cases recorded by doctors during emergency access, across all patients.
      </p>

      {list.length === 0 ? (
        <p className="demo-note left">No emergency cases recorded yet.</p>
      ) : (
        list.map((e) => (
          <div className="generic-row" key={e.id}>
            <Ico className="row-icon">🚨</Ico>
            <div className="row-text">
              <h3>{e.patient} • {e.healthId}</h3>
              <p>
                {e.time} • {e.symptoms || "No symptoms recorded"} • {e.meds.length} medicine
                {e.meds.length === 1 ? "" : "s"} • {e.labs.length} lab test{e.labs.length === 1 ? "" : "s"}
              </p>
              <p>Attended by {USER.doctor}</p>
            </div>
            <span className={isIdentifiedId(e.healthId) ? "status-badge" : "status-badge wait"}>
              {isIdentifiedId(e.healthId) ? "✓ Identified" : "🚨 Unidentified"}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

/* Every emergency case stays here and can be reopened at any time */
function DoctorEmergencyRecords({ encounters, cases, onResume, activeId }) {
  const unidentified = cases.filter((c) => !isIdentifiedId(c.healthId));
  const identified = cases.filter((c) => isIdentifiedId(c.healthId));

  const block = (c) => {
    const encs = encounters.filter((e) => e.healthId === c.healthId && e.emergency);
    const isActive = activeId === c.healthId;
    return (
      <div className="case-block" key={c.healthId}>
        <div className="generic-row">
          <Ico className="row-icon">🚨</Ico>
          <div className="row-text">
            <h3>{c.name} • {c.healthId}</h3>
            <p>{c.time} • {c.reason || "No reason recorded"}</p>
          </div>
          <span className={isIdentifiedId(c.healthId) ? "status-badge" : "status-badge wait"}>
            {isIdentifiedId(c.healthId) ? "✓ Identified" : "🚨 Unidentified"}
          </span>
          <button type="button" className="secondary-btn" disabled={isActive} onClick={() => onResume(c)}>
            {isActive ? "Open now" : "Open case"}
          </button>
        </div>

        {encs.length === 0 ? (
          <p className="demo-note left">No encounter saved for this case yet.</p>
        ) : (
          encs.map((e) => (
            <div className="case-enc" key={e.id}>
              <p><strong>{e.time}</strong> • {e.symptoms || "No symptoms recorded"}</p>
              {e.meds.length > 0 && <p>Prescription: {e.meds.map(medLine).join("; ")}</p>}
              {e.labs.length > 0 && <p>Lab tests ordered: {e.labs.join(", ")}</p>}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="generic-card emergency-folder">
      <h2>🚨 Emergency &amp; Unidentified Records</h2>
      <p className="demo-note left">
        Every emergency case is kept here and can be reopened at any time, even after you move on to
        another patient. Unidentified cases stay until the patient is identified and merged.
      </p>

      <h3 className="contact-subhead">🚨 Still unidentified ({unidentified.length})</h3>
      {unidentified.length === 0 ? (
        <p className="demo-note left">No unidentified cases pending right now.</p>
      ) : (
        unidentified.map(block)
      )}

      <h3 className="contact-subhead">✓ Identified &amp; merged ({identified.length})</h3>
      {identified.length === 0 ? (
        <p className="demo-note left">No identified emergency cases yet.</p>
      ) : (
        identified.map(block)
      )}
    </div>
  );
}

function TodaysPatients({ session, lang }) {
  const t = PAGE_TEXT[lang].common;
  const [q, setQ] = useState("");
  const [all, setAll] = useState(false);

  const term = q.trim().toLowerCase();
  const list = TODAY_PATIENTS.filter((p) => (p.name + p.id).toLowerCase().includes(term));
  const shown = all || term ? list : list.slice(0, 8);

  return (
    <section id="todays-patients" aria-labelledby="tp-title">
      <h2 className="section-title" id="tp-title" lang={lang}>
        {PAGE_TEXT[lang].doctorDash.todaysPatients(TODAY_PATIENTS.length)}
      </h2>

      <div className="field tp-search">
        <label htmlFor="tp-q" lang={lang}>{t.searchLabel}</label>
        <input id="tp-q" type="search" placeholder="e.g. Lakshmi" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <ul className="plain-list">
        {shown.map((p) => {
          const active = session && p.id === "MEDX-9988-7766";
          return (
            <li className="patient-row" key={p.id}>
              <div className="avatar" aria-hidden="true">{p.initials}</div>
              <div>
                <h3>{p.name}</h3>
                <p>{p.id} • {p.time}</p>
              </div>
              <span className={active || p.done ? "status-badge" : "status-badge wait"} lang={lang}>
                {active ? "Access active" : p.done ? "Completed" : "Waiting"}
              </span>
            </li>
          );
        })}
      </ul>

      {shown.length === 0 && <p className="demo-note left" lang={lang}>{t.noResult(q)}</p>}

      {!term && (
        <button type="button" className="secondary-btn show-all" lang={lang} onClick={() => setAll(!all)}>
          {all ? t.showFewer : t.showAll(list.length)}
        </button>
      )}
    </section>
  );
}

/* State lives in MainApp, so the "Consent" card count and this list stay in sync */
function PendingAccessRequests({ pending, approved, onApprove }) {
  return (
    <>
      <h2 className="section-title">⏳ Pending Access Requests</h2>
      <p className="demo-note left">Patients waiting for you to approve record access.</p>

      {pending.length === 0 ? (
        <p className="demo-note left">No pending access requests right now.</p>
      ) : (
        <ul className="plain-list">
          {pending.map((p) => (
            <li className="patient-row" key={p.id}>
              <div className="avatar" aria-hidden="true">{p.initials}</div>
              <div>
                <h3>{p.name}</h3>
                <p>{p.id} • Requested at {p.requestTime}</p>
              </div>
              <button type="button" className="primary-btn small-btn" onClick={() => onApprove(p.id)}>
                ✓ Approve Access
              </button>
            </li>
          ))}
        </ul>
      )}

      {approved.length > 0 && (
        <p className="demo-note left">
          Approved just now: {approved.map((p) => p.name).join(", ")}.
        </p>
      )}
    </>
  );
}

function CompletedSessionHistory({ encounters }) {
  const groups = {};
  encounters.forEach((e) => {
    if (!groups[e.healthId]) groups[e.healthId] = { name: e.patient, healthId: e.healthId, times: [] };
    groups[e.healthId].times.push(e.time);
  });
  const list = Object.values(groups);

  return (
    <>
      <h2 className="section-title">✅ Completed Session History</h2>
      <p className="demo-note left">Sessions you have completed for each patient, with full timestamps.</p>

      <ul className="plain-list">
        {TODAY_PATIENTS.filter((p) => p.done).map((p) => (
          <li className="patient-row" key={p.id}>
            <div className="avatar" aria-hidden="true">{p.initials}</div>
            <div>
              <h3>{p.name}</h3>
              <p>{p.id} • {p.time}</p>
            </div>
            <span className="status-badge">Completed</span>
          </li>
        ))}
      </ul>

      {list.length === 0 ? (
        <p className="demo-note left">No new encounters saved yet in this login.</p>
      ) : (
        <ul className="plain-list">
          {list.map((g) => (
            <li key={g.healthId} className="generic-card session-history-card">
              <div className="session-history-head">
                <h3>{g.name} • {g.healthId}</h3>
                <span className="status-badge">
                  {g.times.length} Completed Visit{g.times.length === 1 ? "" : "s"}
                </span>
              </div>
              <ul className="visit-dates">
                {g.times.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function DoctorDashboard({ goTo, session, encounters, lang, pending, approved, onApprove }) {
  const t = PAGE_TEXT[lang].doctorDash;
  const [panel, setPanel] = useState(null); // null | "consent" | "encounters"
  const toggle = (p) => setPanel(panel === p ? null : p);
  const jump = () => {
    const el = document.getElementById("todays-patients");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Banner
        variant="doctor-banner"
        hello="Welcome"
        name={USER.doctor}
        meta="Apollo Hospitals • Cardiology"
        status="Professional Verified"
      />

      <h2 className="section-title" lang={lang}>{t.todaysOverview}</h2>

      <div className="stats-grid">
        <StatCard icon="👥" title="Patients" text={`${TODAY_PATIENTS.length} verified • see names`} onClick={jump} />
        <StatCard icon="📋" title="Records" text="18 accessed" onClick={() => goTo("records")} />
        <StatCard
          icon="🔐"
          title="Consent"
          text={`${pending.length} pending`}
          active={panel === "consent"}
          onClick={() => toggle("consent")}
        />
        <StatCard
          icon="🩺"
          title="Encounters"
          text={`${8 + encounters.length} completed`}
          active={panel === "encounters"}
          onClick={() => toggle("encounters")}
        />
      </div>

      {panel === "consent" && (
        <div className="detail-panel">
          <PendingAccessRequests pending={pending} approved={approved} onApprove={onApprove} />
        </div>
      )}
      {panel === "encounters" && (
        <div className="detail-panel">
          <CompletedSessionHistory encounters={encounters} />
        </div>
      )}

      <h2 className="section-title" lang={lang}>{PAGE_TEXT[lang].nav.doctor.patients}</h2>

      <div className="verification-card" lang={lang}>
        <h3>
          <Ico>🪪</Ico> {t.verifyTitle}
        </h3>
        <p>{t.verifyDesc}</p>
        <button type="button" className="primary-btn small-btn" onClick={() => goTo("patients")}>
          {PAGE_TEXT[lang].common.verifyPatient}
        </button>
      </div>

      <TodaysPatients session={session} lang={lang} />
    </>
  );
}

/* =========================
   NEW ENCOUNTER (symptoms, vitals, prescription, labs)
========================= */
const PENICILLINS = [
  "penicillin", "amoxicillin", "ampicillin", "cloxacillin",
  "flucloxacillin", "amoxyclav", "augmentin", "piperacillin",
];
const FREQS = ["Once daily", "Twice daily", "Thrice daily", "At night", "Only if needed"];
const LAB_TESTS = [
  "CBC (complete blood count)", "Blood sugar (fasting)", "Lipid profile",
  "Liver function test", "Kidney function test", "Chest X-ray", "ECG",
];

let rxCounter = 0;
const newRx = () => ({ id: ++rxCounter, drug: "", dose: "", freq: "Twice daily", days: "5" });
const outOfRange = (v, lo, hi) => v !== "" && (Number(v) < lo || Number(v) > hi);
const medLine = (m) => `${m.drug} ${m.dose} • ${m.freq.toLowerCase()} • ${m.days} days`;

const vitalsText = (d) => {
  const v = [];
  if (d.bps && d.bpd) v.push(`BP ${d.bps}/${d.bpd} mmHg`);
  if (d.pulse) v.push(`Pulse ${d.pulse} bpm`);
  if (d.temp) v.push(`Temp ${d.temp} °F`);
  if (d.spo2) v.push(`SpO₂ ${d.spo2}%`);
  return v.length ? v.join(" • ") : "Not recorded";
};

function encounterRows(list) {
  const out = [];
  list.forEach((e) => {
    if (e.meds.length) out.push(["💊", `New prescription • ${e.time}`, e.meds.map(medLine).join("; ")]);
    if (e.labs.length) out.push(["🧪", `Lab tests ordered • ${e.time}`, e.labs.join(", ")]);
  });
  return out;
}

const BLANK_ENCOUNTER = {
  symptoms: "", bps: "", bpd: "", pulse: "", temp: "", spo2: "",
  diagnosis: "", advice: "", followUp: "",
};

function NewEncounter({ session, saved, onSave, goTo }) {
  const [f, setF] = useState(BLANK_ENCOUNTER);
  const [rx, setRx] = useState(() => [newRx()]);
  const [labs, setLabs] = useState([]);
  const [ack, setAck] = useState(false);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const upd = (id, k, v) => setRx(rx.map((r) => (r.id === id ? { ...r, [k]: v } : r)));
  const conflicts = rx.filter((r) => PENICILLINS.some((p) => r.drug.toLowerCase().includes(p)));
  const mine = saved.filter((s) => s.healthId === session.healthId);

  const reset = () => {
    setF(BLANK_ENCOUNTER);
    setRx([newRx()]);
    setLabs([]);
    setAck(false);
    setErrors({});
    setDone(null);
  };

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!f.symptoms.trim()) err.symptoms = "Describe the patient's symptoms.";
    if ((f.bps && !f.bpd) || (!f.bps && f.bpd)) err.bps = "Enter both BP values.";
    if (outOfRange(f.bps, 50, 260) || outOfRange(f.bpd, 30, 160)) err.bps = "BP looks out of range. Please check.";
    if (outOfRange(f.pulse, 30, 220)) err.pulse = "Enter 30–220 bpm.";
    if (outOfRange(f.temp, 90, 110)) err.temp = "Enter 90–110 °F.";
    if (outOfRange(f.spo2, 50, 100)) err.spo2 = "Enter 50–100 %.";

    const meds = rx.filter((r) => r.drug.trim());
    meds.forEach((r) => {
      if (!r.dose.trim()) err["dose" + r.id] = "Enter dose.";
      if (!(Number(r.days) >= 1 && Number(r.days) <= 90)) err["days" + r.id] = "1–90 days.";
    });
    if (conflicts.length && !ack) err.ack = "Confirm you reviewed the allergy alert, or change the medicine.";

    setErrors(err);
    if (Object.keys(err).length) return;

    const enc = {
      id: Date.now(),
      patient: session.name,
      healthId: session.healthId,
      time: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      emergency: !!session.emergency,
      ...f,
      meds,
      labs,
      allergyOverride: conflicts.length > 0,
    };
    onSave(enc);
    setDone(enc);
  };

  /* ---------- Saved summary ---------- */
  if (done) {
    const rows = [
      ["Symptoms", done.symptoms],
      ["Vitals", vitalsText(done)],
      ["Diagnosis", done.diagnosis || "Not entered"],
      ["Lab tests ordered", done.labs.length ? done.labs.join(", ") : "None"],
      ["Advice", done.advice || "Not entered"],
      ["Follow-up date", done.followUp || "Not set"],
    ];
    return (
      <>
        <div className="verified-banner" role="status">
          ✓ Encounter saved for {done.patient} on {done.time}.
        </div>

        <div className="generic-card enc-summary">
          <h2>Encounter summary</h2>
          <dl className="summary-list">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <h3 className="rx-title">💊 Prescription</h3>
          {done.meds.length ? (
            <div className="table-wrap">
              <table className="rx-table">
                <thead>
                  <tr><th>Medicine</th><th>Dose</th><th>How often</th><th>Days</th></tr>
                </thead>
                <tbody>
                  {done.meds.map((m) => (
                    <tr key={m.id}>
                      <td>{m.drug}</td><td>{m.dose}</td><td>{m.freq}</td><td>{m.days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="demo-note left">No medicines prescribed.</p>
          )}
          <p className="demo-note left">Prescribed by {USER.doctor} • Apollo Hospitals</p>

          {done.allergyOverride && (
            <div className="alert-card">
              <strong>⚠ Allergy alert reviewed</strong>
              <p>A penicillin-family medicine was prescribed after the doctor confirmed the allergy alert. This is recorded in the audit log.</p>
            </div>
          )}

          <div className="action-row">
            <button type="button" className="primary-btn small-btn" onClick={reset}>Start another encounter</button>
            <button type="button" className="secondary-btn" onClick={() => goTo("records")}>Open health records</button>
          </div>
        </div>
      </>
    );
  }

  /* ---------- Form ---------- */
  return (
    <>
      <form onSubmit={submit} noValidate className="enc-form">
        <div className="alert-card" role="note">
          <strong>⚠ Allergy Alert</strong>
          <p>
            {session.anonymous
              ? "Allergy history is unknown for this unidentified patient. Ask before prescribing if possible."
              : `${session.name}: Penicillin allergy. Check before prescribing.`}
          </p>
        </div>

        <fieldset className="enc-section">
          <legend>🩺 Symptoms</legend>
          <Field
            as="textarea" rows={3} id="e-sym"
            label="What is the patient reporting?"
            placeholder="e.g. Fever and sore throat for 3 days"
            value={f.symptoms} error={errors.symptoms} onChange={set("symptoms")}
          />
        </fieldset>

        <fieldset className="enc-section">
          <legend>❤️ Vitals</legend>
          <div className="grid-3">
            <Field id="e-bps" label="BP upper (mmHg)" type="number" inputMode="numeric" placeholder="120" value={f.bps} error={errors.bps} onChange={set("bps")} />
            <Field id="e-bpd" label="BP lower (mmHg)" type="number" inputMode="numeric" placeholder="80" value={f.bpd} onChange={set("bpd")} />
            <Field id="e-pulse" label="Pulse (bpm)" type="number" inputMode="numeric" placeholder="72" value={f.pulse} error={errors.pulse} onChange={set("pulse")} />
            <Field id="e-temp" label="Temperature (°F)" type="number" step="0.1" inputMode="decimal" placeholder="98.6" value={f.temp} error={errors.temp} onChange={set("temp")} />
            <Field id="e-spo2" label="SpO₂ (%)" type="number" inputMode="numeric" placeholder="98" value={f.spo2} error={errors.spo2} onChange={set("spo2")} />
          </div>
        </fieldset>

        <fieldset className="enc-section">
          <legend>📝 Diagnosis</legend>
          <Field id="e-dx" label="Provisional diagnosis" placeholder="e.g. Acute pharyngitis" value={f.diagnosis} onChange={set("diagnosis")} />
        </fieldset>

        <fieldset className="enc-section">
          <legend>💊 Prescription</legend>

          {rx.map((r, i) => (
            <div className="rx-row" key={r.id}>
              <Field id={`rx-drug-${r.id}`} label={`Medicine ${i + 1}`} placeholder="e.g. Azithromycin" value={r.drug} onChange={(e) => upd(r.id, "drug", e.target.value)} />
              <Field id={`rx-dose-${r.id}`} label="Dose" placeholder="500mg" value={r.dose} error={errors["dose" + r.id]} onChange={(e) => upd(r.id, "dose", e.target.value)} />
              <div className="field">
                <label htmlFor={`rx-freq-${r.id}`}>How often</label>
                <select id={`rx-freq-${r.id}`} value={r.freq} onChange={(e) => upd(r.id, "freq", e.target.value)}>
                  {FREQS.map((x) => <option key={x}>{x}</option>)}
                </select>
              </div>
              <Field id={`rx-days-${r.id}`} label="Days" type="number" min="1" max="90" inputMode="numeric" value={r.days} error={errors["days" + r.id]} onChange={(e) => upd(r.id, "days", e.target.value)} />
              {rx.length > 1 && (
                <button type="button" className="end-btn rx-remove" aria-label={`Remove medicine ${i + 1}`} onClick={() => setRx(rx.filter((x) => x.id !== r.id))}>
                  Remove
                </button>
              )}
            </div>
          ))}

          <button type="button" className="secondary-btn add-rx" onClick={() => setRx([...rx, newRx()])}>
            + Add another medicine
          </button>

          {conflicts.length > 0 && (
            <div className="hospital-alert" role="alert">
              <strong>⚠ Allergy conflict</strong>
              <p>
                {conflicts.map((c) => c.drug).join(", ")} belongs to the penicillin
                family, and {session.name} is allergic to penicillin. Choose a
                different medicine, or confirm that you have reviewed this alert.
              </p>
              <label className="check">
                <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
                I have reviewed this allergy alert
              </label>
              {errors.ack && <p className="field-error" role="alert">{errors.ack}</p>}
            </div>
          )}
        </fieldset>

        <fieldset className="enc-section">
          <legend>🧪 Lab tests</legend>
          <div className="check-grid flat">
            {LAB_TESTS.map((t) => (
              <label key={t} className="check">
                <input
                  type="checkbox"
                  checked={labs.includes(t)}
                  onChange={() => setLabs(labs.includes(t) ? labs.filter((x) => x !== t) : [...labs, t])}
                />
                {t}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="enc-section">
          <legend>📅 Advice and follow-up</legend>
          <Field as="textarea" rows={2} id="e-adv" label="Advice for the patient" placeholder="e.g. Rest, drink plenty of fluids" value={f.advice} onChange={set("advice")} />
          <Field id="e-fu" label="Follow-up date" type="date" value={f.followUp} onChange={set("followUp")} />
        </fieldset>

        <button className="primary-btn save-enc" type="submit">Save encounter</button>
      </form>

      {mine.length > 0 && (
        <div className="saved-list">
          <GenericPage
            description="Encounters saved for this patient in this session."
            items={mine.map((s) => [
              "🩺",
              s.time,
              `${s.symptoms.slice(0, 70)} • ${s.meds.length} medicine${s.meds.length === 1 ? "" : "s"} • ${s.labs.length} lab test${s.labs.length === 1 ? "" : "s"}`,
            ])}
          />
        </div>
      )}
    </>
  );
}

/* =========================
   SECURE SHARING
========================= */
const RECIPIENTS = [
  "Dr. R. K. Patel • Cardiology, City Care Hospital",
  "Dr. S. Reddy • Pathology, Apollo Hospitals",
  "Radiology Department • Apollo Hospitals",
];

function SecureSharing({ session, shares, setShares }) {
  const [to, setTo] = useState(RECIPIENTS[0]);
  const [scope, setScope] = useState(session.scope.slice(0, 1));
  const [mins, setMins] = useState(30);
  const [error, setError] = useState("");

  const labelOf = (k) => SCOPES.find((s) => s[0] === k)[2];
  const durLabel = (m) => DURATIONS.find((d) => d[0] === m)[1];

  const share = (e) => {
    e.preventDefault();
    if (!scope.length) {
      setError("Select at least one type of record to share.");
      return;
    }
    setError("");
    setShares([{ id: Date.now(), to, scope, mins, patient: session.name, active: true }, ...shares]);
  };

  return (
    <>
      <form className="generic-card" onSubmit={share} noValidate>
        <h2>Share approved records securely.</h2>
        <p className="demo-note left">You can only share records the patient approved in this session.</p>

        <div className="field">
          <label htmlFor="s-to">Share with</label>
          <select id="s-to" value={to} onChange={(e) => setTo(e.target.value)}>
            {RECIPIENTS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>

        <fieldset className="check-grid">
          <legend>Records to share</legend>
          {session.scope.map((k) => (
            <label key={k} className="check">
              <input
                type="checkbox"
                checked={scope.includes(k)}
                onChange={() => setScope(scope.includes(k) ? scope.filter((x) => x !== k) : [...scope, k])}
              />
              {labelOf(k)}
            </label>
          ))}
        </fieldset>
        {error && <p className="field-error" role="alert">{error}</p>}

        <div className="field">
          <label htmlFor="s-dur">Access duration</label>
          <select id="s-dur" value={mins} onChange={(e) => setMins(Number(e.target.value))}>
            {DURATIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        <button className="primary-btn small-btn" type="submit">Share securely</button>
      </form>

      {shares.length > 0 && (
        <div className="saved-list">
          <div className="generic-card">
            <h2>Shared access</h2>
            {shares.map((s) => (
              <div className="generic-row" key={s.id}>
                <Ico className="row-icon">📤</Ico>
                <div className="row-text">
                  <h3>{s.to}</h3>
                  <p>{s.patient} • {s.scope.map(labelOf).join(", ")} • {durLabel(s.mins)}</p>
                </div>
                <span className={s.active ? "status-badge" : "status-badge off"}>{s.active ? "Active" : "Revoked"}</span>
                {s.active && (
                  <button
                    type="button"
                    className="end-btn"
                    onClick={() => setShares(shares.map((x) => (x.id === s.id ? { ...x, active: false } : x)))}
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* OTP sent to the patient stays valid for this many seconds */
const OTP_SECONDS = 60;

function PatientVerification({ session, onStart, onEnd, goTo, patients, onMerge, onAdd }) {
  const [step, setStep] = useState("aadhaar"); // aadhaar | otp
  const [method, setMethod] = useState("mobile"); // mobile | aadhaar
  const [mobile, setMobile] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [scope, setScope] = useState(["history", "labs", "rx"]);
  const [mins, setMins] = useState(30);
  const [emergency, setEmergency] = useState(false);
  const [reason, setReason] = useState("");
  const [tempLabel, setTempLabel] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0); // seconds left before the OTP expires
  const [tries, setTries] = useState(0);

  useEffect(() => {
    if (wait <= 0) return undefined;
    const t = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const digits = aadhaar.replace(/\D/g, "");
  const masked = "XXXX XXXX " + digits.slice(8);
  const mobileDigits = mobile.replace(/\D/g, "");
  const maskedMobile = mobileDigits.length === 10 ? "XXXXXX" + mobileDigits.slice(6) : mobileDigits;

  const reset = () => {
    setStep("aadhaar");
    setMethod("mobile");
    setMobile("");
    setAadhaar("");
    setOtp("");
    setReason("");
    setTempLabel("");
    setErrors({});
    setTries(0);
    setWait(0);
    setEmergency(false);
    setBusy(false);
  };

  const grant = () => {
    if (emergency) {
      const anonId = "UNK-" + Date.now().toString().slice(-6);
      onStart({
        name: tempLabel.trim() || "Unidentified Patient",
        healthId: anonId,
        aadhaar: null,
        mobile: null,
        anonymous: true,
        merged: false,
        scope: SCOPES.map((s) => s[0]),
        expiresAt: null,
        emergency: true,
        reason: reason.trim(),
      });
    } else {
      onStart({
        name: USER.patient,
        healthId: "MEDX-9988-7766",
        aadhaar: method === "aadhaar" ? masked : null,
        mobile: method === "mobile" ? maskedMobile : null,
        verifiedVia: method,
        anonymous: false,
        scope,
        expiresAt: Date.now() + mins * 60000,
        emergency: false,
      });
    }
    reset();
  };

  const startOtp = (e) => {
    e.preventDefault();
    const err = {};
    if (emergency) {
      if (!reason.trim()) err.reason = "Enter the reason for emergency access.";
    } else if (method === "mobile") {
      if (mobileDigits.length !== 10) err.mobile = "Enter the patient's 10-digit mobile number.";
      if (scope.length === 0) err.scope = "Select at least one type of record.";
    } else {
      if (digits.length !== 12) err.aadhaar = "Enter the patient's 12-digit Aadhaar number.";
      if (scope.length === 0) err.scope = "Select at least one type of record.";
    }
    setErrors(err);
    if (Object.keys(err).length) return;

    setBusy(true);
    setTimeout(() => {
      if (emergency) {
        grant();
        return;
      }
      setBusy(false);
      setStep("otp");
      setWait(OTP_SECONDS);
      setTries(0);
      setOtp("");
    }, 800);
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    if (wait <= 0) {
      setErrors({ otp: "OTP expired. Please tap Resend OTP to get a new one." });
      return;
    }
    if (otp.length !== 6) {
      setErrors({ otp: "Enter the 6-digit OTP shared by the patient." });
      return;
    }
    if (otp === "000000") {
      const n = tries + 1;
      setTries(n);
      setOtp("");
      if (n >= 3) {
        setStep("aadhaar");
        setErrors({ aadhaar: "Too many wrong OTP attempts. Please start again." });
      } else {
        setErrors({ otp: `Incorrect OTP. ${3 - n} attempt${3 - n === 1 ? "" : "s"} left.` });
      }
      return;
    }
    setErrors({});
    setBusy(true);
    setTimeout(grant, 700);
  };

  /* ---------- Access granted ---------- */
  if (session) {
    return (
      <>
        <div className={session.emergency ? "verified-banner emergency" : "verified-banner"} role="status">
          {session.emergency
            ? session.anonymous
              ? "🚨 Emergency access started for an unidentified patient. This action is recorded and reviewed."
              : "🚨 Emergency access started. This action is recorded and the patient's emergency contact is notified."
            : "✓ Patient verified with Aadhaar OTP. Access is time-limited and ends automatically."}
        </div>

        <div className="patient-row">
          <div className="avatar" aria-hidden="true">
            {session.anonymous
              ? "UP"
              : session.name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
          </div>
          <div>
            <h3>{session.name}</h3>
            {session.anonymous ? (
              <p>Temporary ID: {session.healthId}{session.reason ? ` • ${session.reason}` : ""}</p>
            ) : (
              <p>
                {session.healthId}
                {session.verifiedVia === "mobile" && session.mobile
                  ? ` • Mobile ${session.mobile}`
                  : session.aadhaar
                  ? ` • Aadhaar ${session.aadhaar}`
                  : ""}
              </p>
            )}
            {!session.anonymous && !session.merged && <p>Age: 28 • Male • Blood Group: B+</p>}
          </div>
          <span className="status-badge">{session.anonymous ? "🚨 Unidentified" : "✓ Verified"}</span>
        </div>

        {session.anonymous ? (
          <div className="hospital-alert" role="alert">
            <strong>⚠ Allergies unknown</strong>
            <p>No prior medical history is available for this patient. Confirm allergies and medical history with the patient or family when possible.</p>
          </div>
        ) : (
          <div className="alert-card">
            <strong>⚠ Allergy Alert</strong>
            <p>Penicillin allergy. Check before prescribing.</p>
          </div>
        )}

        <div className="generic-card scope-card">
          <h2>Access approved for</h2>
          <ul className="chip-list">
            {session.scope.map((k) => {
              const s = SCOPES.find((x) => x[0] === k);
              return (
                <li className="chip" key={k}>
                  <Ico>{s[1]}</Ico> {s[2]}
                </li>
              );
            })}
          </ul>
          <div className="action-row">
            <button type="button" className="primary-btn small-btn" onClick={() => goTo("records")}>
              Open health records
            </button>
            <button type="button" className="secondary-btn" onClick={() => goTo("encounter")}>
              Start new encounter
            </button>
            <button type="button" className="secondary-btn" onClick={onEnd}>
              {session.emergency ? "Save & verify next patient" : "End access & verify next patient"}
            </button>
          </div>
        </div>

        {session.anonymous && (
          <MergeAnonymousPanel session={session} patients={patients} onMerge={onMerge} onAdd={onAdd} />
        )}

        {session.merged && (
          <div className="verified-banner" role="status">
            ✓ Merged with {session.name} ({session.healthId}). This visit is now part of their medical history.
          </div>
        )}
      </>
    );
  }

  /* ---------- Verification form ---------- */
  return (
    <>
      <div className="verification-card large">
        <h2>
          <Ico>{emergency ? "🚨" : method === "mobile" ? "📱" : "🪪"}</Ico>{" "}
          {emergency ? "Emergency access" : "Verify patient"}
        </h2>
        <p>
          {emergency
            ? "Use only when the patient is unconscious or cannot give consent. Access has no time limit and is recorded in the audit log. The case stays available in Emergency & Unidentified Records, so you can move on to the next patient and reopen it any time."
            : method === "mobile"
            ? "Enter the patient's mobile number. An OTP is sent to that number. The patient shares it with you to approve access."
            : "Enter the patient's Aadhaar / Health ID number. An OTP is sent to the patient's Aadhaar-linked mobile. The patient shares it with you to approve access."}
        </p>

        {step === "aadhaar" ? (
          <form onSubmit={startOtp} noValidate>
            {!emergency && (
              <div className="verify-tabs" role="tablist" aria-label="Verification method">
                <button
                  type="button"
                  role="tab"
                  aria-selected={method === "mobile"}
                  className={method === "mobile" ? "verify-tab on" : "verify-tab"}
                  onClick={() => { setMethod("mobile"); setErrors({}); }}
                >
                  📱 Verify via Mobile Number
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={method === "aadhaar"}
                  className={method === "aadhaar" ? "verify-tab on" : "verify-tab"}
                  onClick={() => { setMethod("aadhaar"); setErrors({}); }}
                >
                  🪪 Verify via Aadhaar / Health ID
                </button>
              </div>
            )}

            {!emergency && (
              method === "mobile" ? (
                <Field
                  id="p-mobile"
                  label="Patient's mobile number"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={mobile}
                  error={errors.mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                />
              ) : (
                <Field
                  id="p-aadhaar"
                  label="Patient's Aadhaar / Health ID"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="XXXX XXXX XXXX"
                  maxLength={14}
                  value={aadhaar}
                  error={errors.aadhaar}
                  onChange={(e) => setAadhaar(fmtAadhaar(e.target.value))}
                />
              )
            )}

            {emergency ? (
              <>
                <Field
                  id="p-reason"
                  label="Reason for emergency access"
                  placeholder="e.g. Patient unconscious in casualty"
                  value={reason}
                  error={errors.reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <Field
                  id="p-templabel"
                  label="Temporary description (optional)"
                  placeholder="e.g. Unidentified male, approx. 30 years, brought by ambulance"
                  value={tempLabel}
                  onChange={(e) => setTempLabel(e.target.value)}
                />
                <p className="demo-note left">
                  No Aadhaar number is needed to start emergency access. You can identify the
                  patient and merge this visit with their record later.
                </p>
              </>
            ) : (
              <>
                <fieldset className="check-grid">
                  <legend>Records you need</legend>
                  {SCOPES.map(([k, icon, label]) => (
                    <label key={k} className="check">
                      <input
                        type="checkbox"
                        checked={scope.includes(k)}
                        onChange={() =>
                          setScope(scope.includes(k) ? scope.filter((x) => x !== k) : [...scope, k])
                        }
                      />
                      <Ico>{icon}</Ico> {label}
                    </label>
                  ))}
                </fieldset>
                {errors.scope && <p className="field-error" role="alert">{errors.scope}</p>}

                <div className="field">
                  <label htmlFor="p-duration">Access duration</label>
                  <select id="p-duration" value={mins} onChange={(e) => setMins(Number(e.target.value))}>
                    {DURATIONS.map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <button className={emergency ? "primary-btn danger" : "primary-btn"} type="submit" disabled={busy}>
              {busy ? "Please wait…" : emergency ? "Start emergency access" : "Send OTP to patient"}
            </button>

            <button type="button" className="text-btn" onClick={() => { setEmergency(!emergency); setErrors({}); }}>
              {emergency ? "← Back to OTP verification" : "🚨 Patient unconscious? Use emergency access"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} noValidate>
            <div className="otp-info" role="status">
              {method === "mobile"
                ? `OTP sent to mobile number ${maskedMobile}. Ask the patient to read it out to you.`
                : `OTP sent to the mobile number linked with Aadhaar ${masked}. Ask the patient to read it out to you.`}
            </div>

            <div className={wait > 0 ? (wait <= 10 ? "otp-timer low" : "otp-timer") : "otp-timer expired"}>
              <span>
                {wait > 0
                  ? `⏱ OTP valid for ${fmtTime(wait)}`
                  : "⌛ OTP expired. Tap Resend OTP to get a new one."}
              </span>
              <div className="otp-bar" aria-hidden="true">
                <div className="otp-bar-fill" style={{ width: `${(wait / OTP_SECONDS) * 100}%` }} />
              </div>
            </div>

            <Field
              id="p-otp"
              label="OTP shared by the patient"
              className="otp-input"
              inputMode="numeric"
              autoComplete="off"
              maxLength={6}
              placeholder="••••••"
              value={otp}
              error={errors.otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />

            <button className="primary-btn" type="submit" disabled={busy || wait <= 0}>
              {busy ? "Verifying…" : wait <= 0 ? "OTP expired" : "Verify OTP and unlock records"}
            </button>

            <div className="otp-actions">
              <button
                type="button"
                className="text-btn"
                disabled={wait > 0}
                onClick={() => { setWait(OTP_SECONDS); setTries(0); setOtp(""); setErrors({}); }}
              >
                {wait > 0 ? `Resend OTP (${fmtTime(wait)})` : "Resend OTP"}
              </button>
              <button
                type="button"
                className="text-btn"
                onClick={() => { setStep("aadhaar"); setOtp(""); setErrors({}); }}
              >
                {method === "mobile" ? "Change mobile number" : "Change Aadhaar number"}
              </button>
            </div>

            <p className="demo-note">Demo prototype: any 6-digit OTP works within 60 seconds. Try 000000 to see the error.</p>
          </form>
        )}
      </div>

      <div className="lock-note">
        <Ico>🔒</Ico> Zero standing access: every session is patient-approved,
        time-limited and recorded in the audit log (DPDP Act 2023).
      </div>
    </>
  );
}

/* =========================
   MERGE ANONYMOUS / UNKNOWN PATIENT WITH KNOWN RECORD
========================= */
function MergeAnonymousPanel({ session, patients, onMerge, onAdd }) {
  const [open, setOpen] = useState(false);
  const [aadhaar, setAadhaar] = useState("");
  const [name, setName] = useState("");
  const [found, setFound] = useState(undefined); // undefined = not searched yet, null = no match, object = match
  const [error, setError] = useState("");

  const digits = aadhaar.replace(/\D/g, "");
  const masked = digits.length === 12 ? "XXXX XXXX " + digits.slice(8) : "";

  const search = (e) => {
    e.preventDefault();
    if (digits.length !== 12) {
      setError("Enter a valid 12-digit Aadhaar number.");
      return;
    }
    setError("");
    const match = patients.find((p) => p.aadhaarDigits === digits);
    setFound(match || null);
  };

  const confirmMerge = () => {
    onMerge(session.healthId, { id: found.id, name: found.name, aadhaar: found.aadhaar }, { isNewPatient: false });
  };

  const registerNew = () => {
    if (!name.trim()) {
      setError("Enter the patient's name to register.");
      return;
    }
    setError("");
    const words = name.trim().split(/\s+/);
    const id = genPatientId();
    onAdd({
      name: name.trim(),
      id,
      aadhaarDigits: digits,
      aadhaar: masked,
      initials: (words[0][0] + words[words.length - 1][0]).toUpperCase(),
      visits: 1,
      visitDates: [todayLabel()],
      lastVisit: todayLabel(),
    });
    onMerge(session.healthId, { id, name: name.trim(), aadhaar: masked }, { isNewPatient: true });
  };

  if (!open) {
    return (
      <button type="button" className="secondary-btn" onClick={() => setOpen(true)}>
        🔗 Know who this patient is now? Merge with their record
      </button>
    );
  }

  return (
    <div className="generic-card merge-card">
      <h2>🔗 Merge with existing patient</h2>
      <p className="demo-note left">
        Enter the patient's Aadhaar number once they are identified, to combine this emergency
        visit — including any prescriptions and reports entered here — with their medical history.
      </p>

      <form onSubmit={search} noValidate>
        <Field
          id="mg-aadhaar"
          label="Patient's Aadhaar number"
          inputMode="numeric"
          autoComplete="off"
          placeholder="XXXX XXXX XXXX"
          maxLength={14}
          value={aadhaar}
          error={error}
          onChange={(e) => {
            setAadhaar(fmtAadhaar(e.target.value));
            setFound(undefined);
          }}
        />
        <button className="primary-btn small-btn" type="submit">Search patient</button>
      </form>

      {found && (
        <div className="patient-row">
          <div className="avatar" aria-hidden="true">{found.initials}</div>
          <div>
            <h3>{found.name}</h3>
            <p>{found.id} • Aadhaar {found.aadhaar}</p>
          </div>
          <button type="button" className="primary-btn small-btn" onClick={confirmMerge}>
            Confirm merge
          </button>
        </div>
      )}

      {found === null && (
        <div className="hospital-alert" role="alert">
          <strong>No matching patient found</strong>
          <p>Register this Aadhaar number as a new patient to complete the merge.</p>
          <Field id="mg-name" label="Patient's full name" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="button" className="primary-btn small-btn" onClick={registerNew}>
            Register as new patient &amp; merge
          </button>
        </div>
      )}
    </div>
  );
}

function HealthRecordsView({ session, encounters }) {
  const mine = encounters.filter((e) => e.healthId === session.healthId);
  const emergencyRows = encounterRows(mine.filter((e) => e.emergency));
  const normalRows = encounterRows(mine.filter((e) => !e.emergency));
  const regularItems = session.anonymous ? [] : [...session.scope.map((k) => RECORD_DATA[k]), ...normalRows];
  const allMineRows = encounterRows(mine);

  return (
    <>
      <GenericPage
        description={
          session.anonymous
            ? "No prior medical history is available for this unidentified patient."
            : "Records approved by the patient for this session."
        }
        items={
          session.anonymous
            ? [["ℹ️", "No prior history", "Confirm allergies and medical history with the patient or family when possible. All records for this visit are in Emergency Records below."]]
            : regularItems.length
            ? regularItems
            : [["📋", "No records yet", "Start a new encounter to add prescriptions, vitals and reports for this patient."]]
        }
      />

      {(session.anonymous || emergencyRows.length > 0) && (
        <div className="generic-card emergency-folder">
          <h2>🚨 Emergency records</h2>
          <p className="demo-note left">Records created during emergency access sessions for this patient.</p>

          {(session.anonymous ? allMineRows : emergencyRows).length === 0 ? (
            <p className="demo-note left">No emergency records yet.</p>
          ) : (
            (session.anonymous ? allMineRows : emergencyRows).map(([icon, title, text], i) => (
              <div className="generic-row" key={`${title}-${i}`}>
                <Ico className="row-icon">{icon}</Ico>
                <div className="row-text">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}

function GenericPage({ description, items }) {
  return (
    <div className="generic-card">
      <h2>{description}</h2>

      {items.map(([icon, title, text], i) => (
        <div className="generic-row" key={`${title}-${i}`}>
          <Ico className="row-icon">{icon}</Ico>
          <div className="row-text">
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================
   AI HEALTH ASSISTANT (text + voice + 3 languages)
   Demo: keyword-based answers. Replace `answer()` with a real API later.
========================= */
const LANGS = {
  en: { code: "en-IN", label: "English" },
  hi: { code: "hi-IN", label: "हिन्दी" },
  te: { code: "te-IN", label: "తెలుగు" },
};

const AI_TEXT = {
  en: {
    title: "Health Assistant",
    hello: "Hello! I can explain your reports, medicines and consents in simple language. Type a question or tap the mic.",
    placeholder: "Type your question…",
    send: "Send",
    listening: "Listening… speak now",
    noVoice: "Voice input is not supported in this browser. Please use Chrome or Edge.",
    speak: "Read replies aloud",
    attach: "Attach a report (PDF or image)",
    fileBad: "Please attach a PDF or image smaller than 5 MB.",
    fileReply: "I received your file. (Demo) Key finding: Hemoglobin 11.5 g/dL is slightly below the typical range. Please discuss the full report with your doctor.",
    disclaimer: "General information only, not medical advice. Please consult a doctor.",
    chips: ["What is my allergy?", "Explain my blood test", "What is my medicine?", "Who can see my records?"],
    fallback: "I can help with your allergy, medicines, blood test, consents or emergencies. Try one of the suggested questions.",
  },
  hi: {
    title: "स्वास्थ्य सहायक",
    hello: "नमस्ते! मैं आपकी रिपोर्ट, दवाओं और सहमति को सरल भाषा में समझा सकता हूं। प्रश्न लिखें या माइक दबाएं।",
    placeholder: "अपना प्रश्न लिखें…",
    send: "भेजें",
    listening: "सुन रहा हूं… बोलिए",
    noVoice: "इस ब्राउज़र में आवाज़ इनपुट उपलब्ध नहीं है। कृपया Chrome या Edge उपयोग करें।",
    speak: "उत्तर बोलकर सुनाएं",
    attach: "रिपोर्ट जोड़ें (PDF या इमेज)",
    fileBad: "कृपया 5 MB से छोटी PDF या इमेज फ़ाइल जोड़ें।",
    fileReply: "आपकी फ़ाइल मिल गई। (डेमो) मुख्य निष्कर्ष: हीमोग्लोबिन 11.5 g/dL सामान्य सीमा से थोड़ा कम है। पूरी रिपोर्ट के बारे में कृपया अपने डॉक्टर से बात करें।",
    disclaimer: "केवल सामान्य जानकारी, चिकित्सा सलाह नहीं। कृपया डॉक्टर से परामर्श करें।",
    chips: ["मेरी एलर्जी क्या है?", "मेरी रक्त जांच समझाएं", "मेरी दवा कौन सी है?", "मेरे रिकॉर्ड कौन देख सकता है?"],
    fallback: "मैं आपकी एलर्जी, दवाओं, रक्त जांच, सहमति या आपात स्थिति के बारे में मदद कर सकता हूं। सुझाए गए प्रश्नों में से कोई चुनें।",
  },
  te: {
    title: "ఆరోగ్య సహాయకుడు",
    hello: "నమస్కారం! మీ రిపోర్టులు, మందులు, సమ్మతులను సులభమైన భాషలో వివరిస్తాను. ప్రశ్న టైప్ చేయండి లేదా మైక్ నొక్కండి.",
    placeholder: "మీ ప్రశ్న టైప్ చేయండి…",
    send: "పంపండి",
    listening: "వింటున్నాను… మాట్లాడండి",
    noVoice: "ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు. దయచేసి Chrome లేదా Edge వాడండి.",
    speak: "సమాధానాలు చదివి వినిపించు",
    attach: "రిపోర్ట్ జత చేయండి (PDF లేదా ఇమేజ్)",
    fileBad: "దయచేసి 5 MB కంటే తక్కువ ఉన్న PDF లేదా ఇమేజ్ ఫైల్ జత చేయండి.",
    fileReply: "మీ ఫైల్ అందింది. (డెమో) ముఖ్య అంశం: హిమోగ్లోబిన్ 11.5 g/dL సాధారణ పరిధి కంటే కొంచెం తక్కువ. పూర్తి రిపోర్ట్ గురించి దయచేసి మీ డాక్టర్‌తో మాట్లాడండి.",
    disclaimer: "సాధారణ సమాచారం మాత్రమే, వైద్య సలహా కాదు. దయచేసి డాక్టర్‌ను సంప్రదించండి.",
    chips: ["నా అలర్జీ ఏమిటి?", "నా రక్త పరీక్ష వివరించండి", "నా మందు ఏమిటి?", "నా రికార్డులు ఎవరు చూడగలరు?"],
    fallback: "నేను మీ అలర్జీ, మందులు, రక్త పరీక్ష, సమ్మతులు లేదా అత్యవసర పరిస్థితుల గురించి సహాయం చేయగలను. సూచించిన ప్రశ్నలలో ఒకటి ఎంచుకోండి.",
  },
};

/* Order matters: emergency first, then the most specific topics */
const INTENTS = [
  {
    keys: ["emergency", "chest pain", "breathing", "आपात", "इमरजेंसी", "सीने", "सांस", "అత్యవసర", "ఛాతి", "శ్వాస"],
    en: "In an emergency, call 108 (ambulance) or 112 right away. Do not wait for an online answer.",
    hi: "आपात स्थिति में तुरंत 108 (एम्बुलेंस) या 112 पर कॉल करें। ऑनलाइन जवाब का इंतज़ार न करें।",
    te: "అత్యవసర పరిస్థితిలో వెంటనే 108 (అంబులెన్స్) లేదా 112కు కాల్ చేయండి. ఆన్‌లైన్ సమాధానం కోసం వేచి ఉండకండి.",
  },
  {
    keys: ["allerg", "penicillin", "एलर्जी", "पेनिसिलिन", "అలర్జీ", "ఎలర్జీ", "అలెర్జీ", "పెన్సిలిన్"],
    en: "Your health profile records a Penicillin allergy. Always tell your doctor and pharmacist before taking any antibiotic.",
    hi: "आपके स्वास्थ्य प्रोफ़ाइल में पेनिसिलिन से एलर्जी दर्ज है। कोई भी एंटीबायोटिक लेने से पहले अपने डॉक्टर और फार्मासिस्ट को यह ज़रूर बताएं।",
    te: "మీ హెల్త్ ప్రొఫైల్‌లో పెన్సిలిన్ అలర్జీ నమోదు చేయబడింది. ఏదైనా యాంటీబయాటిక్ తీసుకునే ముందు మీ డాక్టర్‌కు, ఫార్మసిస్ట్‌కు తప్పకుండా చెప్పండి.",
  },
  {
    keys: ["medic", "tablet", "azithro", "दवा", "दवाई", "एज़िथ्रोमाइसिन", "మందు", "మాత్ర", "అజిత్రోమైసిన్"],
    en: "Your current medicine is Azithromycin 500mg, once daily, with 3 days remaining. No conflict with your Penicillin allergy was found. Finish the course as your doctor advised.",
    hi: "आपकी मौजूदा दवा एज़िथ्रोमाइसिन 500mg है, दिन में एक बार, 3 दिन बाकी हैं। आपकी पेनिसिलिन एलर्जी से कोई टकराव नहीं मिला। डॉक्टर की सलाह के अनुसार कोर्स पूरा करें।",
    te: "మీ ప్రస్తుత మందు అజిత్రోమైసిన్ 500mg, రోజుకు ఒకసారి, ఇంకా 3 రోజులు మిగిలి ఉన్నాయి. మీ పెన్సిలిన్ అలర్జీతో ఎలాంటి సమస్య కనిపించలేదు. డాక్టర్ సూచించినట్లు కోర్సు పూర్తి చేయండి.",
  },
  {
    keys: ["blood", "hemoglobin", "report", "test", "रक्त", "खून", "जांच", "रिपोर्ट", "హిమోగ్లోబిన్", "రక్త", "రిపోర్ట్", "పరీక్ష"],
    en: "Your latest blood test (18 Sep 2026) shows Hemoglobin 11.5 g/dL, slightly below the typical range. This can have several causes, so please discuss it with your doctor.",
    hi: "आपकी ताज़ा रक्त जांच (18 सितंबर 2026) में हीमोग्लोबिन 11.5 g/dL है, जो सामान्य सीमा से थोड़ा कम है। इसके कई कारण हो सकते हैं, इसलिए कृपया अपने डॉक्टर से बात करें।",
    te: "మీ తాజా రక్త పరీక్ష (18 సెప్టెంబర్ 2026)లో హిమోగ్లోబిన్ 11.5 g/dL ఉంది, ఇది సాధారణ పరిధి కంటే కొంచెం తక్కువ. దీనికి అనేక కారణాలు ఉండవచ్చు, కాబట్టి దయచేసి మీ డాక్టర్‌తో మాట్లాడండి.",
  },
  {
    keys: ["consent", "access", "who can", "सहमति", "अनुमति", "कौन", "సమ్మతి", "అనుమతి", "ఎవరు"],
    en: "Two consents are active: Dr. R. K. Patel (medical history and lab reports) and City Care Hospital (temporary access for 2 hours). You can revoke either one in Consent Manager.",
    hi: "दो सहमतियां सक्रिय हैं: डॉ. आर. के. पटेल (मेडिकल इतिहास और लैब रिपोर्ट) और सिटी केयर हॉस्पिटल (2 घंटे की अस्थायी पहुंच)। आप कंसेंट मैनेजर में किसी को भी हटा सकते हैं।",
    te: "రెండు సమ్మతులు యాక్టివ్‌గా ఉన్నాయి: డా. ఆర్. కె. పటేల్ (వైద్య చరిత్ర మరియు ల్యాబ్ రిపోర్టులు) మరియు సిటీ కేర్ హాస్పిటల్ (2 గంటల తాత్కాలిక యాక్సెస్). కన్సెంట్ మేనేజర్‌లో మీరు ఎవరినైనా తొలగించవచ్చు.",
  },
];

const SpeechRec =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);
const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

function HealthAssistant({ open, setOpen }) {
  const [lang, setLang] = useState("en");
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [speakOn, setSpeakOn] = useState(false);
  const [note, setNote] = useState("");
  const recRef = useRef(null);
  const endRef = useRef(null);
  const fileRef = useRef(null);
  const T = AI_TEXT[lang];

  const stopAll = () => {
    if (canSpeak) window.speechSynthesis.cancel();
    if (recRef.current) recRef.current.abort();
  };

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ block: "end" });
  }, [msgs, open]);

  useEffect(() => {
    if (!open) stopAll();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const say = (text, l = lang) => {
    if (!canSpeak) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANGS[l].code;
    window.speechSynthesis.speak(u);
  };

  const ask = (raw, viaVoice) => {
    const q = raw.trim();
    if (!q) return;
    const lower = q.toLowerCase();
    const hit = INTENTS.find((i) => i.keys.some((k) => lower.includes(k)));
    const answer = hit ? hit[lang] : T.fallback;

    setMsgs((m) => [...m, { from: "user", text: q, lang }, { from: "bot", text: answer, lang }]);
    setInput("");
    setNote("");
    if (speakOn || viaVoice) say(answer);
  };

  const listen = () => {
    if (!SpeechRec) {
      setNote(T.noVoice);
      return;
    }
    if (listening) {
      recRef.current.stop();
      return;
    }
    const r = new SpeechRec();
    r.lang = LANGS[lang].code;
    r.interimResults = false;
    r.onresult = (e) => ask(e.results[0][0].transcript, true);
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    recRef.current = r;
    setNote("");
    setListening(true);
    r.start();
  };

  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const okType = file.type === "application/pdf" || file.type.startsWith("image/");
    if (!okType || file.size > 5 * 1024 * 1024) {
      setNote(T.fileBad);
      return;
    }
    const size =
      file.size < 1048576
        ? `${Math.max(1, Math.round(file.size / 1024))} KB`
        : `${(file.size / 1048576).toFixed(1)} MB`;
    setMsgs((m) => [
      ...m,
      { from: "user", file: { name: file.name, size }, lang },
      { from: "bot", text: T.fileReply, lang },
    ]);
    setNote("");
    if (speakOn) say(T.fileReply);
  };

  const changeLang = (k) => {
    stopAll();
    setListening(false);
    setNote("");
    setLang(k);
  };

  if (!open) {
    return (
      <button type="button" className="ai-fab" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <Ico className="fab-icon">
          <AssistantIcon />
        </Ico>{" "}
        {T.title}
      </button>
    );
  }

  return (
    <section
      className="ai-panel"
      role="dialog"
      aria-label={T.title}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <div className="ai-head">
        <strong>
          <Ico className="ai-ico">
            <AssistantIcon />
          </Ico>{" "}
          {T.title}
        </strong>
        <button type="button" className="ai-close" aria-label="Close assistant" onClick={() => setOpen(false)}>
          ✕
        </button>
      </div>

      <div className="ai-tools">
        <div className="ai-langs" role="group" aria-label="Language">
          {Object.entries(LANGS).map(([k, v]) => (
            <button
              key={k}
              type="button"
              lang={k}
              aria-pressed={lang === k}
              className={lang === k ? "on" : ""}
              onClick={() => changeLang(k)}
            >
              {v.label}
            </button>
          ))}
        </div>

        {canSpeak && (
          <label className="ai-speak">
            <input
              type="checkbox"
              checked={speakOn}
              onChange={(e) => {
                setSpeakOn(e.target.checked);
                if (!e.target.checked) window.speechSynthesis.cancel();
              }}
            />
            {T.speak}
          </label>
        )}
      </div>

      <div className="ai-log" role="log" aria-live="polite">
        <div className="msg bot" lang={lang}>{T.hello}</div>

        {msgs.map((m, i) => (
          <div key={i} className={`msg ${m.from}`} lang={m.lang}>
            {m.file ? (
              <span className="file-chip">
                <Ico>📄</Ico>
                <span className="file-name">{m.file.name}</span>
                <small>{m.file.size}</small>
              </span>
            ) : (
              m.text
            )}
            {m.from === "bot" && canSpeak && (
              <button type="button" className="msg-listen" aria-label="Listen to this reply" onClick={() => say(m.text, m.lang)}>
                🔊
              </button>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="ai-chips">
        {T.chips.map((c) => (
          <button key={c} type="button" lang={lang} onClick={() => ask(c)}>
            {c}
          </button>
        ))}
      </div>

      <p className="ai-note" role="status">{listening ? T.listening : note}</p>

      <form
        className="ai-form"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <button
          type="button"
          className="attach"
          aria-label={T.attach}
          title={T.attach}
          onClick={() => fileRef.current && fileRef.current.click()}
        >
          <ClipIcon />
        </button>
        <input ref={fileRef} type="file" accept="application/pdf,image/*" hidden onChange={onFile} />
        <button
          type="button"
          className={listening ? "mic on" : "mic"}
          aria-label="Voice input"
          title="Voice input"
          aria-pressed={listening}
          onClick={listen}
        >
          <MicIcon />
        </button>
        <input
          aria-label={T.placeholder}
          placeholder={T.placeholder}
          lang={lang}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
        <button type="submit" className="send">{T.send}</button>
      </form>

      <p className="ai-disclaimer">{T.disclaimer}</p>
    </section>
  );
}

/* =========================
   MAIN APP (hash routing: Back button + refresh-safe page)
========================= */
const readHash = () => window.location.hash.replace("#/", "") || "dashboard";

function usePage() {
  const [page, setPageState] = useState(readHash);

  useEffect(() => {
    const onHash = () => setPageState(readHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const setPage = (p) => {
    window.location.hash = "/" + p;
  };
  return [page, setPage];
}

function MainApp({
  role, logout, lang, encounters, setEncounters, patients, addPatient, mergeAnonymousData,
  contact, setContact, emergencyCases, addEmergencyCase,
}) {
  const [rawPage, setPage] = usePage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [notice, setNotice] = useState("");
  const [shares, setShares] = useState([]);

  /* Doctor dashboard: pending consent requests (shown when the Consent card is opened) */
  const [pendingReqs, setPendingReqs] = useState(() =>
    TODAY_PATIENTS.filter((p) => !p.done)
      .slice(0, 5)
      .map((p) => ({ ...p, requestTime: p.time }))
  );
  const [approvedReqs, setApprovedReqs] = useState([]);

  const approveReq = (id) => {
    const p = pendingReqs.find((x) => x.id === id);
    if (!p) return;
    setPendingReqs(pendingReqs.filter((x) => x.id !== id));
    setApprovedReqs([p, ...approvedReqs]);
  };

  const startSession = (sess) => {
    setSession(sess);
    setNotice("");
    if (sess.emergency) {
      // Register the case so it stays reachable after the doctor moves on
      addEmergencyCase({
        healthId: sess.healthId,
        name: sess.name,
        reason: sess.reason || "",
        time: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      });
    }
  };

  const endSession = (msg) => {
    setSession(null);
    setNotice(msg);
  };

  const finishSession = () =>
    endSession(
      session && session.emergency
        ? "Emergency case saved. Reopen it any time from Emergency & Unidentified Records. You can verify the next patient now."
        : "Access ended. Patient records are locked again."
    );

  /* Reopen a saved emergency case at any time (no time limit) */
  const resumeCase = (c) => {
    const known = isIdentifiedId(c.healthId);
    setSession({
      name: c.name,
      healthId: c.healthId,
      aadhaar: null,
      mobile: null,
      anonymous: !known,
      merged: known,
      scope: SCOPES.map((s) => s[0]),
      expiresAt: null,
      emergency: true,
      reason: c.reason,
    });
    setNotice("");
    setPage("records");
  };

  const mergeAnonymous = (anonHealthId, target, opts = {}) => {
    mergeAnonymousData(anonHealthId, target, opts);
    setSession((s) =>
      s && s.healthId === anonHealthId
        ? { ...s, healthId: target.id, name: target.name, aadhaar: target.aadhaar, anonymous: false, merged: true }
        : s
    );
  };

  const page = NAV[role].some((n) => n[0] === rawPage) ? rawPage : "dashboard";
  const title =
    page === "dashboard"
      ? `${AUTH_TEXT[lang].roleTitle[role]} ${PAGE_TEXT[lang].dashboardWord}`
      : PAGE_TEXT[lang].nav[role][page];

  useEffect(() => {
    document.title = `${title} | SMART-MEDX`;
    const main = document.getElementById("main");
    if (main) main.scrollTo && main.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [title]);

  const renderPage = () => {
    const special = {
      patient: {
        dashboard: (
          <PatientDashboard
            goTo={setPage}
            onAssistant={() => setAiOpen(true)}
            lang={lang}
            contact={contact}
            setContact={setContact}
          />
        ),
        consent: <ConsentManager />,
        profile: <PatientProfile contact={contact} goTo={setPage} />,
        ai: (
          <>
            <GenericPage description={GENERIC.patient.ai[0]} items={GENERIC.patient.ai[1]} />
            <button type="button" className="primary-btn small-btn" onClick={() => setAiOpen(true)}>
              Open Health Assistant
            </button>
          </>
        ),
      },
      doctor: {
        dashboard: (
          <DoctorDashboard
            goTo={setPage}
            session={session}
            encounters={encounters}
            lang={lang}
            pending={pendingReqs}
            approved={approvedReqs}
            onApprove={approveReq}
          />
        ),
        patients: (
          <PatientVerification
            session={session}
            onStart={startSession}
            onEnd={finishSession}
            goTo={setPage}
            patients={patients}
            onMerge={mergeAnonymous}
            onAdd={addPatient}
          />
        ),
        records: session ? (
          <HealthRecordsView session={session} encounters={encounters} />
        ) : (
          <Locked goTo={setPage} lang={lang} />
        ),
        emergencyRecords: (
          <DoctorEmergencyRecords
            encounters={encounters}
            cases={emergencyCases}
            onResume={resumeCase}
            activeId={session ? session.healthId : null}
          />
        ),
        encounter: session ? (
          <NewEncounter
            session={session}
            saved={encounters}
            onSave={(enc) => setEncounters([enc, ...encounters])}
            goTo={setPage}
          />
        ) : (
          <Locked goTo={setPage} lang={lang} />
        ),
        sharing: session ? (
          <SecureSharing session={session} shares={shares} setShares={setShares} />
        ) : (
          <Locked goTo={setPage} lang={lang} />
        ),
      },
      hospital: {
        dashboard: <HospitalDashboard goTo={setPage} lang={lang} encounters={encounters} />,
        patients: <PatientRegistry lang={lang} patients={patients} onAdd={addPatient} encounters={encounters} />,
        staff: <StaffDirectory />,
        emergency: <EmergencyAccessLog encounters={encounters} />,
      },
    };

    if (special[role][page]) return special[role][page];

    const [description, items] = GENERIC[role][page];
    return <GenericPage description={description} items={items} />;
  };

  return (
    <div className="app-layout">
      <Sidebar
        role={role}
        page={page}
        setPage={setPage}
        logout={logout}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        lang={lang}
      />

      <main className="main-content" id="main" tabIndex={-1}>
        <TopBar role={role} title={title} onMenu={() => setMenuOpen(true)} lang={lang} />
        <div className="content-area">
          {role === "doctor" && session && (
            <SessionBar
              session={session}
              onEnd={finishSession}
              onExpire={() =>
                endSession(`Access to ${session.name} has ended automatically. Verify the patient again to continue.`)
              }
            />
          )}
          {role === "doctor" && notice && (
            <div className="alert-card" role="status">{notice}</div>
          )}
          {renderPage()}
        </div>
        <footer className="gov-footer" lang={lang}>
          {PAGE_TEXT[lang].footer}
        </footer>
      </main>

      {role === "patient" && <HealthAssistant open={aiOpen} setOpen={setAiOpen} />}
    </div>
  );
}

/* =========================
   APP ROOT
========================= */
export default function App() {
  const [role, setRole] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [size, setSize] = useState(1); // 0 = small, 1 = default, 2 = large
  const [contrast, setContrast] = useState(false);
  const [lang, setLang] = useState("en"); // chosen once, on the first page; applies to every page after

  // Shared, hospital-wide data: lives here (not inside MainApp) so it survives
  // a doctor logging out and a hospital admin logging in — emergency cases a
  // doctor records must still show up in the Hospital block afterwards.
  const [encounters, setEncounters] = useState([]);
  const [patients, setPatients] = useState(HOSPITAL_PATIENTS);
  const [emergencyCases, setEmergencyCases] = useState([]);

  // Patient contact + emergency contact details: shared by Dashboard and Health Profile
  const [contact, setContact] = useState(BLANK_CONTACT);

  const addPatient = (p) => setPatients((list) => [p, ...list]);
  const addEmergencyCase = (c) => setEmergencyCases((list) => [c, ...list]);

  const mergeAnonymousData = (anonHealthId, target, opts = {}) => {
    setEncounters((encs) =>
      encs.map((e) => (e.healthId === anonHealthId ? { ...e, healthId: target.id, patient: target.name } : e))
    );
    setEmergencyCases((list) =>
      list.map((c) => (c.healthId === anonHealthId ? { ...c, healthId: target.id, name: target.name } : c))
    );
    if (!opts.isNewPatient) {
      setPatients((list) =>
        list.map((p) =>
          p.id === target.id
            ? {
                ...p,
                visitDates: [todayLabel(), ...(p.visitDates || [])],
                visits: (p.visitDates ? p.visitDates.length : p.visits || 0) + 1,
                lastVisit: todayLabel(),
              }
            : p
        )
      );
    }
  };

  useEffect(() => {
    document.documentElement.style.fontSize = ["90%", "100%", "115%"][size];
  }, [size]);

  useEffect(() => {
    document.body.classList.toggle("high-contrast", contrast);
  }, [contrast]);

  const logout = () => {
    window.location.hash = "";
    setAuthenticated(false);
    setRole(null);
  };

  let screen;

  if (!role) {
    screen = <RoleSelection onSelect={setRole} lang={lang} setLang={setLang} />;
  } else if (!authenticated) {
    const props = { onBack: () => setRole(null), onLogin: () => setAuthenticated(true), lang };
    screen =
      role === "patient" ? (
        <PatientLogin {...props} />
      ) : (
        <LoginForm role={role} {...props} />
      );
  } else {
    screen = (
      <MainApp
        role={role}
        logout={logout}
        lang={lang}
        encounters={encounters}
        setEncounters={setEncounters}
        patients={patients}
        addPatient={addPatient}
        mergeAnonymousData={mergeAnonymousData}
        contact={contact}
        setContact={setContact}
        emergencyCases={emergencyCases}
        addEmergencyCase={addEmergencyCase}
      />
    );
  }

  return (
    <>
      <GovStrip size={size} setSize={setSize} contrast={contrast} setContrast={setContrast} />
      {screen}
    </>
  );
}