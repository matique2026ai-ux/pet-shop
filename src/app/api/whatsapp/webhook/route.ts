import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

// WhatsApp webhook verification (GET)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "PawsWingsSecret2026";

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      return new NextResponse(challenge, { status: 200 });
    }
    return new NextResponse("Forbidden", { status: 403 });
  }
  return new NextResponse("Bad Request", { status: 400 });
}

// Receive and reply to WhatsApp messages (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if this is a WhatsApp message status update or actual message
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) {
      // Return 200 for status updates or read receipts to prevent Meta retries
      return NextResponse.json({ success: true });
    }

    const sender = message.from; // Phone number of the user
    const text = message.text?.body; // Message content

    if (!text) {
      return NextResponse.json({ success: true });
    }

    const lowerText = text.toLowerCase();
    // Ignore messages from other autoresponders/bots to prevent infinite loops (avoid single word false positives)
    const isBot = 
      lowerText.includes("réponse automatique") || 
      lowerText.includes("reponse automatique") ||
      lowerText.includes("automatic reply") ||
      lowerText.includes("autoresponder") ||
      lowerText.includes("الرد الآلي") ||
      lowerText.includes("الرد التلقائي");

    if (isBot) {
      return NextResponse.json({ success: true });
    }

    // Retrieve system settings
    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const geminiKey = 
      process.env.GEMINI_API_KEY || 
      process.env.GEMINI_KEY || 
      process.env.GOOGLE_API_KEY || 
      process.env.GOOGLE_GEMINI_KEY;

    if (!token || !phoneId) {
      console.error("WhatsApp credentials not set in environment.");
      return NextResponse.json({ error: "Missing WhatsApp credentials" }, { status: 500 });
    }

    // 1. Fetch products catalog from Supabase to feed into AI context
    const supabase = createAdminClient();
    const { data: products } = await supabase
      .from("products")
      .select("id, name, price, description, in_stock, category")
      .eq("in_stock", true);

    const origin = req.nextUrl.origin;

    const catalogContext = products
      ? products.map((p) => `- Name: ${p.name}\n  Category: ${p.category}\n  Price: ${p.price} DZD\n  Description: ${p.description || "N/A"}\n  Link: ${origin}/products/${encodeURIComponent(p.category || "all")}/${p.id}`).join("\n\n")
      : "No products available in stock.";

    // Fetch customer's recent orders for tracking
    let ordersContext = "No recent orders found for this phone number.";
    try {
      // Extract short order ID from text if customer mentions e.g. #A1B2C3 or order ID
      const orderCodeMatch = text.match(/#([A-Za-z0-9]{6})/i) || text.match(/\b([A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12})\b/i);
      const extractedCode = orderCodeMatch ? orderCodeMatch[1] : null;

      const digitsOnly = (sender || "").replace(/\D/g, "");
      let localFormat = digitsOnly;
      if (digitsOnly.startsWith("213")) {
        localFormat = "0" + digitsOnly.slice(3);
      }
      const phoneFilters = [
        sender ? `customer_phone.eq."${sender}"` : null,
        digitsOnly ? `customer_phone.eq."${digitsOnly}"` : null,
        localFormat ? `customer_phone.eq."${localFormat}"` : null,
        digitsOnly.length >= 9 ? `customer_phone.ilike."%${digitsOnly.slice(-9)}%"` : null,
      ].filter(Boolean).join(",");

      let query = supabase.from("orders").select("id, customer_name, status, total, items, notes, created_at");

      if (extractedCode) {
        query = query.or(`id.eq."${extractedCode}",id.ilike."%${extractedCode}"`);
      } else if (phoneFilters) {
        query = query.or(phoneFilters);
      }

      const { data: customerOrders } = await query.order("created_at", { ascending: false }).limit(5);

      if (customerOrders && customerOrders.length > 0) {
        ordersContext = customerOrders.map(o => {
          const dateStr = new Date(o.created_at).toLocaleDateString("fr-FR");
          const shortId = o.id ? String(o.id).slice(-6).toUpperCase() : "N/A";
          const itemsList = Array.isArray(o.items) 
            ? o.items.map((it: any) => `${it.name} (Qty: ${it.quantity || 1})`).join(", ")
            : "N/A";
          return `- Order #${shortId} (ID: ${o.id})\n  Customer: ${o.customer_name}\n  Date: ${dateStr}\n  Status: ${o.status}\n  Total: ${o.total} DZD\n  Items: ${itemsList}\n  Notes: ${o.notes || "N/A"}`;
        }).join("\n\n");
      }
    } catch (err) {
      console.error("Error fetching customer orders for tracking in webhook:", err);
    }

    // 2. Prepare System Prompt for Gemini
    const systemPrompt = `You are a helpful and friendly AI assistant for "Paws & Wings", a pet shop in Algeria (Sétif). 
Your task is to answer customers' questions about our store, catalog, products, prices, stock, delivery, and their order status.
You must speak in Algerian Darja (الدارجة الجزائرية) or French/Arabic, depending on the customer's language. Keep answers concise, helpful, and polite.

CRITICAL RULE FOR LINKS IN WHATSAPP:
DO NOT format URLs as Markdown links like [product name](https://...) or [https://...](https://...).
ALWAYS output URLs as clean, raw plain text without any square brackets or parentheses (e.g. https://pet-cat.vercel.app/products/cats/c1).
WhatsApp does NOT support markdown links, and using brackets [] or () around links will corrupt the URL and cause a 404 error!

When recommending or discussing any specific product, you MUST include its direct Link (from the Link field in the catalog context below) in your response so the customer can view the product images and make a purchase.

If the customer asks about their order status or queries "تتبع طلبيتي" or similar, use the "Recent Orders for this Customer" section below to track it. Explain their order status clearly, translate the status into a friendly Darja explanation, and reassure them.

Here is our current in-stock catalog:
${catalogContext}

Recent Orders for this Customer (${sender || "N/A"}):
${ordersContext}

Our Store Info:
- Store Name: طيور الجمال والجواد (Paws & Wings)
- Location: Sétif, Algeria (Cité elhidhab)
- Delivery: Delivery is available in Sétif for 250 DZD (Free for orders above 5000 DZD). Delivery takes 24-48h.

Customer message: "${text}"
Answer directly and politely in their language:`;

    // 3. Request answer from Gemini
    let replyText = "";
    if (geminiKey) {
      try {
        replyText = await askGemini(systemPrompt, geminiKey);
        replyText = cleanWhatsAppLinks(replyText);
      } catch (err) {
        console.error("Gemini API Error:", err);
        replyText = "مرحباً! شكراً لتواصلك معنا. نحن نواجه عطلاً مؤقتاً في نظام الذكاء الاصطناعي، سنتواصل معك يدوياً قريباً.";
      }
    } else {
      // Fallback response if Gemini key is not configured
      replyText = `مرحباً! شكراً لتواصلك مع متجر Paws & Wings. 🐾
لقد تلقينا رسالتك وسيتواصل معك أحد عملائنا يدوياً في أقرب وقت للإجابة على استفسارك.
يمكنك تصفح متجرنا مباشرة من الرابط التالي: ${origin}`;
    }

    replyText = cleanWhatsAppLinks(replyText);

    // 4. Send the message back via WhatsApp Cloud API
    await sendWhatsAppMessage(sender, replyText, phoneId, token);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in WhatsApp webhook POST:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

function cleanWhatsAppLinks(text: string): string {
  if (!text) return "";
  // 1. Convert markdown links [text](http://...) or [http://...](http://...) into plain http://...
  let cleaned = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g, (_match, _label, url) => url);
  // 2. Strip brackets around URLs e.g. [https://...] or (https://...)
  cleaned = cleaned.replace(/[\(\[]\s*(https?:\/\/[^\s\]\)]+)\s*[\)\]]/g, "$1");
  return cleaned;
}

// Helper: Fetch Gemini API
async function askGemini(prompt: string, apiKey: string): Promise<string> {
  const models = [
    "gemini-3.5-flash-lite",
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash-001",
    "gemini-2.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-2.0-flash"
  ];
  let lastError: Error | null = null;
  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });
        if (response.ok) {
          const data = await response.json();
          const resText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (resText) return resText;
        } else {
          const errorText = await response.text();
          console.error(`Gemini model ${model} (attempt ${attempt + 1}) error ${response.status}:`, errorText);
          if (response.status === 503 || response.status === 429) {
            await new Promise((r) => setTimeout(r, 300));
            continue;
          }
          break;
        }
      } catch (err) {
        lastError = err as Error;
        await new Promise((r) => setTimeout(r, 300));
      }
    }
  }
  throw lastError || new Error("All Gemini models failed");
}

// Helper: Send WhatsApp Message
async function sendWhatsAppMessage(to: string, text: string, phoneId: string, token: string) {
  const url = `https://graph.facebook.com/v20.0/${phoneId}/messages`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: {
        body: text,
      },
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    console.error("Error sending WhatsApp message:", err);
  }
}
