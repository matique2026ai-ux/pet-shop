"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import AnimatedSection from "@/components/animated-section";
import { MapPin, Phone, Mail, Clock, Send, Sparkles, ChevronRight } from "lucide-react";

export default function ContactPage() {
  const { t } = useI18n();

  const info = [
    { icon: <MapPin className="w-5 h-5" />, title: t.contact.address, text: "123 Pet Street\nNew York, NY 10001" },
    { icon: <Phone className="w-5 h-5" />, title: t.contact.phone, text: "+1 (234) 567-890" },
    { icon: <Mail className="w-5 h-5" />, title: t.contact.email, text: "hello@pawsandwings.com" },
    { icon: <Clock className="w-5 h-5" />, title: t.contact.hours, text: `${t.contact.weekday}\n${t.contact.weekend}` },
  ];

  return (
    <div>
      <section className="relative overflow-hidden py-16 lg:py-24 flex items-center min-h-[50vh]">
        <Image
          src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1400&h=600&fit=crop"
          alt="Contact us"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2E241A]/85 via-[#4A3A2A]/60 to-[#2E241A]/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-full text-sm text-emerald-200 border border-white/10 mb-4">
              <Sparkles className="w-4 h-4" /> Get in Touch
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">{t.contact.title}</h1>
            <p className="text-emerald-100/70 text-lg max-w-lg">{t.contact.subtitle}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <AnimatedSection>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  {info.map((item) => (
                    <div key={item.title} className="bg-white rounded-2xl p-5 flex items-start gap-4 transition-all duration-300 hover:-translate-x-1"
                      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}
                    >
                      <span className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-white"
                        style={{ background: "linear-gradient(135deg, #8B7560, #A0896C)" }}
                      >
                        {item.icon}
                      </span>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                        <p className="text-sm text-gray-500 whitespace-pre-line mt-0.5">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-3">
              <AnimatedSection>
                <div className="bg-white rounded-3xl p-8 lg:p-10"
                  style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Send us a message</h2>
                  <p className="text-sm text-gray-500 mb-6">Fill out the form below and we&apos;ll get back to you shortly.</p>
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.formName}</label>
                        <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7560]/20 focus:border-[#8B7560] focus:bg-white transition-all" placeholder="Your name" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.formEmail}</label>
                        <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7560]/20 focus:border-[#8B7560] focus:bg-white transition-all" placeholder="your@email.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.formMessage}</label>
                      <textarea rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7560]/20 focus:border-[#8B7560] focus:bg-white transition-all resize-none" placeholder="Tell us about your pet's needs..." />
                    </div>
                    <button type="submit" className="inline-flex items-center gap-2 bg-[#8B7560] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-[#7D6B55] transition-all shadow-lg shadow-[#8B7560]/20 hover:shadow-xl hover:-translate-y-0.5">
                      <Send className="w-4 h-4" />
                      {t.contact.formSubmit}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </AnimatedSection>
            </div>
          </div>

          <AnimatedSection>
            <div className="mt-12 relative overflow-hidden rounded-3xl h-72">
              <Image
                src="https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1200&h=400&fit=crop"
                alt="Map"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/40 shadow-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#8B7560]" />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Paws & Wings</p>
                    <p className="text-xs text-gray-500">123 Pet Street, New York</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
