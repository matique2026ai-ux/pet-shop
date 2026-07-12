"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, ShoppingCart, Heart, Check, Star, Truck, Shield, PawPrint, Bird } from "lucide-react"
import AnimatedSection from "@/components/animated-section"
import { products } from "@/lib/data"
import { useI18n } from "@/lib/i18n-context"

export default function ProductDetailPage() {
  const { t, dir } = useI18n()
  const isRtl = dir === "rtl"
  const { id } = useParams<{ id: string; category: string }>()
  const product = products.find((p) => p.id === id)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🐾</p>
          <h2 className="text-2xl font-bold mb-2">{t.products.productNotFound}</h2>
          <Link href="/products" className="text-brand-600 hover:underline">{t.products.backToProducts}</Link>
        </div>
      </div>
    )
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
          <Link href="/products" className="hover:text-brand-600 transition-colors">{t.products.title}</Link>
          <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
          <Link href={`/products/${product.category}`} className="hover:text-brand-600 transition-colors capitalize">{product.category}</Link>
          <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
          <span className="text-neutral-700 font-medium truncate">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-square rounded-3xl bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {product.category === "cats" ? <PawPrint className="w-32 h-32 text-neutral-300" /> :
               product.category === "birds" ? <Bird className="w-32 h-32 text-neutral-300" /> :
               <Heart className="w-32 h-32 text-neutral-300" />}
            </div>
            <div className={`absolute top-4 flex gap-2 ${isRtl ? "right-4" : "left-4"}`}>
              {product.isNew && <span className="px-3 py-1.5 bg-vet-500 text-white text-xs font-bold rounded-full">{t.products.new}</span>}
              {product.isSale && <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full">{t.products.sale}</span>}
            </div>
          </motion.div>

          <AnimatedSection direction={isRtl ? "left" : "right"}>
            <p className="text-sm text-brand-600 font-semibold tracking-widest uppercase mb-2">{product.subcategory}</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
                <span className="text-sm text-neutral-500 ml-2">(24 {t.products.reviews})</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold">{product.isSale ? product.salePrice : product.price} DZD</span>
              {product.isSale && <span className="text-lg text-neutral-400 line-through">{product.price} DZD</span>}
              {product.isSale && (
                <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                  -{Math.round((1 - (product.salePrice || product.price) / product.price) * 100)}%
                </span>
              )}
            </div>

            <p className="text-neutral-600 leading-relaxed mb-8">{product.description}</p>

            <div className="mb-8">
              <h3 className="font-semibold mb-3">{t.products.keyFeatures}</h3>
              <ul className="grid grid-cols-2 gap-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-neutral-600">
                    <Check className="w-4 h-4 text-vet-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                <Truck className="w-4 h-4 text-brand-500" />
                {t.products.freeDelivery}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                <Shield className="w-4 h-4 text-brand-500" />
                {t.products.qualityGuaranteed}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 2000) }}
                className="flex-1 px-8 py-3.5 bg-brand-500 text-white font-semibold rounded-full hover:bg-brand-600 transition-all duration-300 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 flex items-center justify-center gap-2"
              >
                {added ? <><Check className="w-4 h-4" /> {t.products.addedToCart}</> : <><ShoppingCart className="w-4 h-4" /> {t.products.addToCart}</>}
              </button>
              <button className="w-13 h-13 border-2 border-neutral-200 rounded-full flex items-center justify-center hover:border-brand-500 hover:text-brand-600 transition-all">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </AnimatedSection>
        </div>

        {related.length > 0 && (
          <section>
            <AnimatedSection className="flex items-center justify-between mb-8">
              <div>
                <span className="text-brand-600 text-sm font-semibold tracking-widest uppercase">{t.products.related}</span>
                <h2 className="text-2xl font-bold mt-1">{t.products.related} {product.category === "cats" ? "Cat" : product.category === "birds" ? "Bird" : ""} {t.products.title}</h2>
              </div>
              <Link href={`/products/${product.category}`} className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                {t.featured.viewAll}
              </Link>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <motion.div key={p.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05 } }),
                  }}>
                  <Link href={`/products/${p.category}/${p.id}`} className="group block bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-lg transition-all duration-500">
                    <div className="relative aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {p.category === "cats" ? <PawPrint className="w-12 h-12 text-neutral-300" /> :
                         p.category === "birds" ? <Bird className="w-12 h-12 text-neutral-300" /> :
                         <Heart className="w-12 h-12 text-neutral-300" />}
                      </div>
                      {p.isNew && <span className={`absolute top-2 ${isRtl ? "right-2" : "left-2"} px-2 py-0.5 bg-vet-500 text-white text-[10px] font-bold rounded-full`}>{t.products.new}</span>}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-1 group-hover:text-brand-600 transition-colors">{p.name}</h3>
                      <span className="font-bold">{p.price} DZD</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

