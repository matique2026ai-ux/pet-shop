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
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <AnimatedSection className="text-center mb-12">
          <span className="text-brand-600 text-sm font-semibold tracking-widest uppercase">{t.products.title}</span>
          <h1 className="text-4xl md:text-6xl font-bold mt-3 tracking-tight">{t.products.heading}</h1>
          <p className="text-neutral-500 mt-4 max-w-xl mx-auto">{t.products.desc}</p>
        </AnimatedSection>

        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="relative flex-1">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 ${isRtl ? "right-4" : "left-4"}`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.products.search}
              className={`w-full ${isRtl ? "pr-11 pl-4" : "pl-11 pr-4"} py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all`}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                !selectedCategory ? "bg-brand-500 text-white border-brand-500" : "bg-white text-neutral-600 border-neutral-200 hover:border-brand-300"
              }`}
            >
              {t.products.all}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                  selectedCategory === cat.id ? "bg-brand-500 text-white border-brand-500" : "bg-white text-neutral-600 border-neutral-200 hover:border-brand-300"
                }`}
              >
                {cat.id === "cats" ? <PawPrint className="w-4 h-4" /> :
                 cat.id === "birds" ? <Bird className="w-4 h-4" /> :
                 <Heart className="w-4 h-4" />}
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 mx-auto text-neutral-300 mb-4" />
            <p className="text-lg font-semibold text-neutral-500">{t.products.noProducts}</p>
            <p className="text-sm text-neutral-400 mt-1">{t.products.noProductsDesc}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <motion.div key={product.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Link href={`/products/${product.category}/${product.id}`} className="group block bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-500">
                  <div className="relative aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className={`absolute top-3 flex gap-2 ${isRtl ? "right-3" : "left-3"}`}>
                      {product.isNew && <span className="px-2.5 py-1 bg-vet-500 text-white text-[10px] font-bold rounded-full">{t.products.new}</span>}
                      {product.isSale && <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full">{t.products.sale}</span>}
                    </div>
                    <div className={`absolute bottom-3 ${isRtl ? "left-3" : "right-3"} w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500`}>
                      <ChevronRight className={`w-4 h-4 text-brand-600 ${isRtl ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] text-brand-600 font-semibold tracking-widest uppercase mb-1">{product.subcategory}</p>
                    <h3 className="font-semibold text-sm leading-snug mb-2 group-hover:text-brand-600 transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{product.isSale ? product.salePrice : product.price} DZD</span>
                      {product.isSale && <span className="text-sm text-neutral-400 line-through">{product.price} DZD</span>}
                    </div>
                    {!product.inStock && <p className="text-xs text-red-500 mt-2 font-medium">{t.products.outOfStock}</p>}
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

