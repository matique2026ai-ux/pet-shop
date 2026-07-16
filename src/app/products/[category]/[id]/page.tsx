"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { useTranslatedData } from "@/lib/use-translated-data";
import { useCart } from "@/lib/cart-context";
import { useRecentlyViewed } from "@/lib/use-recently-viewed";
import { useSiteSettings } from "@/lib/site-settings";
import AnimatedSection from "@/components/animated-section";
import ProductCard from "@/components/product-card";
import ProductReviews from "@/components/product-reviews";
import {
  Star, ChevronRight, Check, ShoppingCart, Plus, Minus, Share2, X, ZoomIn,
  Play, Truck, ShieldCheck, BadgeCheck, Leaf, Ticket, MessageCircle,
} from "lucide-react";
import { unitLabel, isContinuousUnit } from "@/lib/units";

function videoEmbed(url: string) {
  if (!url) return null;
  let m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (m) return { kind: "iframe" as const, src: `https://www.youtube.com/embed/${m[1]}` };
  m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (m) return { kind: "iframe" as const, src: `https://player.vimeo.com/video/${m[1]}` };
  if (/\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url)) return { kind: "mp4" as const, src: url };
  return { kind: "iframe" as const, src: url };
}



function PawIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3z"/>
      <circle cx="6.5" cy="11.5" r="1.5" />
      <circle cx="10" cy="8.5" r="1.5" />
      <circle cx="14" cy="8.5" r="1.5" />
      <circle cx="17.5" cy="11.5" r="1.5" />
    </svg>
  );
}

function BirdFootprintIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" className={className}>
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="12" y1="14" x2="6" y2="9" />
      <line x1="12" y1="14" x2="18" y2="9" />
      <line x1="12" y1="14" x2="12" y2="21" />
    </svg>
  );
}

