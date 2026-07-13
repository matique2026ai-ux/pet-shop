import { NextResponse } from "next/server";

// Very small in-memory rate limiter. Note: serverless instances don't share
// memory, so this is defense-in-depth only (not a hard guarantee). Combine
// with a strong ADMIN_SECRET for real protection.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && rec.resetAt > now) {
    if (rec.count >= MAX_ATTEMPTS) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }
  } else {
    attempts.set(ip, { count: 0, resetAt: now + WINDOW_MS });
  }

  let body: { password?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const password = body.password || "";
  if (!process.env.ADMIN_SECRET || password !== process.env.ADMIN_SECRET) {
    const r = attempts.get(ip)!;
    r.count += 1;
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  attempts.delete(ip);
  return NextResponse.json({ ok: true, secret: process.env.ADMIN_SECRET });
}
