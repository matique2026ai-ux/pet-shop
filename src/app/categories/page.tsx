"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { useTranslatedData } from "@/lib/use-translated-data";
import { products as rawProducts } from "@/lib/data";
import AnimatedSection from "@/components/animated-section";
import { ChevronRight } from "lucide-react";

const catBgImages: Record<string, string> = {
  cats: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=800&fit=crop",
  dogs: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=800&fit=crop",
  birds: "https://images.unsplash.com/photo-1480044965905-02098d419e96?w=800&h=800&fit=crop",
  fish: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&h=800&fit=crop",
  "small-pets": "https://images.unsplash.com/photo-1535241749838-299277b6305f?w=800&h=800&fit=crop",
};

export default function CategoriesPage() {
  const { t } = useI18n();
  const { categories } = useTranslatedData();

  const catCounts: Record<string, number> = {};
  categories.forEach((cat) => {
    catCounts[cat.id] = rawProducts.filter((p) => p.category === cat.id).length;
  });

  return (
    <div>
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050D1A] via-[#0B1E36] to-[#050D1A]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/5 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">{t.categories.title}</h1>
            <p className="text-emerald-100/60 text-lg max-w-lg">{t.categories.subtitle}</p>
          </div>
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
                      ) : (
                        <Image
                          src={cat.image_url || catBgImages[cat.id] || catBgImages.cats}
                          alt={cat.name}
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={idx < 3}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3 gap-2">
                          <h2 className="text-lg font-bold text-[#1A1A2E] leading-tight line-clamp-1">{cat.name}</h2>
                          <span className="text-xs text-[#C4933F] bg-[#F8F7F4] font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
                            {catCounts[cat.id] !== undefined ? catCounts[cat.id] : cat.subcategories.length} {t.categories.items}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{cat.description}</p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {cat.subcategories.slice(0, 3).map((sub) => (
                            <span
                              key={sub.id}
                              className="px-2.5 py-0.5 bg-[#F8F7F4] text-gray-600 text-[10px] rounded-full border border-gray-100 transition-colors group-hover:bg-[#EFF6FF] group-hover:text-[#C4933F] group-hover:border-[#DBEAFE]"
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
                        <span className="flex items-center gap-1 text-xs font-semibold text-[#C4933F] group-hover:gap-2 transition-all">
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
            <h2 className="text-3xl font-bold text-[#0B1E36] mb-4">{t.categories.notSure}</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">{t.categories.notSureDesc}</p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/products" className="inline-flex items-center gap-2 bg-white text-gray-900 px-7 py-3 rounded-2xl font-bold border border-gray-200 hover:border-gray-300 hover:-translate-y-0.5 transition-all shadow-sm">{t.categories.allProductsLink}</Link>
              <Link href="/vet" className="inline-flex items-center gap-2 bg-[#F97316] text-white px-7 py-3 rounded-2xl font-bold hover:bg-[#EA580C] hover:-translate-y-0.5 transition-all shadow-lg shadow-[#F97316]/20">{t.categories.visitVet}</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
