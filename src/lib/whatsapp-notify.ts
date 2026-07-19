/**
 * Sends a WhatsApp notification to a customer when their order status changes.
 * Uses the WhatsApp Cloud API credentials. Works within the 24-hour customer
 * service window after the customer last messaged the business.
 */
export async function sendOrderStatusNotification(
  customerPhone: string,
  orderId: string,
  newStatus: string
): Promise<void> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneId || !customerPhone) return;

  const shortId = orderId.slice(0, 8).toUpperCase();

  const statusMessages: Record<string, string> = {
    confirmed: `✅ مرحباً!\nطلبيتك رقم #${shortId} تم تأكيدها.\nنحن نحضّرها لك الآن. شكراً لثقتك في Paws & Wings 🐾\n\n---\nBonjour ! Votre commande #${shortId} a été confirmée ✅\nNous la préparons pour vous. Merci de votre confiance !`,
    processing: `📦 طلبيتك رقم #${shortId} قيد التحضير الآن!\nسنخبرك عندما تكون جاهزة للشحن.\nPaws & Wings 🐾\n\n---\nVotre commande #${shortId} est en cours de préparation 📦\nNous vous informerons dès qu'elle sera prête.`,
    shipped: `🚚 طلبيتك رقم #${shortId} في الطريق إليك!\nالتوصيل بين 24-48 ساعة.\nPaws & Wings 🐾\n\n---\nVotre commande #${shortId} est en route ! 🚚\nLivraison dans 24-48 heures.`,
    delivered: `🎉 طلبيتك رقم #${shortId} وصلت!\nنأمل أن تكون راضياً عن شرائك.\nPaws & Wings 🐾\n\n---\nVotre commande #${shortId} a été livrée ! 🎉\nNous espérons que vous êtes satisfait de votre achat.`,
    cancelled: `❌ طلبيتك رقم #${shortId} تم إلغاؤها.\nللاستفسار أو الطلب من جديد، راسلنا هنا.\nPaws & Wings 🐾\n\n---\nVotre commande #${shortId} a été annulée. ❌\nPour toute question, n'hésitez pas à nous contacter.`,
  };

  const message = statusMessages[newStatus];
  if (!message) return; // No notification for "pending" or unknown statuses

  // Normalize phone number to international format (213XXXXXXXXX)
  const cleaned = customerPhone.replace(/[^0-9]/g, "");
  let formattedPhone = cleaned;
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    formattedPhone = "213" + cleaned.slice(1);
  } else if (cleaned.startsWith("2130") && cleaned.length === 13) {
    formattedPhone = "213" + cleaned.slice(4);
  } else if (/^[567]/.test(cleaned) && cleaned.length === 9) {
    formattedPhone = "213" + cleaned;
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedPhone,
        type: "text",
        text: { body: message },
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("WhatsApp notification failed:", err);
    }
  } catch (err) {
    console.error("WhatsApp notification error:", err);
  }
}
