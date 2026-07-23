/**
 * Brevo Transactional Email Service
 * High-deliverability transactional emails (Welcome & Order Receipts)
 */

interface SendEmailParams {
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
}

export async function sendBrevoEmail({ toEmail, toName, subject, htmlContent }: SendEmailParams) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "b20715001@smtp-brevo.com";
  const senderName = process.env.BREVO_SENDER_NAME || "مخالب وأجنحة | Paws & Wings";

  if (!apiKey) {
    console.warn("⚠️ BREVO_API_KEY is not set in environment variables. Email sending skipped.");
    return { success: false, reason: "BREVO_API_KEY_MISSING" };
  }

  if (!toEmail || !toEmail.includes("@")) {
    return { success: false, reason: "INVALID_RECIPIENT_EMAIL" };
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [
          {
            email: toEmail.trim().toLowerCase(),
            name: toName || toEmail.split("@")[0],
          },
        ],
        subject,
        htmlContent,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Brevo API Email error:", res.status, errorText);
      return { success: false, error: errorText };
    }

    const data = await res.json();
    return { success: true, messageId: data.messageId };
  } catch (err) {
    console.error("Failed to trigger Brevo API:", err);
    return { success: false, error: (err as Error).message };
  }
}

/**
 * HTML Template: Welcome Email for New Registered Users
 */
