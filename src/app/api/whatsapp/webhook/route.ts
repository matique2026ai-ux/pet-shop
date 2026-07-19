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
    // Ignore messages from other autoresponders/bots to prevent infinite loops
    const isBot = 
      lowerText.includes("réponse automatique") || 
      lowerText.includes("reponse automatique") ||
      lowerText.includes("réponse") ||
      lowerText.includes("reponse") ||
      lowerText.includes("automatic reply") ||
      lowerText.includes("autoresponder") ||
      lowerText.includes("الرد الآلي") ||
      lowerText.includes("الرد التلقائي") ||
      lowerText.includes("bot");

    if (isBot) {
      return NextResponse.json({ success: true });
    }

    // Retrieve system settings
    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const geminiKey = process.env.GEMINI_API_KEY;

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

    const catalogContext = products
      ? products
          .map((p) => `- ${p.name} (Category: ${p.category}): Price ${p.price} DZD. Description: ${p.description || "N/A"}`)
          .join("\n")
      : "No products available in stock.";

    // 2. Prepare System Prompt for Gemini
    const systemPrompt = `You are a helpful and friendly AI assistant for "Paws & Wings", a pet shop in Algeria (Sétif). 
Your task is to answer customers' questions about our store, catalog, products, prices, and stock.
You must speak in Algerian Darja (الدارجة الجزائرية) or French/Arabic, depending on the customer's language. Keep answers concise, helpful, and polite.

Here is our current in-stock catalog:
${catalogContext}

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
      } catch (err) {
        console.error("Gemini API Error:", err);
        replyText = "مرحباً! شكراً لتواصلك معنا. نحن نواجه عطلاً مؤقتاً في نظام الذكاء الاصطناعي، سنتواصل معك يدوياً قريباً.";
      }
    } else {
      // Fallback response if Gemini key is not configured
      replyText = `مرحباً! شكراً لتواصلك مع متجر Paws & Wings. 🐾
لقد تلقينا رسالتك وسيتواصل معك أحد عملائنا يدوياً في أقرب وقت للإجابة على استفسارك.
يمكنك تصفح متجرنا مباشرة من الرابط التالي: https://pawsandwings.com`;
    }

    // 4. Send the message back via WhatsApp Cloud API
    await sendWhatsAppMessage(sender, replyText, phoneId, token);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in WhatsApp webhook POST:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// Helper: Fetch Gemini API
async function askGemini(prompt: string, apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${errorText}`);
  }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I am having trouble answering right now.";
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
