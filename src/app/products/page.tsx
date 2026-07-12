"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, PawPrint, Bird, Heart, ChevronRight } from "lucide-react"
import AnimatedSection from "@/components/animated-section"
import { products, categories } from "@/lib/data"
import { useI18n } from "@/lib/i18n-context"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
}

export default function ProductsPage() {
  const { t, dir } = useI18n()
  const isRtl = dir === "rtl"
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(search.toLowerCase())
    const matchCategory = selectedCategory ? p.category === selectedCategory : true
    return matchSearch && matchCategory
  })

  return (
    <div className="min-h-screen pt-28 pb-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <AnimatedSection className="text-center mb-12">
          <span className="text-brown-500 text-sm font-medium tracking-[0.2em] uppercase">{t.products.title}</span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-brown-900 mt-3 tracking-tight">{t.products.heading}</h1>
          <p className="text-brown-600 mt-4 max-w-xl mx-auto">{t.products.desc}</p>
        </AnimatedSection>

        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="relative flex-1">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-brown-400 ${isRtl ? "right-4" : "left-4"}`} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder={t.products.search}
              className={`w-full ${isRtl ? "pr-11 pl-4" : "pl-11 pr-4"} py-3 bg-cream border border-brown-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brown-500/20 focus:border-brown-500 transition-all text-brown-900 placeholder:text-brown-400`} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${!selectedCategory ? "bg-brown-800 text-cream border-brown-800" : "bg-cream text-brown-600 border-brown-200 hover:border-brown-400"}`}>{t.products.all}</button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${selectedCategory === cat.id ? "bg-brown-800 text-cream border-brown-800" : "bg-cream text-brown-600 border-brown-200 hover:border-brown-400"}`}>
                {cat.id === "cats" ? <PawPrint className="w-4 h-4" /> : cat.id === "birds" ? <Bird className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 mx-auto text-brown-300 mb-4" />
            <p className="text-lg font-heading font-semibold text-brown-600">{t.products.noProducts}</p>
            <p className="text-sm text-brown-400 mt-1">{t.products.noProductsDesc}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <motion.div key={product.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Link href={`/products/${product.category}/${product.id}`}
                  className="group block bg-cream rounded-2xl border border-brown-200 overflow-hidden hover:shadow-xl hover:shadow-brown-900/10 transition-all duration-500">
                  <div className="relative aspect-[4/5] overflow-hidden bg-brown-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brown-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className={`absolute top-3 flex gap-2 ${isRtl ? "right-3" : "left-3"}`}>
                      {product.isNew && <span className="px-2.5 py-1 bg-brown-800 text-gold-300 text-[10px] font-medium tracking-wider uppercase rounded-full">{t.products.new}</span>}
                      {product.isSale && <span className="px-2.5 py-1 bg-gold-500 text-brown-900 text-[10px] font-medium tracking-wider uppercase rounded-full">{t.products.sale}</span>}
                    </div>
                    <div className={`absolute bottom-3 ${isRtl ? "left-3" : "right-3"} w-10 h-10 rounded-full bg-cream/90 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500`}>
                      <ChevronRight className={`w-4 h-4 text-brown-800 ${isRtl ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] text-brown-500 font-medium tracking-[0.2em] uppercase mb-1">{product.subcategory}</p>
                    <h3 className="font-heading font-semibold text-sm leading-snug mb-2 text-brown-900 group-hover:text-brown-700 transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-lg text-brown-800">{product.isSale ? product.salePrice : product.price} DZD</span>
                      {product.isSale && <span className="text-sm text-brown-400 line-through">{product.price} DZD</span>}
                    </div>
                    {!product.inStock && <p className="text-xs text-brown-500 mt-2 font-medium">{t.products.outOfStock}</p>}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
