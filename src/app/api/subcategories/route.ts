import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: Request) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) return unauthorized();
  const supabase = createAdminClient();
  const body = await request.json();
  if (!body.id || !body.category_id || !body.name)
    return NextResponse.json({ error: "id, category_id and name are required" }, { status: 400 });
  const { data, error } = await supabase
    .from("subcategories")
    .insert([{ id: String(body.id), category_id: String(body.category_id), name: String(body.name) }])
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
    .from("subcategories")
    .update({ category_id: body.category_id, name: body.name })
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
  const { error } = await supabase.from("subcategories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
