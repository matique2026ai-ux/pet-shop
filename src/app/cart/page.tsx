"use client";

import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n-context";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/animated-section";
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const { t, currency } = useI18n();

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
                      <p className="text-emerald-600 font-medium mt-0.5">{currency}{item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-2">
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
                    <span className="font-semibold text-gray-900">{currency}{totalPrice.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => alert("Checkout coming soon")}
                    className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
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
    </div>
  );
}
