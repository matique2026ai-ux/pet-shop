"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { useTranslatedData } from "@/lib/use-translated-data";
import AnimatedSection from "@/components/animated-section";
import ProductCard from "@/components/product-card";
import { Star, ChevronRight, Check, ShoppingCart, ArrowLeft } from "lucide-react";

export default function ProductDetailPage() {
  const { t } = useI18n();
  const { products } = useTranslatedData();
  const params = useParams();
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <Link href="/products" className="text-emerald-600 hover:underline">View All Products</Link>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div>
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-emerald-600">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-emerald-600">{t.products.title}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/products/${product.category}`} className="hover:text-emerald-600 capitalize">{product.category}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                {product.badge && (
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${product.badge === "NEW" ? "bg-emerald-600 text-white" : "bg-gray-900 text-white"}`}>
                    {product.badge === "NEW" ? t.products.new : t.products.sale}
                  </span>
                )}
              </div>

              <div>
                <div className="mb-2">
                  <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">{product.category}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                  <span className="font-semibold text-gray-900">{product.rating}</span>
                  <span className="text-gray-500 text-sm">({product.reviews} {t.products.reviews})</span>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
                  )}
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
                  <button className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                    {t.products.addToCart}
                  </button>
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
                  <ProductCard key={p.id} product={p} t={t} variant="related" />
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}
    </div>
  );
}
