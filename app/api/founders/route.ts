import { NextResponse } from "next/server";
import { getFounders, saveFounder } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const founders = await getFounders();
    return NextResponse.json(founders);
  } catch (error) {
    console.error("GET /api/founders error:", error);
    return NextResponse.json({ error: "Failed to fetch founders." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: "Founder name is required." }, { status: 400 });
    }

    const saved = await saveFounder(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("POST /api/founders error:", error);
    return NextResponse.json({ error: "Failed to save founder." }, { status: 500 });
  }
}
