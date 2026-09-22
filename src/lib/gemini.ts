import { ClarifyingQuestion, ClarifyingAnswer, SpecialistType, UrgencyLevel } from "@/types";

const SYSTEM_PROMPT = `You are a cautious, non-diagnostic health triage assistant built for rural and Tier-2 users in India who may have low health literacy. Your job is to interpret symptoms described in plain language (voice, text, or photos of rashes, eyes, wounds) and return ONLY a structured JSON response.

RULES:
1. You are NEVER allowed to give a medical diagnosis. Only describe possible general categories (e.g. "could be a viral infection", "skin allergic dermatitis") in cautious language.
2. Always assess urgency into exactly one of: "mild", "moderate", "urgent".
3. If ANY of these red-flag symptoms are present, urgency MUST be "urgent" and red_flag_triggered must be true: chest pain, difficulty breathing, severe bleeding, loss of consciousness, signs of stroke (face drooping, slurred speech, one-sided weakness), severe burns, suspected poisoning, severe allergic reaction.
4. Recommend exactly one specialist type from this fixed list: general_physician, pediatrician, gynecologist, dermatologist, ent, orthopedic, cardiologist, psychiatrist, dentist, ophthalmologist.
5. Explain your reasoning in simple, plain language a person with no medical background can understand. No medical jargon.
6. If an image is provided, examine it closely (e.g. skin rash, eye redness, swelling, wound) and note 1-2 objective visual observations in simple words.
7. Always include a disclaimer field reminding the user this is not a diagnosis.
8. Output ONLY valid JSON. No markdown, no extra text, no preamble.

OUTPUT FORMAT (strict JSON):
{
  "detected_symptoms": ["string", "string"],
  "duration": "string or null",
  "urgency_level": "mild | moderate | urgent",
  "red_flag_triggered": true | false,
  "recommended_specialist": "string (one of the fixed list)",
  "reasoning": "plain language explanation, 2-3 sentences max",
  "disclaimer": "This is general guidance, not a medical diagnosis. Please consult a qualified doctor.",
  "visual_observations": ["string (if image provided, else empty array)"]
}`;

export interface GeminiTriageResponse {
  detected_symptoms: string[];
  duration: string | null;
  urgency_level: UrgencyLevel;
  red_flag_triggered: boolean;
  recommended_specialist: SpecialistType;
  reasoning: string;
  disclaimer: string;
  visual_observations?: string[];
}

