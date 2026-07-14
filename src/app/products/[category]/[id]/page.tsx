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
import {
  Star, ChevronRight, Check, ShoppingCart, Plus, Minus, Share2, X, ZoomIn,
  Play, Truck, ShieldCheck, BadgeCheck, Leaf,
} from "lucide-react";

function videoEmbed(url: string) {
  if (!url) return null;
  let m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (m) return { kind: "iframe" as const, src: `https://www.youtube.com/embed/${m[1]}` };
  m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (m) return { kind: "iframe" as const, src: `https://player.vimeo.com/video/${m[1]}` };
  if (/\.mp4(\?.*)?$/i.test(url)) return { kind: "mp4" as const, src: url };
  return { kind: "iframe" as const, src: url };
}

export default function ProductDetailPage() {
  const { t, currency, lang } = useI18n();
  const { products, categories } = useTranslatedData();
  const { addItem } = useCart();
  const { addId } = useRecentlyViewed();
  const params = useParams();
  const product = products.find((p) => p.id === params.id);
  const [qty, setQty] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState<"image" | "video">("image");
  const [tab, setTab] = useState<"overview" | "features" | "ingredients" | "video">("overview");

  useEffect(() => {
    if (product) addId(product.id);
  }, [product?.id]);

  useEffect(() => {
    setActiveMedia("image");
    setTab("overview");
    setQty(1);
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
  const embed = product.video ? videoEmbed(product.video) : null;
  const hasIngredients = !!product.ingredients && product.ingredients.trim().length > 0;
  const hasVideo = !!embed;

  return (
    <>
      <div>
        <section className="bg-white border-b border-gray-100 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
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

        <section className="py-10 lg:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
                {/* Media gallery */}
                <div>
                  <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 group shadow-sm">
                    {activeMedia === "video" && embed ? (
                      embed.kind === "iframe" ? (
                        <iframe
                          src={embed.src}
                          title={product.name}
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video src={embed.src} controls autoPlay className="absolute inset-0 w-full h-full object-contain bg-black" />
                      )
                    ) : (
                      <>
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                          onClick={() => setLightboxOpen(true)}
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center"
                          aria-label="Zoom"
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3 shadow-lg">
                            <ZoomIn className="w-5 h-5 text-gray-700" />
                          </span>
                        </button>
                      </>
                    )}
                    {product.badge && activeMedia !== "video" && (
                      <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${product.badge === "NEW" ? "bg-emerald-600 text-white" : "bg-gray-900 text-white"}`}>
                        {product.badge === "NEW" ? t.products.new : t.products.sale}
                      </span>
                    )}
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setActiveMedia("image")}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-colors ${activeMedia === "image" ? "border-emerald-600" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <Image src={product.image || "/placeholder.svg"} alt={product.name} fill sizes="80px" className="object-cover" />
                    </button>
                    {hasVideo && (
                      <button
                        onClick={() => setActiveMedia("video")}
                        className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-colors bg-gray-900 ${activeMedia === "video" ? "border-emerald-600" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill sizes="80px" className="object-cover opacity-50" />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Info panel */}
                <div className="lg:sticky lg:top-24">
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{catName}</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">{product.name}</h1>

                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900">{product.rating}</span>
                    <span className="text-gray-500 text-sm">({product.reviews} {t.products.reviews})</span>
                  </div>

                  <div className="flex items-end gap-3 mb-6">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {currency}{product.price}
                      {product.sold_by === "weight" && <span className="text-lg font-normal text-gray-400"> /{lang === "ar" ? "كغ" : "kg"}</span>}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xl text-gray-400 line-through mb-1">{currency}{product.originalPrice}</span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

                  {/* Trust badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
                    <div className="flex items-center gap-2 bg-emerald-50/60 rounded-xl px-3 py-2.5">
                      <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-medium text-gray-700">{t.products.trustDelivery}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50/60 rounded-xl px-3 py-2.5">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-medium text-gray-700">{t.products.trustSecure}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50/60 rounded-xl px-3 py-2.5">
                      <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-medium text-gray-700">{t.products.trustQuality}</span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 mb-6" />

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
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          {t.products.addToCart}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-xl">
                          <button
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-900">{qty}</span>
                          <button
                            onClick={() => setQty(qty + 1)}
                            className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => { addItem(product, qty); setQty(1); }}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          {t.products.addToCart}
                        </button>
                      </div>
                    )
                  ) : (
                    <span className="inline-block bg-gray-100 text-gray-500 px-6 py-3.5 rounded-xl font-semibold">
                      {t.products.outOfStock}
                    </span>
                  )}

                  <div className="flex items-center gap-3 mt-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {t.products.inStockLabel}
                    </span>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: product.name, url: window.location.href });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                        }
                      }}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors ms-auto"
                    >
                      <Share2 className="w-4 h-4" />
                      {t.products.share}
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Details tabs */}
            {(product.description || (product.features && product.features.length) || hasIngredients || hasVideo) && (
              <AnimatedSection className="mt-14">
                <div className="border-b border-gray-200">
                  <div className="flex gap-1 sm:gap-2 overflow-x-auto">
                    {product.description && (
                      <button
                        onClick={() => setTab("overview")}
                        className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${tab === "overview" ? "border-emerald-600 text-emerald-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                      >
                        {t.products.tabOverview}
                      </button>
                    )}
                    {product.features && product.features.length > 0 && (
                      <button
                        onClick={() => setTab("features")}
                        className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${tab === "features" ? "border-emerald-600 text-emerald-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                      >
                        {t.products.tabFeatures}
                      </button>
                    )}
                    {hasIngredients && (
                      <button
                        onClick={() => setTab("ingredients")}
                        className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${tab === "ingredients" ? "border-emerald-600 text-emerald-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                      >
                        {t.products.tabIngredients}
                      </button>
                    )}
                    {hasVideo && (
                      <button
                        onClick={() => setTab("video")}
                        className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${tab === "video" ? "border-emerald-600 text-emerald-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                      >
                        {t.products.tabVideo}
                      </button>
                    )}
                  </div>
                </div>

                <div className="py-8">
                  {tab === "overview" && product.description && (
                    <p className="text-gray-600 leading-relaxed max-w-3xl whitespace-pre-line">{product.description}</p>
                  )}
                  {tab === "features" && product.features && product.features.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
                      {product.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span className="text-sm text-gray-700">{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {tab === "ingredients" && hasIngredients && (
                    <div className="max-w-3xl bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Leaf className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold text-gray-900">{t.products.ingredients}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.ingredients}</p>
                    </div>
                  )}
                  {tab === "video" && hasVideo && embed && (
                    <div className="aspect-video w-full max-w-3xl rounded-2xl overflow-hidden border border-gray-100 bg-black">
                      {embed.kind === "iframe" ? (
                        <iframe
                          src={embed.src}
                          title={product.name}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video src={embed.src} controls className="w-full h-full" />
                      )}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            )}
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
