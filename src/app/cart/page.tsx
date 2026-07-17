"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n-context";
import { useTranslatedData } from "@/lib/use-translated-data";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/animated-section";
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, CreditCard, CheckCircle, Truck, MessageCircle, Home, Building2, Banknote } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings";
import { useAuth } from "@/lib/auth-context";
import { unitLabel, isContinuousUnit } from "@/lib/units";

const DEFAULT_DELIVERY: Record<string, string> = {
  scope: "commune",
  city: "Sétif",
  wilaya: "Sétif",
  fee: "200",
  freeThreshold: "5000",
  eta: "24-48h",
  areas: "Centre-ville,Aïn El Bey,Cité 1200 Logements,Stade 08 Mai,Zone industrielle",
  note: "Livraison à domicile dans la commune de Sétif (moto).",
};

const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar",
  "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger",
  "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
  "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh",
  "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued",
  "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
  "Ghardaïa", "Relizane",
];

const SOUTH_WILAYAS = new Set([
  "Adrar", "Béchar", "Tindouf", "Tamanrasset", "Ouargla", "Illizi",
  "El Oued", "Ghardaïa", "Biskra", "Laghouat", "El Bayadh", "Naâma",
]);

function isSetifCommune(c: string) {
  const norm = c.trim().toLowerCase();
  return norm === "setif" || norm === "sétif" || norm === "سطيف";
}

function regionForWilaya(w: string, c: string = ""): "setifCenter" | "setifOther" | "north" | "south" {
  if (w === "Sétif") {
    return isSetifCommune(c) ? "setifCenter" : "setifOther";
  }
  if (SOUTH_WILAYAS.has(w)) return "south";
  return "north";
}

const DELIVERY_CONFIG = {
  setifCenter: {
    home: 200,
    stopdesk: 150,
    eta: { en: "12-24h", fr: "12-24h", ar: "12-24 ساعة" }
  },
  setifOther: {
    home: 450,
    stopdesk: 350,
    eta: { en: "24-48h", fr: "24-48h", ar: "24-48 ساعة" }
  },
  north: {
    home: 600,
    stopdesk: 400,
    eta: { en: "3-5 days", fr: "3-5 jours", ar: "3-5 أيام" }
  },
  south: {
    home: 900,
    stopdesk: 700,
    eta: { en: "5-7 days", fr: "5-7 jours", ar: "5-7 أيام" }
  }
};

