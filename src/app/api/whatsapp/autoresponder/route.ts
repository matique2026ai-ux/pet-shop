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

    let queryVal = body.query || body.message || body.msg || body.text || body.body;
    
    // AutoResponder app sometimes sends query as an object with nested message field
    if (queryVal && typeof queryVal === "object") {
      queryVal = queryVal.message || queryVal.query || queryVal.text || "";
    }

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

    const hasProducts = !!(products && products.length > 0);

    // 2. Response Generation
    let replyText = "";
    const isArabic = /[\u0600-\u06FF]/.test(text);
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const catalogContext = products
          ? products.map((p) => `- ${p.name} (Category: ${p.category}): ${p.price} DZD. Description: ${p.description || "N/A"}`).join("\n")
          : "No products in stock.";
        
        const systemPrompt = `You are a helpful and friendly AI assistant for "Paws & Wings", a pet shop in Algeria (Sétif). 
Your task is to answer customers' questions about our store, catalog, products, prices, stock, and delivery.
You must speak in Algerian Darja (الدارجة الجزائرية) or French/Arabic, depending on the customer's language. Keep answers concise, helpful, and polite.

Here is our current in-stock catalog:
${catalogContext}

Our Store Info:
- Store Name: طيور الجمال والجواد (Paws & Wings)
- Location: Sétif, Algeria (Cité elhidhab)
- Delivery: Delivery is available in Sétif for 250 DZD (Free for orders above 5000 DZD). Delivery takes 24-48h.

Customer message: "${queryVal}"
Answer directly and politely in their language:`;

        replyText = await askGemini(systemPrompt, geminiKey);
      } catch (err) {
        console.error("Gemini AI agent error, falling back to local keywords:", err);
        replyText = getLocalResponse(text, isArabic, hasProducts, products);
      }
    } else {
      replyText = getLocalResponse(text, isArabic, hasProducts, products);
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

function getLocalResponse(text: string, isArabic: boolean, hasProducts: boolean, products: any[]): string {
  const wantsDelivery = text.includes("delivery") || text.includes("tousil") || text.includes("toussil") || text.includes("livraison") || text.includes("توصيل") || text.includes("بكم التوصيل") || text.includes("شحن");
  const wantsProducts = text.includes("product") || text.includes("produit") || text.includes("catalog") || text.includes("price") || text.includes("prix") || text.includes("أكل") || text.includes("طعام") || text.includes("منتج") || text.includes("سعر") || text.includes("سومة") || text.includes("عندكم") || text.includes("متوفر");
  const isGreeting = text.includes("hello") || text.includes("hi") || text.includes("bonjour") || text.includes("سلام") || text.includes("مرحبا") || text.includes("صباح الخير") || text.includes("مساء الخير");

  if (wantsDelivery) {
    return isArabic 
      ? "🚚 خدمات التوصيل لدينا:\n- التوصيل متوفر في ولاية سطيف بـ 250 د.ج.\n- التوصيل مجاني تماماً للطلبات التي تفوق 5000 د.ج!\n- مدة التوصيل بين 24 إلى 48 ساعة."
      : "🚚 Nos services de livraison :\n- Livraison disponible à Sétif pour 250 DZD.\n- Livraison gratuite pour toute commande supérieure à 5000 DZD !\n- Délai de livraison : 24 à 48 heures.";
  }

  if (wantsProducts) {
    if (!hasProducts) {
      return isArabic
        ? "مرحباً! عذراً، لا توجد منتجات متوفرة في المخزن حالياً. سنقوم بتحديث المخزن قريباً."
        : "Bonjour ! Désolé, aucun produit n'est actuellement disponible en stock. Nous mettrons à jour le stock très bientôt.";
    }

    // Try to find a specific product match from the text
    const words = text.split(/[\s,?.!]+/);
    const matched = products.filter(p => {
      const pName = p.name.toLowerCase();
      return words.some(word => word.length > 2 && pName.includes(word));
    });

    if (matched.length > 0) {
      const list = matched.map(p => `- ${p.name}: ${p.price} DZD (${p.description || ''})`).join("\n");
      return isArabic
        ? `🐾 المنتجات التي وجدتها متطابقة مع بحثك:\n\n${list}\n\nللطلب أو الاستفسار، نحن هنا لمساعدتك!`
        : `🐾 Produits correspondant à votre recherche :\n\n${list}\n\nPour commander ou pour plus d'infos, nous sommes à votre disposition !`;
    }

    // Default: list first 5 products and link to the website catalogue
    const list = products.slice(0, 5).map(p => `- ${p.name}: ${p.price} DZD`).join("\n");
    return isArabic
      ? `🐾 المنتجات المتوفرة حالياً (بعض الأمثلة):\n\n${list}\n\n🔗 لمشاهدة الكتالوج الكامل والطلب مباشرة، تفضل بزيارة موقعنا:\nhttps://pet-cat.vercel.app/products`
      : `🐾 Produits actuellement disponibles (quelques exemples) :\n\n${list}\n\n🔗 Pour voir tout le catalogue et commander, visitez notre site :\nhttps://pet-cat.vercel.app/products`;
  }

  if (isGreeting) {
    if (hasProducts) {
      const list = products.slice(0, 5).map(p => `- ${p.name}: ${p.price} DZD`).join("\n");
      return isArabic
        ? `مرحباً بك في متجر طيور الجمال والجواد (Paws & Wings)! 🐾✨\nكيف يمكنني مساعدتك اليوم؟\n\nبعض منتجاتنا المتوفرة حالياً:\n${list}\n\n- اكتب "توصيل" لمعرفة معلومات الشحن.\n- اكتب "منتجات" لعرض الكتالوج بالكامل.`
        : `Bienvenue chez Paws & Wings (طيور الجمال والجواد) ! 🐾✨\nComment puis-je vous aider aujourd'hui ?\n\nQuelques produits disponibles :\n${list}\n\n- Écrivez "livraison" pour les infos de livraison.\n- Écrivez "produits" pour voir tout le catalogue.`;
    } else {
      return isArabic
        ? "مرحباً بك في متجر طيور الجمال والجواد (Paws & Wings)! 🐾 كيف يمكنني مساعدتك اليوم؟"
        : "Bienvenue chez Paws & Wings ! 🐾 Comment puis-je vous aider aujourd'hui ?";
    }
  }

  // General fallback
  return isArabic
    ? "شكراً لتواصلك مع متجر طيور الجمال والجواد! 🐾\nرسالتك وصلت وسيقوم أحد عملائنا بالرد عليك يدوياً في أقرب وقت.\nاكتب 'منتجات' لرؤية ما هو متوفر حالياً في المخزن."
    : "Merci de contacter Paws & Wings ! 🐾\nVotre message a été reçu, un conseiller vous répondra manuellement sous peu.\nÉcrivez 'produits' pour voir le stock disponible.";
}
