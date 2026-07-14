"use client";

import { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { useSiteSettings } from "@/lib/site-settings";
import AnimatedSection from "@/components/animated-section";
import { MapPin, Phone, Mail, Clock, Send, Sparkles, ChevronRight, CheckCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
  const { t } = useI18n();
  const { store } = useSiteSettings();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const storeVal = (k: string, fb: string) => (store && store[k] ? store[k] : fb);
  const address = storeVal("address", t.contact.addressText);
  const phone = storeVal("phone", t.contact.phoneText);
  const email = storeVal("email", t.contact.emailText);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("https://formspree.io/f/xjkyqkdr", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setSent(true);
        form.reset();
      }
    } catch {
      // silent
    }
    setSending(false);
  };

  const info = [
    { icon: <MapPin className="w-5 h-5" />, title: t.contact.address, text: address },
    { icon: <Phone className="w-5 h-5" />, title: t.contact.phone, text: phone },
    { icon: <Mail className="w-5 h-5" />, title: t.contact.email, text: email },
    { icon: <Clock className="w-5 h-5" />, title: t.contact.hours, text: `${t.contact.weekday}\n${t.contact.weekend}` },
  ];

  return (
    <div>
      <section className="relative overflow-hidden py-16 lg:py-24 flex items-center min-h-[50vh]">
        <Image
          src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1400&h=600&fit=crop"
          alt={t.contact.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#172554]/85 via-[#172554]/60 to-[#172554]/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-full text-sm text-emerald-200 border border-white/10 mb-4">
              <Sparkles className="w-4 h-4" /> {t.contact.heroBadge}
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
                <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6">{t.contact.infoTitle}</h2>
                <div className="space-y-3">
                  {info.map((item) => (
                    <div key={item.title} className="bg-white rounded-2xl p-4 flex items-start gap-3 transition-all duration-300 hover:-translate-x-1"
                      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
                    >
                      <span className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-white"
                        style={{ background: "linear-gradient(135deg, #F97316, #EA580C)" }}
                      >
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                        <p dir="auto" className="text-sm text-gray-500 whitespace-pre-line mt-0.5 break-words">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-3">
              <AnimatedSection>
                <div className="bg-white rounded-3xl p-6 lg:p-8"
                  style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{t.contact.formTitle}</h2>
                  <p className="text-sm text-gray-500 mb-6">{t.contact.formSubtitle}</p>
                  {sent ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{t.contact.formSuccess}</h3>
                      <p className="text-sm text-gray-500 mb-6">{t.contact.formSuccessDesc}</p>
                      <button onClick={() => setSent(false)} className="text-sm text-emerald-600 hover:underline font-medium">{t.contact.formSendAnother}</button>
                    </div>
                  ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.formName}</label>
                        <input type="text" name="name" required dir="auto" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] focus:bg-white transition-all" placeholder={t.contact.formNamePlaceholder} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.formEmail}</label>
                        <input type="email" name="email" required dir="auto" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] focus:bg-white transition-all" placeholder={t.contact.formEmailPlaceholder} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.contact.formMessage}</label>
                      <textarea name="message" required rows={5} dir="auto" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] focus:bg-white transition-all resize-none" placeholder={t.contact.formMessagePlaceholder} />
                    </div>
                    <button type="submit" disabled={sending} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-3.5 rounded-2xl text-base font-bold hover:bg-[#EA580C] transition-all shadow-lg shadow-[#F97316]/20 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60">
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {t.contact.formSubmit}
                      <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </form>
                  )}
                </div>
              </AnimatedSection>
            </div>
          </div>

          <AnimatedSection>
            <div className="mt-12 relative overflow-hidden rounded-3xl h-72">
              <iframe
                src="https://www.google.com/maps?q=36.1898,5.4123&z=14&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-3xl"
                title={t.contact.storeName}
              />
              <div className="absolute bottom-6 left-6 rtl:left-auto rtl:right-6 bg-white/90 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/40 shadow-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#F97316]" />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{store?.name || t.contact.storeName}</p>
                    <p dir="auto" className="text-xs text-gray-500">{address}</p>
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
