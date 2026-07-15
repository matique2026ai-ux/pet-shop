"use client";

import { useI18n } from "@/lib/i18n-context";
import AnimatedSection from "@/components/animated-section";
import Link from "next/link";
import {
  Truck, Phone, Package, MapPin, Sparkles, CreditCard, RotateCcw,
  ShieldCheck, ArrowRight, Zap, CheckCircle,
} from "lucide-react";

const STEP_ICONS = [Truck, Phone, Package, MapPin];

export default function ShippingPage() {
  const { t, lang } = useI18n();
  const currency = lang === "ar" ? "د.ج" : "DZD";
  const freeAmount = `5,000 ${currency}`;

  const steps = t.shipping.steps as unknown as { title: string; desc: string }[];
  const regions = t.shipping.deliveryTable as unknown as { region: string; eta: string; fee: string; free: string }[];
  const regionLabels = [t.shipping.express, t.shipping.north, t.shipping.south];

  return (
    <div className="bg-[#0B1220]">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_80%_-10%,#0B1E36_0%,#0F1B3D_45%,#0B1220_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20 mb-5">
                <Sparkles className="w-4 h-4" /> {t.shipping.heroBadge}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5">
                {t.shipping.title}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-md leading-relaxed mb-8">
                {t.shipping.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/products"
                  className="cta-btn inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm"
                >
                  {t.shipping.ctaButton}
                  <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
                </Link>
                <span className="inline-flex items-center gap-2 text-sm text-slate-400">
                  <Zap className="w-4 h-4 text-[#E5B25A]" /> {t.shipping.express} · 24–48h
                </span>
              </div>
            </AnimatedSection>

            {/* Animated delivery route */}
            <AnimatedSection>
              <div className="relative ship-scale-in mx-auto max-w-md">
                <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-8 overflow-hidden">
                  <div className="absolute -top-10 -end-10 w-40 h-40 rounded-full bg-[#0B1E36]/40 blur-3xl" />
                    <svg viewBox="0 0 400 160" className="w-full h-40">
                    <path
                      d="M40 120 C 120 40, 280 40, 360 120"
                      fill="none"
                      stroke="#F97316"
                      strokeOpacity="0.35"
                      strokeWidth="3"
                      className="ship-dash"
                    />
                    <circle cx="40" cy="120" r="9" fill="#0B1E36" stroke="#fff" strokeWidth="2" className="ship-pin" />
                    <circle cx="360" cy="120" r="9" fill="#F97316" stroke="#fff" strokeWidth="2" className="ship-pin-2" />
                    <g className="ship-truck">
                      <circle cx="14" cy="34" r="5" fill="#0B1220" stroke="#fff" strokeWidth="1.5" />
                      <circle cx="34" cy="34" r="5" fill="#0B1220" stroke="#fff" strokeWidth="1.5" />
                      <rect x="2" y="14" width="44" height="20" rx="3" fill="#ffffff" />
                      <rect x="8" y="18" width="14" height="12" rx="2" fill="#0B1E36" />
                      <path d="M22 18 H40 V30 H22 Z" fill="#F97316" />
                    </g>
                  </svg>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {[
                      { v: "24–48h", l: t.shipping.express },
                      { v: "5,000+", l: t.shipping.freeOver.replace("{amount}", currency) },
                      { v: "48h", l: t.shipping.codTitle },
                    ].map((s, i) => (
                      <div key={i} className="text-center rounded-xl bg-white/[0.05] border border-white/10 py-3">
                        <div className="text-lg font-bold text-white">{s.v}</div>
                        <div className="text-[11px] text-slate-400 leading-tight px-1">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== STEPS ===== */}
      <section className="py-16 lg:py-24 bg-[#0B1220]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">{t.shipping.stepsTitle}</h2>
              <p className="text-slate-400">{t.shipping.stepsSubtitle}</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => {
              const Icon = STEP_ICONS[i] || Truck;
              return (
                <AnimatedSection key={i} delay={i * 80}>
                  <div className="relative h-full rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 p-6 hover:border-[#F97316]/40 transition-colors duration-300">
                    <span className="absolute -top-3 -start-3 w-9 h-9 rounded-full bg-[#F97316] text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-[#F97316]/30">
                      {i + 1}
                    </span>
                    <span className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 bg-gradient-to-br from-[#0B1E36] to-[#F97316]">
                      <Icon className="w-6 h-6" />
                    </span>
                    <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PRICING CARDS ===== */}
      <section className="py-16 lg:py-24 bg-[#0B1220]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">{t.shipping.pricingTitle}</h2>
              <p className="text-slate-400">{t.shipping.pricingSubtitle}</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regions.map((r, i) => {
              const featured = i === 0;
              return (
                <AnimatedSection key={i} delay={i * 90}>
                  <div
                    className={`relative h-full rounded-3xl p-7 border transition-transform duration-300 hover:-translate-y-1.5 ${
                      featured
                        ? "bg-gradient-to-b from-[#0B1E36] to-[#15275c] border-[#F97316]/40 shadow-2xl shadow-[#0B1E36]/30"
                        : "bg-white/[0.04] border-white/10"
                    }`}
                  >
                    {featured && (
                      <span className="absolute -top-3 start-6 px-3 py-1 rounded-full text-xs font-bold bg-[#F97316] text-white">
                        {t.shipping.express}
                      </span>
                    )}
                    <div className="flex items-center justify-between mb-5">
                      <h3 className={`text-lg font-bold ${featured ? "text-white" : "text-white"}`}>
                        {regionLabels[i] || r.region}
                      </h3>
                      <MapPin className={`w-5 h-5 ${featured ? "text-[#F97316]" : "text-[#E5B25A]"}`} />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">{t.shipping.deliveryTableHeaders.eta}</span>
                        <span className={`font-semibold ${featured ? "text-white" : "text-slate-200"}`}>{r.eta}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">{t.shipping.deliveryTableHeaders.fee}</span>
                        <span className={`font-semibold ${featured ? "text-white" : "text-slate-200"}`}>{r.fee}</span>
                      </div>
                      <div className="pt-3 border-t border-white/10">
                        <span
                          className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                            featured ? "text-[#E5B25A]" : "text-[#E5B25A]"
                          }`}
                        >
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

      {/* ===== COD + RETURNS ===== */}
      <section className="py-16 lg:py-24 bg-[#0B1220]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedSection>
            <div className="h-full rounded-3xl bg-white/[0.04] border border-white/10 p-8 ship-float">
              <span className="w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br from-[#0B1E36] to-[#F97316] mb-5">
                <CreditCard className="w-7 h-7" />
              </span>
              <h3 className="text-xl font-bold text-white mb-3">{t.shipping.codTitle}</h3>
              <p className="text-slate-400 leading-relaxed">{t.shipping.codDesc}</p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <div className="h-full rounded-3xl bg-white/[0.04] border border-white/10 p-8 ship-float" style={{ animationDelay: "1.2s" }}>
              <span className="w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br from-[#0B1E36] to-[#F97316] mb-5">
                <RotateCcw className="w-7 h-7" />
              </span>
              <h3 className="text-xl font-bold text-white mb-3">{t.shipping.returnsTitle}</h3>
              <p className="text-slate-400 leading-relaxed">{t.shipping.returnsDesc}</p>
            </div>
          </AnimatedSection>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <AnimatedSection>
            <div className="flex items-center gap-3 justify-center text-sm text-slate-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              {t.shipping.subtitle}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="pb-28 lg:pb-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B1E36] to-[#F97316] p-10 lg:p-14 text-center">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(60%_120%_at_50%_0%,#fff_0%,transparent_70%)]" />
              <h2 className="relative text-2xl lg:text-3xl font-bold text-white mb-3">{t.shipping.ctaTitle}</h2>
              <p className="relative text-white/80 max-w-md mx-auto mb-7">{t.shipping.ctaDesc}</p>
              <Link
                href="/products"
                className="relative inline-flex items-center gap-2 bg-white text-[#0B1E36] px-7 py-3.5 rounded-xl font-semibold hover:bg-white/90 transition-colors"
              >
                {t.shipping.ctaButton}
                <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== STICKY CTA ===== */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0B1220]/95 backdrop-blur border-t border-white/10 lg:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="text-sm">
            <div className="text-white font-semibold">{t.shipping.express}</div>
            <div className="text-slate-400 text-xs">{t.shipping.freeOver.replace("{amount}", freeAmount)}</div>
          </div>
          <Link href="/products" className="cta-btn px-5 py-2.5 rounded-xl font-semibold text-sm">
            {t.shipping.ctaButton}
          </Link>
        </div>
      </div>
    </div>
  );
}