function isValidAlgerianPhone(raw: string): boolean {
  let v = raw.replace(/[\s\-().]/g, "");
  if (v.startsWith("+213")) v = v.slice(4);
  else if (v.startsWith("00213")) v = v.slice(5);
  else if (v.startsWith("213")) v = v.slice(3);
  if (!/^\d{9,10}$/.test(v)) return false;
  if (/^0[567]\d{8}$/.test(v)) return true; // mobile: 05/06/07 + 8 digits
  if (/^0[0-3]\d{7,8}$/.test(v)) return true; // landline: 0 + area code (e.g. 036 Sétif)
  return false;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { products } = useTranslatedData();
  const { t, currency, lang } = useI18n();
  const { user } = useAuth();
  const { store, delivery } = useSiteSettings();
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<{ id: string } | null>(null);
  const [area, setArea] = useState("");
  const [wilaya, setWilaya] = useState("Sétif");
  const [commune, setCommune] = useState("");
  const [deliveryType, setDeliveryType] = useState<"home" | "stopdesk">("home");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const [orderReferral, setOrderReferral] = useState("");
  const [hasBirdsInOrder, setHasBirdsInOrder] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("pet_shop_referral") || "";
        setReferralCode(stored);
      } catch {}
    }
  }, []);

  const cartHasBirds = items.some((item) => products.find((p: any) => p.id === item.productId)?.category === "birds");

  const d = { ...DEFAULT_DELIVERY, ...(delivery || {}) };
  const region = regionForWilaya(wilaya, commune);
  const deliv = DELIVERY_CONFIG[region];
  const feeNum = deliveryType === "home" ? deliv.home : deliv.stopdesk;
  const etaText = deliv.eta[lang];
  const freeNum = Number(d.freeThreshold) || 5000;
  const subtotal = totalPrice;
  const deliveryFee = subtotal > 0 && subtotal >= freeNum ? 0 : feeNum;
  const grandTotal = subtotal + deliveryFee;
  const remainingForFree = freeNum - subtotal;

  if (orderPlaced) {
    const orderRef = orderPlaced.id.slice(-6).toUpperCase();
    const whatsappNum = (store?.whatsapp || delivery?.whatsapp || store?.phone || "213555123456").replace(/[^0-9]/g, "");
    
    const refCodeText = orderReferral ? ` (كود الإحالة: BIRD-${orderReferral.toUpperCase()}-${orderRef})` : ` (كود عمولة الطيور: BIRD-DIRECT-${orderRef})`;
    const whatsappMsgText = lang === "ar"
      ? `مرحباً، لقد قمت بطلب رقم #${orderRef} من موقع Paws & Wings. أود تأكيد الطلب من فضلك.${hasBirdsInOrder ? refCodeText : ""}`
      : `Bonjour, je viens de passer la commande #${orderRef} sur Paws & Wings. Je souhaite confirmer ma commande s'il vous plaît.${hasBirdsInOrder ? ` (Code commission: BIRD-${(orderReferral || "DIRECT").toUpperCase()}-${orderRef})` : ""}`;
    
    const message = encodeURIComponent(whatsappMsgText);
    const waUrl = `https://wa.me/${whatsappNum}?text=${message}`;

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 max-w-lg mx-auto py-12">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {lang === "ar" ? "تم تسجيل طلبك بنجاح!" : lang === "fr" ? "Commande enregistrée !" : "Order Placed Successfully!"}
        </h2>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 w-full my-6 text-left" dir={lang === "ar" ? "rtl" : "ltr"}>
          <p className="text-sm text-gray-600 mb-2 font-medium">
            {lang === "ar" ? "رقم الطلب الخاص بك:" : lang === "fr" ? "Référence de votre commande :" : "Your Order Reference:"}
            <span className="font-mono font-bold text-lg text-emerald-800 ml-2 bg-white px-2.5 py-1 rounded-lg border border-emerald-100 shadow-sm inline-block">
              #{orderRef}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            {lang === "ar"
              ? "طريقة الدفع: الدفع عند الاستلام (COD) فور وصول طلبك."
              : lang === "fr"
              ? "Mode de paiement : espèces à la livraison (COD) dès réception de votre colis."
              : "Payment method: Cash on Delivery (COD) upon receiving your package."}
          </p>
        </div>

        {hasBirdsInOrder && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 w-full mb-6 text-left" dir={lang === "ar" ? "rtl" : "ltr"}>
            <h4 className="font-bold text-amber-900 mb-1.5 flex items-center gap-2 text-sm">
              <span>🐦</span>
              {lang === "ar" ? "رمز عمولة الطيور الخاص بك:" : lang === "fr" ? "Votre code commission oiseaux :" : "Your Bird Commission Code:"}
            </h4>
            <p className="text-xs text-amber-700 leading-relaxed mb-3">
              {lang === "ar" 
                ? "يرجى إرسال هذا الكود أو إظهاره لصاحب المحل لكي يُعلم بأنك مرسول من طرف شريكنا وتأكيد عمولتك." 
                : lang === "fr" 
                ? "Veuillez envoyer ou présenter ce code au propriétaire pour confirmer votre commission de parrainage." 
                : "Please share this code with the shop owner to confirm your referral commission."}
            </p>
            <span className="font-mono font-bold text-base text-amber-900 bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm inline-block">
              BIRD-{(orderReferral || "DIRECT").toUpperCase()}-{orderRef}
            </span>
          </div>
        )}
        <p className="text-gray-500 mb-6 text-sm">
          {lang === "ar"
            ? "يرجى الضغط على الزر أدناه لتأكيد طلبك مباشرة عبر الواتساب معنا للتسليم السريع."
            : lang === "fr"
            ? "Veuillez cliquer ci-dessous pour confirmer votre commande directement via WhatsApp pour une livraison plus rapide."
            : "Please click below to confirm your order via WhatsApp for faster delivery."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#20ba56] transition-colors shadow-md text-sm"
          >
            <MessageCircle className="w-5 h-5 shrink-0" />
            {lang === "ar" ? "تأكيد عبر واتساب" : lang === "fr" ? "Confirmer via WhatsApp" : "Confirm via WhatsApp"}
          </a>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.cart.continueShopping}
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.cart.empty}</h2>
        <p className="text-gray-500 mb-8 max-w-md">{t.cart.emptyDesc}</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.cart.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{t.cart.title}</h1>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-row items-start sm:items-center gap-3 sm:gap-4 relative"
                  >
                    {/* Product Image */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 64px, 80px"
                      />
                    </div>

                    {/* Product Details & Actions */}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      {/* Name & Unit Price */}
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate pr-6 sm:pr-0 rtl:pl-6 rtl:pr-0">
                          {item.name}
                        </h3>
                        <p className="text-emerald-600 font-bold text-xs sm:text-sm mt-0.5 sm:mt-1">
                          {currency}{item.price.toFixed(2)}
                          {item.sold_by && item.sold_by !== "piece" && (
                            <span className="text-[10px] sm:text-xs font-normal text-gray-400">
                              {" "}/{unitLabel(item.sold_by, lang)}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Quantity & Price Summary Row */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-1 sm:mt-0 pt-2 sm:pt-0 border-t border-dashed border-gray-100 sm:border-0">
                        {/* Quantity Selector / Weight Input */}
                        <div className="flex items-center">
                          {isContinuousUnit(item.sold_by) ? (
                            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200/60 rounded-xl px-2.5 py-1">
                              <input
                                type="number"
                                min="0.1"
                                step="0.1"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.productId, Math.max(0.1, Number(e.target.value) || 0.1))}
                                className="w-12 sm:w-16 bg-transparent text-center font-bold text-gray-900 text-xs sm:text-sm focus:outline-none"
                              />
                              <span className="text-[10px] sm:text-xs text-gray-400 font-medium">{unitLabel(item.sold_by, lang)}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200/60 rounded-xl p-0.5">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-bold text-gray-900 text-xs sm:text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Total Price for this item */}
                        <div className="text-right sm:min-w-[90px]">
                          <p className="font-bold text-gray-900 text-sm sm:text-base">
                            {currency}{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button (absolute on mobile for neat spacing, standard on desktop) */}
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="absolute top-3 right-3 sm:relative sm:top-auto sm:right-auto p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100 rtl:left-3 rtl:right-auto sm:rtl:left-auto"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="lg:w-80">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.cart.summary}</h3>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">{t.cart.subtotal}</span>
                    <span className="font-semibold text-gray-900">{currency}{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Truck className="w-4 h-4" />
                      {t.nav.shipping || "Shipping"}
                    </span>
                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                      {t.cart.calculatedAtCheckout || "Calculated at checkout"}
                    </span>
                  </div>

                  {remainingForFree > 0 && (
                    <div className="mt-3">
                      <div className="h-2 rounded-full bg-emerald-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (subtotal / freeNum) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-emerald-600 mt-1.5">
                        {t.cart.freeProgress.replace("{amount}", `${currency}${remainingForFree.toFixed(2)}`)}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-3 border-b border-gray-100 text-lg font-bold text-gray-900">
                    <span>{t.cart.total}</span>
                    <span>{currency}{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="mt-5 flex items-start gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-xl px-3 py-2.5 leading-relaxed">
                    <Truck className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{t.cart.codBadge}</span>
                  </div>

                  <button
                    onClick={() => setCheckingOut(true)}
                    className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                  >
                    {t.cart.checkout}
                  </button>

                  <Link
                    href="/products"
                    className="w-full mt-3 inline-flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {t.cart.continueShopping}
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {checkingOut && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4 pb-10 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t.cart.checkout}</h2>
              <button onClick={() => setCheckingOut(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>

            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 text-sm">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <span className="flex-1 text-gray-700 truncate">{item.name} x{item.quantity}</span>
                  <span className="font-medium text-gray-900">{currency}{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6 space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{t.cart.subtotal}</span>
                <span className="font-medium text-gray-900">{currency}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" />{wilaya} · {etaText}</span>
                <span className="font-medium text-gray-900">
                  {deliveryFee === 0 ? t.cart.free : `${currency}${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              {remainingForFree > 0 && (
                <div className="mt-2">
                  <div className="h-2 rounded-full bg-emerald-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (subtotal / freeNum) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-emerald-600 mt-1.5">{t.cart.freeProgress.replace("{amount}", `${currency}${remainingForFree.toFixed(2)}`)}</p>
                </div>
              )}
              <div className="flex items-center justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>{t.cart.total}</span>
                <span>{currency}{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const fd = new FormData(form);
                const phone = (fd.get("phone") as string) || "";
                if (!isValidAlgerianPhone(phone)) {
                  setPhoneError(t.cart.phoneInvalid);
                  return;
                }
                setPhoneError(null);
                
                const addressDetails = fd.get("address_details") as string || "";
                const fullAddress = deliveryType === "stopdesk"
                  ? `[Stop Desk Yalidine] Commune: ${commune}, Wilaya: ${wilaya}`
                  : `[À Domicile] Adresse: ${addressDetails}, Commune: ${commune}, Wilaya: ${wilaya}`;

                const hasBirds = cartHasBirds;
                const refCode = (fd.get("referral_code") as string || "").trim();
                let notesVal = "";
                if (refCode) {
                  notesVal = `Referral Code: ${refCode}`;
                }
                if (hasBirds) {
                  notesVal = notesVal ? `${notesVal} | Birds Commission Tracked` : `Birds Commission Tracked`;
                  setHasBirdsInOrder(true);
                  setOrderReferral(refCode);
                } else {
                  setHasBirdsInOrder(false);
                  setOrderReferral("");
                }

                const order = {
                  customer_name: fd.get("name") as string,
                  customer_phone: phone,
                  delivery_address: fullAddress,
                  city: wilaya,
                  delivery_area: commune,
                  delivery_fee: deliveryFee,
                  delivery_eta: etaText,
                  items: items.map((i) => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity, sold_by: i.sold_by })),
                  total: grandTotal,
                  notes: notesVal || null,
                  user_id: user?.id || null,
                };
                try {
                  const res = await fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(order),
                  });
                  if (!res.ok) throw new Error("Server error");
                  const createdOrder = await res.json();
                  setOrderPlaced(createdOrder);
                  clearCart();
                } catch (e) {
                  alert(t.cart.orderFailed);
                  return;
                }
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                placeholder={t.cart.namePlaceholder}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder={t.cart.phonePlaceholder}
                inputMode="tel"
                dir="auto"
                required
                onChange={() => phoneError && setPhoneError(null)}
                className={`w-full px-4 py-3 rounded-xl border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${phoneError ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {phoneError && (
                <p className="text-xs text-red-500 mt-1">{phoneError}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.cart.wilaya}</label>
                <select
                  value={wilaya}
                  onChange={(e) => setWilaya(e.target.value)}
                  name="wilaya"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {WILAYAS.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                name="commune"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                placeholder={t.cart.commune}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              {/* Optional Referral Code */}
              <div>
                <input
                  type="text"
                  name="referral_code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder={lang === "ar" ? "كود الإحالة / الشريك (اختياري)" : lang === "fr" ? "Code de parrainage (Optionnel)" : "Referral Code (Optional)"}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {cartHasBirds && (
                  <p className="text-[11px] text-emerald-600 mt-1 font-medium flex items-center gap-1">
                    <span>🐦</span>
                    {lang === "ar" 
                      ? "سيتم إنشاء كود عمولة طيور خاص بك عند إتمام هذا الطلب." 
                      : lang === "fr" 
                      ? "Un code commission oiseaux sera généré pour cette commande." 
                      : "A bird commission code will be generated for this order."}
                  </p>
                )}
              </div>

              {/* Delivery Type Selection */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {lang === "ar" ? "نوع التوصيل" : lang === "fr" ? "Type de livraison" : "Delivery Type"}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("home")}
                    className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${deliveryType === "home" ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/10" : "border-gray-200 hover:bg-gray-50 text-gray-700"}`}
                  >
                    <Home className="w-4 h-4" />
                    {lang === "ar" ? "توصيل للمنزل" : lang === "fr" ? "À domicile" : "Home Delivery"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("stopdesk")}
                    className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${deliveryType === "stopdesk" ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/10" : "border-gray-200 hover:bg-gray-50 text-gray-700"}`}
                  >
                    <Building2 className="w-4 h-4" />
                    {lang === "ar" ? "مكتب ياليدين (Stop)" : lang === "fr" ? "Bureau (Stop)" : "Stop Desk"}
                  </button>
                </div>
              </div>

              {/* Detailed Address field (shown for home delivery) */}
              {deliveryType === "home" && (
                <input
                  type="text"
                  name="address_details"
                  placeholder={lang === "ar" ? "العنوان بالتفصيل (الحي، الشارع، رقم الشقة...)" : lang === "fr" ? "Adresse détaillée (Quartier, Rue, N°...)" : "Detailed Address (Neighborhood, Street, N°...)"}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              )}

              {/* Payment info box */}
              <div className="bg-gray-50 border border-gray-150 rounded-xl p-3 text-xs space-y-1">
                <p className="font-bold text-gray-700 flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                  {lang === "ar" ? "طريقة الدفع المتاحة:" : lang === "fr" ? "Mode de paiement disponible :" : "Available payment method:"}
                </p>
                <p className="text-gray-500 leading-relaxed">
                  {lang === "ar"
                    ? "الدفع عند الاستلام (COD) — الدفع نقداً عند استلام طلبيتك."
                    : lang === "fr"
                    ? "Paiement à la livraison (COD) — payez en espèces à la réception de votre colis."
                    : "Cash on Delivery (COD) — pay cash only when your order is delivered."}
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                {t.cart.placeOrder}
              </button>
              <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
                <Truck className="w-4 h-4 shrink-0" />
                <span className="font-medium">{t.cart.codBadge}</span>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
