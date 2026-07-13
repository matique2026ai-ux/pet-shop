import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: { password?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const password = body.password || "";
  if (!process.env.ADMIN_SECRET || password !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, secret: process.env.ADMIN_SECRET });
}
