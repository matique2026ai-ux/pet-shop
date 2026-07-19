import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let body: any = {};
    
    try {
      if (contentType.includes("application/json")) {
        body = await req.json();
      } else {
        const rawText = await req.text();
        if (contentType.includes("application/x-www-form-urlencoded")) {
          const params = new URLSearchParams(rawText);
          body = {};
          params.forEach((value, key) => {
            body[key] = value;
          });
        } else {
          try {
            body = JSON.parse(rawText);
          } catch {
            const params = new URLSearchParams(rawText);
            body = {};
            params.forEach((value, key) => {
              body[key] = value;
            });
          }
        }
      }
    } catch (err) {
      console.error("Body parsing error:", err);
      body = {};
    }

    const queryVal = body.query || body.message || body.msg || body.text || body.body;
    const text = (queryVal !== undefined && queryVal !== null ? String(queryVal) : "").toLowerCase().trim();

    // Ignore messages from other autoresponders/bots to prevent infinite loops
    const isBot = 
      text.includes("réponse automatique") || 
      text.includes("reponse automatique") ||
      text.includes("réponse") ||
      text.includes("reponse") ||
      text.includes("automatic reply") ||
      text.includes("autoresponder") ||
      text.includes("الرد الآلي") ||
      text.includes("الرد التلقائي") ||
      text.includes("bot");

    // 1. Fetch products catalog from Supabase
    const supabase = createAdminClient();

    if (!text || isBot) {
      await logRequest(supabase, {
        contentType,
        body,
        queryVal,
        text,
        userAgent: req.headers.get("user-agent"),
        ip: req.headers.get("x-forwarded-for"),
        ignored: true,
        reason: !text ? "empty query" : "detected bot/autoresponder"
      });
      return NextResponse.json({ replies: [] });
    }

    const { data: products } = await supabase
      .from("products")
      .select("id, name, price, description, in_stock, category")
      .eq("in_stock", true);

    const hasProducts = products && products.length > 0;

    // 2. Local smart keyword matching (No API key needed!)
    let replyText = "";

    const isArabic = /[\u0600-\u06FF]/.test(text);

    // Keyword detection
    const wantsDelivery = text.includes("delivery") || text.includes("tousil") || text.includes("toussil") || text.includes("livraison") || text.includes("توصيل") || text.includes("بكم التوصيل") || text.includes("شحن");
    const wantsProducts = text.includes("product") || text.includes("produit") || text.includes("catalog") || text.includes("price") || text.includes("prix") || text.includes("أكل") || text.includes("طعام") || text.includes("منتج") || text.includes("سعر") || text.includes("سومة") || text.includes("عندكم") || text.includes("متوفر");
    const isGreeting = text.includes("hello") || text.includes("hi") || text.includes("bonjour") || text.includes("سلام") || text.includes("مرحبا") || text.includes("صباح الخير") || text.includes("مساء الخير");

    if (wantsDelivery) {
      replyText = isArabic 
        ? "🚚 خدمات التوصيل لدينا:\n- التوصيل متوفر في ولاية سطيف بـ 250 د.ج.\n- التوصيل مجاني تماماً للطلبات التي تفوق 5000 د.ج!\n- مدة التوصيل بين 24 إلى 48 ساعة."
        : "🚚 Nos services de livraison :\n- Livraison disponible à Sétif pour 250 DZD.\n- Livraison gratuite pour toute commande supérieure à 5000 DZD !\n- Délai de livraison : 24 à 48 heures.";
    } else if (wantsProducts) {
      if (hasProducts) {
        const list = products.map(p => `- ${p.name}: ${p.price} DZD`).join("\n");
        replyText = isArabic
          ? `🐾 المنتجات المتوفرة حالياً في متجرنا:\n\n${list}\n\nلطلب أي منتج أو الاستفسار، يمكنك كتابة اسمه هنا وسنتواصل معك!`
          : `🐾 Produits actuellement disponibles en magasin :\n\n${list}\n\nPour commander ou demander des détails, écrivez simplement le nom du produit ici !`;
      } else {
        replyText = isArabic
          ? "مرحباً! عذراً، لا توجد منتجات متوفرة في المخزن حالياً. سنقوم بتحديث المخزن قريباً."
          : "Bonjour ! Désolé, aucun produit n'est actuellement disponible en stock. Nous mettrons à jour le stock très bientôt.";
      }
    } else if (isGreeting) {
      if (hasProducts) {
        const list = products.slice(0, 5).map(p => `- ${p.name}: ${p.price} DZD`).join("\n");
        replyText = isArabic
          ? `مرحباً بك في متجر طيور الجمال والجواد (Paws & Wings)! 🐾✨\nكيف يمكنني مساعدتك اليوم؟\n\nبعض منتجاتنا المتوفرة حالياً:\n${list}\n\n- اكتب "توصيل" لمعرفة معلومات الشحن.\n- اكتب "منتجات" لعرض القائمة الكاملة.`
          : `Bienvenue chez Paws & Wings (طيور الجمال والجواد) ! 🐾✨\nComment puis-je vous aider aujourd'hui ?\n\nQuelques produits disponibles :\n${list}\n\n- Écrivez "livraison" pour les infos de livraison.\n- Écrivez "produits" pour voir tout le catalogue.`;
      } else {
        replyText = isArabic
          ? "مرحباً بك في متجر طيور الجمال والجواد (Paws & Wings)! 🐾 كيف يمكنني مساعدتك اليوم؟"
          : "Bienvenue chez Paws & Wings ! 🐾 Comment puis-je vous aider aujourd'hui ?";
      }
    } else {
      // Default fallback using Gemini if key exists, otherwise local fallback
      const geminiKey = process.env.GEMINI_API_KEY;
      if (geminiKey) {
        try {
          const catalogContext = products
            ? products.map((p) => `- ${p.name} (${p.category}): ${p.price} DZD.`).join("\n")
            : "No products in stock.";
          const systemPrompt = `You are a helpful AI assistant for Paws & Wings pet shop in Sétif, Algeria. Answer directly in Algerian Darja/Arabic/French.
In-stock products:\n${catalogContext}\nCustomer message: "${text}"`;
          replyText = await askGemini(systemPrompt, geminiKey);
        } catch (err) {
          console.error("Gemini fallback error:", err);
          replyText = isArabic 
            ? "شكراً لتواصلك معنا! سنقوم بالرد عليك يدوياً في أقرب وقت ممكن. 🐾"
            : "Merci pour votre message ! Nous vous répondrons manuellement très bientôt. 🐾";
        }
      } else {
        replyText = isArabic
          ? "شكراً لتواصلك مع متجر طيور الجمال والجواد! 🐾\nرسالتك وصلت وسيقوم أحد عملائنا بالرد عليك يدوياً في أقرب وقت.\nاكتب 'منتجات' لرؤية ما هو متوفر حالياً في المخزن."
          : "Merci de contacter Paws & Wings ! 🐾\nVotre message a été reçu, un conseiller vous répondra manuellement sous peu.\nÉcrivez 'produits' pour voir le stock disponible.";
      }
    }

    await logRequest(supabase, {
      contentType,
      body,
      queryVal,
      text,
      userAgent: req.headers.get("user-agent"),
      ip: req.headers.get("x-forwarded-for"),
      response: replyText
    });

    return NextResponse.json({
      replies: [
        {
          message: replyText
        }
      ]
    });
  } catch (err) {
    console.error("Error in AutoResponder webhook POST:", err);
    try {
      const supabase = createAdminClient();
      await logRequest(supabase, {
        error: (err as Error).message
      });
    } catch {}
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

async function logRequest(supabase: any, content: any) {
  try {
    const { data } = await supabase.from("site_settings").select("value").eq("key", "debug_logs").single();
    let logs = data && Array.isArray(data.value) ? data.value : [];
    logs.push({
      timestamp: new Date().toISOString(),
      ...content
    });
    if (logs.length > 20) logs = logs.slice(-20);
    await supabase.from("site_settings").upsert({
      key: "debug_logs",
      value: logs,
      updated_at: new Date().toISOString()
    });
  } catch (err) {
    console.error("Failed to log request in database:", err);
  }
}
