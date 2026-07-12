"use client"

import { motion } from "framer-motion"
import { Syringe, Stethoscope, Scissors, Smile, Microscope, Ambulance, Apple, Heart, Phone, Star, ChevronRight, Calendar } from "lucide-react"
import AnimatedSection from "@/components/animated-section"
import { vetServices, team, testimonials } from "@/lib/data"
import { useI18n } from "@/lib/i18n-context"

const iconMap: Record<string, React.ReactNode> = {
  stethoscope: <Stethoscope className="w-6 h-6 text-gold-400" />,
  syringe: <Syringe className="w-6 h-6 text-gold-400" />,
  scalpel: <Stethoscope className="w-6 h-6 text-gold-400" />,
  scissors: <Scissors className="w-6 h-6 text-gold-400" />,
  tooth: <Smile className="w-6 h-6 text-gold-400" />,
  microscope: <Microscope className="w-6 h-6 text-gold-400" />,
  ambulance: <Ambulance className="w-6 h-6 text-gold-400" />,
  apple: <Apple className="w-6 h-6 text-gold-400" />,
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
}

export default function VetPage() {
  const { t, dir } = useI18n()
  const isRtl = dir === "rtl"

  return (
    <>
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900 text-cream overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-brown-600/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-gold-500/10 text-gold-300 text-xs font-medium tracking-widest uppercase rounded-full mb-8">
              <Stethoscope className="w-3 h-3" /> {t.vet.badge}
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6">
            {t.vet.title1} <span className="text-gold-400">{t.vet.titleAccent}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-brown-300 max-w-xl mb-8">{t.vet.desc}</motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-4">
            <a href="#services" className="px-7 py-3.5 bg-gold-500 text-brown-900 font-medium rounded-full hover:bg-gold-400 transition-colors shadow-lg">{t.vet.ourServices}</a>
            <a href="tel:+213555123456" className="px-7 py-3.5 border-2 border-brown-700 text-cream font-medium rounded-full hover:bg-brown-700/50 transition-colors flex items-center gap-2">
              <Phone className="w-4 h-4" /> {t.vet.emergencyCall}
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-cream border-b border-brown-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: "2,500+", label: t.vet.petsTreated },
              { num: "12+", label: t.vet.yearsExperience },
              { num: "8", label: t.vet.vetServices },
              { num: "98%", label: t.vet.happyClients },
            ].map((stat, i) => (
              <motion.div key={stat.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
                <p className="text-3xl md:text-4xl font-heading font-bold text-brown-800">{stat.num}</p>
                <p className="text-sm text-brown-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-28 bg-warm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-brown-500 text-sm font-medium tracking-[0.2em] uppercase">{t.vet.whatWeOffer}</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-brown-900 mt-4 tracking-tight">{t.vet.heading}</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
            <p className="text-brown-600 mt-4 max-w-xl mx-auto">{t.vet.subheading}</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vetServices.map((service, i) => (
              <motion.div key={service.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="group bg-cream rounded-2xl p-6 border border-brown-200 hover:border-brown-400 hover:shadow-xl hover:shadow-brown-900/10 transition-all duration-500">
                <div className="w-12 h-12 rounded-xl bg-brown-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brown-800 transition-all duration-500">
                  {iconMap[service.icon] || <Heart className="w-6 h-6 text-gold-400" />}
                </div>
                <h3 className="font-heading font-bold text-brown-900 mb-2">{service.title}</h3>
                <p className="text-sm text-brown-600 leading-relaxed mb-4">{service.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-brown-200">
                  <span className="text-sm font-medium text-brown-800">{service.price}</span>
                  <span className="text-xs text-brown-400">{service.duration}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-brown-500 text-sm font-medium tracking-[0.2em] uppercase">{t.vet.ourTeam}</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-brown-900 mt-4 tracking-tight">{t.vet.teamHeading}</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
            <p className="text-brown-600 mt-4 max-w-xl mx-auto">{t.vet.teamSub}</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div key={member.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="group text-center">
                <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-brown-700 to-brown-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-500 shadow-lg shadow-brown-900/20">
                  <span className="text-5xl font-heading font-bold text-gold-400">{member.name[0]}</span>
                </div>
                <h3 className="text-xl font-heading font-bold text-brown-900">{member.name}</h3>
                <p className="text-sm text-gold-500 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-brown-600 max-w-xs mx-auto">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 bg-warm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-brown-500 text-sm font-medium tracking-[0.2em] uppercase">{t.testimonials.title}</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-brown-900 mt-4 tracking-tight">{t.vet.clientSay}</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((test, i) => (
              <motion.div key={test.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-cream rounded-2xl p-6 border border-brown-200 hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (<Star key={s} className={`w-4 h-4 ${s < test.rating ? "text-gold-500 fill-gold-500" : "text-brown-200"}`} />))}
                </div>
                <p className="text-sm text-brown-600 leading-relaxed mb-4">&ldquo;{test.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brown-800 flex items-center justify-center text-gold-400 text-sm font-medium">{test.name[0]}</div>
                  <div><p className="text-sm font-medium text-brown-900">{test.name}</p><p className="text-xs text-brown-500">{test.pet}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-brown-800 to-brown-900 text-cream">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <AnimatedSection>
            <Calendar className="w-14 h-14 mx-auto mb-5 text-gold-400" />
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t.vet.bookAppointment}</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto mb-6" />
            <p className="text-brown-300 mb-8 max-w-lg mx-auto">{t.vet.bookDesc}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+213555123456" className="px-7 py-3.5 bg-gold-500 text-brown-900 font-medium rounded-full hover:bg-gold-400 transition-colors shadow-lg flex items-center gap-2">
                <Phone className="w-4 h-4" /> +213 555 12 34 56</a>
              <a href="/contact" className="px-7 py-3.5 border-2 border-brown-700 text-cream font-medium rounded-full hover:bg-brown-700/50 transition-colors">{t.vet.sendMessage}</a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
