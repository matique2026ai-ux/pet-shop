import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET(request: Request) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createClient();
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = createClient();
  const body = await request.json();
  const { data, error } = await supabase.from("orders").insert([{ ...body, status: "pending" }]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
