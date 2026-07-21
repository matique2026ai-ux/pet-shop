import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

// POST /api/orders/[id]/cancel — customer-initiated order cancellation
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Fetch the order using admin client first
  const supabase = createAdminClient();
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, status, user_id, customer_phone")
    .eq("id", id)
    .single();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Verify user identity via Bearer token if present
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const accessToken = authHeader.replace("Bearer ", "");
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user } } = await anonClient.auth.getUser(accessToken);

    // If order has a user_id, ensure it matches the authenticated user
    if (order.user_id && user && order.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Only pending orders can be cancelled
  if (order.status !== "pending") {
    return NextResponse.json(
      { error: "Only pending orders can be cancelled" },
      { status: 400 }
    );
  }

  // Cancel the order
  const { data: updated, error: updateError } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Send WhatsApp notification to customer
  if (order.customer_phone) {
    const { sendOrderStatusNotification } = await import("@/lib/whatsapp-notify");
    sendOrderStatusNotification(order.customer_phone, id, "cancelled").catch(() => {});
  }

  return NextResponse.json(updated);
}
