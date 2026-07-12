"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Star, Shield, Truck, Clock, Heart, PawPrint, Bird, Syringe, Scissors, Stethoscope, ChevronRight, Phone } from "lucide-react"
import AnimatedSection from "@/components/animated-section"
import { products, testimonials, categories, vetServices } from "@/lib/data"
import { useI18n } from "@/lib/i18n-context"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
}

export default function HomePage() {
  const { t, dir } = useI18n()
  const isRtl = dir === "rtl"

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-brand-50 via-white to-vet-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-vet-200/30 rounded-full blur-3xl" />
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-brand-400/20 rounded-full"
              style={{ top: `${15 + i * 15}%`, [isRtl ? "right" : "left"]: `${10 + i * 14}%` }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-20 relative z-10">
          <div className={`grid lg:grid-cols-2 gap-12 items-center`}>
            <div className={isRtl ? "lg:order-2" : ""}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/10 text-brand-700 text-xs font-semibold rounded-full mb-6">
                  <Heart className="w-3 h-3" /> {t.hero.badge}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
              >
                {t.hero.title1}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-700">
                  {t.hero.titleAccent}
                </span>{" "}
                {t.hero.title2}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg text-neutral-600 leading-relaxed mb-8 max-w-lg"
              >
                {t.hero.desc}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/products"
                  className="group px-8 py-3.5 bg-brand-500 text-white font-semibold rounded-full hover:bg-brand-600 transition-all duration-300 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 flex items-center gap-2"
                >
                  {t.hero.shopNow}
                  <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""} group-hover:translate-x-1 transition-transform`} style={isRtl ? { rotate: "180deg" } : {}} />
                </Link>
                <Link
                  href="/vet"
                  className="px-8 py-3.5 border-2 border-neutral-200 text-neutral-700 font-semibold rounded-full hover:border-brand-500 hover:text-brand-600 transition-all duration-300"
                >
                  {t.hero.vetServices}
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="flex items-center gap-6 mt-10 pt-8 border-t border-neutral-100"
              >
                {[
                  { icon: Truck, label: t.hero.freeDelivery, sub: t.hero.freeDeliverySub },
                  { icon: Shield, label: t.hero.qualityGuaranteed, sub: t.hero.qualityGuaranteedSub },
                  { icon: Clock, label: t.hero.sameDayCare, sub: t.hero.sameDayCareSub },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-brand-600" />
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs font-semibold">{item.label}</p>
                      <p className="text-[10px] text-neutral-500">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className={`relative hidden lg:block ${isRtl ? "lg:order-1" : ""}`}
            >
              <div className="relative w-full aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-200 to-vet-200 rounded-[3rem] rotate-6 opacity-60" />
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <img src="https://placehold.co/700x700/EA580C/FFFFFF?text=Paws+%26+Wings&font=playfair" alt="Paws & Wings" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-3xl font-bold">Paws & Wings</h3>
                    <p className="text-white/80 mt-1">Where pets come first</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection className="text-center mb-14">
            <span className="text-brand-600 text-sm font-semibold tracking-widest uppercase">{t.categories.title}</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight">{t.categories.heading}</h2>
            <p className="text-neutral-500 mt-4 max-w-xl mx-auto">{t.categories.desc}</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Link href={`/products/${cat.id}`} className="group block relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200 p-8 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-500">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                    {cat.id === "cats" ? <PawPrint className="w-6 h-6 text-white" /> :
                     cat.id === "birds" ? <Bird className="w-6 h-6 text-white" /> :
                     <Heart className="w-6 h-6 text-white" />}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-brand-600 transition-colors">{cat.name}</h3>
                  <p className="text-sm text-neutral-500 mb-4">{cat.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-brand-600">{cat.count} {t.categories.productsCount}</span>
                    <span className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                      <ChevronRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection className="flex items-end justify-between mb-14">
            <div>
              <span className="text-brand-600 text-sm font-semibold tracking-widest uppercase">{t.featured.title}</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight">{t.featured.heading}</h2>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              {t.featured.viewAll} <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            </Link>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.filter(p => p.isNew || p.isSale).slice(0, 4).map((product, i) => (
              <motion.div key={product.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Link href={`/products/${product.category}/${product.id}`} className="group block bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-500">
                  <div className="relative aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {product.category === "cats" ? <PawPrint className="w-16 h-16 text-neutral-300" /> : <Bird className="w-16 h-16 text-neutral-300" />}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className={`absolute top-3 flex gap-2 ${isRtl ? "right-3" : "left-3"}`}>
                      {product.isNew && <span className="px-2.5 py-1 bg-vet-500 text-white text-[10px] font-bold rounded-full">{t.products.new}</span>}
                      {product.isSale && <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full">-{Math.round((1 - (product.salePrice || product.price) / product.price) * 100)}%</span>}
                    </div>
                    <div className={`absolute bottom-3 ${isRtl ? "left-3" : "right-3"} w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500`}>
                      <ArrowRight className={`w-4 h-4 text-brand-600 ${isRtl ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] text-brand-600 font-semibold tracking-widest uppercase mb-1">{product.subcategory}</p>
                    <h3 className="font-semibold text-sm leading-snug mb-2 group-hover:text-brand-600 transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{product.isSale ? product.salePrice : product.price} DZD</span>
                      {product.isSale && <span className="text-sm text-neutral-400 line-through">{product.price} DZD</span>}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <AnimatedSection className="mt-8 text-center md:hidden">
            <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-semibold rounded-full hover:bg-brand-600 transition-colors text-sm">
              {t.featured.viewAll} <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-vet-900 via-vet-800 to-vet-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-brand-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className={`grid lg:grid-cols-2 gap-14 items-center`}>
            <AnimatedSection direction={isRtl ? "right" : "left"} className={isRtl ? "lg:order-2" : ""}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white text-xs font-semibold rounded-full mb-6">
                <Stethoscope className="w-3 h-3" /> {t.vetPreview.badge}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                {t.vetPreview.title1}{" "}
                <span className="text-vet-300">{t.vetPreview.titleAccent}</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-8 max-w-lg">{t.vetPreview.desc}</p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {vetServices.slice(0, 4).map((service) => (
                  <div key={service.id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3.5 backdrop-blur-sm">
                    <div className="w-9 h-9 rounded-lg bg-vet-500/20 flex items-center justify-center">
                      {service.icon === "stethoscope" ? <Stethoscope className="w-4 h-4 text-vet-300" /> :
                       service.icon === "syringe" ? <Syringe className="w-4 h-4 text-vet-300" /> :
                       service.icon === "scissors" ? <Scissors className="w-4 h-4 text-vet-300" /> :
                       <Heart className="w-4 h-4 text-vet-300" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{service.title}</p>
                      <p className="text-xs text-white/50">{service.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/vet" className="inline-flex items-center gap-2 px-7 py-3 bg-white text-vet-900 font-semibold rounded-full hover:bg-vet-100 transition-colors shadow-lg">
                {t.vetPreview.exploreAll} <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
              </Link>
            </AnimatedSection>

            <AnimatedSection direction={isRtl ? "left" : "right"} className={`hidden lg:block ${isRtl ? "lg:order-1" : ""}`}>
              <div className="bg-white/5 backdrop-blur-sm rounded-[2rem] p-8 border border-white/10">
                <div className="text-center mb-6">
                  <Syringe className="w-16 h-16 mx-auto text-vet-300 mb-4" />
                  <h3 className="text-2xl font-bold">{t.vetPreview.openingHours}</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { day: t.vetPreview.satThu, hours: t.vetPreview.hours },
                    { day: t.vetPreview.fri, hours: t.vetPreview.closed },
                    { day: t.vetPreview.emergency, hours: t.vetPreview.emergencyCall },
                  ].map((item) => (
                    <div key={item.day} className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-sm text-white/70">{item.day}</span>
                      <span className="text-sm font-semibold">{item.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-vet-500/20 rounded-xl flex items-center gap-3">
                  <Phone className="w-5 h-5 text-vet-300" />
                  <div>
                    <p className="text-xs text-white/60">{t.vetPreview.emergencyContact}</p>
                    <p className="font-semibold">+213 555 12 34 56</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection className="text-center mb-14">
            <span className="text-brand-600 text-sm font-semibold tracking-widest uppercase">{t.testimonials.title}</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight">{t.testimonials.heading}</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((test, i) => (
              <motion.div key={test.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-500">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className={`w-4 h-4 ${s < test.rating ? "text-amber-400 fill-amber-400" : "text-neutral-200"}`} />
                  ))}
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">&ldquo;{test.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold">
                    {test.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{test.name}</p>
                    <p className="text-xs text-neutral-500">{test.pet}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-brand-500 to-brand-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
          <AnimatedSection>
            <Heart className="w-16 h-16 mx-auto mb-6 text-white/70" />
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{t.cta.title}</h2>
            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">{t.cta.desc}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products" className="px-8 py-3.5 bg-white text-brand-700 font-semibold rounded-full hover:bg-neutral-100 transition-colors shadow-lg">
                {t.cta.startShopping}
              </Link>
              <Link href="/contact" className="px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
                {t.cta.bookAppointment}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

