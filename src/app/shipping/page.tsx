"use client";

import { useI18n } from "@/lib/i18n-context";
import AnimatedSection from "@/components/animated-section";
import Link from "next/link";
import {
  Truck, Package, MapPin, CreditCard, RotateCcw,
  ShieldCheck, ArrowRight, Zap, CheckCircle, Clock, Phone,
} from "lucide-react";

const STEP_ICONS = [Truck, Phone, Package, MapPin];

export default function ShippingPage() {
  const { t, lang, dir } = useI18n();
  const currency = lang === "ar" ? "د.ج" : "DZD";
  const freeAmount = `5,000 ${currency}`;

  const steps = t.shipping.steps as unknown as { title: string; desc: string }[];
  const regions = t.shipping.deliveryTable as unknown as { region: string; eta: string; fee: string; free: string }[];
  const regionLabels = [t.shipping.express, t.shipping.north, t.shipping.south];

  return (
    <div className="bg-[#F8F7F4] min-h-screen" dir={dir}>

      {/* ═══════════════════════════════
          HERO
      ═══════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1A2E] via-[#2D2B45] to-[#1A1A2E] py-20 lg:py-28">
        {/* Gold glow accents */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#C4933F] rounded-full opacity-5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#DFB96A] rounded-full opacity-5 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#C4933F]/20 backdrop-blur-sm border border-[#C4933F]/40 text-[#DFB96A] rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <Truck className="w-4 h-4" />
                {t.shipping.heroBadge}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5 drop-shadow-lg">
                {t.shipping.title}
              </h1>
              <p className="text-lg text-white/75 max-w-md leading-relaxed mb-8">
                {t.shipping.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C4933F] to-[#A87A2E] text-white px-7 py-3.5 rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#C4933F]/30 hover:-translate-y-0.5"
                >
                  {t.shipping.ctaButton}
                  <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
                </Link>
                <span className="inline-flex items-center gap-2 text-sm text-white/60">
                  <Zap className="w-4 h-4 text-[#DFB96A] fill-current" />
                  {t.shipping.express} · 24–48h
                </span>
              </div>
            </AnimatedSection>

            {/* Stats card */}
            <AnimatedSection>
              <div className="relative mx-auto max-w-sm">
                <div className="rounded-3xl border border-[#C4933F]/25 bg-white/[0.06] backdrop-blur-sm p-8 shadow-2xl">
                  {/* Route SVG */}
                  <svg viewBox="0 0 400 160" className="w-full h-36 mb-2">
                    <path
                      d="M40 120 C 120 30, 280 30, 360 120"
                      fill="none"
                      stroke="#C4933F"
                      strokeOpacity="0.5"
                      strokeWidth="3"
                      strokeDasharray="8 5"
                    />
                    <circle cx="40" cy="120" r="9" fill="#1A1A2E" stroke="#DFB96A" strokeWidth="2.5" />
                    <circle cx="360" cy="120" r="9" fill="#C4933F" stroke="#fff" strokeWidth="2.5" />
                    {/* Truck icon group */}
                    <g transform="translate(185, 50)">
                      <rect x="0" y="10" width="44" height="20" rx="3" fill="#ffffff" />
                      <rect x="6" y="14" width="14" height="12" rx="2" fill="#1A1A2E" />
                      <path d="M20 14 H38 V30 H20 Z" fill="#C4933F" />
                      <circle cx="10" cy="32" r="5" fill="#1A1A2E" stroke="#fff" strokeWidth="1.5" />
                      <circle cx="33" cy="32" r="5" fill="#1A1A2E" stroke="#fff" strokeWidth="1.5" />
                    </g>
                  </svg>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { v: "24–48h", l: t.shipping.express, icon: <Clock className="w-4 h-4" /> },
                      { v: "5,000+", l: t.shipping.freeOver.replace("{amount}", currency), icon: <CheckCircle className="w-4 h-4" /> },
                      { v: "COD", l: t.shipping.codTitle, icon: <CreditCard className="w-4 h-4" /> },
                    ].map((s, i) => (
                      <div key={i} className="text-center rounded-xl bg-[#C4933F]/10 border border-[#C4933F]/20 py-3 px-2">
                        <div className="flex justify-center text-[#DFB96A] mb-1">{s.icon}</div>
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
          HOW IT WORKS — 4 STEPS
      ═══════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E]">{t.shipping.stepsTitle}</h2>
              <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-[#C4933F] to-[#DFB96A]" />
              <p className="text-[#7A6F61] mt-3 max-w-lg mx-auto">{t.shipping.stepsSubtitle}</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => {
              const Icon = STEP_ICONS[i] || Truck;
              return (
                <AnimatedSection key={i} delay={i * 80}>
                  <div className="relative h-full rounded-2xl bg-[#FBF8F3] border border-[#ECDCAE] p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    {/* Step number */}
                    <span className="absolute -top-3.5 -start-3.5 w-9 h-9 rounded-full bg-gradient-to-br from-[#C4933F] to-[#A87A2E] text-white text-sm font-bold flex items-center justify-center shadow-md shadow-[#C4933F]/30">
                      {i + 1}
                    </span>
                    {/* Icon */}
                    <div className="w-13 h-13 w-12 h-12 rounded-xl bg-gradient-to-br from-[#C4933F] to-[#DFB96A] flex items-center justify-center text-white mb-4 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#1A1A2E] mb-2">{s.title}</h3>
                    <p className="text-sm text-[#7A6F61] leading-relaxed">{s.desc}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          DELIVERY ZONES CARDS
      ═══════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-[#F8F7F4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E]">{t.shipping.pricingTitle}</h2>
              <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-[#C4933F] to-[#DFB96A]" />
              <p className="text-[#7A6F61] mt-3">{t.shipping.pricingSubtitle}</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regions.map((r, i) => {
              const featured = i === 0;
              return (
                <AnimatedSection key={i} delay={i * 90}>
                  <div
                    className={`relative h-full rounded-3xl p-7 border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                      featured
                        ? "bg-gradient-to-b from-[#1A1A2E] to-[#2D2B45] border-[#C4933F]/40 shadow-2xl shadow-[#C4933F]/10"
                        : "bg-white border-[#ECDCAE]"
                    }`}
                  >
                    {featured && (
                      <span className="absolute -top-3.5 start-6 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#C4933F] to-[#A87A2E] text-white shadow-sm">
                        {t.shipping.express}
                      </span>
                    )}

                    <div className="flex items-center justify-between mb-5">
                      <h3 className={`text-lg font-bold ${featured ? "text-white" : "text-[#1A1A2E]"}`}>
                        {regionLabels[i] || r.region}
                      </h3>
                      <MapPin className={`w-5 h-5 ${featured ? "text-[#DFB96A]" : "text-[#C4933F]"}`} />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${featured ? "text-white/60" : "text-[#7A6F61]"}`}>{t.shipping.deliveryTableHeaders.eta}</span>
                        <span className={`font-bold text-sm ${featured ? "text-white" : "text-[#1A1A2E]"}`}>{r.eta}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${featured ? "text-white/60" : "text-[#7A6F61]"}`}>{t.shipping.deliveryTableHeaders.fee}</span>
                        <span className={`font-bold text-sm ${featured ? "text-white" : "text-[#1A1A2E]"}`}>{r.fee}</span>
                      </div>
                      <div className={`pt-3 border-t ${featured ? "border-white/10" : "border-[#ECDCAE]"}`}>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#C4933F]">
                          <CheckCircle className="w-4 h-4" />
                          {t.shipping.freeOver.replace("{amount}", freeAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          COD + RETURNS
      ═══════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedSection>
              <div className="h-full rounded-2xl bg-[#FBF8F3] border border-[#ECDCAE] p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C4933F] to-[#DFB96A] flex items-center justify-center text-white mb-5 shadow-md shadow-[#C4933F]/20">
                  <CreditCard className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">{t.shipping.codTitle}</h3>
                <p className="text-[#7A6F61] leading-relaxed">{t.shipping.codDesc}</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <div className="h-full rounded-2xl bg-[#FBF8F3] border border-[#ECDCAE] p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C4933F] to-[#DFB96A] flex items-center justify-center text-white mb-5 shadow-md shadow-[#C4933F]/20">
                  <RotateCcw className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">{t.shipping.returnsTitle}</h3>
                <p className="text-[#7A6F61] leading-relaxed">{t.shipping.returnsDesc}</p>
              </div>
            </AnimatedSection>
          </div>

          {/* Trust badge */}
          <AnimatedSection>
            <div className="flex items-center gap-3 justify-center text-sm text-[#9E9282] mt-8">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              {t.shipping.subtitle}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════
          CTA BANNER
      ═══════════════════════════════ */}
      <section className="py-16 lg:py-20 bg-[#F8F7F4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1A2E] via-[#2D2B45] to-[#1A1A2E] p-10 lg:p-14 text-center">
              {/* Glow effects */}
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#C4933F] rounded-full opacity-5 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#DFB96A] rounded-full opacity-5 blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-[#C4933F]/20 border border-[#C4933F]/30 text-[#DFB96A] rounded-full px-4 py-1.5 text-sm font-medium mb-5">
                  <Truck className="w-4 h-4" />
                  {t.shipping.express}
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">{t.shipping.ctaTitle}</h2>
                <p className="text-white/70 max-w-md mx-auto mb-7">{t.shipping.ctaDesc}</p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C4933F] to-[#A87A2E] text-white px-8 py-3.5 rounded-full font-bold hover:opacity-90 transition-all shadow-lg shadow-[#C4933F]/30 hover:-translate-y-0.5"
                >
                  {t.shipping.ctaButton}
                  <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
