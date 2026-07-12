"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, PawPrint, Bird, Heart } from "lucide-react"
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

const iconMap: Record<string, React.ReactNode> = {
  cats: <PawPrint className="w-6 h-6 text-gold-400" />,
  birds: <Bird className="w-6 h-6 text-gold-400" />,
  accessories: <Heart className="w-6 h-6 text-gold-400" />,
}

export default function CategoryPage() {
  const { t, dir } = useI18n()
  const isRtl = dir === "rtl"
  const { category } = useParams<{ category: string }>()
  const catInfo = categories.find((c) => c.id === category)
  const filtered = products.filter((p) => p.category === category)

  return (
    <div className="min-h-screen pt-28 pb-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <AnimatedSection className="mb-12">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-brown-800 text-cream mb-4">
            {iconMap[category]}
            <div>
              <p className="text-xs text-gold-400 font-medium">{t.products.category}</p>
              <p className="font-heading font-bold text-lg">{catInfo?.name || category}</p>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-brown-900 tracking-tight">{catInfo?.name || category}</h1>
          <p className="text-brown-600 mt-3 max-w-xl">{catInfo?.description}</p>
        </AnimatedSection>

        <div className="flex items-center gap-2 text-sm text-brown-400 mb-8">
          <Link href="/" className="hover:text-brown-700 transition-colors">Home</Link>
          <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
          <Link href="/products" className="hover:text-brown-700 transition-colors">{t.products.title}</Link>
          <ChevronRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
          <span className="text-brown-800 font-medium">{catInfo?.name || category}</span>
        </div>

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
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
