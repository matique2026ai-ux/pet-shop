import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

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
