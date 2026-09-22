/**
 * Client-side red-flag emergency detection.
 * Runs BEFORE the Gemini API call — for life-threatening cases,
 * we skip AI nuance and go straight to the emergency screen.
 */

const RED_FLAGS = [
  // English
  "chest pain",
  "can't breathe",
  "cannot breathe",
  "difficulty breathing",
  "unconscious",
  "heavy bleeding",
  "severe bleeding",
  "face drooping",
  "slurred speech",
  "one side weak",
  "can't move one side",
  "cannot move one side",
  "severe burn",
  "severe burns",
  "poisoning",
  "seizure",
  "fits",
  "heart attack",
  "stroke",
  "severe allergic reaction",
  "anaphylaxis",
  // Hindi transliterations
  "seene mein dard",
  "saans nahi aa rahi",
  "behosh",
  "bahut khoon",
  "jal gaya",
  "zehar",
  "dil ka daura",
  "daura pad raha",
  // Kannada transliterations
  "edeya novu",
  "ushiratake",
  "prajna illade",
  "rakthasrava",
];

export function checkEmergency(transcript: string): boolean {
  const lower = transcript.toLowerCase();
  return RED_FLAGS.some((flag) => lower.includes(flag));
}

export { RED_FLAGS };
