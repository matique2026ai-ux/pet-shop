"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { useTranslatedData } from "@/lib/use-translated-data";
import AnimatedSection from "@/components/animated-section";
import { ArrowRight, Star, Phone, Stethoscope, Sparkles, Clock, ChevronRight } from "lucide-react";

const serviceImages: Record<string, string> = {
  "vet-1": "https://picsum.photos/seed/vet-checkup/600/700",
  "vet-2": "https://picsum.photos/seed/vet-vaccination/600/700",
  "vet-3": "https://picsum.photos/seed/vet-dental/600/700",
  "vet-4": "https://picsum.photos/seed/vet-surgery/600/700",
  "vet-5": "https://picsum.photos/seed/vet-microchip/600/700",
  "vet-6": "https://picsum.photos/seed/vet-labs/600/700",
  "vet-7": "https://picsum.photos/seed/vet-grooming/600/700",
  "vet-8": "https://picsum.photos/seed/vet-nutrition/600/700",
};

export default function VetPage() {
  const { t, currency } = useI18n();
  const { vetServices, team, testimonials } = useTranslatedData();

  return (
    <div>
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">
        <Image
          src="https://picsum.photos/seed/vet-hero/1400/900"
          alt={t.vet.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1512]/85 via-[#3a220a]/60 to-[#1a1512]/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatedSection>
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-full text-sm text-emerald-200 border border-white/10 mb-5">
                <Sparkles className="w-4 h-4" /> {t.vet.heroBadge}
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight">{t.vet.title}</h1>
              <p className="text-emerald-100/70 text-lg mb-8 max-w-md leading-relaxed">{t.vet.subtitle}</p>
              <div className="flex items-center gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-[#3a220a] px-7 py-3.5 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-xl hover:-translate-y-0.5">
                  <Phone className="w-4 h-4" />
                  {t.vet.bookNow}
                </Link>
                <Link href="#services" className="inline-flex items-center gap-2 text-white px-6 py-3.5 rounded-2xl font-medium border border-white/20 hover:bg-white/10 transition-all hover:-translate-y-0.5">
                  {t.vet.viewServices}
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative z-10 -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 border border-white/40"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
            >
              {[
                { label: t.vet.stats.happyPets, value: "2,500+" },
                { label: t.vet.stats.yearsExperience, value: "12+" },
                { label: t.vet.stats.services, value: "8+" },
                { label: t.vet.stats.satisfaction, value: "98%" },
              ].map((s) => (
                <div key={s.label as string} className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{s.value}</div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section id="services" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#fef8e7] rounded-full text-sm text-[#b87a30] border border-[#fdf0c8] mb-3">
                <Stethoscope className="w-4 h-4" /> {t.vet.servicesTitle}
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{t.vet.servicesTitle}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {vetServices.map((s) => (
                <div key={s.id} className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1.5 bg-white"
                  style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={serviceImages[s.id] || serviceImages["vet-1"]}
                      alt={s.title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white border border-white/20">
                        {s.duration}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{s.title}</h3>
                      <span className="text-lg font-bold text-[#b87a30]">{currency}{s.price}</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{s.description}</p>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {s.duration}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-[#b87a30] group-hover:gap-2 transition-all">
                        {t.vet.bookNow} <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 lg:py-20" style={{ background: "#F8F6F3" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-sm text-[#b87a30] border border-[#fdf0c8] mb-3">{t.vet.teamBadge}</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{t.vet.teamTitle}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {team.map((m) => (
                <div key={m.id} className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
                  style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={m.id === "team-1" ? "https://picsum.photos/seed/vet-team1/400/500" : m.id === "team-2" ? "https://picsum.photos/seed/vet-team2/400/500" : "https://picsum.photos/seed/vet-team3/400/500"}
                      alt={m.name}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg">{m.name}</h3>
                      <p className="text-emerald-200 text-sm">{m.role}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-500 leading-relaxed">{m.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#fef8e7] rounded-full text-sm text-[#b87a30] border border-[#fdf0c8] mb-3">{t.vet.testimonialsBadge}</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{t.vet.testimonialsTitle}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {testimonials.slice(0, 3).map((rev) => (
                <div key={rev.id} className="bg-white rounded-3xl p-7 transition-all duration-500 hover:-translate-y-1.5"
                  style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}
                >
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-5 leading-relaxed">&ldquo;{rev.text}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#fdf0c8] to-[#fef8e7] rounded-full flex items-center justify-center text-xs font-bold text-[#b87a30]">{rev.initials}</div>
                    <span className="text-sm font-semibold text-gray-900">{rev.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 lg:py-20 min-h-[50vh] flex items-center">
        <Image
          src="https://picsum.photos/seed/vet-cta/1400/600"
          alt={t.vet.subtitle}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1512]/90 via-[#3a220a]/70 to-[#1a1512]/80" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative w-full">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-full text-sm text-emerald-200 border border-white/10 mb-4">
              <Sparkles className="w-4 h-4" /> {t.vet.ctaBadge}
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">{t.vet.ctaTitle}</h2>
            <p className="text-emerald-100/60 mb-8 max-w-md mx-auto text-lg">
              {t.vet.ctaText}
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-[#3a220a] px-8 py-3.5 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-xl hover:-translate-y-0.5">
              {t.vet.bookNow}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
