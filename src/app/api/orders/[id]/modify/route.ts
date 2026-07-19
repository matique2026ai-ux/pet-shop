import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

// POST /api/orders/[id]/modify — customer-initiated order modification (pending only)
// Allows switching delivery type: delivery ↔ pickup
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Verify user identity via Bearer token
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = authHeader.replace("Bearer ", "");
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user }, error: authError } = await anonClient.auth.getUser(accessToken);
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { delivery_type: "pickup" | "delivery" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!["pickup", "delivery"].includes(body.delivery_type)) {
    return NextResponse.json({ error: "Invalid delivery_type" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Fetch order and verify ownership
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, status, user_id, customer_phone, delivery_address, delivery_fee")
    .eq("id", id)
    .single();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.user_id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (order.status !== "pending") {
    return NextResponse.json(
      { error: "Only pending orders can be modified" },
      { status: 400 }
    );
  }

  // Build update payload based on delivery type
  const updates =
    body.delivery_type === "pickup"
      ? {
          delivery_fee: 0,
          delivery_area: "pickup",
          delivery_address: "استلام من المتجر - Retrait en magasin (Sétif, Cité elhidhab)",
          delivery_eta: "24h",
        }
      : {
          delivery_fee: 250,
          delivery_area: "setif",
          delivery_address: order.delivery_address?.startsWith("استلام")
            ? "" // Was pickup, address is gone — customer must re-place order for full address
            : order.delivery_address,
          delivery_eta: "24-48h",
        };

  const { data: updated, error: updateError } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json(updated);
}
