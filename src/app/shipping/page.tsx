"use client";

import { useI18n } from "@/lib/i18n-context";
import AnimatedSection from "@/components/animated-section";
import Link from "next/link";
import {
  Truck, Package, MapPin, CreditCard, RotateCcw,
  ShieldCheck, ArrowRight, Zap, CheckCircle, Clock, Phone, PawPrint, Sparkles,
} from "lucide-react";

import { SetifMotorcycleDeliveryBadge } from "@/components/setif-courier-icon";

const STEP_ICONS = [Truck, Phone, Package, MapPin];

export default function ShippingPage() {
  const { t, lang, dir } = useI18n();
  const currency = lang === "ar" ? "د.ج" : "DZD";
  const freeAmount = `5,000 ${currency}`;

  const steps = t.shipping.steps as unknown as { title: string; desc: string }[];
  const regions = t.shipping.deliveryTable as unknown as { region: string; eta: string; fee: string; free: string }[];
  const regionLabels = [t.shipping.express, t.shipping.north, t.shipping.south];

  return (
    <div className="bg-[#F8F7F4] text-slate-800 pb-20" dir={dir}>

      {/* ═══════════════════════════════
          HERO
      ═══════════════════════════════ */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-[#0F1913] via-[#1C2C22] to-[#0A120D] text-white">
        {/* Glow & Paw Decor */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F5851F]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
        <PawPrint className="absolute top-8 left-[6%] w-24 h-24 text-white/5 rotate-[-20deg] pointer-events-none select-none" />
        <PawPrint className="absolute bottom-8 right-[8%] w-32 h-32 text-white/5 rotate-[15deg] pointer-events-none select-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#E3602D]/10 border border-[#E3602D]/30 text-[#F1C290] rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <Truck className="w-4 h-4" />
                {t.shipping.heroBadge}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5 drop-shadow-lg">
                {t.shipping.title}
              </h1>
              <p className="text-lg text-white/70 max-w-md leading-relaxed mb-8">
                {t.shipping.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E3602D] to-[#A87A2E] text-white px-7 py-3.5 rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#E3602D]/30 hover:-translate-y-0.5"
                >
                  {t.shipping.ctaButton}
                  <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
                </Link>
                <span className="inline-flex items-center gap-2 text-sm text-white/50 font-medium">
                  <Zap className="w-4 h-4 text-[#F1C290] fill-current" />
                  {t.shipping.express} · 24–48h
                </span>
              </div>
            </AnimatedSection>

            {/* Stats card */}
            <AnimatedSection>
              <div className="relative mx-auto max-w-sm">
                <div className="rounded-3xl border border-[#E3602D]/20 bg-[#241A11] p-8 shadow-2xl">
                  {/* Route SVG */}
                  <svg viewBox="0 0 400 160" className="w-full h-36 mb-2">
                    <path
                      d="M40 120 C 120 30, 280 30, 360 120"
                      fill="none"
                      stroke="#E3602D"
                      strokeOpacity="0.3"
                      strokeWidth="3"
                      strokeDasharray="8 5"
                    />
                    <circle cx="40" cy="120" r="9" fill="#1A120B" stroke="#F1C290" strokeWidth="2.5" />
                    <circle cx="360" cy="120" r="9" fill="#E3602D" stroke="#1A120B" strokeWidth="2.5" />
                    {/* Truck icon group */}
                    <g transform="translate(185, 50)">
                      <rect x="0" y="10" width="44" height="20" rx="3" fill="#ffffff" />
                      <rect x="6" y="14" width="14" height="12" rx="2" fill="#1A120B" />
                      <path d="M20 14 H38 V30 H20 Z" fill="#E3602D" />
                      <circle cx="10" cy="32" r="5" fill="#1A120B" stroke="#fff" strokeWidth="1.5" />
                      <circle cx="33" cy="32" r="5" fill="#1A120B" stroke="#fff" strokeWidth="1.5" />
                    </g>
                  </svg>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { v: "24–48h", l: t.shipping.express, icon: <Clock className="w-4 h-4" /> },
                      { v: "5,000+", l: t.shipping.freeOver.replace("{amount}", currency), icon: <CheckCircle className="w-4 h-4" /> },
                      { v: "COD", l: t.shipping.codTitle, icon: <CreditCard className="w-4 h-4" /> },
                    ].map((s, i) => (
                      <div key={i} className="text-center rounded-xl bg-[#E3602D]/5 border border-[#E3602D]/10 py-3 px-2">
                        <div className="flex justify-center text-[#F1C290] mb-1">{s.icon}</div>
                        <div className="text-base font-bold text-white">{s.v}</div>
                        <div className="text-[10px] text-white/50 leading-tight mt-0.5">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          BENTO GRID: STEPS, ZONES, COD
      ═══════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* ROW 1: How it works (Steps) */}
        <AnimatedSection>
          <div className="rounded-3xl border border-[#E3602D]/20 bg-[#241A11] p-8 lg:p-10">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-white">{t.shipping.stepsTitle}</h2>
              <p className="text-white/50 mt-2">{t.shipping.stepsSubtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s, i) => {
                const Icon = STEP_ICONS[i] || Truck;
                return (
                  <div key={i} className="relative group">
                    <div className="h-full rounded-2xl bg-[#1A120B] border border-[#E3602D]/10 p-6 hover:border-[#E3602D]/30 transition-colors duration-300">
                      <span className="absolute -top-3 -start-3 w-8 h-8 rounded-full bg-[#E3602D] text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-[#E3602D]/20">
                        {i + 1}
                      </span>
                      <div className="w-12 h-12 rounded-xl bg-[#E3602D]/10 flex items-center justify-center text-[#F1C290] mb-4">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                      <p className="text-sm text-white/60 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* ROW 2: Delivery Zones & Pricing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <AnimatedSection delay={100} className="h-full">
              <div className="h-full rounded-3xl border border-[#E3602D]/20 bg-[#241A11] p-8 lg:p-10">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white">{t.shipping.pricingTitle}</h2>
                  <p className="text-white/50 mt-2 mb-6">{t.shipping.pricingSubtitle}</p>
                  <SetifMotorcycleDeliveryBadge />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {regions.map((r, i) => {
                    const featured = i === 0;
                    return (
                      <div
                        key={i}
                        className={`relative rounded-2xl p-6 border transition-all duration-300 ${
                          featured
                            ? "bg-gradient-to-b from-[#E3602D]/20 to-transparent border-[#E3602D]/50 shadow-inner"
                            : "bg-[#1A120B] border-[#E3602D]/10 hover:border-[#E3602D]/30"
                        }`}
                      >
                        {featured && (
                          <span className="absolute -top-3 start-4 px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#F1C290] text-[#1A120B]">
                            {t.shipping.express}
                          </span>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-bold text-white">
                            {regionLabels[i] || r.region}
                          </h3>
                          <MapPin className={`w-4 h-4 ${featured ? "text-[#F1C290]" : "text-[#E3602D]/60"}`} />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white/50">{t.shipping.deliveryTableHeaders.eta}</span>
                            <span className="font-bold text-sm text-white">{r.eta}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white/50">{t.shipping.deliveryTableHeaders.fee}</span>
                            <span className="font-bold text-sm text-[#F1C290]">{r.fee}</span>
                          </div>
                          <div className="pt-3 border-t border-white/5">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400/90">
                              <CheckCircle className="w-3.5 h-3.5" />
                              {t.shipping.freeOver.replace("{amount}", freeAmount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* ROW 2: COD & Returns */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <AnimatedSection delay={200} className="flex-1">
              <div className="h-full rounded-3xl border border-[#E3602D]/20 bg-[#241A11] p-8 flex flex-col justify-center">
                <div className="w-12 h-12 rounded-xl bg-[#E3602D]/10 flex items-center justify-center text-[#F1C290] mb-4">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{t.shipping.codTitle}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{t.shipping.codDesc}</p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={300} className="flex-1">
              <div className="h-full rounded-3xl border border-[#E3602D]/20 bg-[#241A11] p-8 flex flex-col justify-center">
                <div className="w-12 h-12 rounded-xl bg-[#E3602D]/10 flex items-center justify-center text-[#F1C290] mb-4">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{t.shipping.returnsTitle}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{t.shipping.returnsDesc}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          DETAILED POLICIES (SECTIONS)
      ═══════════════════════════════ */}
      {t.shipping.sections && t.shipping.sections.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <AnimatedSection>
            <div className="rounded-3xl border border-[#E3602D]/20 bg-[#241A11] p-8 lg:p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(t.shipping.sections as unknown as { title: string; text: string }[]).map((sec, i) => (
                  <div key={i} className="space-y-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-[#E3602D]/10 pb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F1C290]" />
                      {sec.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {sec.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* ═══════════════════════════════
          CTA BANNER (Bento Style)
      ═══════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-3xl border border-[#E3602D]/30 bg-gradient-to-br from-[#241A11] to-[#1A120B] p-10 lg:p-14 text-center shadow-2xl">
            {/* Glow effects */}
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#E3602D] rounded-full opacity-10 blur-3xl -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#F1C290] rounded-full opacity-10 blur-3xl -translate-y-1/2 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="inline-flex items-center gap-2 bg-[#E3602D]/10 border border-[#E3602D]/20 text-[#F1C290] rounded-full px-4 py-1.5 text-sm font-medium mb-5">
                <ShieldCheck className="w-4 h-4" />
                {t.shipping.subtitle}
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">{t.shipping.ctaTitle}</h2>
              <p className="text-white/60 max-w-md mx-auto mb-8">{t.shipping.ctaDesc}</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E3602D] to-[#A87A2E] text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all shadow-lg shadow-[#E3602D]/30 hover:-translate-y-0.5"
              >
                {t.shipping.ctaButton}
                <ArrowRight className="w-5 h-5 rtl:-scale-x-100" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>

    </div>
  );
}
