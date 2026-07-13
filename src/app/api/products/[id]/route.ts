import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient();
  const { id } = await params;
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createAdminClient();
  const { id } = await params;
  const body = await request.json();

  if (body.price !== undefined && (typeof body.price !== "number" || !isFinite(body.price) || body.price < 0)) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }
  if (body.badge !== undefined && body.badge !== null && !["NEW", "SALE"].includes(body.badge)) {
    return NextResponse.json({ error: "Invalid badge" }, { status: 400 });
  }

  const { data, error } = await supabase.from("products").update({ ...body, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createAdminClient();
  const { id } = await params;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
