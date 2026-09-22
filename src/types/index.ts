// ─── Language ──────────────────────────────────────────
export type Language = "en" | "hi" | "kn";

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  hi: "हिंदी",
  kn: "ಕನ್ನಡ",
};

export const SPEECH_LANG_CODES: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  kn: "kn-IN",
};

// ─── Urgency ───────────────────────────────────────────
export type UrgencyLevel = "mild" | "moderate" | "urgent";

// ─── Specialist Types ──────────────────────────────────
export type SpecialistType =
  | "general_physician"
  | "pediatrician"
  | "gynecologist"
  | "dermatologist"
  | "ent"
  | "orthopedic"
  | "cardiologist"
  | "psychiatrist"
  | "dentist"
  | "ophthalmologist";

export const SPECIALIST_LABELS: Record<SpecialistType, string> = {
  general_physician: "General Physician",
  pediatrician: "Pediatrician",
  gynecologist: "Gynecologist",
  dermatologist: "Dermatologist",
  ent: "ENT Specialist",
  orthopedic: "Orthopedic",
  cardiologist: "Cardiologist",
  psychiatrist: "Psychiatrist",
  dentist: "Dentist",
  ophthalmologist: "Eye Doctor",
};

export const SPECIALIST_ICONS: Record<SpecialistType, string> = {
  general_physician: "🩺",
  pediatrician: "👶",
  gynecologist: "🤰",
  dermatologist: "🧴",
  ent: "👂",
  orthopedic: "🦴",
  cardiologist: "❤️",
  psychiatrist: "🧠",
  dentist: "🦷",
  ophthalmologist: "👁️",
};

// ─── Multi-Turn Clarifying Questions ───────────────────
export interface ClarifyingQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface ClarifyingAnswer {
  questionId: string;
  question: string;
  answer: string;
}

// ─── Triage Result ─────────────────────────────────────
export interface TriageResult {
  detected_symptoms: string[];
  duration: string | null;
  urgency_level: UrgencyLevel;
  red_flag_triggered: boolean;
  recommended_specialist: SpecialistType;
  reasoning: string;
  disclaimer: string;
  visual_observations?: string[];
  clarifying_answers?: ClarifyingAnswer[];
  has_image?: boolean;
}

// ─── Clinic & Healthcare Facility ──────────────────────
export type FacilityCategory = "all" | "govt" | "ayushman" | "janaushadhi" | "private";

export interface Clinic {
  id: string | number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  phone: string | null;
  address: string | null;
  distance_km: number;
  is_govt?: boolean;
  is_ayushman_bharat?: boolean;
  is_janaushadhi?: boolean;
  facility_category?: FacilityCategory;
  pricing_note?: string;
}

// ─── Symptom Check Record (DB) ─────────────────────────
export interface SymptomCheck {
  id: string;
  user_id: string | null;
  transcript: string;
  language: Language;
  detected_symptoms: string[];
  duration: string | null;
  urgency_level: UrgencyLevel;
  recommended_specialist: SpecialistType;
  ai_reasoning: string;
  red_flag_triggered: boolean;
  created_at: string;
  image_url?: string | null;
  clarifying_qa?: ClarifyingAnswer[];
}
