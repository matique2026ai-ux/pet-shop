import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

async function syncProductStats(supabase: any, productId: string) {
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("status", "approved");

  if (error) {
    console.error("Error fetching reviews for sync:", error);
    return;
  }

  const reviewsCount = reviews?.length ?? 0;
  let averageRating = 0;
  if (reviewsCount > 0) {
    const sum = reviews.reduce((acc: number, r: any) => acc + Number(r.rating || 0), 0);
    averageRating = Number((sum / reviewsCount).toFixed(1));
  } else {
    averageRating = 0;
  }

  const { error: updateError } = await supabase
    .from("products")
    .update({
      rating: averageRating,
      reviews: reviewsCount,
    })
    .eq("id", productId);

  if (updateError) {
    console.error("Error updating product stats:", updateError);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const status = body.status;
  if (!["pending", "approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const supabase = createAdminClient();

  const { data: reviewInfo } = await supabase.from("reviews").select("product_id").eq("id", id).single();

  const { data, error } = await supabase.from("reviews").update({ status }).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (reviewInfo?.product_id) {
    await syncProductStats(supabase, reviewInfo.product_id);
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: reviewInfo } = await supabase.from("reviews").select("product_id").eq("id", id).single();

  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (reviewInfo?.product_id) {
    await syncProductStats(supabase, reviewInfo.product_id);
  }

  return NextResponse.json({ success: true });
}