function FootprintDecorations({ category }: { category: string }) {
  const isBird = category === "birds";
  
  if (isBird) {
    return (
      <>
        <div className="absolute top-10 left-8 text-[#C4933F] opacity-10 pointer-events-none w-12 h-12 rotate-12">
          <BirdFootprintIcon className="w-full h-full" />
        </div>
        <div className="absolute top-1/3 right-10 text-[#C4933F] opacity-10 pointer-events-none w-10 h-10 -rotate-45">
          <BirdFootprintIcon className="w-full h-full" />
        </div>
        <div className="absolute bottom-24 left-10 text-[#C4933F] opacity-10 pointer-events-none w-10 h-10 rotate-45">
          <BirdFootprintIcon className="w-full h-full" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="absolute top-10 left-8 text-[#C4933F] opacity-10 pointer-events-none w-12 h-12 rotate-12">
        <PawIcon className="w-full h-full" />
      </div>
      <div className="absolute top-1/3 right-10 text-[#C4933F] opacity-10 pointer-events-none w-10 h-10 -rotate-12">
        <PawIcon className="w-full h-full" />
      </div>
      <div className="absolute bottom-24 left-10 text-[#C4933F] opacity-10 pointer-events-none w-10 h-10 rotate-45">
        <PawIcon className="w-full h-full" />
      </div>
    </>
  );
}

export default function ProductDetailPage() {
  const { t, currency, lang } = useI18n();
  const { products, categories } = useTranslatedData();
  const { addItem } = useCart();
  const { addId } = useRecentlyViewed();
  const params = useParams();
  const { store, delivery } = useSiteSettings();
  const product = products.find((p) => p.id === params.id);
  const [qty, setQty] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState<"image" | "video">("image");
  const [activeImage, setActiveImage] = useState("");
  const [tab, setTab] = useState<"overview" | "features" | "ingredients" | "video">("overview");
  
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleOpenReferralModal = () => {
    if (!product) return;
    const ref = typeof window !== "undefined" ? localStorage.getItem("pet_shop_referral") || "" : "";
    const cleanRef = ref.trim().replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const prodIdPart = product.id.slice(-6).toUpperCase();
    const randPart = Math.random().toString(36).substring(2, 7).toUpperCase();
    const code = `TJB-BIRD-${cleanRef ? cleanRef + "-" : ""}${prodIdPart}-${randPart}`;
    setGeneratedCode(code);
    setReferralModalOpen(true);
    setCopied(false);
  };

  useEffect(() => {
    if (product) addId(product.id);
  }, [product?.id]);

  useEffect(() => {
    setActiveMedia("image");
    setTab("overview");
    setQty(1);
    setActiveImage(product?.image || "");
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
  const storeName = store?.storeName || store?.name || (
    lang === "ar"
      ? "طيور الجمال والجواد"
      : "Paws & Wings"
  );

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

        <section className="py-8 lg:py-12 bg-gray-50/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-6 sm:p-8 space-y-6">
                
                {/* Background decorative animal footprint patterns */}
                <FootprintDecorations category={product.category} />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  {/* Left Side: Product Image & Video Trigger */}
                  <div className="md:col-span-5 flex flex-col items-center gap-4">
                    <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-white rounded-2xl p-4 flex items-center justify-center border border-gray-100 shadow-sm group">
                      {activeMedia === "video" && embed ? (
                        embed.kind === "iframe" ? (
                          <iframe
                            src={embed.src}
                            title={product.name}
                            className="absolute inset-0 w-full h-full rounded-2xl"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video src={embed.src} controls autoPlay className="absolute inset-0 w-full h-full object-contain bg-black rounded-2xl" />
                        )
                      ) : (
                        <>
                          <Image
                            src={activeImage || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            priority
                            className="object-contain p-4 transition-transform duration-550 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 30vw"
                          />
                          <button
                            onClick={() => setLightboxOpen(true)}
                            className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center rounded-2xl"
                            aria-label={t.products.zoom}
                          >
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 rounded-full p-2.5 shadow-md">
                              <ZoomIn className="w-4 h-4 text-gray-600" />
                            </span>
                          </button>
                        </>
                      )}
                    </div>

                    {/* Gallery Thumbnails */}
                    {((product.images && product.images.length > 0) || hasVideo) && (
                      <div className="flex flex-wrap items-center justify-center gap-2 mt-2 max-w-full">
                        {/* Main Cover Image Thumbnail */}
                        <button
                          onClick={() => {
                            setActiveMedia("image");
                            setActiveImage(product.image);
                          }}
                          className={`relative w-12 h-12 rounded-lg border bg-white overflow-hidden p-1 transition-all ${
                            activeMedia === "image" && activeImage === product.image
                              ? "border-emerald-600 ring-2 ring-emerald-600/20"
                              : "border-gray-200 hover:border-emerald-600"
                          }`}
                        >
                          <div className="relative w-full h-full">
                            <Image src={product.image} alt={product.name} fill className="object-contain" />
                          </div>
                        </button>

                        {/* Additional Images Thumbnails */}
                        {product.images?.map((imgUrl, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setActiveMedia("image");
                              setActiveImage(imgUrl);
                            }}
                            className={`relative w-12 h-12 rounded-lg border bg-white overflow-hidden p-1 transition-all ${
                              activeMedia === "image" && activeImage === imgUrl
                                ? "border-emerald-600 ring-2 ring-emerald-600/20"
                                : "border-gray-200 hover:border-emerald-600"
                            }`}
                          >
                            <div className="relative w-full h-full">
                              <Image src={imgUrl} alt={`${product.name} - gallery ${idx + 1}`} fill className="object-contain" />
                            </div>
                          </button>
                        ))}

                        {/* Video Thumbnail */}
                        {hasVideo && (
                          <button
                            onClick={() => {
                              setActiveMedia("video");
                            }}
                            className={`relative w-12 h-12 rounded-lg border bg-gray-900 overflow-hidden flex items-center justify-center transition-all ${
                              activeMedia === "video"
                                ? "border-emerald-600 ring-2 ring-emerald-600/20"
                                : "border-gray-200 hover:border-emerald-600"
                            }`}
                          >
                            <Play className="w-5 h-5 text-white fill-white/20" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Side: Product Details */}
                  <div className={`md:col-span-7 space-y-5 ${lang === "ar" ? "text-right" : "text-left"}`} dir={lang === "ar" ? "rtl" : "ltr"}>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-bold text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-lg">
                          {catName}
                        </span>
                      </div>
                      
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                        {product.name}
                      </h1>

                      {/* Ratings */}
                      <div className={`flex items-center gap-2 pt-1 ${lang === "ar" ? "justify-start" : "justify-start flex-row-reverse"}`}>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(product.reviews > 0 ? product.rating : 0) ? "fill-orange-400 text-orange-400" : "fill-gray-200 text-gray-200"}`} />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-gray-500">
                          ({product.reviews} {t.products.reviews})
                        </span>
                      </div>
                    </div>

                    {/* Price section */}
                    <div className="pt-2">
                      <div className={`flex items-baseline gap-3 ${lang === "ar" ? "justify-start" : "justify-start flex-row-reverse"}`}>
                        <p className="text-3xl font-extrabold text-gray-900">
                          {product.price.toLocaleString()} {currency}
                          {product.sold_by && product.sold_by !== "piece" && <span className="text-sm font-normal text-gray-400"> /{unitLabel(product.sold_by, lang)}</span>}
                        </p>
                        {product.originalPrice && (
                          <p className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString()} {currency}</p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-5">
                      {/* Quantity and Add to Cart action */}
                      <div className={`flex flex-col sm:flex-row items-center gap-3 w-full`}>
                        {/* Quantity selectors */}
                        {isContinuousUnit(product.sold_by) ? (
                          <div className="flex items-center justify-between w-full sm:w-auto bg-gray-100 rounded-xl px-4 py-2 shrink-0">
                            <input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={qty}
                              onChange={(e) => setQty(Math.max(0.1, Number(e.target.value) || 0.1))}
                              className="w-16 bg-transparent text-center font-bold text-gray-900 text-sm focus:outline-none"
                            />
                            <span className="text-xs text-gray-500 font-semibold">{unitLabel(product.sold_by, lang)}</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full sm:w-auto bg-gray-100 rounded-xl shrink-0">
                            <button
                              onClick={() => setQty(Math.max(1, qty - 1))}
                              className="w-12 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-12 text-center font-bold text-gray-900 text-sm">{qty}</span>
                            <button
                              onClick={() => setQty(qty + 1)}
                              className="w-12 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Add to Cart button */}
                        <button
                          onClick={() => { addItem(product, qty); setQty(1); }}
                          className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-[#EA580C] hover:from-orange-600 hover:to-[#D97706] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 text-sm uppercase tracking-wide min-w-[160px] flex-1"
                        >
                          <ShoppingCart className="w-4 h-4 shrink-0" />
                          {t.products.addToCart}
                        </button>

                        {/* Bird Direct Shop Purchase button */}
                        {product.category === "birds" && (
                          <button
                            onClick={handleOpenReferralModal}
                            className="w-full sm:w-auto border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide min-w-[160px] flex-1"
                          >
                            <Ticket className="w-4 h-4 shrink-0" />
                            {lang === "ar" ? "شراء من المحل (خصم)" : lang === "fr" ? "Achat au magasin (code)" : "Buy at Shop (code)"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Features List with custom bullet shapes */}
                    {product.features && product.features.length > 0 && (
                      <div className="space-y-2.5 pt-5 border-t border-gray-100">
                        {product.features.map((f, i) => (
                          <div key={i} className={`flex items-start gap-2.5 ${lang === "ar" ? "flex-row" : "flex-row-reverse justify-end"}`}>
                            <span className="text-sm text-gray-600 font-medium leading-relaxed">{f}</span>
                            <div className="w-5 h-5 rounded-full bg-orange-100 text-[#EA580C] flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">
                              ✓
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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

            <AnimatedSection>
              <ProductReviews productId={product.id} />
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
            <Image src={activeImage || "/placeholder.svg"} alt={product.name} fill sizes="(max-width: 768px) 100vw, 56rem" className="object-contain" />
          </div>
        </div>
      )}

      {/* Bird Direct Purchase Referral Modal */}
      {referralModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setReferralModalOpen(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100" onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                <h3 className="font-bold text-sm sm:text-base">
                  {lang === "ar" ? "كود الخصم والشراء المباشر" : lang === "fr" ? "Code de réduction & achat" : "Discount & Shop Code"}
                </h3>
              </div>
              <button onClick={() => setReferralModalOpen(false)} className="text-white/80 hover:text-white text-2xl font-bold focus:outline-none">
                &times;
              </button>
            </div>

            {/* Ticket Content */}
            <div className="p-6 space-y-6 text-center" dir={lang === "ar" ? "rtl" : "ltr"}>
              
              <div className="relative border-2 border-dashed border-emerald-200 bg-emerald-50/30 rounded-2xl p-5 space-y-4">
                
                {/* Decorative cutouts (left & right circles) */}
                <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 bg-white border-r border-emerald-100 rounded-full" />
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 bg-white border-l border-emerald-100 rounded-full" />

                <div className="text-xs font-bold text-emerald-700 tracking-wide uppercase bg-emerald-50 px-3 py-1 rounded-full inline-block">
                  {storeName}
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-400">{lang === "ar" ? "المنتج المطلـوب" : lang === "fr" ? "Produit demandé" : "Requested Product"}</p>
                  <h4 className="font-extrabold text-gray-900 text-base sm:text-lg line-clamp-1">{product.name}</h4>
                </div>

                <div className="border-t border-dashed border-emerald-100 pt-4 space-y-2">
                  <p className="text-xs text-gray-400">{lang === "ar" ? "رمز الشراء والعمولة الخاص بك" : lang === "fr" ? "Votre code d'achat" : "Your Purchase Code"}</p>
                  <div className="font-mono font-black text-lg sm:text-xl text-emerald-800 bg-white border border-emerald-100 rounded-xl px-4 py-2.5 shadow-sm select-all tracking-wider">
                    {generatedCode}
                  </div>
                </div>

                <div className="text-xs text-gray-500 leading-relaxed pt-2">
                  {lang === "ar" 
                    ? "أظهر هذا الكود لصاحب المحل عند الشراء لتأكيد حجزك والحصول على الخصم المباشر." 
                    : lang === "fr" 
                    ? "Présentez ce code au magasin pour bénéficier de votre réduction." 
                    : "Show this code to the shop owner at the store to secure your discount."}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className={`w-full py-3 rounded-xl font-bold transition-all text-xs flex items-center justify-center gap-2 border ${copied ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"}`}
                >
                  <Check className={`w-4 h-4 shrink-0 transition-transform ${copied ? "scale-100" : "scale-0"}`} />
                  {copied ? (lang === "ar" ? "تم نسخ الكود!" : "Copié !") : (lang === "ar" ? "نسخ الكود" : "Copier le code")}
                </button>

                <a
                  href={`https://wa.me/${(store?.whatsapp || delivery?.whatsapp || store?.phone || "213555123456").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    lang === "ar" 
                      ? `مرحباً، أود شراء الطائر "${product.name}" من المحل. كود الحجز والخصم الخاص بي هو: ${generatedCode}` 
                      : `Bonjour, je souhaite acheter l'oiseau "${product.name}" au magasin. Mon code de réduction est : ${generatedCode}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold hover:bg-[#20ba56] transition-colors shadow-md text-xs flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  {lang === "ar" ? "تأكيد عبر واتساب" : "WhatsApp"}
                </a>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
