import { Language } from "@/types";

export interface SymptomPreset {
  id: string;
  icon: string;
  label: Record<Language, string>;
  fullText: Record<Language, string>;
  isEmergency?: boolean;
}

export const COMMON_SYMPTOMS: SymptomPreset[] = [
  {
    id: "fever_bodypain",
    icon: "🌡️",
    label: {
      en: "Fever & Body Pain (3 days)",
      hi: "3 दिन से बुखार और बदन दर्द",
      kn: "3 ದಿನಗಳಿಂದ ಜ್ವರ ಮತ್ತು ಮೈಕೈ ನೋವು",
    },
    fullText: {
      en: "I have had fever and body pain for the last 3 days, and I feel very tired. No cough or breathing problem.",
      hi: "मुझे 3 दिन से बुखार और बदन दर्द है, और बहुत कमजोरी महसूस हो रही है। खांसी या सांस की तकलीफ नहीं है।",
      kn: "ನನಗೆ ಕಳೆದ 3 ದಿನಗಳಿಂದ ಜ್ವರ ಮತ್ತು ಮೈಕೈ ನೋವು ಇದೆ, ತುಂಬಾ ಸುಸ್ತಾಗುತ್ತಿದೆ. ಕೆಮ್ಮು ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆ ಇಲ್ಲ.",
    },
  },
  {
    id: "cough_cold",
    icon: "🤧",
    label: {
      en: "Cough & Sore Throat",
      hi: "खांसी और गले में खराश",
      kn: "ಕೆಮ್ಮು ಮತ್ತು ಗಂಟಲು ನೋವು",
    },
    fullText: {
      en: "I have a dry cough, runny nose and sore throat since yesterday. Mild headache as well.",
      hi: "कल से सूखी खांसी, बहती नाक और गले में खराश है। सिर में भी हल्का दर्द है।",
      kn: "ನಿನ್ನೆಯಿಂದ ಒಣ ಕೆಮ್ಮು, ನೆಗಡಿ ಮತ್ತು ಗಂಟಲು ನೋವು ಇದೆ. ಲಘು ತಲೆನೋವು ಕೂಡ ಇದೆ.",
    },
  },
  {
    id: "stomach_vomit",
    icon: "🤢",
    label: {
      en: "Stomach Ache & Vomiting",
      hi: "पेट दर्द और उल्टी",
      kn: "ಹೊಟ್ಟೆ ನೋವು ಮತ್ತು ವಾಂತಿ",
    },
    fullText: {
      en: "I have severe stomach cramps and have vomited twice since morning. Loose motions started today.",
      hi: "सुबह से पेट में तेज मरोड़ और दर्द है, दो बार उल्टी हुई है और दस्त भी शुरू हो गए हैं।",
      kn: "ಬೆಳಗಿನಿಂದ ತೀವ್ರ ಹೊಟ್ಟೆ ನೋವು ಮತ್ತು ಎರಡು ಬಾರಿ ವಾಂತಿಯಾಗಿದೆ. ಇವತ್ತು ಬೇಧಿ ಕೂಡ ಪ್ರಾರಂಭವಾಗಿದೆ.",
    },
  },
  {
    id: "chest_pain_emergency",
    icon: "🚨",
    isEmergency: true,
    label: {
      en: "Chest Pain & Shortness of Breath (Emergency)",
      hi: "सीने में तेज दर्द और सांस फूलना (आपातकाल)",
      kn: "ಎದೆ ನೋವು ಮತ್ತು ಉಸಿರಾಟದ ತೊಂದರೆ (ತುರ್ತು)",
    },
    fullText: {
      en: "Sudden severe chest pain radiating to left arm, difficulty breathing and sweating heavily.",
      hi: "सीने में अचानक तेज दर्द जो बाएं हाथ तक जा रहा है, सांस लेने में भारी तकलीफ और पसीना आ रहा है।",
      kn: "ಎದೆಯಲ್ಲಿ ಹಠಾತ್ ತೀವ್ರ ನೋವು ಎಡಗೈಗೆ ಹರಡುತ್ತಿದೆ, ಉಸಿರಾಟಕ್ಕೆ ಕಷ್ಟವಾಗುತ್ತಿದೆ ಮತ್ತು ಅತಿಯಾದ ಬೆವರುವಿಕೆ ಇದೆ.",
    },
  },
  {
    id: "skin_rash",
    icon: "🧴",
    label: {
      en: "Skin Rash & Itching",
      hi: "त्वचा पर खुजली और लाल दाने",
      kn: "ಚರ್ಮದ ತುರಿಕೆ ಮತ್ತು ಕೆಂಪು ದದ್ದು",
    },
    fullText: {
      en: "Red rashes with severe itching on hands and neck since two days after eating street food.",
      hi: "दो दिन से हाथों और गर्दन पर लाल चकत्ते और तेज खुजली हो रही है।",
      kn: "ಕಳೆದ ಎರಡು ದಿನಗಳಿಂದ ಕೈಗಳು ಮತ್ತು ಕುತ್ತಿಗೆಯ ಮೇಲೆ ಕೆಂಪು ದದ್ದುಗಳು ಮತ್ತು ತೀವ್ರ ತುರಿಕೆ ಉಂಟಾಗಿದೆ.",
    },
  },
  {
    id: "eye_irritation",
    icon: "👁️",
    label: {
      en: "Redness & Burning in Eyes",
      hi: "आँखों में लाली और जलन",
      kn: "ಕಣ್ಣು ಕೆಂಪಾಗುವುದು ಮತ್ತು ಉರಿ",
    },
    fullText: {
      en: "Both eyes are very red, watery and burning with sticky yellow discharge in the morning.",
      hi: "दोनों आँखें लाल हैं, पानी बह रहा है और तेज जलन हो रही है। सुबह पीला चिपचिपा पदार्थ निकलता है।",
      kn: "ಎರಡೂ ಕಣ್ಣುಗಳು ತುಂಬಾ ಕೆಂಪಾಗಿವೆ, ನೀರು ಬರುತ್ತಿದೆ ಮತ್ತು ಬೆಳಿಗ್ಗೆ ಅಂಟಂಟಾದ ಹಳದಿ ದ್ರವ ಬರುತ್ತಿದೆ.",
    },
  },
  {
    id: "child_fever",
    icon: "👶",
    label: {
      en: "Child Fever & Crying",
      hi: "बच्चे को तेज बुखार और रोना",
      kn: "ಮಗುವಿಗೆ ಜ್ವರ ಮತ್ತು ಅಳು",
    },
    fullText: {
      en: "My 3 year old child has high fever, crying continuously and refusing to eat anything.",
      hi: "मेरे 3 साल के बच्चे को तेज बुखार है, वह लगातार रो रहा है और कुछ भी खाने से मना कर रहा है।",
      kn: "ನನ್ನ 3 ವರ್ಷದ ಮಗುವಿಗೆ ತೀವ್ರ ಜ್ವರವಿದೆ, ನಿರಂತರವಾಗಿ ಅಳುತ್ತಿದೆ ಮತ್ತು ಊಟ ಮಾಡಲು ನಿರಾಕರಿಸುತ್ತಿದೆ.",
    },
  },
  {
    id: "tooth_ache",
    icon: "🦷",
    label: {
      en: "Severe Toothache & Swelling",
      hi: "दांत में तेज दर्द और मसूड़ों में सूजन",
      kn: "ಹಲ್ಲು ನೋವು ಮತ್ತು ಒಸಡು ಊತ",
    },
    fullText: {
      en: "Throbbing pain in lower molar tooth with swollen gums. Cannot chew food since yesterday.",
      hi: "नीचे की दाढ़ में तेज धड़कता हुआ दर्द है और मसूड़े सूज गए हैं। कल से खाना चबा नहीं पा रहा हूँ।",
      kn: "ಕೆಳಗಿನ ದವಡೆ ಹಲ್ಲಿನಲ್ಲಿ ತೀವ್ರ ನೋವು ಮತ್ತು ಒಸಡು ಊದಿಕೊಂಡಿದೆ. ನಿನ್ನೆಯಿಂದ ಆಹಾರವನ್ನು ಅಗಿಯಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ.",
    },
  },
];
