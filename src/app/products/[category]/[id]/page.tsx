"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { useTranslatedData } from "@/lib/use-translated-data";
import { useCart } from "@/lib/cart-context";
import { useRecentlyViewed } from "@/lib/use-recently-viewed";
import AnimatedSection from "@/components/animated-section";
import ProductCard from "@/components/product-card";
import { Star, ChevronRight, Check, ShoppingCart, Plus, Minus, Share2, X, ZoomIn } from "lucide-react";

export default function ProductDetailPage() {
  const { t, currency, lang } = useI18n();
  const { products, categories } = useTranslatedData();
  const { addItem } = useCart();
  const { addId } = useRecentlyViewed();
  const params = useParams();
  const product = products.find((p) => p.id === params.id);
  const [qty, setQty] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (product) addId(product.id);
  }, [product?.id]);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t.products.notFound}</h1>
        <Link href="/products" className="text-emerald-600 hover:underline">{t.products.viewAll}</Link>
      </div>
    );
  }

  const catName = categories.find((c) => c.id === product.category)?.name ?? product.category;

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <>
      <div>
        <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-emerald-600">{t.products.breadcrumbHome}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-emerald-600">{t.products.title}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/products/${product.category}`} className="hover:text-emerald-600">{catName}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 cursor-pointer group" onClick={() => setLightboxOpen(true)}>
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2 shadow-lg">
                    <ZoomIn className="w-5 h-5 text-gray-700" />
                  </span>
                </div>
                {product.badge && (
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${product.badge === "NEW" ? "bg-emerald-600 text-white" : "bg-gray-900 text-white"}`}>
                    {product.badge === "NEW" ? t.products.new : t.products.sale}
                  </span>
                )}
              </div>

              <div>
                <div className="mb-2">
                  <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">{catName}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                  <span className="font-semibold text-gray-900">{product.rating}</span>
                  <span className="text-gray-500 text-sm">({product.reviews} {t.products.reviews})</span>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {currency}{product.price}
                    {product.sold_by === "weight" && <span className="text-base font-normal text-gray-400"> /{lang === "ar" ? "كغ" : "kg"}</span>}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">{currency}{product.originalPrice}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: product.name, url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    {t.products.share}
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {product.inStock ? (
                  product.sold_by === "weight" ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={qty}
                          onChange={(e) => setQty(Math.max(0.1, Number(e.target.value) || 0.1))}
                          className="w-20 bg-transparent text-center font-semibold text-gray-900 focus:outline-none"
                        />
                        <span className="text-sm text-gray-500">{lang === "ar" ? "كغ" : "kg"}</span>
                      </div>
                      <button
                        onClick={() => { addItem(product, qty); setQty(1); }}
                        className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {t.products.addToCart}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-xl">
                        <button
                          onClick={() => setQty(Math.max(1, qty - 1))}
                          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900">{qty}</span>
                        <button
                          onClick={() => setQty(qty + 1)}
                          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => { addItem(product, qty); setQty(1); }}
                        className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {t.products.addToCart}
                      </button>
                    </div>
                  )
                ) : (
                  <span className="inline-block bg-gray-100 text-gray-500 px-6 py-3 rounded-xl font-semibold">
                    {t.products.outOfStock}
                  </span>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-12 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t.products.relatedTitle}</h2>
            <AnimatedSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-8">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} variant="related" />
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 text-white/70 hover:text-white z-10">
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill sizes="(max-width: 768px) 100vw, 56rem" className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
