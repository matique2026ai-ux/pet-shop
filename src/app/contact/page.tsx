"use client";

import { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { useSiteSettings } from "@/lib/site-settings";
import AnimatedSection from "@/components/animated-section";
import { MapPin, Phone, Mail, Clock, Send, Sparkles, ChevronRight, CheckCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
  const { t, dir } = useI18n();
  const { store, content } = useSiteSettings();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const storeVal = (k: string, fb: string) => (store && store[k] ? store[k] : fb);
  const address = storeVal("address", t.contact.addressText);
  const phone = storeVal("phone", t.contact.phoneText);
  const email = storeVal("email", t.contact.emailText);
  
  const heroBg = content?.contactHeroImage || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1400&h=600&fit=crop";

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
    <div className="bg-[#F8F7F4] min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 flex items-center">
        <Image
          src={heroBg}
          alt={t.contact.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#1A120B]/80 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8F7F4] to-transparent opacity-90" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold text-[#DFB96A] border border-[#DFB96A]/30 mb-6 shadow-xl">
              <Sparkles className="w-4 h-4" /> {t.contact.heroBadge}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl">
              {t.contact.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light drop-shadow-md">
              {t.contact.subtitle}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-24 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {info.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <div className="bg-white rounded-3xl p-6 text-center border border-[#E2DDD4] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white mb-4 bg-gradient-to-br from-[#DFB96A] to-[#C4933F] shadow-lg shadow-[#C4933F]/30">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-[#1A1A2E] text-lg mb-2">{item.title}</h3>
                  <p dir="auto" className="text-sm text-[#5C5348] whitespace-pre-line">{item.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Form Section */}
            <AnimatedSection>
              <div className="bg-white rounded-3xl p-8 lg:p-10 border border-[#E2DDD4] shadow-lg h-full relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#DFB96A]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#C4933F]/10 rounded-full blur-3xl pointer-events-none" />
                
                <h2 className="text-3xl font-bold text-[#1A1A2E] mb-2">{t.contact.formTitle}</h2>
                <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#C4933F] to-[#DFB96A] mb-4" />
                <p className="text-[#9E9282] mb-8">{t.contact.formSubtitle}</p>
                
                {sent ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1A1A2E] mb-2">{t.contact.formSuccess}</h3>
                    <p className="text-[#5C5348] mb-8">{t.contact.formSuccessDesc}</p>
                    <button onClick={() => setSent(false)} className="text-[#C4933F] hover:text-[#A87A2E] font-bold underline underline-offset-4 transition-colors">
                      {t.contact.formSendAnother}
                    </button>
                  </div>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-[#1A1A2E] mb-2">{t.contact.formName}</label>
                      <input type="text" name="name" required dir="auto" className="w-full px-5 py-3.5 bg-[#F8F7F4] border border-[#E2DDD4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4933F]/50 focus:border-[#C4933F] focus:bg-white transition-all shadow-sm" placeholder={t.contact.formNamePlaceholder} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#1A1A2E] mb-2">{t.contact.formEmail}</label>
                      <input type="email" name="email" required dir="auto" className="w-full px-5 py-3.5 bg-[#F8F7F4] border border-[#E2DDD4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4933F]/50 focus:border-[#C4933F] focus:bg-white transition-all shadow-sm" placeholder={t.contact.formEmailPlaceholder} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1A1A2E] mb-2">{t.contact.formMessage}</label>
                    <textarea name="message" required rows={5} dir="auto" className="w-full px-5 py-3.5 bg-[#F8F7F4] border border-[#E2DDD4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C4933F]/50 focus:border-[#C4933F] focus:bg-white transition-all resize-none shadow-sm" placeholder={t.contact.formMessagePlaceholder} />
                  </div>
                  <button type="submit" disabled={sending} className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#C4933F] to-[#A87A2E] text-white px-8 py-4 rounded-xl text-base font-bold hover:opacity-90 transition-all shadow-lg shadow-[#C4933F]/30 hover:shadow-xl hover:-translate-y-1 disabled:opacity-60">
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
                    <div className="w-12 h-12 bg-gradient-to-br from-[#DFB96A] to-[#C4933F] rounded-full flex items-center justify-center text-white shrink-0 shadow-inner">
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
