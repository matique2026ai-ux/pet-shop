import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase";
import { sendBrevoEmail, getOrderReceiptEmailHtml } from "@/lib/brevo-email";

export async function GET(request: Request) {
  if (request.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const MAX = 500;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(body.customer_name);
  const phone = str(body.customer_phone);
  const address = str(body.delivery_address);
  const email = str(body.customer_email);

  if (!name || !phone || !address || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (name.length > MAX || phone.length > MAX || address.length > 2000 || email.length > MAX) {
    return NextResponse.json({ error: "Field too long" }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (body.items.length > 100) {
    return NextResponse.json({ error: "Too many items" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .insert([{
      customer_name: name,
      customer_phone: phone,
      customer_email: email || null,
      delivery_address: address,
      city: str(body.city) || null,
      delivery_area: str(body.delivery_area) || null,
      delivery_fee: Number(body.delivery_fee) || 0,
      delivery_eta: str(body.delivery_eta) || null,
      items: body.items,
      total: Number(body.total) || 0,
      notes: str(body.notes).slice(0, MAX) || null,
      user_id: body.user_id || null,
      status: "pending",
    }])
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Asynchronously send order receipt via Brevo if email is available
  if (email && data) {
    const orderRef = (data.id || "").slice(-6).toUpperCase();
    sendBrevoEmail({
      toEmail: email,
      toName: name,
      subject: `تأكيد طلبية #${orderRef} | مخالب وأجنحة`,
      htmlContent: getOrderReceiptEmailHtml(data, "ar"),
    }).catch((e) => console.error("Async Brevo order email error:", e));
  }

  return NextResponse.json(data);
}