export function getWelcomeEmailHtml(fullName: string, lang = "ar"): string {
  const name = fullName || "صديق الحيوانات الأليفة";
  const isAr = lang === "ar";
  
  return `
  <!DOCTYPE html>
  <html lang="${lang}" dir="${isAr ? "rtl" : "ltr"}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مرحباً بك في مخالب وأجنحة</title>
  </head>
  <body style="margin:0; padding:0; background-color:#FDFBF7; font-family:'Cairo', Arial, sans-serif; color:#1A120B;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FDFBF7; padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:24px; overflow:hidden; border:1px solid #F0EDE6; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
            <!-- Header -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #1E2D24 0%, #0E1611 100%); padding:36px 20px; text-align:center;">
                <img src="https://pet-shop.vercel.app/logo-badge.png" alt="Paws & Wings Logo" width="90" height="90" style="display:block; margin:0 auto 12px auto; border-radius:50%; border:2px solid #E3602D;">
                <h1 style="color:#F1C290; margin:0; font-size:24px; font-weight:800;">مخالب وأجنحة</h1>
                <p style="color:#ffffff; opacity:0.8; margin:6px 0 0 0; font-size:13px;">المتجر الإلكتروني الرائد للحيوانات الأليفة والخيول في الجزائر</p>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding:32px 28px;">
                <h2 style="color:#1E2D24; font-size:20px; margin-top:0;">مرحباً بك يا ${name}! 🐾</h2>
                <p style="font-size:15px; line-height:1.7; color:#5C523D;">
                  سعداء جداً بأنك أصبحت عضواً في عائلة <strong>مخالب وأجنحة</strong>! حسابك جاهز الآن لتصفح أفضل المنتجات، الأغذية، والإكسسوارات المعتمدة لحيواناتك الأليفة والخيول.
                </p>
                <div style="background-color:#FBF8F3; border-radius:16px; border:1px solid #ECDCAE; padding:20px; margin:24px 0;">
                  <h3 style="margin:0 0 10px 0; color:#E3602D; font-size:16px;">💡 مميزات حسابك معنا:</h3>
                  <ul style="margin:0; padding-inline-start:20px; color:#3E3729; font-size:14px; line-height:1.8;">
                    <li>تتبع حالة طلباتك والتوصيل بشكل مباشر.</li>
                    <li>حفظ مفضلاتك والمنتجات التي تهتم بها.</li>
                    <li>استفادة من عروض التوصيل والخصومات المخصصة للأعضاء.</li>
                  </ul>
                </div>
                <div style="text-align:center; margin:32px 0 16px 0;">
                  <a href="https://pet-shop.vercel.app/products" style="background: linear-gradient(135deg, #E3602D 0%, #A87A2E 100%); color:#ffffff; font-weight:bold; padding:14px 32px; border-radius:50px; text-decoration:none; display:inline-block; font-size:15px; box-shadow:0 6px 18px rgba(227, 96, 45, 0.35);">
                    ابدأ التصفح والتسوق الآن 🛍️
                  </a>
                </div>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color:#1A120B; color:#9A8D70; padding:20px; text-align:center; font-size:12px; border-top:1px solid #241A11;">
                <p style="margin:0 0 6px 0;">سطيف، الجزائر • هاتف: 0776.07.53.55 / 0661.23.45.67</p>
                <p style="margin:0;">© 2026 مخالب وأجنحة | Paws & Wings. جميع الحقوق محفوظة.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * HTML Template: Order Invoice & Confirmation Email
 */
export function getOrderReceiptEmailHtml(order: any, lang = "ar"): string {
  const isAr = lang === "ar";
  const orderRef = (order.id || "").slice(-6).toUpperCase();
  const items = Array.isArray(order.items) ? order.items : [];
  const currency = "د.ج";

  const itemsListHtml = items.map((item: any) => `
    <tr>
      <td style="padding:10px 0; border-bottom:1px solid #F0EDE6; font-size:14px; color:#1A120B;">
        <strong>${item.name || item.title || "منتج"}</strong>
        ${item.variant ? `<br><span style="font-size:12px; color:#7A6F54;">الحجم/النوع: ${item.variant}</span>` : ""}
      </td>
      <td align="center" style="padding:10px 0; border-bottom:1px solid #F0EDE6; font-size:14px; color:#5C523D;">
        ${item.quantity || item.qty || 1}
      </td>
      <td align="left" style="padding:10px 0; border-bottom:1px solid #F0EDE6; font-size:14px; font-weight:bold; color:#1E2D24;">
        ${((item.price || 0) * (item.quantity || item.qty || 1)).toLocaleString()} ${currency}
      </td>
    </tr>
  `).join("");

  return `
  <!DOCTYPE html>
  <html lang="${lang}" dir="${isAr ? "rtl" : "ltr"}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأكيد طلبية #${orderRef}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#FDFBF7; font-family:'Cairo', Arial, sans-serif; color:#1A120B;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#FDFBF7; padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:24px; overflow:hidden; border:1px solid #F0EDE6; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
            <!-- Header -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #1E2D24 0%, #0E1611 100%); padding:32px 20px; text-align:center;">
                <img src="https://pet-shop.vercel.app/logo-badge.png" alt="Paws & Wings" width="80" height="80" style="display:block; margin:0 auto 10px auto; border-radius:50%; border:2px solid #E3602D;">
                <h1 style="color:#F1C290; margin:0; font-size:22px; font-weight:800;">تأكيد استلام الطلبية</h1>
                <div style="display:inline-block; background-color:#E3602D; color:#ffffff; font-weight:bold; padding:4px 14px; border-radius:20px; font-size:13px; margin-top:8px;">
                  رقم الطلب: #${orderRef}
                </div>
              </td>
            </tr>
            <!-- Order Details -->
            <tr>
              <td style="padding:28px;">
                <p style="font-size:15px; color:#3E3729; margin-top:0;">
                  مرحباً <strong>${order.customer_name || "عميلنا العزيز"}</strong>،<br>
                  شكراً لثقتك بمتجر <strong>مخالب وأجنحة</strong>! تم تسجيل طلبك بنجاح وسنقوم بالتواصل معك هاتفياً لتأكيد الشحن والتوصيل.
                </p>

                <!-- Customer & Delivery Info Box -->
                <div style="background-color:#FBF8F3; border-radius:16px; border:1px solid #ECDCAE; padding:18px; margin:20px 0; font-size:13px; color:#5C523D; line-height:1.7;">
                  <strong style="color:#E3602D; font-size:14px; display:block; mb-1;">📍 معلومات التوصيل:</strong>
                  • <strong>الاسم:</strong> ${order.customer_name}<br>
                  • <strong>الهاتف:</strong> ${order.customer_phone}<br>
                  • <strong>العنوان:</strong> ${order.delivery_address || order.city || "سطيف"}<br>
                  • <strong>المدة المتوقعة:</strong> ${order.delivery_eta || "24-48 ساعة"}
                </div>

                <!-- Products Table -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:16px;">
                  <thead>
                    <tr style="border-bottom:2px solid #1E2D24;">
                      <th align="right" style="padding:8px 0; color:#1E2D24; font-size:13px;">المنتج</th>
                      <th align="center" style="padding:8px 0; color:#1E2D24; font-size:13px;">الكمية</th>
                      <th align="left" style="padding:8px 0; color:#1E2D24; font-size:13px;">السعر</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsListHtml}
                  </tbody>
                </table>

                <!-- Summary Totals -->
                <div style="margin-top:20px; padding-top:16px; border-top:2px solid #F0EDE6; text-align:left;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="right" style="font-size:14px; color:#7A6F54;">رسوم التوصيل:</td>
                      <td align="left" style="font-size:14px; font-weight:bold; color:#1A120B;">${(order.delivery_fee || 0).toLocaleString()} ${currency}</td>
                    </tr>
                    <tr>
                      <td align="right" style="font-size:16px; font-weight:bold; color:#1E2D24; padding-top:8px;">المجموع الإجمالي:</td>
                      <td align="left" style="font-size:18px; font-weight:800; color:#E3602D; padding-top:8px;">${(order.total || 0).toLocaleString()} ${currency}</td>
                    </tr>
                  </table>
                </div>

                <div style="text-align:center; margin-top:30px;">
                  <a href="https://wa.me/213776075355?text=${encodeURIComponent(`مرحباً، أستفسر عن طلبيتي رقم #${orderRef}`)}" style="background-color:#25D366; color:#ffffff; font-weight:bold; padding:12px 28px; border-radius:50px; text-decoration:none; display:inline-block; font-size:14px;">
                    تواصل معنا مباشرة عبر الواتساب 💬
                  </a>
                </div>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color:#1A120B; color:#9A8D70; padding:18px; text-align:center; font-size:12px;">
                <p style="margin:0;">© 2026 مخالب وأجنحة | Paws & Wings. سطيف، الجزائر</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
