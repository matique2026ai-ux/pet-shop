"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, PawPrint, Bird, Shield, Award, Users, ChevronRight } from "lucide-react"
import AnimatedSection from "@/components/animated-section"
import { useI18n } from "@/lib/i18n-context"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
}

export default function AboutPage() {
  const { t, dir } = useI18n()
  const isRtl = dir === "rtl"

  return (
    <>
      <section className="relative min-h-[50vh] flex items-center bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900 text-cream overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-brown-600/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-gold-500/10 text-gold-300 text-xs font-medium tracking-widest uppercase rounded-full mb-8">
              <Heart className="w-3 h-3" /> {t.about.badge}
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6">{t.about.heading}</h1>
            <p className="text-lg text-brown-300 max-w-xl">{t.about.desc}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className={`grid lg:grid-cols-2 gap-16 items-center`}>
            <AnimatedSection direction={isRtl ? "right" : "left"}>
              <span className="text-brown-500 text-sm font-medium tracking-[0.2em] uppercase">{t.about.whoWeAre}</span>
              <h2 className="text-4xl font-heading font-bold text-brown-900 mt-3 mb-6 tracking-tight">{t.about.whoHeading}</h2>
              <div className="w-16 h-0.5 bg-gold-500 mb-6" />
              <div className="space-y-4 text-brown-600 leading-relaxed">
                <p>{t.about.para1}</p>
                <p>{t.about.para2}</p>
                <p>{t.about.para3}</p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction={isRtl ? "left" : "right"}>
              <div className="bg-warm rounded-[2rem] p-8 border border-brown-200">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: PawPrint, label: "500+ Cat Products" },
                    { icon: Bird, label: "300+ Bird Products" },
                    { icon: Shield, label: "Quality Guaranteed" },
                    { icon: Award, label: "Award Winning Vet" },
                    { icon: Users, label: "5000+ Happy Pets" },
                    { icon: Heart, label: "Family Owned" },
                  ].map((item, i) => (
                    <motion.div key={item.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                      className="flex items-center gap-3 p-4 bg-cream rounded-xl border border-brown-200">
                      <item.icon className="w-5 h-5 text-brown-600" />
                      <span className="text-sm font-medium text-brown-900">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-28 bg-warm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-brown-500 text-sm font-medium tracking-[0.2em] uppercase">{t.about.whyChoose}</span>
            <h2 className="text-4xl font-heading font-bold text-brown-900 mt-4 tracking-tight">{t.about.whyHeading}</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: PawPrint, title: t.about.petFirst, desc: t.about.petFirstDesc },
              { icon: Award, title: t.about.expertTeam, desc: t.about.expertTeamDesc },
              { icon: Shield, title: t.about.qualityAssurance, desc: t.about.qualityAssuranceDesc },
            ].map((item, i) => (
              <motion.div key={item.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-cream rounded-2xl p-8 border border-brown-200 text-center hover:shadow-xl hover:shadow-brown-900/10 transition-all duration-500">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-brown-800 flex items-center justify-center mb-5"><item.icon className="w-6 h-6 text-gold-400" /></div>
                <h3 className="text-xl font-heading font-bold text-brown-900 mb-3">{item.title}</h3>
                <p className="text-sm text-brown-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-brown-800 to-brown-900 text-cream text-center">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t.about.visitUs}</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto mb-6" />
            <p className="text-brown-300 mb-8 max-w-lg mx-auto">{t.about.visitDesc}</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold-500 text-brown-900 font-medium rounded-full hover:bg-gold-400 transition-colors shadow-lg">
              {t.about.getDirections} <ChevronRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
