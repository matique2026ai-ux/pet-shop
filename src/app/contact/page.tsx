"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock, Send, Check, Heart } from "lucide-react"
import AnimatedSection from "@/components/animated-section"
import { useI18n } from "@/lib/i18n-context"

export default function ContactPage() {
  const { t, dir } = useI18n()
  const isRtl = dir === "rtl"
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
    setForm({ name: "", email: "", phone: "", message: "" })
  }

  return (
    <>
      <section className="relative min-h-[50vh] flex items-center bg-gradient-to-br from-brand-900 via-brand-800 to-vet-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-brand-400/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white text-xs font-semibold rounded-full mb-6">
              <Heart className="w-3 h-3" /> {t.contact.badge}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">{t.contact.heading}</h1>
            <p className="text-lg text-white/70 max-w-xl">{t.contact.desc}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className={`grid lg:grid-cols-2 gap-16`}>
            <AnimatedSection direction={isRtl ? "right" : "left"}>
              <span className="text-brand-600 text-sm font-semibold tracking-widest uppercase">{t.contact.contactInfo}</span>
              <h2 className="text-3xl font-bold mt-3 mb-8 tracking-tight">{t.contact.visitHeading}</h2>

              <div className="space-y-6">
                {[
                  { icon: MapPin, label: t.contact.address, value: t.contact.addressValue, sub: t.contact.addressSub },
                  { icon: Phone, label: t.contact.phone, value: "+213 555 12 34 56", sub: t.contact.phoneSub, href: "tel:+213555123456" },
                  { icon: Mail, label: t.contact.email, value: "hello@pawswings.dz", sub: t.contact.emailSub, href: "mailto:hello@pawswings.dz" },
                  { icon: Clock, label: t.contact.hours, value: t.contact.hoursValue, sub: t.contact.hoursSub },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="font-semibold hover:text-brand-600 transition-colors">{item.value}</a>
                      ) : (
                        <p className="font-semibold">{item.value}</p>
                      )}
                      <p className="text-sm text-neutral-400">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection direction={isRtl ? "left" : "right"}>
              <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-100">
                <h3 className="text-xl font-bold mb-6">{t.contact.sendMessage}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t.contact.yourName}</label>
                      <input type="text" required value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                        placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t.contact.emailLabel}</label>
                      <input type="email" required value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                        placeholder="john@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t.contact.phoneLabel}</label>
                    <input type="tel" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                      placeholder="+213 555 00 00 00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">{t.contact.message}</label>
                    <textarea required rows={4} value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                      placeholder={t.contact.messagePlaceholder} />
                  </div>
                  <button type="submit"
                    className="w-full px-6 py-3.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2">
                    {sent ? <><Check className="w-4 h-4" /> {t.contact.messageSent}</> : <><Send className="w-4 h-4" /> {t.contact.send}</>}
                  </button>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="h-80 bg-neutral-200 flex items-center justify-center">
        <div className="text-center text-neutral-400">
          <MapPin className="w-10 h-10 mx-auto mb-2" />
          <p className="font-semibold">Google Maps</p>
          <p className="text-sm">123 Rue Didouche Mourad, Algiers</p>
        </div>
      </section>
    </>
  )
}
