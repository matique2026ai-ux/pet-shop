"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { useTranslatedData } from "@/lib/use-translated-data";
import AnimatedSection from "@/components/animated-section";
import ProductCard from "@/components/product-card";
import { ChevronRight, ArrowLeft, LayoutGrid, List, Cat, Dog, Bird, Fish, Rabbit, PawPrint, Sparkles } from "lucide-react";
import { useState } from "react";

const catHeroImages: Record<string, string> = {
  cats: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1200&h=600&fit=crop",
  dogs: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&h=600&fit=crop",
  birds: "https://images.unsplash.com/photo-1480044965905-02098d419e96?w=1200&h=600&fit=crop",
  fish: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1200&h=600&fit=crop",
  "small-pets": "https://images.unsplash.com/photo-1535241749838-299277b6305f?w=1200&h=600&fit=crop",
};

const catIcons: Record<string, React.ReactNode> = {
  cat: <Cat className="w-6 h-6" />,
  dog: <Dog className="w-6 h-6" />,
  bird: <Bird className="w-6 h-6" />,
  fish: <Fish className="w-6 h-6" />,
  rabbit: <Rabbit className="w-6 h-6" />,
};

export default function CategoryPage() {
  const { t, dir } = useI18n();
  const { products, categories } = useTranslatedData();
  const params = useParams();
  const searchParams = useSearchParams();
  const catSlug = params.category as string;
  const activeSub = searchParams.get("sub");
  const cat = categories.find((c) => c.id === catSlug);
  const catProducts = products.filter((p) => p.category === catSlug);

  const filtered = activeSub
    ? catProducts.filter((p) => p.subcategory === activeSub)
    : catProducts;

  if (!cat) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t.products.categoryNotFound}</h1>
        <Link href="/products" className="text-emerald-600 hover:underline">{t.products.viewAll}</Link>
      </div>
    );
  }

  return (
    <div>
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0">
          <Image
            src={catHeroImages[cat.id] || catHeroImages.cats}
            alt={cat.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-emerald-200/80 mb-4">
            <Link href="/" className="hover:text-white transition-colors">{t.products.breadcrumbHome}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/categories" className="hover:text-white transition-colors">{t.products.breadcrumbCategories}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-medium">{cat.name}</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <span className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20">
              {catIcons[cat.icon] ?? <PawPrint className="w-7 h-7" />}
            </span>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white">{cat.name}</h1>
              <p className="text-emerald-100/80 mt-1 text-lg">{cat.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs text-white border border-white/20">
              {filtered.length} {t.categories.items}
            </span>
          </div>
        </div>
      </section>

      <section className="py-8 border-b border-gray-100 sticky top-16 bg-white/80 backdrop-blur-xl z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Link
              href={`/products/${cat.id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                !activeSub
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {t.products.all} {cat.name}
            </Link>
            {cat.subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/products/${cat.id}?sub=${sub.id}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeSub === sub.id
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500">{activeSub ? t.products.noSubcategory : t.products.noCategory}</p>
                <Link href="/products" className="inline-flex items-center gap-1 text-emerald-600 mt-4 hover:underline">
                  <ArrowLeft className="w-4 h-4" /> {t.products.backToAll}
                </Link>
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
