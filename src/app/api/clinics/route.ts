import { searchNearbyClinics } from "@/lib/clinics";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "");
    const lng = parseFloat(searchParams.get("lng") || "");
    const specialist = searchParams.get("specialist") || "general_physician";
    const radius = parseInt(searchParams.get("radius") || "5000");

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: "Valid lat and lng are required" },
        { status: 400 }
      );
    }

    const clinics = await searchNearbyClinics(lat, lng, specialist, radius);

    return NextResponse.json({ clinics });
  } catch (error) {
    console.error("Clinics API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to search clinics",
      },
      { status: 500 }
    );
  }
}
