"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { useTranslatedData } from "@/lib/use-translated-data";
import { products as rawProducts } from "@/lib/data";
import AnimatedSection from "@/components/animated-section";
import { ChevronRight, PawPrint, Sparkles, ShoppingBag, Truck, Tag } from "lucide-react";

export default function CategoriesPage() {
  const { t, lang, dir } = useI18n();
  const { categories } = useTranslatedData();

  const catCounts: Record<string, number> = {};
  categories.forEach((cat) => {
    catCounts[cat.id] = rawProducts.filter((p) => p.category === cat.id).length;
  });

  return (
    <div dir={dir} className="bg-[#F8F7F4] min-h-screen">
      {/* ══════════════════════════════════
          HERO SECTION
      ══════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-[#0F1913] via-[#1C2C22] to-[#0A120D] text-white">
        {/* Glow & Paw Decor */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F5851F]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
        <PawPrint className="absolute top-8 left-[6%] w-24 h-24 text-white/5 rotate-[-20deg] pointer-events-none select-none" />
        <PawPrint className="absolute bottom-8 right-[8%] w-32 h-32 text-white/5 rotate-[15deg] pointer-events-none select-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#F1C290] text-xs sm:text-sm font-semibold mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#F5851F]" />
              <span>{lang === "ar" ? "كتالوج الأقسام الشامل" : lang === "fr" ? "Catalogue officiel des catégories" : "Official Category Catalogue"}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-5">
              {lang === "ar" ? (
                <>
                  تسوّق حسب <span className="bg-gradient-to-r from-[#F5851F] via-[#F1C290] to-emerald-400 bg-clip-text text-transparent">القسم المناسب</span> لحيوانك
                </>
              ) : lang === "fr" ? (
                <>
                  Explorez nos <span className="bg-gradient-to-r from-[#F5851F] via-[#F1C290] to-emerald-400 bg-clip-text text-transparent">Catégories Précieuses</span>
                </>
              ) : (
                <>
                  Shop by <span className="bg-gradient-to-r from-[#F5851F] via-[#F1C290] to-emerald-400 bg-clip-text text-transparent">Pet Category</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-emerald-100/70 max-w-2xl leading-relaxed mb-8">
              {t.categories.subtitle}
            </p>

            {/* Quick Stats / Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
                <div className="p-2.5 rounded-xl bg-[#F5851F]/20 text-[#F5851F]">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{categories.length} {lang === "ar" ? "أقسام رئيسية" : "Catégories"}</div>
                  <div className="text-[11px] text-white/50">{lang === "ar" ? "تغطي كافة الحيوانات" : "Toutes espèces"}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{rawProducts.length}+ {lang === "ar" ? "منتج ممتاز" : "Produits"}</div>
                  <div className="text-[11px] text-white/50">{lang === "ar" ? "مفحوص ومضمون" : "Qualité certifiée"}</div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
                <div className="p-2.5 rounded-xl bg-[#F1C290]/20 text-[#F1C290]">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{lang === "ar" ? "توصيل لـ 69 ولاية" : "Livraison 69 Wilayas"}</div>
                  <div className="text-[11px] text-white/50">{lang === "ar" ? "شحن آمن وسريع" : "Service Rapide"}</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto lg:grid lg:grid-cols-5 gap-6 pb-6 px-1 scrollbar-none snap-x snap-mandatory">
            {categories.map((cat, idx) => (
              <AnimatedSection
                key={cat.id}
                className="shrink-0 w-[280px] sm:w-[320px] lg:w-auto snap-start"
              >
                <Link
                  href={`/products/${cat.id}`}
                  className="group block h-full"
                >
                  <div className="bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 h-full flex flex-col justify-between"
                    style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.02)" }}
                  >
                     <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 shrink-0">
                      {cat.video_url ? (
                        <video
                          src={cat.video_url}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        />
                      ) : cat.image_url ? (
                        <Image
                          src={cat.image_url}
                          alt={cat.name}
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={idx < 3}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1E2D24] to-[#0E1611] flex flex-col items-center justify-center p-4">
                          <div className="relative w-16 h-16 opacity-30 group-hover:opacity-50 transition-opacity duration-300">
                            <Image
                              src="/logo-badge.png"
                              alt="Logo"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3 gap-2">
                          <h2 className="text-lg font-bold text-[#1A1A2E] leading-tight line-clamp-1">{cat.name}</h2>
                          <span className="text-xs text-[#E3602D] bg-[#F8F7F4] font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
                            {catCounts[cat.id] !== undefined ? catCounts[cat.id] : cat.subcategories.length} {t.categories.items}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{cat.description}</p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {cat.subcategories.slice(0, 3).map((sub) => (
                            <span
                              key={sub.id}
                              className="px-2.5 py-0.5 bg-[#F8F7F4] text-gray-600 text-[10px] rounded-full border border-gray-100 transition-colors group-hover:bg-[#EFF6FF] group-hover:text-[#E3602D] group-hover:border-[#DBEAFE]"
                            >
                              {sub.name}
                            </span>
                          ))}
                          {cat.subcategories.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] rounded-full">
                              +{cat.subcategories.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                        <span className="text-[10px] text-gray-400">{t.nav.subcategoryCount.replace("{n}", String(cat.subcategories.length))}</span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-[#E3602D] group-hover:gap-2 transition-all">
                          {t.categories.browseAll} <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 relative overflow-hidden" style={{ background: "#F8FAFC" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-[#1E2D24] mb-4">{t.categories.notSure}</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">{t.categories.notSureDesc}</p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/products" className="inline-flex items-center gap-2 bg-white text-gray-900 px-7 py-3 rounded-2xl font-bold border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 transition-all shadow-sm">{t.categories.allProductsLink}</Link>
              <Link href="/blog" className="px-6 py-2 bg-[#F97316] text-white rounded-full text-sm font-semibold hover:bg-[#EA580C] hover:-translate-y-0.5 transition-all shadow-lg shadow-[#F97316]/20">{t.categories.visitBlog}</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
