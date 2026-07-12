"use client"

import { motion } from "framer-motion"
import { Syringe, Stethoscope, Scissors, Smile, Microscope, Ambulance, Apple, Heart, Phone, Clock, Shield, Star, ChevronRight, Calendar } from "lucide-react"
import AnimatedSection from "@/components/animated-section"
import { vetServices, team, testimonials } from "@/lib/data"

const iconMap: Record<string, React.ReactNode> = {
  stethoscope: <Stethoscope className="w-6 h-6 text-vet-600" />,
  syringe: <Syringe className="w-6 h-6 text-vet-600" />,
  scalpel: <Stethoscope className="w-6 h-6 text-vet-600" />,
  scissors: <Scissors className="w-6 h-6 text-vet-600" />,
  tooth: <Smile className="w-6 h-6 text-vet-600" />,
  microscope: <Microscope className="w-6 h-6 text-vet-600" />,
  ambulance: <Ambulance className="w-6 h-6 text-vet-600" />,
  apple: <Apple className="w-6 h-6 text-vet-600" />,
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
}

export default function VetPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-vet-900 via-vet-800 to-vet-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-brand-400/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white text-xs font-semibold rounded-full mb-6">
              <Stethoscope className="w-3 h-3" /> Veterinary Clinic
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Expert Care for{" "}
            <span className="text-vet-300">Every Paw & Wing</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-white/70 max-w-xl mb-8"
          >
            State-of-the-art veterinary clinic with experienced professionals dedicated to your pet&apos;s health and well-being.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <a href="#services" className="px-7 py-3.5 bg-white text-vet-900 font-semibold rounded-full hover:bg-vet-100 transition-colors shadow-lg">
              Our Services
            </a>
            <a href="tel:+213555123456" className="px-7 py-3.5 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
              <Phone className="w-4 h-4" /> Emergency Call
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: "2,500+", label: "Pets Treated" },
              { num: "12+", label: "Years Experience" },
              { num: "8", label: "Vet Services" },
              { num: "98%", label: "Happy Clients" },
            ].map((stat, i) => (
              <motion.div key={stat.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-vet-600">{stat.num}</p>
                <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection className="text-center mb-14">
            <span className="text-vet-600 text-sm font-semibold tracking-widest uppercase">What We Offer</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight">Veterinary Services</h2>
            <p className="text-neutral-500 mt-4 max-w-xl mx-auto">Comprehensive medical care tailored to your pet&apos;s needs.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vetServices.map((service, i) => (
              <motion.div key={service.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp}
                className="group bg-white rounded-2xl p-6 border border-neutral-100 hover:border-vet-200 hover:shadow-xl hover:shadow-vet-500/10 transition-all duration-500">
                <div className="w-12 h-12 rounded-xl bg-vet-50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-vet-100 transition-all duration-500">
                  {iconMap[service.icon] || <Heart className="w-6 h-6 text-vet-600" />}
                </div>
                <h3 className="font-bold mb-2">{service.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-4">{service.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <span className="text-sm font-semibold text-vet-600">{service.price}</span>
                  <span className="text-xs text-neutral-400">{service.duration}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection className="text-center mb-14">
            <span className="text-vet-600 text-sm font-semibold tracking-widest uppercase">Our Team</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight">Meet the Veterinarians</h2>
            <p className="text-neutral-500 mt-4 max-w-xl mx-auto">Passionate professionals dedicated to your pet&apos;s health.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div key={member.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp}
                className="group text-center">
                <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-vet-400 to-vet-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-500 shadow-lg shadow-vet-500/20">
                  <span className="text-5xl text-white font-bold">{member.name[0]}</span>
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-sm text-vet-600 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-neutral-500 max-w-xs mx-auto">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection className="text-center mb-14">
            <span className="text-vet-600 text-sm font-semibold tracking-widest uppercase">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight">What Our Clients Say</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t, i) => (
              <motion.div key={t.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white rounded-2xl p-6 border border-neutral-100 hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className={`w-4 h-4 ${s < t.rating ? "text-amber-400 fill-amber-400" : "text-neutral-200"}`} />
                  ))}
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vet-400 to-vet-600 flex items-center justify-center text-white text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-neutral-500">{t.pet}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-vet-700 to-vet-800 text-white">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <AnimatedSection>
            <Calendar className="w-14 h-14 mx-auto mb-5 text-vet-300" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Book an Appointment</h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Give your pet the care they deserve. Call us or visit the clinic — we&apos;re here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+213555123456" className="px-7 py-3.5 bg-white text-vet-800 font-semibold rounded-full hover:bg-vet-100 transition-colors shadow-lg flex items-center gap-2">
                <Phone className="w-4 h-4" /> +213 555 12 34 56
              </a>
              <a href="/contact" className="px-7 py-3.5 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
                Send a Message
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}



