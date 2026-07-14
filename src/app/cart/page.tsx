"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n-context";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/animated-section";
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, CreditCard, CheckCircle, Truck } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings";
import { useAuth } from "@/lib/auth-context";

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

function regionForWilaya(w: string): "setif" | "north" | "south" {
  if (w === "Sétif") return "setif";
  if (SOUTH_WILAYAS.has(w)) return "south";
  return "north";
}

const DELIVERY_BY_REGION = {
  setif: { fee: 200, eta: { en: "24-48h", fr: "24-48h", ar: "24-48 ساعة" } },
  north: { fee: 500, eta: { en: "3-5 days", fr: "3-5 jours", ar: "3-5 أيام" } },
  south: { fee: 800, eta: { en: "5-7 days", fr: "5-7 jours", ar: "5-7 أيام" } },
};

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { t, currency, lang } = useI18n();
  const { user } = useAuth();
  const { delivery } = useSiteSettings();
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [area, setArea] = useState("");
  const [wilaya, setWilaya] = useState("Sétif");
  const [commune, setCommune] = useState("");

  const d = { ...DEFAULT_DELIVERY, ...(delivery || {}) };
  const region = regionForWilaya(wilaya);
  const deliv = DELIVERY_BY_REGION[region];
  const feeNum = deliv.fee;
  const etaText = deliv.eta[lang];
  const freeNum = Number(d.freeThreshold) || 5000;
  const subtotal = totalPrice;
  const deliveryFee = subtotal > 0 && subtotal >= freeNum ? 0 : feeNum;
  const grandTotal = subtotal + deliveryFee;
  const remainingForFree = freeNum - subtotal;

  if (orderPlaced) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.cart.orderConfirmed}</h2>
        <p className="text-gray-500 mb-8 max-w-md">{t.cart.orderConfirmedDesc}</p>
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
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-emerald-600 font-medium mt-0.5">
                        {currency}{item.price.toFixed(2)}
                        {item.sold_by === "weight" && <span className="text-xs font-normal text-gray-400"> /{lang === "ar" ? "كغ" : "kg"}</span>}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.sold_by === "weight" ? (
                        <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2 py-1">
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, Math.max(0.1, Number(e.target.value) || 0.1))}
                            className="w-16 bg-transparent text-center font-medium text-gray-900 text-sm focus:outline-none"
                          />
                          <span className="text-xs text-gray-500">{lang === "ar" ? "كغ" : "kg"}</span>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-medium text-gray-900 text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="text-right min-w-[80px]">
                      <p className="font-semibold text-gray-900">
                        {currency}{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
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
                      {wilaya} · {etaText}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {deliveryFee === 0 ? t.cart.free : `${currency}${deliveryFee.toFixed(2)}`}
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
                    <span>{currency}{grandTotal.toFixed(2)}</span>
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
                const order = {
                  customer_name: fd.get("name") as string,
                  customer_phone: fd.get("phone") as string,
                  delivery_address: `${commune}, ${wilaya}`,
                  city: wilaya,
                  delivery_area: commune,
                  delivery_fee: deliveryFee,
                  delivery_eta: etaText,
                  items: items.map((i) => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity, sold_by: i.sold_by })),
                  total: grandTotal,
                  user_id: user?.id || null,
                };
                try {
                  const res = await fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(order),
                  });
                  if (!res.ok) throw new Error("Server error");
                } catch (e) {
                  alert("Failed to place order. Please try again.");
                  return;
                }
                setOrderPlaced(true);
                clearCart();
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
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
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
