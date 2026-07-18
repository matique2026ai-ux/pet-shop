import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body.query; // AutoResponder sends message in "query" field
    const sender = body.sender; // AutoResponder sends sender ID/phone in "sender" field

    if (!text) {
      return NextResponse.json({ replies: [] });
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    // 1. Fetch products catalog from Supabase
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
      // Fallback message if Gemini API key is missing
      replyText = `مرحباً! شكراً لتواصلك مع متجر Paws & Wings. 🐾
لقد تلقينا رسالتك وسيتواصل معك أحد عملائنا يدوياً في أقرب وقت للإجابة على استفسارك.
يمكنك تصفح متجرنا مباشرة من الرابط التالي: https://pet-cat.vercel.app`;
    }

    return NextResponse.json({
      replies: [
        {
          message: replyText
        }
      ]
    });
  } catch (err) {
    console.error("Error in AutoResponder webhook POST:", err);
    return NextResponse.json({ replies: [{ message: "حدث خطأ أثناء معالجة الطلب." }] }, { status: 500 });
  }
}

async function askGemini(prompt: string, apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
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
