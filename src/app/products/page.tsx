"use client";

import { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { useTranslatedData } from "@/lib/use-translated-data";
import AnimatedSection from "@/components/animated-section";
import ProductCard from "@/components/product-card";
import { Search } from "lucide-react";

function ProductsContent() {
  const { t } = useI18n();
  const { products, categories } = useTranslatedData();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    let list = products;
    if (initialFilter === "new") {
      list = list.filter((p) => p.badge === "NEW");
    } else if (initialFilter === "offers") {
      list = list.filter((p) => p.badge === "SALE" || p.originalPrice);
    }
    return list.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || p.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category, initialFilter]);

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.products.title}</h1>
          <p className="text-gray-500">{t.products.subtitle}</p>
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
            <div className="flex gap-2">
              {[{ id: "all", name: t.products.all }, ...categories].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    category === c.id ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500">{t.products.noResults}</p>
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
