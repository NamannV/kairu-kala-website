import { NextResponse } from "next/server";
import { saveInquiry, getInquiries } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, phone, inquiry_type, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const saved = await saveInquiry({
      name,
      email,
      phone: phone || "",
      inquiry_type: inquiry_type || "General",
      message,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out to Kairu Kala. Your architectural inquiry has been recorded and our team will get in touch shortly.",
      inquiry: saved
    });
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry. Please try again." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }
    const inquiries = await getInquiries();
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json({ error: "Failed to retrieve inquiries." }, { status: 500 });
  }
}
