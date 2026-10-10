import { NextResponse } from "next/server";
import { getProjects, saveProject } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    const featured = searchParams.get("featured") === "true";

    // If 'all' is requested, verify if admin, otherwise only return published
    const authed = await isAuthenticated();
    const onlyPublished = !(all && authed);

    const projects = await getProjects({
      onlyPublished,
      featuredOnly: featured,
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ error: "Project title is required." }, { status: 400 });
    }

    // Auto-generate slug if not provided
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const saved = await saveProject(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
  }
}
