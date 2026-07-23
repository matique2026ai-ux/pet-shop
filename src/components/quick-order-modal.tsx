"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle, Truck, Zap, CreditCard } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

import { setCookie } from "@/lib/cookies";
import { WILAYAS } from "@/lib/data";
import { WILAYAS_AR } from "@/lib/wilayas";
import { toast } from "sonner";

interface QuickOrderModalProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
    sold_by?: string;
  };
  variant?: string;
  quantity?: number;
  isOpen: boolean;
  onClose: () => void;
}

function isValidAlgerianPhone(raw: string): boolean {
  let v = raw.replace(/[\s\-().]/g, "");
  if (v.startsWith("+213")) v = v.slice(4);
  else if (v.startsWith("00213")) v = v.slice(5);
  else if (v.startsWith("213")) v = v.slice(3);
  if (!/^\d{9,10}$/.test(v)) return false;
  if (/^0[567]\d{8}$/.test(v)) return true;
  if (/^0[0-3]\d{7,8}$/.test(v)) return true;
  return false;
}

export default function QuickOrderModal({
  product,
  variant,
  quantity = 1,
  isOpen,
  onClose,
}: QuickOrderModalProps) {
  const { lang, currency, dir } = useI18n();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<{ id: string } | null>(null);

  if (!isOpen) return null;

  const total = product.price * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAlgerianPhone(customerPhone)) {
      setPhoneError(lang === "ar" ? "يرجى إدخال رقم هاتف جزائري صحيح (مثال: 0550123456)" : "Numéro de téléphone invalide");
      return;
    }
    setPhoneError(null);
    setIsSubmitting(true);

    const fullAddress = `[Quick Order ⚡] Commune: ${commune || "N/A"}, Wilaya: ${wilaya}`;
    const order = {
      customer_name: customerName,
      customer_phone: customerPhone,
      delivery_address: fullAddress,
      city: wilaya,
      delivery_area: commune || wilaya,
      delivery_fee: 0,
      delivery_eta: "24-48h",
      items: [{ productId: product.id, name: `${product.name} ${variant ? `(${variant})` : ""}`, price: product.price, quantity }],
      total,
      notes: "Express 1-Click Fast Order",
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (!res.ok) throw new Error("Order error");
      const createdOrder = await res.json();

      // Save customer info to cookies for fast autofill
      setCookie("pawswings_customer_info", JSON.stringify({ name: customerName, phone: customerPhone, wilaya, commune }), 180);

      setOrderPlaced(createdOrder);
    } catch {
      toast.error(lang === "ar" ? "تعذر إرسال الطلب، يرجى المحاولة مرة أخرى" : "Erreur lors de l'envoi de la commande");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOrderPlaced(null);
    onClose();
  };

  const orderRef = orderPlaced?.id.slice(-6).toUpperCase() || "";
  const waText = encodeURIComponent(
    lang === "ar"
      ? `مرحباً، لقد قمت بعمل طلب سريع برقم #${orderRef} لمنتج: ${product.name} (${quantity} قطعة) بـ ${total} ${currency}. يرجى تأكيد الطلب!`
      : `Bonjour, j'ai passé une commande rapide #${orderRef} pour ${product.name}. Merci de la valider!`
  );
  const waHref = `https://wa.me/213776075355?text=${waText}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 overflow-y-auto" dir={dir}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center text-lg transition-colors z-10"
        >
          &times;
        </button>

        {orderPlaced ? (
          /* ── SUCCESS VIEW ── */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-lg shadow-emerald-600/20">
              <CheckCircle className="w-8 h-8" />
            </div>

            <span className="inline-block bg-emerald-50 text-emerald-700 font-bold text-xs px-3.5 py-1 rounded-full border border-emerald-200">
              #{orderRef}
            </span>

            <h3 className="text-2xl font-black text-gray-900">
              {lang === "ar" ? "تم تسجيل طلبك السريع بنجاح! 🎉" : "Commande Rapide Enregistrée !"}
            </h3>

            <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
              {lang === "ar"
                ? "شكراً لك! سنتصل بك هاتفياً لتأكيد الطلب والتوصيل خلال 24-48 ساعة."
                : "Merci ! Notre équipe vous contactera sous peu pour la livraison."}
            </p>

            <div className="pt-3 space-y-2">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all"
              >
                💬 {lang === "ar" ? "تأكيد فوري عبر الواتساب" : "Confirmer sur WhatsApp"}
              </a>
              <button
                onClick={handleClose}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold text-sm transition-colors"
              >
                {lang === "ar" ? "إغلاق النافذة" : "Fermer"}
              </button>
            </div>
          </div>
        ) : (
          /* ── FORM VIEW ── */
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#E3602D] flex items-center justify-center">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {lang === "ar" ? "الطلب السريع بضغطة زر ⚡" : "Achat Rapide 1-Clic ⚡"}
                </h3>
                <p className="text-xs text-gray-500">{lang === "ar" ? "اطلب الآن بدون تسجيل سلة المشتريات" : "Commandez directement sans passer par le panier"}</p>
              </div>
            </div>

            {/* Product Card Snippet */}
            <div className="flex items-center gap-3 bg-[#FBF9F5] p-3 rounded-2xl border border-[#EFEBE4] mb-5">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white shrink-0 border border-gray-100">
                <Image src={product.image} alt={product.name} fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-xs truncate">{product.name}</h4>
                {variant && <p className="text-[11px] text-orange-600 font-semibold">{variant}</p>}
                <p className="text-xs font-black text-emerald-700 mt-0.5">
                  {total.toLocaleString()} {currency} {quantity > 1 && `(${quantity} قطعة)`}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === "ar" ? "الاسم الكامل *" : "Nom Complet *"}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={lang === "ar" ? "مثال: أحمد محمد" : "Votre nom"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === "ar" ? "رقم الهاتف *" : "Numéro de Téléphone *"}
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (phoneError) setPhoneError(null);
                  }}
                  placeholder="0550 12 34 56"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm ${phoneError ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
                {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {lang === "ar" ? "الولاية *" : "Wilaya *"}
                  </label>
                  <select
                    required
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                  >
                    <option value="" disabled hidden>{lang === "ar" ? "اختر الولاية" : "Sélectionner"}</option>
                    {WILAYAS.map((w: string, i: number) => (
                      <option key={w} value={w}>{lang === "ar" ? WILAYAS_AR[i] : w}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {lang === "ar" ? "البلدية" : "Commune"}
                  </label>
                  <input
                    type="text"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    placeholder={lang === "ar" ? "اسم البلدية" : "Nom commune"}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-[11px] text-emerald-800 flex items-center gap-2 mt-2">
                <Truck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{lang === "ar" ? "التوصيل لجميع الولايات والطلب يسدد عند الاستلام" : "Livraison dans toute l'Algérie, paiement à la réception."}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3.5 rounded-2xl font-extrabold text-sm hover:opacity-95 transition-all shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>{lang === "ar" ? "إتمام الشراء السريع 🚀" : "Valider la Commande 🚀"}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
