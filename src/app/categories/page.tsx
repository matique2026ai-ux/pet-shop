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

      {/* ══════════════════════════════════
          IMMERSIVE CATEGORIES GRID
      ══════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-[#0B0F0D] via-[#121A15] to-[#0E1611] relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/8 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#F5851F]/6 rounded-full blur-[140px] pointer-events-none" />
        <PawPrint className="absolute top-12 left-[5%] w-20 h-20 rotate-[-18deg] text-white/[0.03] pointer-events-none select-none" />
        <PawPrint className="absolute bottom-10 right-[6%] w-24 h-24 rotate-[22deg] text-[#F1C290]/[0.03] pointer-events-none select-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Featured Card + Side Cards Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Featured (first) category — large hero card */}
            {categories.length > 0 && (
              <AnimatedSection className="lg:col-span-7">
                <Link href={`/products/${categories[0].id}`} className="group block h-full">
                  <div className="relative rounded-3xl overflow-hidden h-[320px] sm:h-[400px] lg:h-full lg:min-h-[460px]">
                    {categories[0].video_url ? (
                      <video src={categories[0].video_url} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                    ) : categories[0].image_url ? (
                      <Image src={categories[0].image_url} alt={categories[0].name} fill className="object-cover transition-transform duration-[1.2s] group-hover:scale-110" sizes="(max-width: 1024px) 100vw, 58vw" priority />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-[#0E1611]" />
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Content overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                      {/* Count badge */}
                      <div className="absolute top-5 right-5 rtl:right-auto rtl:left-5">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 text-white text-xs font-bold shadow-lg">
                          {catCounts[categories[0].id] || categories[0].subcategories.length} {t.categories.items}
                        </span>
                      </div>
                      
                      {/* Subcategory pills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {categories[0].subcategories.slice(0, 4).map((sub) => (
                          <span key={sub.id} className="px-3 py-1 bg-white/10 backdrop-blur-md text-white/90 text-[11px] sm:text-xs font-medium rounded-full border border-white/15 transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/30">
                            {sub.name}
                          </span>
                        ))}
                        {categories[0].subcategories.length > 4 && (
                          <span className="px-3 py-1 bg-[#F5851F]/20 backdrop-blur-md text-[#F1C290] text-[11px] sm:text-xs font-medium rounded-full border border-[#F5851F]/30">
                            +{categories[0].subcategories.length - 4}
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 leading-tight drop-shadow-lg">
                        {categories[0].name}
                      </h2>
                      <p className="text-sm sm:text-base text-white/70 mb-4 max-w-md line-clamp-2">
                        {categories[0].description}
                      </p>
                      <div className="inline-flex items-center gap-2 text-[#F1C290] font-bold text-sm group-hover:gap-3 transition-all duration-300">
                        {t.categories.browseAll}
                        <ChevronRight className="w-4 h-4 rtl:-scale-x-100 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            )}

            {/* Right side — stacked smaller cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4 lg:gap-5">
              {categories.slice(1, 5).map((cat, idx) => (
                <AnimatedSection key={cat.id}>
                  <Link href={`/products/${cat.id}`} className="group block h-full">
                    <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden h-[200px] sm:h-[220px]">
                      {cat.video_url ? (
                        <video src={cat.video_url} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : cat.image_url ? (
                        <Image src={cat.image_url} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 1024px) 50vw, 25vw" priority={idx < 2} />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-[#0E1611]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
                      <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/20 transition-colors duration-500" />

                      {/* Count badge */}
                      <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-lg border border-white/15 text-white text-[10px] font-bold">
                          {catCounts[cat.id] || cat.subcategories.length} {t.categories.items}
                        </span>
                      </div>

                      <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
                        {/* Subcategory pills */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {cat.subcategories.slice(0, 2).map((sub) => (
                            <span key={sub.id} className="px-2 py-0.5 bg-white/10 backdrop-blur-sm text-white/80 text-[10px] font-medium rounded-full border border-white/10">
                              {sub.name}
                            </span>
                          ))}
                          {cat.subcategories.length > 2 && (
                            <span className="px-2 py-0.5 bg-[#F5851F]/15 text-[#F1C290] text-[10px] font-medium rounded-full border border-[#F5851F]/20">
                              +{cat.subcategories.length - 2}
                            </span>
                          )}
                        </div>

                        <h2 className="text-base sm:text-lg font-bold text-white leading-tight mb-1 drop-shadow-lg line-clamp-1">
                          {cat.name}
                        </h2>
                        <p className="text-[11px] text-white/50 mb-1.5 line-clamp-1 hidden sm:block">{cat.description}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#F1C290] font-semibold group-hover:gap-2.5 transition-all duration-300">
                          {t.categories.browseAll}
                          <ChevronRight className="w-3 h-3 rtl:-scale-x-100 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Extra categories row if more than 5 */}
          {categories.length > 5 && (
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
              {categories.slice(5).map((cat) => (
                <AnimatedSection key={cat.id}>
                  <Link href={`/products/${cat.id}`} className="group block">
                    <div className="relative rounded-2xl overflow-hidden h-[180px]">
                      {cat.image_url ? (
                        <Image src={cat.image_url} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 640px) 50vw, 25vw" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-[#0E1611]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <h3 className="text-sm sm:text-base font-bold text-white mb-0.5 drop-shadow-lg line-clamp-1">{cat.name}</h3>
                        <span className="text-[10px] text-[#F1C290] font-medium">{catCounts[cat.id] || cat.subcategories.length} {t.categories.items}</span>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
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
