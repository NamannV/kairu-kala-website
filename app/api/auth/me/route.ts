import { NextResponse } from "next/server";
import { isAuthenticated, ADMIN_EMAIL } from "@/lib/auth";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, email: ADMIN_EMAIL });
}