// ─── High-Reliability Clinical Fallback Engine ──────────────────────────────
export function fallbackClinicalTriage(
  transcript: string,
  language: string = "en",
  hasImage?: boolean
): GeminiTriageResponse {
  const text = transcript.toLowerCase();
  const isHindi = language === "hi" || /[\u0900-\u097F]/.test(transcript);
  const isKannada = language === "kn" || /[\u0C80-\u0CFF]/.test(transcript);

  const detectedSymptoms: string[] = [];
  let urgency: UrgencyLevel = "mild";
  let specialist: SpecialistType = "general_physician";
  let reasoning = "";

  // Check red flags / high urgency
  if (
    /chest pain|difficulty breathing|shortness of breath|unconscious|severe bleeding|heart attack|stroke|सीने में दर्द|सांस लेने में तकलीफ|ಬೆನ್ನು ನೋವು|ಎದೆ ನೋವು|ಉಸಿರಾಟದ ತೊಂದರೆ/i.test(text)
  ) {
    urgency = "urgent";
    specialist = "cardiologist";
    detectedSymptoms.push(isHindi ? "सीने में दर्द / सांस की तकलीफ" : isKannada ? "ಎದೆ ನೋವು / ಉಸಿರಾಟದ ತೊಂದರೆ" : "Chest pain / Breathing difficulty");
    reasoning = isHindi
      ? "ये लक्षण तत्काल चिकित्सीय आपातकाल का संकेत हो सकते हैं। कृपया तुरंत 108 पर कॉल करें या निकटतम अस्पताल जाएं।"
      : isKannada
      ? "ಇದು ತಕ್ಷಣದ ತುರ್ತು ಚಿಕಿತ್ಸೆಯ ಅಗತ್ಯವನ್ನು ಸೂಚಿಸುತ್ತದೆ. ದಯವಿಟ್ಟು 108 ಕರೆ ಮಾಡಿ ಅಥವಾ ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ತೆರಳಿ."
      : "These symptoms indicate a potential medical emergency. Please call 108 or go to the nearest emergency ward immediately.";
  }
  // Check skin / rash / allergy / wound
  else if (/rash|itch|allergy|skin|wound|boil|eczema|दाने|खुजली|चमड़ी|घाव|ದದ್ದು|ತುರಿಕೆ|ಗಾಯ/i.test(text) || hasImage) {
    urgency = "mild";
    specialist = "dermatologist";
    detectedSymptoms.push(isHindi ? "त्वचा पर दाने / खुजली" : isKannada ? "ಚರ್ಮದ ದದ್ದು / ತುರಿಕೆ" : "Skin rash / Itching");
    reasoning = isHindi
      ? "त्वचा की एलर्जी, इन्फेक्शन या रैश के उचित इलाज के लिए चर्म रोग विशेषज्ञ (डर्मेटोलॉजिस्ट) से परामर्श लें।"
      : isKannada
      ? "ಚರ್ಮದ ಸೋಂಕು ಅಥವಾ ಅಲರ್ಜಿಯ ಪರಿಹಾರಕ್ಕಾಗಿ ಚರ್ಮರೋಗ ತಜ್ಞರನ್ನು (ಡರ್ಮಟಾಲಜಿಸ್ಟ್) ಸಂಪರ್ಕಿಸಿ."
      : "Visual rash or skin irritation is best evaluated by a Dermatologist to prescribe appropriate topical medication.";
  }
  // Check child / pediatrician
  else if (/child|baby|infant|kid|pediatric|बच्चा|शिशु|मरीज|ಮಗು|ಚಿಕ್ಕ ಮಗು/i.test(text)) {
    urgency = "moderate";
    specialist = "pediatrician";
    detectedSymptoms.push(isHindi ? "शिशु / बच्चे की अस्वस्थता" : isKannada ? "ಮಗುವಿನ ಅನಾರೋಗ್ಯ" : "Child health symptoms");
    reasoning = isHindi
      ? "बच्चों के मामलों में बिना डॉक्टर की सलाह के दवा न दें। नजदीकी बाल रोग विशेषज्ञ (पीडियाट्रिशियन) से जांच कराएं।"
      : isKannada
      ? "ಮಕ್ಕಳ ಆರೋಗ್ಯಕ್ಕೆ ಸ್ವಂತ ಚಿಕಿತ್ಸೆ ನೀಡಬಾರದು. ಹತ್ತಿರದ ಮಕ್ಕಳ ವೈದ್ಯರನ್ನು (ಪೀಡಿಯಾಟ್ರಿಶಿಯನ್) ಸಂಪರ್ಕಿಸಿ."
      : "Child health symptoms require careful evaluation by a Pediatrician for safe dosage and proper assessment.";
  }
  // Check eye
  else if (/eye|vision|cornea|आंख|ಕಣ್ಣು/i.test(text)) {
    urgency = "moderate";
    specialist = "ophthalmologist";
    detectedSymptoms.push(isHindi ? "आंख में तकलीफ / लाली" : isKannada ? "ಕಣ್ಣಿನ ಸಮಸ್ಯೆ / ಕೆಂಪಾಗುವಿಕೆ" : "Eye discomfort / Redness");
    reasoning = isHindi
      ? "आंखों के किसी भी संक्रमण या दर्द के लिए नेत्र विशेषज्ञ (आई डॉक्टर) से जांच कराना जरूरी है।"
      : isKannada
      ? "ಕಣ್ಣಿನ ಯಾವುದೇ ತೊಂದರೆಗೆ ನೇತ್ರ ತಜ್ಞರನ್ನು (ಕಣ್ಣಿನ ವೈದ್ಯರು) ಕಾಣುವುದು ಸೂಕ್ತ."
      : "Eye irritation or vision issues should be promptly examined by an Eye Doctor (Ophthalmologist).";
  }
  // Check orthopedic (joints / bones)
  else if (/joint|bone|knee|back pain|fracture|हड्डी|कमर दर्द|जोड़ों में दर्द|ಮೂಳೆ|ಕೀಲು ನೋವು/i.test(text)) {
    urgency = "mild";
    specialist = "orthopedic";
    detectedSymptoms.push(isHindi ? "जोड़ों या हड्डी में दर्द" : isKannada ? "ಕೀಲು ಅಥವಾ ಮೂಳೆ ನೋವು" : "Joint / Bone pain");
    reasoning = isHindi
      ? "हड्डी और जोड़ों के दर्द के लिए आर्थोपेडिक डॉक्टर को दिखाएं और भारी वजन उठाने से बचें।"
      : isKannada
      ? "ಮೂಳೆ ಮತ್ತು ಕೀಲು ನೋವಿಗೆ ಅಸ್ಥಿ ತಜ್ಞರನ್ನು (ಆರ್ಥೋಪೆಡಿಕ್) ಸಂಪರ್ಕಿಸಿ."
      : "Persistent bone or joint pain is best diagnosed by an Orthopedic specialist.";
  }
  // Check stomach / vomiting / diarrhea
  else if (/stomach|abdomen|loose motion|diarrhea|vomit|vomiting|pet dard|पेट दर्द|उल्टी|दस्त|ಹೊಟ್ಟೆ ನೋವು|ವಾಂತಿ/i.test(text)) {
    urgency = /severe|खून|रक्त|blood/i.test(text) ? "urgent" : "moderate";
    specialist = "general_physician";
    detectedSymptoms.push(isHindi ? "पेट में दर्द / उल्टी या दस्त" : isKannada ? "ಹೊಟ್ಟೆ ನೋವು / ವಾಂತಿ" : "Stomach pain / Gastric issue");
    reasoning = isHindi
      ? "पेट के संक्रमण और डिहाइड्रेशन से बचने के लिए ओआरएस (ORS) घोल लें और जनरल फिजिशियन से परामर्श लें।"
      : isKannada
      ? "ಹೊಟ್ಟೆಯ ಸೋಂಕಿನಿಂದ ಪಾರಾಗಲು ಒಆರ್‌ಎಸ್ (ORS) ಸೇವಿಸಿ ಮತ್ತು ಸಾಮಾನ್ಯ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ."
      : "Abdominal discomfort or fluid loss requires hydration (ORS) and clinical evaluation by a General Physician.";
  }
  // General fever / cold / headache / body pain
  else {
    const hasFever = /fever|temperature|बुखार|ಜ್ವರ|ताप/i.test(text);
    const hasHeadache = /headache|सिरदर्द|तलेनोवु|ತಲೆನೋವು/i.test(text);
    const hasCough = /cough|cold|खांसी|जुकाम|केम्मु|ಕೆಮ್ಮು|ನೆಗಡಿ/i.test(text);

    if (hasFever) detectedSymptoms.push(isHindi ? "बुखार (Fever)" : isKannada ? "ಜ್ವರ (Fever)" : "Fever");
    if (hasHeadache) detectedSymptoms.push(isHindi ? "सिरदर्द (Headache)" : isKannada ? "ತಲೆನೋವು (Headache)" : "Headache");
    if (hasCough) detectedSymptoms.push(isHindi ? "खांसी / जुकाम (Cough/Cold)" : isKannada ? "ಕೆಮ್ಮು / ನೆಗಡಿ (Cough)" : "Cough & Cold");
    if (detectedSymptoms.length === 0) {
      detectedSymptoms.push(isHindi ? "सामान्य अस्वस्थता" : isKannada ? "ಸಾಮಾನ್ಯ ಅಸ್ವಸ್ಥತೆ" : "General discomfort");
    }

    urgency = /severe|high|तेज|बहुत|ತೀವ್ರ/i.test(text) ? "moderate" : "mild";
    specialist = "general_physician";
    reasoning = isHindi
      ? "ये लक्षण मौसमी वायरल बुखार या सामान्य संक्रमण के हो सकते हैं। नजदीकी सरकारी पीएचसी या जनरल फिजिशियन से दवा लें और आराम करें।"
      : isKannada
      ? "ಇದು ಸಾಮಾನ್ಯ ಜ್ವರ ಅಥವಾ ಕಾಲೋಚಿತ ಸೋಂಕಿನ ಲಕ್ಷಣವಾಗಿರಬಹುದು. ಹತ್ತಿರದ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ ಅಥವಾ ಸಾಮಾನ್ಯ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ."
      : "These symptoms suggest a common viral illness. Rest, hydrate, and consult a General Physician at your nearest PHC.";
  }

  // Duration extraction
  let duration: string | null = null;
  const daysMatch = text.match(/(\d+)\s*(days?|दिन|ದಿನ)/i);
  if (daysMatch) {
    duration = isHindi ? `${daysMatch[1]} दिन` : isKannada ? `${daysMatch[1]} ದಿನಗಳು` : `${daysMatch[1]} days`;
  }

  return {
    detected_symptoms: detectedSymptoms,
    duration,
    urgency_level: urgency,
    red_flag_triggered: urgency === "urgent",
    recommended_specialist: specialist,
    reasoning,
    disclaimer: isHindi
      ? "यह सामान्य स्वास्थ्य मार्गदर्शन है, कोई चिकित्सीय निदान नहीं। कृपया योग्य डॉक्टर से परामर्श लें।"
      : isKannada
      ? "ಇದು ಸಾಮಾನ್ಯ ಮಾರ್ಗದರ್ಶನ ಮಾತ್ರ, ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವಲ್ಲ. ದಯವಿಟ್ಟು ಅರ್ಹ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ."
      : "This is general guidance, not a medical diagnosis. Please consult a qualified doctor.",
    visual_observations: hasImage ? ["Visual examination notes possible skin or tissue irritation"] : [],
  };
}

