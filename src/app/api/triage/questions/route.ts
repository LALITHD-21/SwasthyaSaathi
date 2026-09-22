import { generateFollowUpQuestions } from "@/lib/gemini";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { transcript, language, imageBase64, imageMimeType } = await req.json();

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    // Security guard: Validate image size if provided
    if (imageBase64 && imageBase64.length > 7 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image exceeds 5MB limit" },
        { status: 413 }
      );
    }

    const questions = await generateFollowUpQuestions(
      transcript,
      language || "en",
      imageBase64,
      imageMimeType
    );

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Questions generation error:", error);
    return NextResponse.json({ questions: [] });
  }
}
