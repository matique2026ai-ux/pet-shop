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
      <section className="relative min-h-[50vh] flex items-center bg-gradient-to-br from-brand-900 via-brand-800 to-vet-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-brand-400/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white text-xs font-semibold rounded-full mb-6">
              <Heart className="w-3 h-3" /> {t.about.badge}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">{t.about.heading}</h1>
            <p className="text-lg text-white/70 max-w-xl">{t.about.desc}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className={`grid lg:grid-cols-2 gap-16 items-center`}>
            <AnimatedSection direction={isRtl ? "right" : "left"}>
              <span className="text-brand-600 text-sm font-semibold tracking-widest uppercase">{t.about.whoWeAre}</span>
              <h2 className="text-4xl font-bold mt-3 mb-6 tracking-tight">{t.about.whoHeading}</h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>{t.about.para1}</p>
                <p>{t.about.para2}</p>
                <p>{t.about.para3}</p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction={isRtl ? "left" : "right"}>
              <div className="bg-gradient-to-br from-brand-100 via-white to-vet-100 rounded-[2rem] p-8 border border-neutral-100">
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
                      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-100">
                      <item.icon className="w-5 h-5 text-brand-600" />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection className="text-center mb-14">
            <span className="text-brand-600 text-sm font-semibold tracking-widest uppercase">{t.about.whyChoose}</span>
            <h2 className="text-4xl font-bold mt-3 tracking-tight">{t.about.whyHeading}</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: PawPrint, title: t.about.petFirst, desc: t.about.petFirstDesc },
              { icon: Award, title: t.about.expertTeam, desc: t.about.expertTeamDesc },
              { icon: Shield, title: t.about.qualityAssurance, desc: t.about.qualityAssuranceDesc },
            ].map((item, i) => (
              <motion.div key={item.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-white rounded-2xl p-8 border border-neutral-100 text-center hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-500">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-brand-500 to-brand-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.about.visitUs}</h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">{t.about.visitDesc}</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-brand-700 font-semibold rounded-full hover:bg-neutral-100 transition-colors shadow-lg">
              {t.about.getDirections} <ChevronRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
