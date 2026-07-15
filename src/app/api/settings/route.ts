import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";

// Public read (storefront needs store settings, e.g. footer/contact).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const supabase = createAdminClient();
  if (key) {
    const { data, error } = await supabase.from("site_settings").select("value").eq("key", key).single();
    if (error) return NextResponse.json({ value: null });
    return NextResponse.json({ value: data?.value ?? null });
  }
  const { data, error } = await supabase.from("site_settings").select("key, value");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const map: Record<string, any> = {};
  for (const row of data || []) map[row.key] = row.value;
  return NextResponse.json(map);
}

export async function PUT(request: Request) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createAdminClient();
  const body = await request.json();
  if (!body.key || body.value === undefined) {
    return NextResponse.json({ error: "key and value are required" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("site_settings")
    .upsert({ key: String(body.key), value: body.value, updated_at: new Date().toISOString() }, { onConflict: "key" })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
