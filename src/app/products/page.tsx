"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { useTranslatedData } from "@/lib/use-translated-data";
import AnimatedSection from "@/components/animated-section";
import ProductCard, { ProductCardSkeleton } from "@/components/product-card";
import { Search, Sparkles, PawPrint, Tag } from "lucide-react";

function ProductsContent() {
  const { t, lang, dir } = useI18n();
  const { products, categories, productsLoaded } = useTranslatedData();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter");
  const initialSearch = searchParams.get("q") || "";
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = products;
    if (initialFilter === "new") {
      list = list.filter((p) => p.badge === "NEW");
    } else if (initialFilter === "offers") {
      list = list.filter((p) => p.badge === "SALE" || p.originalPrice);
    }
    list = list.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || p.category === category;
      return matchSearch && matchCat;
    });
    switch (sort) {
      case "price-asc": return [...list].sort((a, b) => a.price - b.price);
      case "price-desc": return [...list].sort((a, b) => b.price - a.price);
      case "rating": return [...list].sort((a, b) => (b.reviews > 0 ? b.rating : 0) - (a.reviews > 0 ? a.rating : 0));
      case "name": return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default: return list;
    }
  }, [products, search, category, initialFilter, sort]);

  return (
    <div dir={dir} className="bg-[#F8F7F4] min-h-screen">
      {/* ══════════════════════════════════
          CREATIVE PRODUCTS HERO
      ══════════════════════════════════ */}
      <section className="relative overflow-hidden py-14 lg:py-20 bg-gradient-to-br from-[#0F1913] via-[#1C2C22] to-[#0A120D] text-white">
        {/* Glow & Paw Decor */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F5851F]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
        <PawPrint className="absolute top-8 left-[6%] w-24 h-24 text-white/5 rotate-[-20deg] pointer-events-none select-none" />
        <PawPrint className="absolute bottom-8 right-[8%] w-32 h-32 text-white/5 rotate-[15deg] pointer-events-none select-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#F1C290] text-xs sm:text-sm font-semibold mb-4 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#F5851F]" />
              <span>
                {initialFilter === "offers"
                  ? (lang === "ar" ? "تخفيضات وعروض حصرية" : "Offres Spéciales")
                  : initialFilter === "new"
                  ? (lang === "ar" ? "منتجات جديدة وصلتنا حديثاً" : "Nouveautés")
                  : (lang === "ar" ? "كتالوج المنتجات الرسمي" : "Catalogue Officiel")}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-3">
              {initialFilter === "offers"
                ? (lang === "ar" ? "عروض وتخفيضات مميزة" : "Offres & Promotions Exclusives")
                : initialFilter === "new"
                ? (lang === "ar" ? "أحدث المقتنيات والمنتجات" : "Dernières Nouveautés")
                : t.products.title}
            </h1>
            <p className="text-sm sm:text-lg text-emerald-100/70 max-w-xl">
              {t.products.subtitle}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.products.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full max-w-full touch-pan-x">
              {[{ id: "all", name: t.products.all }, ...categories].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 whitespace-nowrap ${
                    category === c.id
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
            >
              <option value="default">{t.products.sortBy}</option>
              <option value="price-asc">{t.products.sortPriceAsc}</option>
              <option value="price-desc">{t.products.sortPriceDesc}</option>
              <option value="rating">{t.products.sortRating}</option>
              <option value="name">{t.products.sortName}</option>
            </select>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            {!productsLoaded ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={`sk-${i}`} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12">
                <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto mb-12">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t.products.noResults}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    {lang === "ar"
                      ? "لم نجد نتائج تطابق بحثك الحالي. جرب تغيير كلمة البحث أو تصفح المنتجات المقترحة أدناه:"
                      : "Aucun résultat trouvé pour votre recherche. Découvrez nos meilleures suggestions :"}
                  </p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setCategory("all");
                    }}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
                  >
                    {lang === "ar" ? "عرض جميع المنتجات" : "Afficher tous les produits"}
                  </button>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 text-start">
                    {lang === "ar" ? "منتجات قد تعجبك أيضًا 🔥" : "Produits recommandés 🔥"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-8">
                    {products.slice(0, 4).map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-8">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

function ProductsFallback() {
  const { t } = useI18n();
  return <div className="text-center py-20 text-gray-500">{t.products.loading}</div>;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsContent />
    </Suspense>
  );
}
