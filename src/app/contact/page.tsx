"use client";

import { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { useSiteSettings } from "@/lib/site-settings";
import AnimatedSection from "@/components/animated-section";
import { MapPin, Phone, Mail, Clock, Send, Sparkles, ChevronRight, CheckCircle, Loader2, PawPrint, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const { t, dir, lang } = useI18n();
  const { store } = useSiteSettings();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const storeVal = (k: string, fb: string) => (store && store[k] ? store[k] : fb);
  const address = storeVal("address", t.contact.addressText);
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
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: lang === "ar" ? "تواصل عبر الواتساب" : lang === "fr" ? "Contact WhatsApp" : "WhatsApp Chat",
      text: lang === "ar" ? "دردشة مباشرة واستفسارات فورية" : lang === "fr" ? "Assistance rapide sur WhatsApp" : "Instant chat & support",
      href: "https://wa.me/213776075355",
      isBtn: true,
    },
    { icon: <Mail className="w-5 h-5" />, title: t.contact.email, text: email },
    { icon: <Clock className="w-5 h-5" />, title: t.contact.hours, text: `${t.contact.weekday}\n${t.contact.weekend}` },
  ];

  return (
    <div className="bg-[#F8F7F4] min-h-screen" dir={dir}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-[#0F1913] via-[#1C2C22] to-[#0A120D] text-white">
        {/* Glow & Paw Decor */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F5851F]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
        <PawPrint className="absolute top-8 left-[6%] w-24 h-24 text-white/5 rotate-[-20deg] pointer-events-none select-none" />
        <PawPrint className="absolute bottom-8 right-[8%] w-32 h-32 text-white/5 rotate-[15deg] pointer-events-none select-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs sm:text-sm font-semibold text-[#F1C290] border border-white/15 mb-6 shadow-xl">
              <Sparkles className="w-4 h-4 text-[#F5851F]" /> {t.contact.heroBadge}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-xl">
              {t.contact.title}
            </h1>
            <p className="text-base md:text-xl text-emerald-100/70 max-w-2xl mx-auto font-light drop-shadow-md">
              {t.contact.subtitle}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {info.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-3xl p-6 text-center border border-[#E2DDD4] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center justify-center group"
                  >
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-white mb-4 bg-emerald-600 shadow-lg shadow-emerald-600/30 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-[#1A1A2E] text-lg mb-2 group-hover:text-emerald-700 transition-colors">{item.title}</h3>
                    <p dir="auto" className="text-sm text-[#5C5348] whitespace-pre-line mb-3">{item.text}</p>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                      {lang === "ar" ? "افتح الواتساب الآن 💬" : "Ouvrir WhatsApp"}
                    </span>
                  </a>
                ) : (
                  <div className="bg-white rounded-3xl p-6 text-center border border-[#E2DDD4] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-white mb-4 bg-gradient-to-br from-[#F1C290] to-[#E3602D] shadow-lg shadow-[#E3602D]/30">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-[#1A1A2E] text-lg mb-2">{item.title}</h3>
                    <p dir="auto" className="text-sm text-[#5C5348] whitespace-pre-line">{item.text}</p>
                  </div>
                )}
              </AnimatedSection>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Form Section */}
            <AnimatedSection>
              <div className="bg-white rounded-3xl p-8 lg:p-10 border border-[#E2DDD4] shadow-lg h-full relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#F1C290]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#E3602D]/10 rounded-full blur-3xl pointer-events-none" />
                
                <h2 className="text-3xl font-bold text-[#1A1A2E] mb-2">{t.contact.formTitle}</h2>
                <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#E3602D] to-[#F1C290] mb-4" />
                <p className="text-[#9E9282] mb-8">{t.contact.formSubtitle}</p>
                
                {sent ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">{t.contact.formSuccess}</h3>
                    <p className="text-[#5C5348] mb-8">{t.contact.formSuccessDesc}</p>
                    <button onClick={() => setSent(false)} className="text-[#E3602D] hover:text-[#A87A2E] font-bold underline underline-offset-4 transition-colors">
                      {t.contact.formSendAnother}
                    </button>
                  </div>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-[#1A1A2E] mb-2">{t.contact.formName}</label>
                      <input type="text" name="name" required dir="auto" className="w-full px-5 py-3.5 bg-[#F8F7F4] border border-[#E2DDD4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E3602D]/50 focus:border-[#E3602D] focus:bg-white transition-all shadow-sm" placeholder={t.contact.formNamePlaceholder} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#1A1A2E] mb-2">{t.contact.formEmail}</label>
                      <input type="email" name="email" required dir="auto" className="w-full px-5 py-3.5 bg-[#F8F7F4] border border-[#E2DDD4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E3602D]/50 focus:border-[#E3602D] focus:bg-white transition-all shadow-sm" placeholder={t.contact.formEmailPlaceholder} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1A1A2E] mb-2">{t.contact.formMessage}</label>
                    <textarea name="message" required rows={5} dir="auto" className="w-full px-5 py-3.5 bg-[#F8F7F4] border border-[#E2DDD4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E3602D]/50 focus:border-[#E3602D] focus:bg-white transition-all resize-none shadow-sm" placeholder={t.contact.formMessagePlaceholder} />
                  </div>
                  <button type="submit" disabled={sending} className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#E3602D] to-[#A87A2E] text-white px-8 py-4 rounded-xl text-base font-bold hover:opacity-90 transition-all shadow-lg shadow-[#E3602D]/30 hover:shadow-xl hover:-translate-y-1 disabled:opacity-60">
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {t.contact.formSubmit}
                    <ChevronRight className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                  </button>
                </form>
                )}
              </div>
            </AnimatedSection>

            {/* Map Section */}
            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-3xl p-2 border border-[#E2DDD4] shadow-lg h-full min-h-[400px] relative overflow-hidden group">
                <iframe
                  src="https://maps.google.com/maps?q=36.1898,5.4123&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '400px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-2xl transition-transform duration-700 group-hover:scale-105"
                  title={t.contact.storeName}
                />
                
                {/* Floating Location Card */}
                <div className="absolute bottom-6 left-6 right-6 sm:right-auto bg-white/95 backdrop-blur-xl rounded-2xl p-4 border border-white/50 shadow-2xl z-10 transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#F1C290] to-[#E3602D] rounded-full flex items-center justify-center text-white shrink-0 shadow-inner">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1A1A2E] text-base">{store?.storeName || store?.name || t.contact.storeName}</p>
                      <p dir="auto" className="text-sm text-[#5C5348] mt-0.5 line-clamp-2">{address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
          </div>
        </div>
      </section>
    </div>
  );
}
