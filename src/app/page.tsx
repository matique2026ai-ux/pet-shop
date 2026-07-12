"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Star, Shield, Truck, Clock, Heart, PawPrint, Bird, Syringe, Stethoscope, ChevronRight, Phone } from "lucide-react"
import AnimatedSection from "@/components/animated-section"
import { products, testimonials, categories, vetServices } from "@/lib/data"
import { useI18n } from "@/lib/i18n-context"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
}

export default function HomePage() {
  const { t, dir } = useI18n()
  const isRtl = dir === "rtl"

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-cream via-warm to-cream">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brown-200/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold-300/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-20 relative z-10">
          <div className={`grid lg:grid-cols-2 gap-16 items-center`}>
            <div className={isRtl ? "lg:order-2" : ""}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="inline-flex items-center gap-2 px-5 py-2 bg-brown-800 text-gold-300 text-xs font-medium tracking-widest uppercase rounded-full mb-8">
                  <Heart className="w-3 h-3 text-gold-400" /> {t.hero.badge}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.1] tracking-tight mb-6 text-brown-900"
              >
                {t.hero.title1}{" "}
                <span className="text-brown-600">{t.hero.titleAccent}</span>
                <br />{t.hero.title2}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg text-brown-600 leading-relaxed mb-10 max-w-lg"
              >
                {t.hero.desc}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/products"
                  className="group px-8 py-3.5 bg-brown-800 text-cream font-medium rounded-full hover:bg-brown-900 transition-all duration-300 shadow-lg shadow-brown-800/20 hover:shadow-brown-800/30 flex items-center gap-2">
                  {t.hero.shopNow}
                  <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRtl ? "rotate-180" : ""}`} />
                </Link>
                <Link href="/vet"
                  className="px-8 py-3.5 border-2 border-brown-300 text-brown-700 font-medium rounded-full hover:border-brown-500 hover:text-brown-900 transition-all duration-300">
                  {t.hero.vetServices}
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex items-center gap-8 mt-12 pt-8 border-t border-brown-200"
              >
                {[
                  { icon: Truck, label: t.hero.freeDelivery, sub: t.hero.freeDeliverySub },
                  { icon: Shield, label: t.hero.qualityGuaranteed, sub: t.hero.qualityGuaranteedSub },
                  { icon: Clock, label: t.hero.sameDayCare, sub: t.hero.sameDayCareSub },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-brown-100 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-brown-600" />
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs font-medium text-brown-800">{item.label}</p>
                      <p className="text-[10px] text-brown-500">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className={`relative hidden lg:block ${isRtl ? "lg:order-1" : ""}`}
            >
              <div className="relative w-full aspect-square">
                <div className="absolute -inset-4 bg-gradient-to-br from-brown-200 to-gold-200 rounded-[3rem] opacity-40" />
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brown-900/20">
                  <img
                    src="https://placehold.co/700x700/4A2C1A/FCF8F0?text=Paws+%26+Wings&font=playfair"
                    alt="Paws & Wings"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-900/50 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-3xl font-heading font-bold text-cream">Paws & Wings</h3>
                    <p className="text-gold-300 mt-1 text-sm">Where pets come first</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-brown-500 text-sm font-medium tracking-[0.2em] uppercase">{t.categories.title}</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-brown-900 mt-4 tracking-tight">{t.categories.heading}</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
            <p className="text-brown-600 mt-4 max-w-xl mx-auto">{t.categories.desc}</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Link href={`/products/${cat.id}`}
                  className="group block relative overflow-hidden rounded-2xl bg-warm border border-brown-200 p-8 hover:shadow-xl hover:shadow-brown-900/5 transition-all duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-brown-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    {cat.id === "cats" ? <PawPrint className="w-7 h-7 text-gold-400" /> :
                     cat.id === "birds" ? <Bird className="w-7 h-7 text-gold-400" /> :
                     <Heart className="w-7 h-7 text-gold-400" />}
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-brown-900 mb-2 group-hover:text-brown-700 transition-colors">{cat.name}</h3>
                  <p className="text-sm text-brown-600 leading-relaxed mb-6">{cat.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-brown-500">{cat.count} {t.categories.productsCount}</span>
                    <span className="w-10 h-10 rounded-full bg-brown-100 flex items-center justify-center group-hover:bg-brown-800 group-hover:text-cream transition-all duration-300">
                      <ChevronRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 bg-warm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection className="flex items-end justify-between mb-16">
            <div>
              <span className="text-brown-500 text-sm font-medium tracking-[0.2em] uppercase">{t.featured.title}</span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-brown-900 mt-4 tracking-tight">{t.featured.heading}</h2>
              <div className="w-16 h-0.5 bg-gold-500 mt-4" />
            </div>
            <Link href="/products"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-brown-600 hover:text-brown-900 transition-colors">
              {t.featured.viewAll} <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            </Link>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.filter(p => p.isNew || p.isSale).slice(0, 4).map((product, i) => (
              <motion.div key={product.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Link href={`/products/${product.category}/${product.id}`}
                  className="group block bg-cream rounded-2xl border border-brown-200 overflow-hidden hover:shadow-xl hover:shadow-brown-900/10 transition-all duration-500">
                  <div className="relative aspect-[4/5] overflow-hidden bg-brown-100">
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brown-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className={`absolute top-4 flex gap-2 ${isRtl ? "right-4" : "left-4"}`}>
                      {product.isNew && <span className="px-3 py-1 bg-brown-800 text-gold-300 text-[10px] font-medium tracking-wider uppercase rounded-full">{t.products.new}</span>}
                      {product.isSale && <span className="px-3 py-1 bg-gold-500 text-brown-900 text-[10px] font-medium tracking-wider uppercase rounded-full">-{Math.round((1 - (product.salePrice || product.price) / product.price) * 100)}%</span>}
                    </div>
                    <div className={`absolute bottom-4 ${isRtl ? "left-4" : "right-4"} w-10 h-10 rounded-full bg-cream/90 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500`}>
                      <ArrowRight className={`w-4 h-4 text-brown-800 ${isRtl ? "rotate-180" : ""}`} />
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

          <AnimatedSection className="mt-10 text-center md:hidden">
            <Link href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brown-800 text-cream font-medium rounded-full hover:bg-brown-900 transition-colors text-sm">
              {t.featured.viewAll} <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-28 bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900 text-cream relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-brown-600/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className={`grid lg:grid-cols-2 gap-16 items-center`}>
            <AnimatedSection direction={isRtl ? "right" : "left"} className={isRtl ? "lg:order-2" : ""}>
              <span className="inline-flex items-center gap-2 px-5 py-2 bg-gold-500/10 text-gold-300 text-xs font-medium tracking-widest uppercase rounded-full mb-8">
                <Stethoscope className="w-3 h-3" /> {t.vetPreview.badge}
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-6">
                {t.vetPreview.title1}{" "}
                <span className="text-gold-400">{t.vetPreview.titleAccent}</span>
              </h2>
              <div className="w-16 h-0.5 bg-gold-500 mb-8" />
              <p className="text-brown-300 leading-relaxed mb-10 max-w-lg">{t.vetPreview.desc}</p>

              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {vetServices.slice(0, 4).map((service) => (
                  <div key={service.id} className="flex items-center gap-3 bg-brown-700/30 rounded-xl p-4 backdrop-blur-sm border border-brown-700/30">
                    <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
                      {service.icon === "stethoscope" ? <Stethoscope className="w-4 h-4 text-gold-400" /> :
                       service.icon === "syringe" ? <Syringe className="w-4 h-4 text-gold-400" /> :
                       <Heart className="w-4 h-4 text-gold-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-cream">{service.title}</p>
                      <p className="text-xs text-brown-400">{service.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/vet"
                className="inline-flex items-center gap-2 px-7 py-3 bg-gold-500 text-brown-900 font-medium rounded-full hover:bg-gold-400 transition-colors shadow-lg">
                {t.vetPreview.exploreAll} <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
              </Link>
            </AnimatedSection>

            <AnimatedSection direction={isRtl ? "left" : "right"} className={`hidden lg:block ${isRtl ? "lg:order-1" : ""}`}>
              <div className="bg-brown-800/30 backdrop-blur-sm rounded-[2rem] p-8 border border-brown-700/30">
                <div className="text-center mb-8">
                  <Syringe className="w-16 h-16 mx-auto text-gold-400 mb-4" />
                  <h3 className="text-2xl font-heading font-bold text-cream">{t.vetPreview.openingHours}</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { day: t.vetPreview.satThu, hours: t.vetPreview.hours },
                    { day: t.vetPreview.fri, hours: t.vetPreview.closed },
                    { day: t.vetPreview.emergency, hours: t.vetPreview.emergencyCall },
                  ].map((item) => (
                    <div key={item.day} className="flex justify-between items-center py-3 border-b border-brown-700/30">
                      <span className="text-sm text-brown-300">{item.day}</span>
                      <span className="text-sm font-medium text-cream">{item.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-4 bg-gold-500/10 rounded-xl flex items-center gap-3 border border-gold-500/20">
                  <Phone className="w-5 h-5 text-gold-400" />
                  <div>
                    <p className="text-xs text-brown-400">{t.vetPreview.emergencyContact}</p>
                    <p className="font-medium text-cream">+213 555 12 34 56</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-brown-500 text-sm font-medium tracking-[0.2em] uppercase">{t.testimonials.title}</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-brown-900 mt-4 tracking-tight">{t.testimonials.heading}</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((test, i) => (
              <motion.div key={test.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-warm rounded-2xl p-6 border border-brown-200 hover:shadow-lg hover:shadow-brown-900/5 transition-all duration-500">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className={`w-4 h-4 ${s < test.rating ? "text-gold-500 fill-gold-500" : "text-brown-200"}`} />
                  ))}
                </div>
                <p className="text-sm text-brown-600 leading-relaxed mb-4">&ldquo;{test.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brown-800 flex items-center justify-center text-gold-400 text-sm font-medium">{test.name[0]}</div>
                  <div>
                    <p className="text-sm font-medium text-brown-900">{test.name}</p>
                    <p className="text-xs text-brown-500">{test.pet}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 bg-gradient-to-r from-brown-800 to-brown-900 text-cream relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brown-600/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
          <AnimatedSection>
            <Heart className="w-16 h-16 mx-auto mb-6 text-gold-400" />
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4">{t.cta.title}</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto mb-6" />
            <p className="text-brown-300 text-lg mb-10 max-w-2xl mx-auto">{t.cta.desc}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products"
                className="px-8 py-3.5 bg-gold-500 text-brown-900 font-medium rounded-full hover:bg-gold-400 transition-colors shadow-lg">
                {t.cta.startShopping}
              </Link>
              <Link href="/contact"
                className="px-8 py-3.5 border-2 border-brown-600 text-cream font-medium rounded-full hover:bg-brown-700/50 transition-colors">
                {t.cta.bookAppointment}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
