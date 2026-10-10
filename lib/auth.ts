import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@kairukala.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kairukala2026";
const AUTH_SECRET = process.env.AUTH_SECRET || "kairu-kala-architectural-studio-secret-key-2026";
const COOKIE_NAME = "kairu_admin_session";

// Sign session token
export function signSession(email: string): string {
  const payload = JSON.stringify({
    email,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days
  });
  const encodedPayload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

// Verify session token
export function verifySession(token: string): { email: string } | null {
  try {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(encodedPayload)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8"));
    if (payload.exp && payload.exp < Date.now()) return null;

    return { email: payload.email };
  } catch {
    return null;
  }
}

// Authenticate admin credentials
export function validateCredentials(email: string, pass: string): boolean {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && pass === ADMIN_PASSWORD;
}

// Check if current server request is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (!sessionCookie?.value) return false;
    return !!verifySession(sessionCookie.value);
  } catch {
    return false;
  }
}

export { COOKIE_NAME, ADMIN_EMAIL };
