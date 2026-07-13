import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { products, categories } from "@/lib/data";

export async function POST(request: Request) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Ensure subcategories exist (upsert from data.ts)
  const subcatInserts = categories.flatMap((c) =>
    c.subcategories.map((s) => ({
      id: s.id,
      category_id: c.id,
      name: s.name,
    }))
  );

  for (const sc of subcatInserts) {
    await supabase.from("subcategories").upsert(sc, { onConflict: "id" });
  }

  // Delete existing products to avoid duplicates
  await supabase.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  // Insert all products from data.ts
  const mapped = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    subcategory: p.subcategory,
    price: p.price,
    original_price: p.originalPrice || null,
    image: p.image,
    badge: p.badge || null,
    rating: p.rating,
    reviews: p.reviews,
    description: p.description,
    features: p.features,
    in_stock: p.inStock,
  }));

  const { data, error } = await supabase.from("products").insert(mapped).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ inserted: data?.length ?? 0 });
}
