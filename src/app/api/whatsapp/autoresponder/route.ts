/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export const runtime = "edge";

let cachedProducts: any[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000;

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

    // Ignore messages from other autoresponders/bots to prevent infinite loops (avoid single word false positives)
    const isBot = 
      text.includes("réponse automatique") || 
      text.includes("reponse automatique") ||
      text.includes("automatic reply") ||
      text.includes("autoresponder") ||
      text.includes("الرد الآلي") ||
      text.includes("الرد التلقائي");

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
      return NextResponse.json({ replies: [], reply: "", message: "" });
    }

    let sender = "";
    if (body.query && typeof body.query === "object") {
      sender = body.query.sender || "";
    } else if (body.sender) {
      sender = body.sender;
    }

    let products: any[] = [];
    const now = Date.now();
    if (cachedProducts && (now - cacheTimestamp < CACHE_TTL)) {
      products = cachedProducts;
    } else {
      const { data } = await supabase
        .from("products")
        .select("id, name, price, in_stock, category")
        .eq("in_stock", true);
      products = data || [];
      if (products.length > 0) {
        cachedProducts = products;
        cacheTimestamp = now;
      }
    }

    const hasProducts = products.length > 0;

    // Extract order code if present (e.g., #9F2E52 or order code)
    const orderCodeMatch = 
      text.match(/#([A-Za-z0-9]{6})/i) || 
      text.match(/طلب\s*(?:رقم)?\s*#?([A-Za-z0-9]{6})/i) || 
      text.match(/commande\s*#?([A-Za-z0-9]{6})/i) || 
      text.match(/\b([A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12})\b/i);
    const extractedCode = orderCodeMatch ? orderCodeMatch[1] : null;

    let matchedOrder: any = null;
    let ordersContext = "No recent orders found for this phone number/code.";

    try {
      let query = supabase.from("orders").select("id, customer_name, customer_phone, status, total, items, delivery_address, notes, created_at");

      if (extractedCode) {
        query = query.or(`id.ilike.%${extractedCode}%,id.eq."${extractedCode}"`);
      } else if (sender) {
        const cleanedSender = sender.replace(/\s+/g, "");
        const digitsOnly = sender.replace(/\D/g, "");
        let localFormat = digitsOnly;
        if (digitsOnly.startsWith("213")) {
          localFormat = "0" + digitsOnly.slice(3);
        }
        const orFilter = [
          `customer_phone.eq."${sender}"`,
          `customer_phone.eq."${cleanedSender}"`,
          `customer_phone.eq."${digitsOnly}"`,
          `customer_phone.eq."${localFormat}"`
        ].join(",");
        query = query.or(orFilter);
      }

      const { data: customerOrders } = await query.order("created_at", { ascending: false }).limit(3);

      if (customerOrders && customerOrders.length > 0) {
        matchedOrder = customerOrders[0];
        ordersContext = customerOrders.map(o => {
          const dateStr = new Date(o.created_at).toLocaleDateString("fr-FR");
          const shortId = o.id.slice(-6).toUpperCase();
          const itemsList = Array.isArray(o.items) 
            ? o.items.map((it: any) => `${it.name} (Qty: ${it.quantity || 1})`).join(", ")
            : "N/A";
          return `- Order #${shortId} (ID: ${o.id})\n  Customer: ${o.customer_name}\n  Delivery Address: ${o.delivery_address || "N/A"}\n  Date: ${dateStr}\n  Status: ${o.status}\n  Total: ${o.total} DZD\n  Items: ${itemsList}`;
        }).join("\n\n");
      }
    } catch (err) {
      console.error("Error fetching customer orders for tracking:", err);
    }

    // 2. Response Generation
    let replyText = "";
    const isArabic = /[\u0600-\u06FF]/.test(text);
    const geminiKey = 
      process.env.GEMINI_API_KEY || 
      process.env.GEMINI_KEY || 
      process.env.GOOGLE_API_KEY || 
      process.env.GOOGLE_GEMINI_KEY;

    if (geminiKey) {
      try {
        const origin = req.nextUrl.origin;
        const catalogContext = products
          ? products.map((p) => `- Name: ${p.name}\n  Category: ${p.category}\n  Price: ${p.price} DZD\n  Link: ${origin}/products/${p.category}/${p.id}`).join("\n\n")
          : "No products available in stock.";
        
        const systemPrompt = `You are a helpful and friendly AI assistant for "Paws & Wings", a pet shop in Algeria (Sétif). 
Your task is to answer customers' questions about our store, catalog, products, prices, stock, delivery, and their order status.
You must speak in Algerian Darja (الدارجة الجزائرية) or French/Arabic, depending on the customer's language. Keep answers concise, helpful, and polite.

CRITICAL RULE FOR LINKS IN WHATSAPP:
DO NOT format URLs as Markdown links like [product name](https://...) or [https://...](https://...).
ALWAYS output URLs as clean, raw plain text without any square brackets or parentheses (e.g. https://pet-cat.vercel.app/products/cats/c1).
WhatsApp does NOT support markdown links, and using brackets [] or () around links will corrupt the URL and cause a 404 error!

CRITICAL RULE FOR ORDER CONFIRMATION & TRACKING:
If the customer message mentions an order (e.g., "مرحباً، لقد قمت بطلب رقم #9F2E52..." or asks to confirm/track their order), check the "Recent Orders for this Customer" section below.
Confirm that their order has been received, state the order reference, customer name, total amount, items, and reassure them that their order is being prepared and delivery team will contact them by phone.

When recommending or discussing any specific product, include its direct Link from the catalog context.

CRITICAL RULE: DO NOT start your message with "Réponse automatique" or any similar automated prefix. Just answer directly and naturally.

Here is our current in-stock catalog:
${catalogContext}

Recent Orders for this Customer/Query (${sender || extractedCode || "N/A"}):
${ordersContext}

Our Store Info:
- Store Name: مخالب وأجنحة (Paws & Wings)
- Location: Sétif, Algeria (Cité elhidhab)
- Delivery: Delivery is available across all 69 provinces in Algeria. Delivery inside the commune of Sétif only costs 150 DZD (Free for orders above 5000 DZD) and takes 24h. Delivery to other provinces varies in cost and takes 2-4 days. When confirming an order, ALWAYS mention the customer's specific delivery province to reassure them.

Customer message: "${queryVal}"
Answer directly and politely in their language:`;

        replyText = await askGemini(systemPrompt, geminiKey);
        replyText = cleanWhatsAppLinks(replyText);
      } catch (err) {
        console.error("Gemini AI agent error, falling back to local keywords:", err);
        await logRequest(supabase, {
          geminiError: (err as Error).message
        });
        replyText = getLocalResponse(text, isArabic, hasProducts, products || [], req.nextUrl.origin, matchedOrder, extractedCode);
      }
    } else {
      replyText = getLocalResponse(text, isArabic, hasProducts, products || [], req.nextUrl.origin, matchedOrder, extractedCode);
    }

    replyText = cleanWhatsAppLinks(replyText);

    await logRequest(supabase, {
      contentType,
      body,
      queryVal,
      text,
      userAgent: req.headers.get("user-agent"),
      ip: req.headers.get("x-forwarded-for"),
      response: replyText,
      geminiKeyPresent: !!geminiKey
    });

    return NextResponse.json({
      replies: [
        {
          message: replyText
        }
      ],
      reply: replyText,
      message: replyText
    });
  } catch (err) {
    console.error("Error in AutoResponder webhook POST:", err);
    try {
      const supabase = createAdminClient();
      await logRequest(supabase, {
        error: (err as Error).message
      });
    } catch {}
    return NextResponse.json({ 
      replies: [{ message: "حدث خطأ أثناء معالجة الطلب." }],
      reply: "حدث خطأ أثناء معالجة الطلب.",
      message: "حدث خطأ أثناء معالجة الطلب."
    }, { status: 500 });
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

async function askGemini(prompt: string, apiKey: string): Promise<string> {
  const models = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-2.5-flash",
    "gemini-2.0-flash-lite"
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

function getLocalResponse(
  text: string, 
  isArabic: boolean, 
  hasProducts: boolean, 
  products: any[], 
  origin: string,
  matchedOrder: any,
  extractedCode: string | null
): string {
  const wantsOrder = 
    text.includes("طلب رقم") || 
    text.includes("طلب") || 
    text.includes("طلبيتي") || 
    text.includes("تأكيد الطلب") || 
    text.includes("تأكيد") || 
    text.includes("تتبع") || 
    text.includes("commande") || 
    text.includes("confirm") || 
    !!extractedCode;

  if (wantsOrder) {
    if (matchedOrder) {
      const shortId = matchedOrder.id.slice(-6).toUpperCase();
      const itemsList = Array.isArray(matchedOrder.items)
        ? matchedOrder.items.map((it: any) => `• ${it.name} (${it.quantity || 1}x)`).join("\n")
        : "منتجات متنوعة";
      
      const statusMap: Record<string, string> = {
        pending: "مقبول وقيد التحضير (سنتصل بك هاتفياً لتأكيد التوصيل)",
        confirmed: "مؤكد وقيد الإعداد للشحن 📦",
        processing: "جاري تحضير الطلبية 📦",
        shipped: "في الطريق إليك مع موزّع التوصيل 🚚",
        delivered: "تم التسليم بنجاح 🎉",
        cancelled: "ملغى ❌"
      };

      const statusText = statusMap[matchedOrder.status] || matchedOrder.status;

      return isArabic
        ? `✅ مرحباً بك! تم استلام طلبك رقم #${shortId} بنجاح! 🐾\n\n📋 تفاصيل طلبك:\n• الاسم: ${matchedOrder.customer_name || "زبوننا الكريم"}\n${itemsList}\n• المجموع: ${matchedOrder.total} د.ج\n• حالة الطلب: ${statusText}\n\n🚚 التوصيل: متوفر في سطيف ومختلف الولايات. سيتم التواصل معك هاتفياً للتأكيد والتسليم في أقرب وقت.\nشكراً لثقتك في متجر مخالب وأجنحة (Paws & Wings) ✨`
        : `✅ Bonjour ! Nous avons bien reçu votre commande #${shortId} ! 🐾\n\n📋 Détails :\n• Nom: ${matchedOrder.customer_name || "Client"}\n${itemsList}\n• Total: ${matchedOrder.total} DZD\n• Statut: ${matchedOrder.status}\n\n🚚 Nous vous contacterons par téléphone pour confirmer l'expédition. Merci de votre confiance en Paws & Wings ! ✨`;
    }

    const orderRefDisplay = extractedCode ? `#${extractedCode.toUpperCase()}` : "الخاص بك";
    return isArabic
      ? `✅ مرحباً بك! تم استقبال طلبك رقم ${orderRefDisplay} في متجر مخالب وأجنحة (Paws & Wings) 🐾\n\nلقد قمنا بتسجيل التأكيد، وسيتم التواصل معك هاتفياً على هذا الرقم للتحقق من بيانات العنوان والشحن وإرسال طلبيتك فوراً.\nإذا كان لديك أي استفسار، يسعدنا مساعدتك!`
      : `✅ Bonjour ! Votre commande ${orderRefDisplay} a bien été enregistrée chez Paws & Wings 🐾\n\nNous vous contacterons par téléphone pour confirmer l'adresse et l'expédition. Merci de votre confiance !`;
  }

  const wantsDelivery = text.includes("delivery") || text.includes("tousil") || text.includes("toussil") || text.includes("livraison") || text.includes("توصيل") || text.includes("بكم التوصيل") || text.includes("شحن");
  const wantsProducts = text.includes("product") || text.includes("produit") || text.includes("catalog") || text.includes("price") || text.includes("prix") || text.includes("أكل") || text.includes("طعام") || text.includes("منتج") || text.includes("سعر") || text.includes("سومة") || text.includes("عندكم") || text.includes("متوفر");
  const isGreeting = text.includes("hello") || text.includes("hi") || text.includes("bonjour") || text.includes("سلام") || text.includes("مرحبا") || text.includes("صباح الخير") || text.includes("مساء الخير");

  if (wantsDelivery) {
    return isArabic 
      ? "🚚 خدمات التوصيل لدينا:\n- التوصيل داخل بلدية سطيف متوفر بـ 150 د.ج.\n- التوصيل مجاني تماماً للطلبات التي تفوق 5000 د.ج!\n- مدة التوصيل بين 24 إلى 48 ساعة."
      : "🚚 Nos services de livraison :\n- Livraison à l'intérieur de la commune de Sétif uniquement pour 150 DZD.\n- Livraison gratuite pour toute commande supérieure à 5000 DZD !\n- Délai de livraison : 24 à 48 heures.";
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
      ? `🐾 المنتجات المتوفرة حالياً (بعض الأمثلة):\n\n${list}\n\n🔗 لمشاهدة الكتالوج الكامل والطلب مباشرة، تفضل بزيارة موقعنا:\n${origin}/products`
      : `🐾 Produits actuellement disponibles (quelques exemples) :\n\n${list}\n\n🔗 Pour voir tout le catalogue et commander, visitez notre site :\n${origin}/products`;
  }

  if (isGreeting) {
    if (hasProducts) {
      const list = products.slice(0, 5).map(p => `- ${p.name}: ${p.price} DZD`).join("\n");
      return isArabic
        ? `مرحباً بك في متجر مخالب وأجنحة (Paws & Wings)! 🐾✨\nكيف يمكنني مساعدتك اليوم؟\n\nبعض منتجاتنا المتوفرة حالياً:\n${list}\n\n- اكتب "توصيل" لمعرفة معلومات الشحن.\n- اكتب "منتجات" لعرض الكتالوج بالكامل.`
        : `Bienvenue chez Paws & Wings (مخالب وأجنحة) ! 🐾✨\nComment puis-je vous aider aujourd'hui ?\n\nQuelques produits disponibles :\n${list}\n\n- Écrivez "livraison" pour les infos de livraison.\n- Écrivez "produits" pour voir tout le catalogue.`;
    } else {
      return isArabic
        ? "مرحباً بك في متجر مخالب وأجنحة (Paws & Wings)! 🐾 كيف يمكنني مساعدتك اليوم؟"
        : "Bienvenue chez Paws & Wings ! 🐾 Comment puis-je vous aider aujourd'hui ?";
    }
  }

  // General fallback
  return isArabic
    ? "شكراً لتواصلك مع متجر مخالب وأجنحة! 🐾\nرسالتك وصلت وسيقوم أحد عملائنا بالرد عليك يدوياً في أقرب وقت.\nاكتب 'منتجات' لرؤية ما هو متوفر حالياً في المخزن."
    : "Merci de contacter Paws & Wings ! 🐾\nVotre message a été reçu, un conseiller vous répondra manuellement sous peu.\nÉcrivez 'produits' pour voir le stock disponible.";
}
