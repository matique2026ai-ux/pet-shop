"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n-context";
import { useTranslatedData } from "@/lib/use-translated-data";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/animated-section";
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, CreditCard, CheckCircle, Truck, MessageCircle, Home, Building2, Banknote, Store, PawPrint } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings";
import { useAuth } from "@/lib/auth-context";
import { unitLabel, isContinuousUnit } from "@/lib/units";
import { formatWhatsAppNumber } from "@/lib/phone-utils";
import { SetifMotorcycleDeliveryBadge } from "@/components/setif-courier-icon";
import { setCookie, getCookie } from "@/lib/cookies";

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

function VisaIcon({ className = "h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" rx="3" fill="#1434CB"/>
      <path d="M14.5 16.5H12.3L13.7 7.5H15.9L14.5 16.5ZM23.4 7.7C22.9 7.5 22.1 7.3 21.2 7.3C18.9 7.3 17.3 8.5 17.3 10.2C17.3 11.5 18.4 12.2 19.3 12.6C20.2 13 20.5 13.3 20.5 13.7C20.5 14.3 19.8 14.6 19.1 14.6C18.1 14.6 17.3 14.3 16.7 14L16.3 15.8C17 16.1 18.1 16.4 19.3 16.4C21.7 16.4 23.3 15.2 23.3 13.4C23.3 10.9 19.8 10.7 19.8 9.7C19.8 9.3 20.2 8.9 21.1 8.9C21.8 8.9 22.5 9.1 23 9.3L23.4 7.7ZM28.5 7.5H26.8C26.1 7.5 25.6 7.9 25.4 8.5L21.7 16.5H24.1L24.6 15.2H27.5L27.8 16.5H30L28.5 7.5ZM25.2 13.4L26.3 10.3L27 13.4H25.2ZM11.1 7.5L8.9 13.6L8.7 12.3C8.4 11.2 8.1 10.7 7.4 10.3C6.7 9.9 5.6 9.5 4.5 9.3L4.6 8.9H7.9C8.7 8.9 9.4 9.4 9.6 10.2L10.3 13.8L11.1 7.5Z" fill="white"/>
    </svg>
  );
}

function MastercardIcon({ className = "h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="24" rx="3" fill="#252525"/>
      <circle cx="14" cy="12" r="7" fill="#EB001B"/>
      <circle cx="22" cy="12" r="7" fill="#F79E1B" fillOpacity="0.9"/>
      <path d="M18 6.8A6.97 6.97 0 0 0 15.4 12A6.97 6.97 0 0 0 18 17.2A6.97 6.97 0 0 0 20.6 12A6.97 6.97 0 0 0 18 6.8Z" fill="#FF5F00"/>
    </svg>
  );
}

import { WILAYAS, WILAYAS_AR } from "@/lib/wilayas";

