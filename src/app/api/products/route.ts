export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createAdminClient();
  const body = await request.json();

  if (typeof body.price !== "number" || !isFinite(body.price) || body.price < 0) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }
  if (body.badge !== undefined && body.badge !== null && !["NEW", "SALE"].includes(body.badge)) {
    return NextResponse.json({ error: "Invalid badge" }, { status: 400 });
  }

  const { data, error } = await supabase.from("products").insert([{ ...body, created_at: new Date().toISOString() }]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
