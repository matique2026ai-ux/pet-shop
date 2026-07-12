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
      <div className="min-h-screen pt-28 bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🐾</p>
          <h2 className="text-2xl font-heading font-bold text-brown-900 mb-2">{t.products.productNotFound}</h2>
          <Link href="/products" className="text-brown-600 hover:text-brown-800 transition-colors">{t.products.backToProducts}</Link>
        </div>
      </div>
    )
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="min-h-screen pt-28 pb-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-2 text-sm text-brown-400 mb-8">
          <Link href="/" className="hover:text-brown-700 transition-colors">Home</Link>
          <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
          <Link href="/products" className="hover:text-brown-700 transition-colors">{t.products.title}</Link>
          <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
          <Link href={`/products/${product.category}`} className="hover:text-brown-700 transition-colors capitalize">{product.category}</Link>
          <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
          <span className="text-brown-800 font-medium truncate">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <motion.div initial={{ opacity: 0, x: isRtl ? 30 : -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-brown-100 shadow-xl shadow-brown-900/10">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className={`absolute top-4 flex gap-2 ${isRtl ? "right-4" : "left-4"}`}>
              {product.isNew && <span className="px-3 py-1.5 bg-brown-800 text-gold-300 text-xs font-medium tracking-wider uppercase rounded-full">{t.products.new}</span>}
              {product.isSale && <span className="px-3 py-1.5 bg-gold-500 text-brown-900 text-xs font-medium tracking-wider uppercase rounded-full">{t.products.sale}</span>}
            </div>
          </motion.div>

          <AnimatedSection direction={isRtl ? "left" : "right"}>
            <p className="text-sm text-brown-500 font-medium tracking-[0.2em] uppercase mb-2">{product.subcategory}</p>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-brown-900 tracking-tight mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 text-gold-500 fill-gold-500" />))}
                <span className="text-sm text-brown-500 ml-2">(24 {t.products.reviews})</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-heading font-bold text-brown-800">{product.isSale ? product.salePrice : product.price} DZD</span>
              {product.isSale && <span className="text-lg text-brown-400 line-through">{product.price} DZD</span>}
              {product.isSale && <span className="px-2 py-0.5 bg-gold-100 text-gold-500 text-xs font-bold rounded-full">-{Math.round((1 - (product.salePrice || product.price) / product.price) * 100)}%</span>}
            </div>

            <p className="text-brown-600 leading-relaxed mb-8">{product.description}</p>

            <div className="mb-8">
              <h3 className="font-heading font-semibold text-brown-900 mb-3">{t.products.keyFeatures}</h3>
              <ul className="grid grid-cols-2 gap-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-brown-600"><Check className="w-4 h-4 text-gold-500 shrink-0" />{f}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1.5 text-sm text-brown-600"><Truck className="w-4 h-4 text-brown-500" />{t.products.freeDelivery}</div>
              <div className="flex items-center gap-1.5 text-sm text-brown-600"><Shield className="w-4 h-4 text-brown-500" />{t.products.qualityGuaranteed}</div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 2000) }}
                className="flex-1 px-8 py-3.5 bg-brown-800 text-cream font-medium rounded-full hover:bg-brown-900 transition-all duration-300 shadow-lg shadow-brown-800/20 flex items-center justify-center gap-2">
                {added ? <><Check className="w-4 h-4" />{t.products.addedToCart}</> : <><ShoppingCart className="w-4 h-4" />{t.products.addToCart}</>}
              </button>
              <button className="w-13 h-13 border-2 border-brown-200 rounded-full flex items-center justify-center hover:border-brown-500 text-brown-600 hover:text-brown-800 transition-all"><Heart className="w-5 h-5" /></button>
            </div>
          </AnimatedSection>
        </div>

        {related.length > 0 && (
          <section>
            <AnimatedSection className="flex items-center justify-between mb-8">
              <div>
                <span className="text-brown-500 text-sm font-medium tracking-[0.2em] uppercase">{t.products.related}</span>
                <h2 className="text-2xl font-heading font-bold text-brown-900 mt-1">{t.products.related} Products</h2>
              </div>
              <Link href={`/products/${product.category}`} className="text-sm font-medium text-brown-600 hover:text-brown-900 transition-colors">{t.featured.viewAll}</Link>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <motion.div key={p.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05 } }) }}>
                  <Link href={`/products/${p.category}/${p.id}`}
                    className="group block bg-cream rounded-2xl border border-brown-200 overflow-hidden hover:shadow-lg transition-all duration-500">
                    <div className="relative aspect-[4/5] overflow-hidden bg-brown-100">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {p.isNew && <span className={`absolute top-2 ${isRtl ? "right-2" : "left-2"} px-2 py-0.5 bg-brown-800 text-gold-300 text-[10px] font-medium uppercase rounded-full`}>{t.products.new}</span>}
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading font-semibold text-sm text-brown-900 mb-1 group-hover:text-brown-700 transition-colors">{p.name}</h3>
                      <span className="font-heading font-bold text-brown-800">{p.price} DZD</span>
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