const SOUTH_WILAYAS = new Set([
  "Adrar", "Béchar", "Tindouf", "Tamanrasset", "Ouargla", "Illizi",
  "El Oued", "Ghardaïa", "Biskra", "Laghouat", "El Bayadh", "Naâma",
  "Timimoun", "Bordj Badji Mokhtar", "Béni Abbès", "In Salah", "In Guezzam",
  "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
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
    stopdesk: 200,
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
  const { t, currency, lang, dir } = useI18n();
  const { user } = useAuth();
  const { store, delivery } = useSiteSettings();
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<{ id: string, delivery_address?: string } | null>(null);
  const [area, setArea] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [deliveryType, setDeliveryType] = useState<"home" | "stopdesk" | "pickup" | "">("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [hasPreFilledInfo, setHasPreFilledInfo] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const [orderReferral, setOrderReferral] = useState("");
  const [hasBirdsInOrder, setHasBirdsInOrder] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedRef = getCookie("pawswings_referral") || localStorage.getItem("pet_shop_referral") || "";
        setReferralCode(storedRef);

        const cookieVal = getCookie("pawswings_customer_info");
        const raw = cookieVal || localStorage.getItem("pawswings_customer_info");
        if (raw) {
          const c = JSON.parse(raw);
          if (c.name) setCustomerName(c.name);
          if (c.phone) setCustomerPhone(c.phone);
          if (c.wilaya) setWilaya(c.wilaya);
          if (c.commune) setCommune(c.commune);
          if (c.addressDetails) setAddressDetails(c.addressDetails);
          setHasPreFilledInfo(true);
        }
      } catch (e) {
        console.error("Error reading customer cookie:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (checkingOut && !orderPlaced) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [checkingOut, orderPlaced]);

  const cartHasBirds = items.some((item) => {
    const p = products.find((p: any) => p.id === item.productId);
    if (!p) return false;
    const cat = p.category?.toLowerCase() || "";
    const sub = p.subcategory?.toLowerCase() || "";
    
    // Check if it's a known animal category
    const isAnimalCategory = ["birds", "cats", "dogs", "fish", "small-pets", "pets", "live-animals"].includes(cat);
    
    // Check if the subcategory implies it's a product, not a live animal
    const nonLivingSubcategories = ["food", "cages", "accessories", "toys", "health", "beds", "bowls", "grooming", "litter", "aquariums"];
    const isNonLiving = nonLivingSubcategories.some(term => sub.includes(term));
    
    // Flag as live animal ONLY if it's in an animal category AND doesn't have a non-living subcategory
    return isAnimalCategory && !isNonLiving;
  });
  
  const cartHasOther = items.some((item) => {
    const p = products.find((p: any) => p.id === item.productId);
    if (!p) return true;
    const cat = p.category?.toLowerCase() || "";
    const sub = p.subcategory?.toLowerCase() || "";
    const isAnimalCategory = ["birds", "cats", "dogs", "fish", "small-pets", "pets", "live-animals"].includes(cat);
    const nonLivingSubcategories = ["food", "cages", "accessories", "toys", "health", "beds", "bowls", "grooming", "litter", "aquariums"];
    const isNonLiving = nonLivingSubcategories.some(term => sub.includes(term));
    const isLiveAnimal = isAnimalCategory && !isNonLiving;
    return !isLiveAnimal;
  });
  
  const hasMixedCart = cartHasBirds && cartHasOther;

  const d = { ...DEFAULT_DELIVERY, ...(delivery || {}) };
  const region = regionForWilaya(wilaya, commune);
  const deliv = DELIVERY_CONFIG[region];
  const feeNum = deliveryType === "pickup" ? 0 : (wilaya ? (deliveryType === "home" ? deliv.home : deliv.stopdesk) : 0);
  const etaText = deliveryType === "pickup" ? t.cart.readyNow : (wilaya ? deliv.eta[lang] : "");
  const freeNum = Number(d.freeThreshold) || 5000;
  const subtotal = totalPrice;
  const deliveryFee = subtotal > 0 && subtotal >= freeNum ? 0 : feeNum;
  const grandTotal = subtotal + deliveryFee;
  const remainingForFree = freeNum - subtotal;

  if (orderPlaced) {
    const orderRef = orderPlaced.id.slice(-6).toUpperCase();
    const whatsappNum = formatWhatsAppNumber(store?.whatsapp || delivery?.whatsapp || store?.phone, "213776075355");
    
    const refCodeText = orderReferral ? ` (كود الإحالة: BIRD-${orderReferral.toUpperCase()}-${orderRef})` : ` (كود عمولة الطيور: BIRD-DIRECT-${orderRef})`;
    const isPickup = orderPlaced.delivery_address === "[Pickup] الاستلام من المحل";
    const waTextPickup = lang === "ar"
      ? `مرحباً، لقد قمت بطلب رقم #${orderRef} من موقع Paws & Wings وسأقوم باستلامه من المحل. كود الإحالة الخاص بي هو: BIRD-${(orderReferral || "DIRECT").toUpperCase()}-${orderRef}`
      : `Bonjour, je viens de passer la commande #${orderRef} sur Paws & Wings. Je passerai la récupérer en magasin. Mon code de parrainage est: BIRD-${(orderReferral || "DIRECT").toUpperCase()}-${orderRef}`;
    
    const whatsappMsgText = isPickup ? waTextPickup : (lang === "ar"
      ? `مرحباً، لقد قمت بطلب رقم #${orderRef} من موقع Paws & Wings. أود تأكيد الطلب من فضلك.${hasBirdsInOrder ? refCodeText : ""}`
      : `Bonjour, je viens de passer la commande #${orderRef} sur Paws & Wings. Je souhaite confirmer ma commande s'il vous plaît.${hasBirdsInOrder ? ` (Code commission: BIRD-${(orderReferral || "DIRECT").toUpperCase()}-${orderRef})` : ""}`);
    
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

        {orderPlaced.delivery_address === "[Pickup] الاستلام من المحل" ? (
          <div className="bg-amber-50 text-amber-900 border border-amber-200 rounded-xl p-5 mb-8 w-full max-w-sm text-right" dir="auto">
            <h3 className="font-bold mb-2 flex items-center justify-center gap-2 text-center">
              <Store className="w-5 h-5 text-amber-600" />
              {lang === "ar" ? "استلام من المحل" : "Retrait en magasin"}
            </h3>
            <p className="text-sm mb-4 leading-relaxed text-center">
              {lang === "ar" 
                ? "يرجى التوجه إلى المحل واستلام طلبك. أعطِ هذا الكود لصاحب المحل لكي يعرف أنك من طرفنا:" 
                : "Veuillez vous présenter au magasin pour récupérer votre commande. Donnez ce code au propriétaire pour qu'il sache que vous venez de notre part :"}
            </p>
            <div className="bg-white px-4 py-3 rounded-lg border-2 border-dashed border-amber-300 text-center font-mono font-bold text-lg tracking-wider text-amber-700">
              BIRD-{orderReferral ? orderReferral.toUpperCase() : "DIRECT"}-{orderRef}
            </div>
            <p className="text-xs text-amber-600 mt-3 text-center">
              {lang === "ar" ? "احتفظ بهذا الكود كمرجعية." : "Gardez ce code comme référence."}
            </p>
          </div>
        ) : (
          hasBirdsInOrder && (
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
          )
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
          <button
            onClick={async () => {
              if (!confirm(lang === "ar" ? "هل أنت متأكد أنك تريد إلغاء هذا الطلب؟" : lang === "fr" ? "Êtes-vous sûr de vouloir annuler cette commande ?" : "Are you sure you want to cancel this order?")) return;
              try {
                // If the user has a token in localStorage or cookies, we could pass it.
                // Assuming auth-context sets a session in supabase.
                const supabase = (await import("@/lib/supabase")).createClient();
                const { data: { session } } = await supabase.auth.getSession();
                
                const res = await fetch(`/api/orders/${orderPlaced.id}/cancel`, {
                  method: "POST",
                  headers: {
                    ...(session?.access_token ? { "Authorization": `Bearer ${session.access_token}` } : {})
                  }
                });
                
                if (res.ok) {
                  alert(lang === "ar" ? "تم إلغاء الطلب بنجاح" : lang === "fr" ? "Commande annulée avec succès" : "Order cancelled successfully");
                  window.location.href = "/";
                } else {
                  const err = await res.json();
                  alert((lang === "ar" ? "تعذر إلغاء الطلب: " : "Error: ") + (err.error || ""));
                }
              } catch (e) {
                console.error(e);
              }
            }}
            className="inline-flex items-center justify-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors shadow-sm text-sm border border-red-200"
          >
            {lang === "ar" ? "إلغاء الطلب" : lang === "fr" ? "Annuler la commande" : "Cancel Order"}
          </button>
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
    <div className="bg-[#F8F7F4] min-h-screen pb-20" dir={dir}>
      {/* ══════════════════════════════════
          CREATIVE CART HERO
      ══════════════════════════════════ */}
      <section className="relative overflow-hidden py-14 lg:py-20 bg-gradient-to-br from-[#0F1913] via-[#1C2C22] to-[#0A120D] text-white mb-8">
        {/* Glow & Paw Decor */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F5851F]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
        <PawPrint className="absolute top-8 left-[6%] w-24 h-24 text-white/5 rotate-[-20deg] pointer-events-none select-none" />
        <PawPrint className="absolute bottom-8 right-[8%] w-32 h-32 text-white/5 rotate-[15deg] pointer-events-none select-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#F1C290] text-xs sm:text-sm font-semibold mb-3 shadow-sm">
              <ShoppingBag className="w-4 h-4 text-[#F5851F]" />
              <span>{t.cart.title || "Shopping Cart"}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-2">
              {t.cart.title || "عربة التسوق"}
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/70 max-w-xl">
              {dir === "rtl"
                ? "مراجعة المنتجات المختارة وإكمال الطلب في ثوانٍ معدودة مع التوصيل لجميع الولايات"
                : "Vérifiez vos articles et finalisez votre commande en toute sécurité."}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex flex-col lg:flex-row gap-8 items-start w-full overflow-hidden">
              <div className="flex-1 min-w-0 w-full space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.selectedVariant || "default"}`}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-row items-start sm:items-center gap-3 sm:gap-4 relative overflow-hidden"
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
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 pr-6 sm:pr-0 rtl:pl-6 rtl:pr-0">
                          {item.name}
                        </h3>
                        {item.selectedVariant && (
                          <div className="mt-1">
                            <span className="inline-block text-[10px] sm:text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100/50">
                              {item.selectedVariant}
                            </span>
                          </div>
                        )}
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
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-1 sm:mt-0 pt-2 sm:pt-0 border-t border-dashed border-gray-100 sm:border-0 shrink-0">
                        {/* Quantity Selector / Weight Input */}
                        <div className="flex items-center">
                          {isContinuousUnit(item.sold_by) ? (
                            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200/60 rounded-xl px-2.5 py-1">
                              <input
                                type="number"
                                min="0.1"
                                step="0.1"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.productId, Math.max(0.1, Number(e.target.value) || 0.1), item.selectedVariant)}
                                className="w-12 sm:w-16 bg-transparent text-center font-bold text-gray-900 text-xs sm:text-sm focus:outline-none"
                              />
                              <span className="text-[10px] sm:text-xs text-gray-400 font-medium">{unitLabel(item.sold_by, lang)}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200/60 rounded-xl p-0.5">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedVariant)}
                                disabled={item.quantity <= 1}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-bold text-gray-900 text-xs sm:text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedVariant)}
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
                      onClick={() => removeItem(item.productId, item.selectedVariant)}
                      className="absolute top-3 right-3 sm:relative sm:top-auto sm:right-auto p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100 rtl:left-3 rtl:right-auto sm:rtl:left-auto"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="w-full lg:w-80 lg:shrink-0">
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

                  {hasMixedCart ? (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                      ⚠️ {lang === "ar" ? "لا يمكن جمع كائنات حية مع منتجات أخرى في نفس الطلب. يرجى فصلهما في طلبين (طلب استلام للمحل، وطلب توصيل للمنتجات)."
                          : lang === "fr" ? "Vous ne pouvez pas mélanger des animaux vivants avec d'autres produits. Veuillez les séparer en deux commandes (retrait pour les animaux, livraison pour le reste)."
                          : "Cannot mix live animals with other products. Please split into two orders."}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        // Auto-set the delivery type based on cart contents
                        if (cartHasBirds) {
                          setDeliveryType("pickup");
                        } else if (deliveryType === "pickup" || deliveryType === "") {
                          setDeliveryType("home");
                        }
                        setCheckingOut(true);
                      }}
                      className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                    >
                      {t.cart.checkout}
                    </button>
                  )}

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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-6 sm:p-8 my-auto relative max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{t.cart.checkout}</h2>
                  <p className="text-xs text-gray-500">{lang === "ar" ? "أدخل بيانات التوصيل لإكمال طلبك في ثوانٍ" : "Remplissez vos coordonnées de livraison"}</p>
                </div>
              </div>
              <button
                onClick={() => setCheckingOut(false)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center text-xl transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* ── LEFT COLUMN (5/12): Order Summary & Items ── */}
              <div className="lg:col-span-5 bg-[#FBF9F5] rounded-2xl p-5 border border-[#EFEBE4] space-y-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 border-b border-gray-200/60 pb-2.5">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>{lang === "ar" ? "ملخص طلبك" : "Récapitulatif"} ({items.length})</span>
                </h3>

                {/* Items List */}
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 text-sm bg-white p-2.5 rounded-xl border border-gray-100">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-xs truncate">{item.name}</p>
                        <p className="text-[11px] text-gray-400">x{item.quantity} {item.selectedVariant ? `· ${item.selectedVariant}` : ""}</p>
                      </div>
                      <span className="font-bold text-gray-900 text-xs shrink-0">{currency}{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Price Calculation */}
                <div className="border-t border-gray-200/60 pt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>{t.cart.subtotal}</span>
                    <span className="font-semibold text-gray-900">{currency}{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-emerald-600" />{wilaya ? `${wilaya} · ${etaText}` : (t.nav.shipping || "Shipping")}</span>
                    <span className="font-semibold text-gray-900">
                      {!wilaya ? "-" : (deliveryFee === 0 ? t.cart.free : `${currency}${deliveryFee.toFixed(2)}`)}
                    </span>
                  </div>
                  {remainingForFree > 0 && (
                    <div className="mt-2 pt-1 border-t border-dashed border-gray-200">
                      <div className="h-1.5 rounded-full bg-emerald-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (subtotal / freeNum) * 100)}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-emerald-700 mt-1 font-medium">{t.cart.freeProgress.replace("{amount}", `${currency}${remainingForFree.toFixed(2)}`)}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                    <span>{t.cart.total}</span>
                    <span className="text-emerald-700">{currency}{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* COD Guarantee */}
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium rounded-xl p-2.5 flex items-center gap-2">
                  <Truck className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{t.cart.codBadge}</span>
                </div>
              </div>

              {/* ── RIGHT COLUMN (7/12): Form Inputs ── */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (deliveryType === "") return;
                  
                  const fd = new FormData(e.currentTarget);
                  const phone = (fd.get("phone") as string) || "";
                  if (!isValidAlgerianPhone(phone)) {
                    setPhoneError(t.cart.phoneInvalid);
                    return;
                  }
                  setPhoneError(null);
                  
                  const addressDetails = fd.get("address_details") as string || "";
                  const fullAddress = deliveryType === "pickup"
                    ? "[Pickup] الاستلام من المحل"
                    : (deliveryType === "stopdesk"
                      ? `[Stop Desk] Commune: ${commune}, Wilaya: ${wilaya}`
                      : `[À Domicile] Adresse: ${addressDetails}, Commune: ${commune}, Wilaya: ${wilaya}`);

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
                    city: deliveryType === "pickup" ? "" : wilaya,
                    delivery_area: deliveryType === "pickup" ? "" : commune,
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

                    // Save customer info to cookie and localStorage for 180 days for fast 1-click future checkout
                    const savedInfo = {
                      name: fd.get("name") as string,
                      phone,
                      wilaya,
                      commune,
                      addressDetails,
                    };
                    setCookie("pawswings_customer_info", JSON.stringify(savedInfo), 180);
                    try {
                      localStorage.setItem("pawswings_customer_info", JSON.stringify(savedInfo));
                    } catch {}

                    setOrderPlaced(createdOrder);
                    setCheckingOut(false);
                    if (typeof document !== "undefined") {
                      document.body.style.overflow = "";
                    }
                    clearCart();
                  } catch (e) {
                    alert(t.cart.orderFailed);
                    return;
                  }
                }}
                className="lg:col-span-7 space-y-4"
              >
                {hasPreFilledInfo && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{lang === "ar" ? "⚡ تم استرجاع بياناتك تلقائياً لسرعة الطلب." : "⚡ Vos coordonnées ont été pré-remplies."}</span>
                  </div>
                )}

                {/* 2-Column Name & Phone Inputs on Desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{t.cart.namePlaceholder}</label>
                    <input
                      type="text"
                      name="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={t.cart.namePlaceholder}
                      required
                      onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(lang === "ar" ? "يرجى ملء هذا الحقل" : lang === "fr" ? "Veuillez renseigner ce champ" : "Please fill out this field")}
                      onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{t.cart.phonePlaceholder}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        if (phoneError) setPhoneError(null);
                      }}
                      placeholder={t.cart.phonePlaceholder}
                      inputMode="tel"
                      dir="auto"
                      required
                      onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(lang === "ar" ? "يرجى ملء هذا الحقل" : lang === "fr" ? "Veuillez renseigner ce champ" : "Please fill out this field")}
                      onInput={(e) => {
                        (e.target as HTMLInputElement).setCustomValidity("");
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm ${phoneError ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    />
                    {phoneError && (
                      <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                    )}
                  </div>
                </div>

                {/* Delivery Type Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {lang === "ar" ? "طريقة الاستلام والتوصيل" : lang === "fr" ? "Mode de livraison et retrait" : "Delivery & Pickup Method"}
                  </label>
                  
                  {cartHasBirds ? (
                    <div className="space-y-2">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-800 leading-relaxed" dir={lang === "ar" ? "rtl" : "ltr"}>
                        <p className="font-bold mb-0.5">⚠️ {lang === "ar" ? "تنبيه هام:" : "Avis important :"}</p>
                        {lang === "ar" 
                          ? "سلة المشتريات تحتوي على طيور/كائنات حية. يرجى استلام الطلب مباشرة من المحل."
                          : "Votre panier contient des animaux vivants. Veuillez récupérer votre commande au magasin."}
                      </div>
                      <button
                        type="button"
                        onClick={() => setDeliveryType("pickup")}
                        className="w-full px-3 py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 border-amber-600 bg-amber-50 text-amber-800 ring-2 ring-amber-600/20"
                      >
                        <Store className="w-4 h-4 shrink-0" />
                        <span>{lang === "ar" ? "استلام من المحل (إجباري للطيور)" : "Retrait en magasin"}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryType("home")}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${deliveryType === "home" ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/10" : "border-gray-200 hover:bg-gray-50 text-gray-700"}`}
                      >
                        <Home className="w-4 h-4 shrink-0" />
                        <span className="truncate">{lang === "ar" ? "توصيل للمنزل" : "À domicile"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryType("stopdesk")}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${deliveryType === "stopdesk" ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/10" : "border-gray-200 hover:bg-gray-50 text-gray-700"}`}
                      >
                        <Building2 className="w-4 h-4 shrink-0" />
                        <span className="truncate">{lang === "ar" ? "مكتب التوصيل" : "Bureau de livraison"}</span>
                      </button>
                    </div>
                  )}

                  {deliveryType === "" && (
                    <p className="text-xs text-red-500 mt-1">{lang === "ar" ? "يرجى اختيار نوع التوصيل." : "Veuillez choisir un type de livraison."}</p>
                  )}
                </div>

                {/* Conditional Address Fields (2-Column Wilaya & Commune) */}
                {(deliveryType === "home" || deliveryType === "stopdesk") && (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">{t.cart.wilaya}</label>
                        <select
                          value={wilaya}
                          onChange={(e) => {
                            (e.target as HTMLSelectElement).setCustomValidity("");
                            setWilaya(e.target.value);
                          }}
                          onInvalid={(e) => (e.target as HTMLSelectElement).setCustomValidity(lang === "ar" ? "يرجى اختيار ولاية" : lang === "fr" ? "Veuillez sélectionner une wilaya" : "Please select a wilaya")}
                          name="wilaya"
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                        >
                          <option value="" disabled hidden>{lang === "ar" ? "اختر الولاية" : "Sélectionnez une wilaya"}</option>
                          {WILAYAS.map((w, i) => (
                            <option key={w} value={w}>{lang === "ar" ? WILAYAS_AR[i] : w}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">{t.cart.commune}</label>
                        <input
                          type="text"
                          name="commune"
                          value={commune}
                          onChange={(e) => setCommune(e.target.value)}
                          placeholder={t.cart.commune}
                          required
                          onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(lang === "ar" ? "يرجى ملء هذا الحقل" : lang === "fr" ? "Veuillez renseigner ce champ" : "Please fill out this field")}
                          onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                        />
                      </div>
                    </div>

                    {(wilaya === "Sétif" || isSetifCommune(commune)) && (
                      <SetifMotorcycleDeliveryBadge className="mt-1" />
                    )}

                    {deliveryType === "home" && (
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          {lang === "ar" ? "العنوان بالتفصيل" : "Adresse détaillée"}
                        </label>
                        <input
                          type="text"
                          name="address_details"
                          value={addressDetails}
                          onChange={(e) => setAddressDetails(e.target.value)}
                          placeholder={lang === "ar" ? "الحي، الشارع، رقم المنزل/الشقة..." : "Quartier, Rue, N°..."}
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Optional Referral Code */}
                <div>
                  <input
                    type="text"
                    name="referral_code"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder={lang === "ar" ? "كود الإحالة / الشريك (اختياري)" : "Code de parrainage (Optionnel)"}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-gray-900 text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Payment info box */}
                <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-700 flex items-center gap-1.5 text-xs">
                      <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                      {lang === "ar" ? "طريقة الدفع:" : "Paiement :"}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <VisaIcon className="h-4 rounded" />
                      <MastercardIcon className="h-4 rounded" />
                    </div>
                  </div>
                  <p className="text-gray-500 leading-relaxed text-[11px]">
                    {lang === "ar" ? "الدفع عند الاستلام (COD) — تدفع نقداً لموزّع التوصيل عند استلام الطلبية." : "Paiement à la livraison (COD) à la réception."}
                  </p>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3.5 rounded-xl font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 text-sm sm:text-base"
                >
                  <CreditCard className="w-5 h-5" />
                  {t.cart.placeOrder}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
