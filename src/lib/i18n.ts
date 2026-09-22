import type { Language } from "@/types";

export type TranslationKeys =
  | "appName"
  | "tagline"
  | "trustStatement"
  | "selectLanguage"
  | "tapToSpeak"
  | "listening"
  | "stopRecording"
  | "confirmTranscript"
  | "reRecord"
  | "submit"
  | "analyzing"
  | "urgencyMild"
  | "urgencyModerate"
  | "urgencyUrgent"
  | "recommendedSpecialist"
  | "findClinics"
  | "generateSummary"
  | "disclaimer"
  | "emergencyTitle"
  | "emergencyMessage"
  | "call108"
  | "goToHospital"
  | "nearbyClinics"
  | "noResults"
  | "loadingClinics"
  | "locationRequired"
  | "call"
  | "directions"
  | "km"
  | "doctorSummary"
  | "downloadPDF"
  | "share"
  | "symptoms"
  | "duration"
  | "urgency"
  | "specialist"
  | "date"
  | "back"
  | "startNew"
  | "speechNotSupported"
  | "detectedSymptoms"
  | "voiceTab"
  | "typeTab"
  | "quickChipsTitle"
  | "speechNetworkHelp"
  | "typePlaceholder"
  | "listenAdvice"
  | "stopAudio"
  | "emergencyQuickAccess"
  | "emergencyCall108"
  | "citySelectLabel"
  | "selectSymptomPrompt"
  | "whatsappShare"
  | "attachPhoto"
  | "photoDescription"
  | "removePhoto"
  | "clarifyingTitle"
  | "clarifyingSub"
  | "skipQuestions"
  | "visualObservations"
  | "filterAll"
  | "filterGovt"
  | "filterAyushman"
  | "filterJanaushadhi"
  | "subsidizedCare"
  | "freeGovtCare"
  | "takeLivePhoto"
  | "chooseFilePhoto"
  | "retakePhoto"
  | "telegramShare"
  | "telegramBotTitle"
  | "telegramBotDesc"
  | "openTelegramBot";

