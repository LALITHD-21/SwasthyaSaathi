import type { TriageResult } from "@/types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generate a doctor-ready PDF summary card.
 * Runs client-side only.
 */
export function generateSummaryPDF(
  triageResult: TriageResult,
  transcript: string,
  language: string,
  imageThumbnailBase64?: string
): void {
  const doc = new jsPDF();

  const urgencyColors: Record<string, [number, number, number]> = {
    mild: [34, 197, 94],
    moderate: [245, 158, 11],
    urgent: [239, 68, 68],
  };

  // Header Branding
  doc.setFontSize(22);
  doc.setTextColor(2, 132, 199);
  doc.text("SwasthyaSaathi", 14, 18);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Clinical Pre-Consultation Summary Card (AI-Assisted)", 14, 25);
  doc.text(
    `Date & Time: ${new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    })} | Lang: ${language.toUpperCase()}`,
    14,
    31
  );

  // Divider line
  doc.setDrawColor(2, 132, 199);
  doc.setLineWidth(0.5);
  doc.line(14, 35, 196, 35);

  // Urgency badge
  const urgencyColor = urgencyColors[triageResult.urgency_level] || [100, 100, 100];
  doc.setFillColor(...urgencyColor);
  doc.roundedRect(14, 40, 56, 9, 2, 2, "F");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`URGENCY: ${triageResult.urgency_level.toUpperCase()}`, 17, 46.5);

  // Patient transcript
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text("Patient's Description (Reported Symptoms):", 14, 57);
  doc.setFontSize(9.5);
  doc.setTextColor(60);
  const splitTranscript = doc.splitTextToSize(`"${transcript}"`, 170);
  doc.text(splitTranscript, 14, 63);

  const transcriptEndY = 63 + splitTranscript.length * 5;

  // Build Table Rows
  const tableRows: string[][] = [
    ["Detected Symptoms", triageResult.detected_symptoms.join(", ")],
    ["Reported Duration", triageResult.duration || "Not specified"],
    ["Triage Urgency Level", triageResult.urgency_level.toUpperCase()],
    ["Recommended Specialist", triageResult.recommended_specialist.replace(/_/g, " ").toUpperCase()],
  ];

  if (triageResult.visual_observations && triageResult.visual_observations.length > 0) {
    tableRows.push(["Visual AI Observations", triageResult.visual_observations.join("; ")]);
  }

  if (triageResult.clarifying_answers && triageResult.clarifying_answers.length > 0) {
    const qaFormatted = triageResult.clarifying_answers
      .map((qa) => `${qa.question} -> ${qa.answer}`)
      .join("\n");
    tableRows.push(["Patient Clarifications", qaFormatted]);
  }

  // Symptoms table
  autoTable(doc, {
    startY: transcriptEndY + 4,
    head: [["Assessment Field", "Clinical Observation"]],
    body: tableRows,
    theme: "striped",
    headStyles: { fillColor: [2, 132, 199], textColor: [255, 255, 255] },
    styles: { fontSize: 9.5, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
    },
  });

  // Reasoning
  const finalY = (doc as any).lastAutoTable?.finalY || transcriptEndY + 60;

  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text("AI Triage Rationale for Doctor:", 14, finalY + 8);
  doc.setFontSize(9.5);
  doc.setTextColor(60);
  const splitReasoning = doc.splitTextToSize(triageResult.reasoning, 175);
  doc.text(splitReasoning, 14, finalY + 14);

  // Disclaimer footer
  const disclaimerY = Math.min(finalY + 14 + splitReasoning.length * 5 + 8, 275);
  doc.setDrawColor(220, 220, 220);
  doc.line(14, disclaimerY, 196, disclaimerY);

  doc.setFontSize(8);
  doc.setTextColor(140);
  const splitDisclaimer = doc.splitTextToSize(
    `Important Medical Disclaimer: ${triageResult.disclaimer} SwasthyaSaathi is an AI symptom triage tool and does not provide formal medical diagnoses or prescriptions.`,
    175
  );
  doc.text(splitDisclaimer, 14, disclaimerY + 5);

  // Save PDF
  doc.save(`SwasthyaSaathi-Doctor-Summary-${Date.now()}.pdf`);
}
