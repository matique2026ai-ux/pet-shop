"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock, Send, Check, Heart } from "lucide-react"
import AnimatedSection from "@/components/animated-section"

export default function ContactPage() {
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
              <Heart className="w-3 h-3" /> Get in Touch
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Contact Us</h1>
            <p className="text-lg text-white/70 max-w-xl">We&apos;d love to hear from you. Whether you have a question about our products, services, or just want to say hi.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <AnimatedSection direction="left">
              <span className="text-brand-600 text-sm font-semibold tracking-widest uppercase">Contact Info</span>
              <h2 className="text-3xl font-bold mt-3 mb-8 tracking-tight">Visit Our Store & Clinic</h2>

              <div className="space-y-6">
                {[
                  { icon: MapPin, label: "Address", value: "123 Rue Didouche Mourad, Algiers, Algeria", sub: "Next to the post office" },
                  { icon: Phone, label: "Phone", value: "+213 555 12 34 56", sub: "Available 8 AM – 8 PM", href: "tel:+213555123456" },
                  { icon: Mail, label: "Email", value: "hello@pawswings.dz", sub: "We reply within 24 hours", href: "mailto:hello@pawswings.dz" },
                  { icon: Clock, label: "Hours", value: "Saturday – Thursday: 8:00 AM – 8:00 PM", sub: "Friday: Closed" },
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

            <AnimatedSection direction="right">
              <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-100">
                <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Your Name</label>
                      <input type="text" required value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                        placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
                      <input type="email" required value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                        placeholder="john@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone (optional)</label>
                    <input type="tel" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                      placeholder="+213 555 00 00 00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Message</label>
                    <textarea required rows={4} value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
                      placeholder="Tell us how we can help..." />
                  </div>
                  <button type="submit"
                    className="w-full px-6 py-3.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2">
                    {sent ? <><Check className="w-4 h-4" /> Message Sent!</> : <><Send className="w-4 h-4" /> Send Message</>}
                  </button>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="h-80 bg-neutral-200 flex items-center justify-center">
        <div className="text-center text-neutral-400">
          <MapPin className="w-10 h-10 mx-auto mb-2" />
          <p className="font-semibold">Google Maps Integration</p>
          <p className="text-sm">123 Rue Didouche Mourad, Algiers</p>
        </div>
      </section>
    </>
  )
}
