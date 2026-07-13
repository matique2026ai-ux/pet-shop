import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { products } from "@/lib/data";

export async function POST(request: Request) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient();

  const mapped = products.map((p) => ({
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
    features: JSON.stringify(p.features),
    in_stock: p.inStock,
  }));

  const { data, error } = await supabase.from("products").insert(mapped).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ inserted: data?.length ?? 0 });
}