const translations: Record<Language, Record<TranslationKeys, string>> = {
  en: {
    appName: "SwasthyaSaathi",
    tagline: "Your AI Health Companion",
    trustStatement: "Not a diagnosis. Helps you find the right care faster.",
    selectLanguage: "Choose your language",
    tapToSpeak: "Tap to Speak",
    listening: "Listening... Speak now",
    stopRecording: "Done Speaking",
    confirmTranscript: "Check your symptoms before analyzing",
    reRecord: "Record Again",
    submit: "Analyze Symptoms",
    analyzing: "Analyzing your symptoms with AI...",
    urgencyMild: "Mild",
    urgencyModerate: "Moderate",
    urgencyUrgent: "Urgent",
    recommendedSpecialist: "Recommended Doctor",
    findClinics: "Find Nearby Clinics",
    generateSummary: "Doctor Summary Card",
    disclaimer:
      "This is guidance, not a medical diagnosis. Please consult a qualified healthcare provider.",
    emergencyTitle: "⚠️ Immediate Emergency",
    emergencyMessage:
      "Your symptoms indicate a potential life-threatening emergency. Please call 108 immediately or go to the nearest emergency room.",
    call108: "Call 108 Ambulance",
    goToHospital: "Find Nearest Hospital on Map",
    nearbyClinics: "Nearby Clinics & Hospitals",
    noResults: "No clinics found within the search range. Showing nearby emergency centers.",
    loadingClinics: "Locating verified medical facilities near you...",
    locationRequired: "Location access is needed to find the closest clinics.",
    call: "Call",
    directions: "Directions",
    km: "km away",
    doctorSummary: "Doctor Consultation Summary",
    downloadPDF: "Download PDF Card",
    share: "Share Summary",
    symptoms: "Symptoms",
    duration: "Duration",
    urgency: "Urgency Level",
    specialist: "Specialist",
    date: "Date",
    back: "Back",
    startNew: "Check Another Symptom",
    speechNotSupported:
      "Voice recognition is offline or not supported in this browser. You can type or select a symptom below.",
    detectedSymptoms: "Detected Symptoms",
    voiceTab: "🎤 Voice Input",
    typeTab: "⌨️ Type or Pick",
    quickChipsTitle: "Tap a common symptom to test instantly:",
    speechNetworkHelp:
      "Voice network paused. Tap any symptom below or type to continue without speaking.",
    typePlaceholder: "Describe how you are feeling (e.g. fever for 3 days, headache, weakness)...",
    listenAdvice: "🔊 Read Aloud (Listen)",
    stopAudio: "⏹ Stop Reading",
    emergencyQuickAccess: "🚨 Emergency? Call 108 Ambulance",
    emergencyCall108: "Call 108 Emergency",
    citySelectLabel: "Location Area:",
    selectSymptomPrompt: "Select a common symptom below or describe your own",
    whatsappShare: "Share via WhatsApp",
    attachPhoto: "📷 Add Photo (Rash, Eye, Wound)",
    photoDescription: "Snap or upload photo of affected skin, eye, or wound for AI visual analysis",
    removePhoto: "Remove Photo",
    clarifyingTitle: "Quick Clarifying Questions",
    clarifyingSub: "Please answer these 1-2 questions to help the AI give the most accurate recommendation",
    skipQuestions: "Skip & View Results",
    visualObservations: "AI Visual Observations",
    filterAll: "All Facilities",
    filterGovt: "🏛️ Govt PHC / Hospital (Free)",
    filterAyushman: "💳 Ayushman Bharat (PM-JAY)",
    filterJanaushadhi: "💊 Jan Aushadhi (Generic)",
    subsidizedCare: "PM-JAY Empanelled",
    freeGovtCare: "Free Govt OPD",
    takeLivePhoto: "📸 Live Camera",
    chooseFilePhoto: "📁 Upload Photo",
    retakePhoto: "Retake",
    telegramShare: "Share via Telegram",
    telegramBotTitle: "SwasthyaSaathi on Telegram",
    telegramBotDesc: "Triage symptoms directly on Telegram voice & chat",
    openTelegramBot: "Open Telegram Bot",
  },
  hi: {
    appName: "स्वास्थ्य साथी",
    tagline: "आपका एआई स्वास्थ्य साथी",
    trustStatement: "यह निदान नहीं है। सही डॉक्टर और देखभाल खोजने में मदद करता है।",
    selectLanguage: "अपनी भाषा चुनें",
    tapToSpeak: "बोलने के लिए माइक दबाएं",
    listening: "सुन रहा है... अब बोलिए",
    stopRecording: "बोलना समाप्त",
    confirmTranscript: "जांच करने से पहले अपने लक्षण देख लें",
    reRecord: "फिर से बोलें",
    submit: "लक्षणों की जांच करें",
    analyzing: "एआई द्वारा आपके लक्षणों का विश्लेषण हो रहा है...",
    urgencyMild: "हल्का (Mild)",
    urgencyModerate: "मध्यम (Moderate)",
    urgencyUrgent: "गंभीर (Urgent)",
    recommendedSpecialist: "सुझाया गया डॉक्टर",
    findClinics: "पास के अस्पताल व क्लिनिक",
    generateSummary: "डॉक्टर सारांश कार्ड",
    disclaimer:
      "यह सामान्य मार्गदर्शन है, चिकित्सा निदान नहीं। कृपया योग्य डॉक्टर से परामर्श लें।",
    emergencyTitle: "⚠️ तत्काल आपातकाल",
    emergencyMessage:
      "ये लक्षण गंभीर आपातकाल का संकेत हो सकते हैं। कृपया तुरंत 108 पर कॉल करें या निकटतम अस्पताल जाएं।",
    call108: "108 एम्बुलेंस को कॉल करें",
    goToHospital: "नक्शे पर नजदीकी अस्पताल खोजें",
    nearbyClinics: "पास के अस्पताल और क्लिनिक",
    noResults: "पास में कोई क्लिनिक नहीं मिला।",
    loadingClinics: "आपके पास के प्रमाणित अस्पताल खोजे जा रहे हैं...",
    locationRequired: "पास के अस्पताल खोजने के लिए लोकेशन की अनुमति चाहिए।",
    call: "कॉल करें",
    directions: "रास्ता (दिशा)",
    km: "कि.मी. दूर",
    doctorSummary: "डॉक्टर परामर्श सारांश कार्ड",
    downloadPDF: "PDF कार्ड डाउनलोड करें",
    share: "शेयर करें",
    symptoms: "लक्षण",
    duration: "अवधि",
    urgency: "गंभीरता स्तर",
    specialist: "विशेषज्ञ डॉक्टर",
    date: "दिनांक",
    back: "वापस",
    startNew: "नई जांच शुरू करें",
    speechNotSupported:
      "आवाज़ पहचान सेवा उपलब्ध नहीं है। आप नीचे लक्षण चुन सकते हैं या लिख सकते हैं।",
    detectedSymptoms: "पहचाने गए लक्षण",
    voiceTab: "🎤 बोलकर बताएं",
    typeTab: "⌨️ लिखकर या चुनकर",
    quickChipsTitle: "तुरंत जांचने के लिए सामान्य लक्षण पर टैप करें:",
    speechNetworkHelp:
      "माइक नेटवर्क धीमा है। नीचे दिए गए किसी भी लक्षण पर टैप करें या लिखकर बताएं।",
    typePlaceholder: "अपनी तकलीफ लिखें (जैसे: 3 दिन से बुखार, सिरदर्द, बदन में कमजोरी)...",
    listenAdvice: "🔊 बोलकर सुनें (आवाज)",
    stopAudio: "⏹ बंद करें",
    emergencyQuickAccess: "🚨 आपातकाल? तुरंत 108 पर कॉल करें",
    emergencyCall108: "108 आपातकालीन कॉल",
    citySelectLabel: "शहर / क्षेत्र चुनें:",
    selectSymptomPrompt: "नीचे से कोई सामान्य लक्षण चुनें या अपनी बात लिखें",
    whatsappShare: "व्हाट्सएप पर शेयर करें",
    attachPhoto: "📷 फोटो जोड़ें (दाने, आंख, घाव)",
    photoDescription: "प्रभावित त्वचा, आंख या घाव की फोटो जोड़ें ताकि एआई देख सके",
    removePhoto: "फोटो हटाएं",
    clarifyingTitle: "महत्वपूर्ण प्रश्न",
    clarifyingSub: "सटीक सलाह के लिए कृपया इन 1-2 आसान सवालों के जवाब दें",
    skipQuestions: "छोड़ें और परिणाम देखें",
    visualObservations: "फोटो का एआई अवलोकन",
    filterAll: "सभी केंद्र",
    filterGovt: "🏛️ सरकारी अस्पताल / पीएचसी (मुफ़्त)",
    filterAyushman: "💳 आयुष्मान भारत (PM-JAY)",
    filterJanaushadhi: "💊 जन औषधि केंद्र (सस्ती दवा)",
    subsidizedCare: "आयुष्मान पैनल में",
    freeGovtCare: "मुफ़्त सरकारी ओपीडी",
    takeLivePhoto: "📸 लाइव कैमरा",
    chooseFilePhoto: "📁 फोटो अपलोड करें",
    retakePhoto: "बदलें",
    telegramShare: "टेलीग्राम पर शेयर करें",
    telegramBotTitle: "टेलीग्राम पर स्वास्थ्य साथी",
    telegramBotDesc: "टेलीग्राम पर बोलकर या लिखकर लक्षणों की जांच करें",
    openTelegramBot: "टेलीग्राम बॉट खोलें",
  },
  kn: {
    appName: "ಸ್ವಾಸ್ಥ್ಯ ಸಾಥಿ",
    tagline: "ನಿಮ್ಮ ಎಐ ಆರೋಗ್ಯ ಸಂಗಾತಿ",
    trustStatement: "ಇದು ರೋಗನಿರ್ಣಯವಲ್ಲ. ಸರಿಯಾದ ವೈದ್ಯರನ್ನು ವೇಗವಾಗಿ ಹುಡುಕಲು ನೆರವಾಗುತ್ತದೆ.",
    selectLanguage: "ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
    tapToSpeak: "ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ",
    listening: "ಕೇಳುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ",
    stopRecording: "ಮುಕ್ತಾಯ",
    confirmTranscript: "ವಿಶ್ಲೇಷಿಸುವ ಮುನ್ನ ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
    reRecord: "ಮತ್ತೆ ಮಾತನಾಡಿ",
    submit: "ಲಕ್ಷಣಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
    analyzing: "ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ಎಐ ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...",
    urgencyMild: "ಸೌಮ್ಯ (Mild)",
    urgencyModerate: "ಮಧ್ಯಮ (Moderate)",
    urgencyUrgent: "ತುರ್ತು (Urgent)",
    recommendedSpecialist: "ಶಿಫಾರಸು ಮಾಡಿದ ತಜ್ಞ ವೈದ್ಯರು",
    findClinics: "ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು",
    generateSummary: "ವೈದ್ಯರ ಸಾರಾಂಶ ಕಾರ್ಡ್",
    disclaimer:
      "ಇದು ಸಾಮಾನ್ಯ ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ, ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವಲ್ಲ. ದಯವಿಟ್ಟು ಅರ್ಹ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    emergencyTitle: "⚠️ ತಕ್ಷಣದ ತುರ್ತು ಪರಿಸ್ಥಿತಿ",
    emergencyMessage:
      "ಇದು ಜೀವಕ್ಕೆ ಅಪಾಯಕಾರಿ ತುರ್ತು ಪರಿಸ್ಥಿತಿ ಆಗಿರಬಹುದು. ದಯವಿಟ್ಟು ತಕ್ಷಣ 108 ಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗೆ ತೆರಳಿ.",
    call108: "108 ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗೆ ಕರೆ ಮಾಡಿ",
    goToHospital: "ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗೆ ದಾರಿ ನೋಡಿ",
    nearbyClinics: "ಹತ್ತಿರದ ಕ್ಲಿನಿಕ್ ಮತ್ತು ಆಸ್ಪತ್ರೆಗಳು",
    noResults: "ಹತ್ತಿರದಲ್ಲಿ ಯಾವುದೇ ಕ್ಲಿನಿಕ್ ಕಂಡುಬಂದಿಲ್ಲ.",
    loadingClinics: "ನಿಮ್ಮ ಸಮೀಪದ ವೈದ್ಯಕೀಯ ಕೇಂದ್ರಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
    locationRequired: "ಹತ್ತಿರದ ಕ್ಲಿನಿಕ್ ಹುಡುಕಲು ಸ್ಥಳ ಪ್ರವೇಶ (GPS) ಅಗತ್ಯವಿದೆ.",
    call: "ಕರೆ ಮಾಡಿ",
    directions: "ದಾರಿ",
    km: "ಕಿ.ಮೀ. ದೂರ",
    doctorSummary: "ವೈದ್ಯರ ಸಮಾಲೋಚನಾ ಸಾರಾಂಶ",
    downloadPDF: "PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    share: "ಹಂಚಿಕೊಳ್ಳಿ",
    symptoms: "ಲಕ್ಷಣಗಳು",
    duration: "ಅವಧಿ",
    urgency: "ತುರ್ತು ಮಟ್ಟ",
    specialist: "ವಿಶೇಷ ತಜ್ಞರು",
    date: "ದಿನಾಂಕ",
    back: "ಹಿಂದೆ",
    startNew: "ಹೊಸ ಪರೀಕ್ಷೆ ಪ್ರಾರಂಭಿಸಿ",
    speechNotSupported:
      "ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಲಕ್ಷಣವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.",
    detectedSymptoms: "ಗುರುತಿಸಲಾದ ಲಕ್ಷಣಗಳು",
    voiceTab: "🎤 ಧ್ವನಿ ಮೂಲಕ",
    typeTab: "⌨️ ಬರೆದು / ಆಯ್ಕೆಮಾಡಿ",
    quickChipsTitle: "ತಕ್ಷಣ ಪರಿಶೀಲಿಸಲು ಸಾಮಾನ್ಯ ಲಕ್ಷಣವನ್ನು ಆರಿಸಿ:",
    speechNetworkHelp:
      "ಮೈಕ್ರೋಫೋನ್ ಜಾಲ ನಿಧಾನವಾಗಿದೆ. ಕೆಳಗಿನ ಲಕ್ಷಣವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಬರೆಯಿರಿ.",
    typePlaceholder: "ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಬರೆಯಿರಿ (ಉದಾ: 3 ದಿನಗಳಿಂದ ಜ್ವರ, ತಲೆನೋವು, ಸುಸ್ತು)...",
    listenAdvice: "🔊 ಓದಿ ಕೇಳಿ (ಧ್ವನಿ)",
    stopAudio: "⏹ ನಿಲ್ಲಿಸಿ",
    emergencyQuickAccess: "🚨 ತುರ್ತು ಪರಿಸ್ಥಿತಿ? 108 ಗೆ ಕರೆ ಮಾಡಿ",
    emergencyCall108: "108 ತುರ್ತು ಕರೆ",
    citySelectLabel: "ಸ್ಥಳ / ನಗರ:",
    selectSymptomPrompt: "ಕೆಳಗಿನ ಸಾಮಾನ್ಯ ಲಕ್ಷಣವನ್ನು ಆರಿಸಿ ಅಥವಾ ಬರೆಯಿರಿ",
    whatsappShare: "ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ",
    attachPhoto: "📷 ಫೋಟೋ ಸೇರಿಸಿ (ದದ್ದು, ಕಣ್ಣು, ಗಾಯ)",
    photoDescription: "ಎಐ ಪರಿಶೀಲನೆಗಾಗಿ ಚರ್ಮದ ದದ್ದು, ಕಣ್ಣು ಅಥವಾ ಗಾಯದ ಫೋಟೋವನ್ನು ಸೇರಿಸಿ",
    removePhoto: "ಫೋಟೋ ತೆಗೆಯಿರಿ",
    clarifyingTitle: "ಸ್ಪಷ್ಟೀಕರಣ ಪ್ರಶ್ನೆಗಳು",
    clarifyingSub: "ನಿಖರವಾದ ಸಲಹೆ ನೀಡಲು ದಯವಿಟ್ಟು ಈ 1-2 ಸುಲಭ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ",
    skipQuestions: "ಮುಂದೆ ಹೋಗಿ ಫಲಿತಾಂಶ ನೋಡಿ",
    visualObservations: "ಎಐ ದೃಶ್ಯ ವೀಕ್ಷಣೆ",
    filterAll: "ಎಲ್ಲಾ ಆಸ್ಪತ್ರೆಗಳು",
    filterGovt: "🏛️ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆ / ಪಿಎಚ್‌ಸಿ (ಉಚಿತ)",
    filterAyushman: "💳 ಆಯುಷ್ಮಾನ್ ಭಾರತ್ (PM-JAY)",
    filterJanaushadhi: "💊 ಜನೌಷಧಿ ಕೇಂದ್ರ (ಕಡಿಮೆ ಬೆಲೆ)",
    subsidizedCare: "ಆಯುಷ್ಮಾನ್ ನೋಂದಾಯಿತ",
    freeGovtCare: "ಉಚಿತ ಸರ್ಕಾರಿ ಓಪಿಡಿ",
    takeLivePhoto: "📸 ಲೈವ್ ಕ್ಯಾಮೆರಾ",
    chooseFilePhoto: "📁 ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    retakePhoto: "ಮತ್ತೆ ತೆಗೆಯಿರಿ",
    telegramShare: "ಟೆಲಿಗ್ರಾಂನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ",
    telegramBotTitle: "ಟೆಲಿಗ್ರಾಂನಲ್ಲಿ ಸ್ವಾಸ್ಥ್ಯ ಸಾಥಿ",
    telegramBotDesc: "ಟೆಲಿಗ್ರಾಂನಲ್ಲಿ ಧ್ವನಿ ಅಥವಾ ಪಠ್ಯದ ಮೂಲಕ ಲಕ್ಷಣಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ",
    openTelegramBot: "ಟೆಲಿಗ್ರಾಂ ಬಾಟ್ ತೆರೆಯಿರಿ",
  },
};

export function t(lang: Language, key: TranslationKeys): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}
