import { triageSymptoms } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";
import { ClarifyingAnswer } from "@/types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const {
      transcript,
      language,
      imageBase64,
      imageMimeType,
      clarifyingAnswers,
    } = await req.json();

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    // Security validation: Check image payload size
    if (imageBase64 && typeof imageBase64 === "string" && imageBase64.length > 7 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image size exceeds allowed limit (5MB)" },
        { status: 413 }
      );
    }

    // Call Gemini 3.6 Flash multimodal triage
    const triageResult = await triageSymptoms(
      transcript,
      language || "en",
      imageBase64,
      imageMimeType,
      clarifyingAnswers as ClarifyingAnswer[]
    );

    // Attach client context to result
    const enrichedResult = {
      ...triageResult,
      has_image: !!imageBase64,
      clarifying_answers: clarifyingAnswers || [],
    };

    // Record to Supabase asynchronously
    try {
      const supabase = createClient();
      const { error: insertErr } = await supabase.from("symptom_checks").insert({
        transcript,
        language: language || "en",
        detected_symptoms: triageResult.detected_symptoms,
        duration: triageResult.duration,
        urgency_level: triageResult.urgency_level,
        recommended_specialist: triageResult.recommended_specialist,
        ai_reasoning: triageResult.reasoning,
        red_flag_triggered: triageResult.red_flag_triggered || false,
        has_image: !!imageBase64,
        clarifying_qa: clarifyingAnswers || [],
      });
      if (insertErr) {
        console.warn("Supabase logging notice:", insertErr.message);
      }
    } catch (dbErr) {
      console.warn("Supabase connection note:", dbErr);
    }

    return NextResponse.json(enrichedResult);
  } catch (error) {
    console.error("Triage API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze symptoms",
      },
      { status: 500 }
    );
  }
}