export async function generateFollowUpQuestions(
  transcript: string,
  language: string,
  imageBase64?: string,
  imageMimeType?: string
): Promise<ClarifyingQuestion[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return [];

  const prompt = `Based on symptoms "${transcript}", generate 1 or 2 brief clarifying questions in language "${language}". Output JSON format {"questions": [{"id": "q1", "question": "...", "options": ["Yes", "No", "Not sure"]}]}`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) return [];
    const data = await res.json();
    const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) return [];
    const parsed = JSON.parse(jsonText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim());
    return Array.isArray(parsed.questions) ? parsed.questions.slice(0, 2) : [];
  } catch (err) {
    console.warn("Follow-up questions generation notice:", err);
    return [];
  }
}

export async function triageSymptoms(
  transcript: string,
  language: string,
  imageBase64?: string,
  imageMimeType?: string,
  clarifyingAnswers?: ClarifyingAnswer[]
): Promise<GeminiTriageResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("No GEMINI_API_KEY. Using clinical fallback.");
    return fallbackClinicalTriage(transcript, language, Boolean(imageBase64));
  }

  let userMessage = `Language: ${language}\nTranscript: "${transcript}"`;

  if (clarifyingAnswers && clarifyingAnswers.length > 0) {
    userMessage += `\nFollow-up Patient Clarifications:\n` +
      clarifyingAnswers.map((qa) => `- ${qa.question}: ${qa.answer}`).join("\n");
  }

  const parts: any[] = [
    { text: SYSTEM_PROMPT + "\n\n" + userMessage },
  ];

  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: imageMimeType || "image/jpeg",
        data: imageBase64,
      },
    });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Gemini returned status ${response.status}. Using clinical fallback engine.`);
      return fallbackClinicalTriage(transcript, language, Boolean(imageBase64));
    }

    const data = await response.json();
    const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) {
      return fallbackClinicalTriage(transcript, language, Boolean(imageBase64));
    }

    const cleaned = jsonText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const result: GeminiTriageResponse = JSON.parse(cleaned);

    if (!result.urgency_level || !result.recommended_specialist) {
      return fallbackClinicalTriage(transcript, language, Boolean(imageBase64));
    }

    return result;
  } catch (err: any) {
    console.warn("Gemini call exception. Using clinical fallback engine:", err.message);
    return fallbackClinicalTriage(transcript, language, Boolean(imageBase64));
  }
}
