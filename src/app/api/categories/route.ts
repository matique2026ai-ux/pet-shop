import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createClient();
  const { data: categories, error } = await supabase.from("categories").select("*").order("order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: subcategories } = await supabase.from("subcategories").select("*");
  const catsWithSubs = categories.map((cat: any) => ({
    ...cat,
    subcategories: subcategories?.filter((s: any) => s.category_id === cat.id) || [],
  }));

  return NextResponse.json(catsWithSubs);
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: Request) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) return unauthorized();
  const supabase = createAdminClient();
  const body = await request.json();
  if (!body.id || !body.name) return NextResponse.json({ error: "id and name are required" }, { status: 400 });
  const { data, error } = await supabase
    .from("categories")
    .insert([{
      id: String(body.id),
      name: String(body.name),
      icon: body.icon || "paw-print",
      order: Number(body.order) || 0,
      image_url: body.image_url || ""
    }])
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) return unauthorized();
  const supabase = createAdminClient();
  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const { data, error } = await supabase
    .from("categories")
    .update({ name: body.name, icon: body.icon, order: Number(body.order) || 0, image_url: body.image_url })
    .eq("id", body.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) return unauthorized();
  const supabase = createAdminClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
