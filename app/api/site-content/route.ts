import { NextResponse } from "next/server";
import { getSiteContent, updateSiteContent } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error("GET /api/site-content error:", error);
    return NextResponse.json({ error: "Failed to fetch site content." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { key, content } = await request.json();
    if (!key) {
      return NextResponse.json({ error: "Content key is required." }, { status: 400 });
    }

    const success = await updateSiteContent(key, content);
    if (!success) {
      return NextResponse.json({ error: "Failed to update site content." }, { status: 500 });
    }

    return NextResponse.json({ success: true, key, content });
  } catch (error) {
    console.error("PUT /api/site-content error:", error);
    return NextResponse.json({ error: "Failed to update site content." }, { status: 500 });
  }
}
