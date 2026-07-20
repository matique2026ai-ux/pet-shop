export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(request: Request) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const products = await request.json();

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "Expected an array of products" }, { status: 400 });
    }

    // Process and validate each product
    const timestamp = new Date().toISOString();
    const validProducts = products.map((p: any) => {
      // Validate basic numbers to prevent database constraint errors
      const price = typeof p.price === "number" && isFinite(p.price) && p.price >= 0 ? p.price : 0;
      const original_price = typeof p.original_price === "number" ? p.original_price : null;
      const rating = typeof p.rating === "number" ? p.rating : 4.5;
      const reviews = typeof p.reviews === "number" ? p.reviews : 0;
      const stock_quantity = typeof p.stock_quantity === "number" ? p.stock_quantity : 0;
      const badge = p.badge && ["NEW", "SALE"].includes(p.badge) ? p.badge : null;

      // Make sure features and variants are proper arrays or JSON
      const features = Array.isArray(p.features) ? p.features : [];
      const variants = Array.isArray(p.variants) ? p.variants : [];
      const images = Array.isArray(p.images) ? p.images : [];

      return {
        ...p,
        price,
        original_price,
        rating,
        reviews,
        stock_quantity,
        badge,
        features,
        variants,
        images,
        created_at: p.created_at || timestamp,
        updated_at: timestamp
      };
    });

    // Upsert products to Supabase (onConflict: 'id')
    const { data, error } = await supabase
      .from("products")
      .upsert(validProducts, { onConflict: "id" })
      .select();

    if (error) {
      console.error("Bulk Import Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: data.length, data });
  } catch (err: any) {
    console.error("Bulk Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
