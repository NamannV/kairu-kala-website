import { NextResponse } from "next/server";
import { getCarouselSettings, updateCarouselSettings } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await getCarouselSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET /api/carousel-settings error:", error);
    return NextResponse.json({ error: "Failed to fetch carousel settings." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const body = await request.json();
    const updated = await updateCarouselSettings(body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/carousel-settings error:", error);
    return NextResponse.json({ error: "Failed to update carousel settings." }, { status: 500 });
  }
}
