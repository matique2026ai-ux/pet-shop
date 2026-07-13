"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import AnimatedSection from "@/components/animated-section";
import { Heart, Shield, Users, Award, Leaf, Smile, Sparkles, ChevronRight, PawPrint, Phone, MapPin, Clock } from "lucide-react";

const valueIcons = [
  <Heart className="w-6 h-6" />,
  <Shield className="w-6 h-6" />,
  <Users className="w-6 h-6" />,
  <Award className="w-6 h-6" />,
  <Leaf className="w-6 h-6" />,
  <Smile className="w-6 h-6" />,
];

const statValues = [
  { value: "2,500+" },
  { value: "12+" },
  { value: "10,000+" },
  { value: "98%" },
];

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div>
      <section className="relative overflow-hidden py-16 lg:py-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1400&h=800&fit=crop"
            alt={t.about.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2E241A]/90 via-[#4A3A2A]/70 to-[#2E241A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2E241A] via-transparent to-transparent opacity-60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-full text-sm text-emerald-200 border border-white/10 mb-5">
              <Sparkles className="w-4 h-4" /> {t.about.since}
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight">{t.about.title}</h1>
            <p className="text-emerald-100/70 text-xl max-w-lg leading-relaxed">{t.about.subtitle}</p>
            <div className="flex items-center gap-3 mt-8">
              <Link href="/products" className="inline-flex items-center gap-2 bg-white text-[#4A3A2A] px-7 py-3 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-xl hover:-translate-y-0.5">
                {t.hero.cta1}
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-2xl font-medium border border-white/20 hover:bg-white/10 transition-all">
                {t.nav.contact}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative z-10 -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-white rounded-3xl px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-8"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}
            >
              {statValues.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {[t.about.stats.happyPets, t.about.stats.experience, t.about.stats.products, t.about.stats.satisfaction][i]}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection>
              <div className="relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=450&fit=crop"
                    alt={t.about.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl px-6 py-4 shadow-xl border border-gray-100 hidden lg:block">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 bg-[#EDE6DB] rounded-xl flex items-center justify-center text-[#8B7560]">
                      <PawPrint className="w-6 h-6" />
                    </span>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">2,500+</div>
                      <div className="text-xs text-gray-500">{t.about.stats.happyPets}</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F7F3ED] rounded-full text-sm text-[#8B7560] font-medium mb-4">
                <Sparkles className="w-4 h-4" /> {t.about.story}
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-5 leading-tight">{t.about.storyTitle}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{t.about.storyText}</p>
              <div className="mt-6 flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-[#8B7560]" />
                  <span>{t.about.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4 text-[#8B7560]" />
                  <span>{t.about.hours}</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 relative overflow-hidden"
        style={{ background: "#F8F6F3" }}
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-200/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-sm text-[#8B7560] border border-emerald-200/50 shadow-sm mb-3">
                <Heart className="w-4 h-4" /> {t.about.purpose}
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.about.mission}</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{t.about.missionText}</p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">{t.about.values}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {t.about.valueItems.map((v: { title: string; text: string }, i: number) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1"
                  style={{ background: i % 2 === 0 ? "#FFFFFF" : "#F7F3ED" }}
                >
                  <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"
                    style={{ background: i % 2 === 0 ? "#EDE6DB" : "#E0D5C4" }}
                  />
                  <div className="relative flex items-start gap-4">
                    <span className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-[#8B7560] text-lg font-bold"
                      style={{ background: i % 2 === 0 ? "#F7F3ED" : "#FFFFFF" }}
                    >
                      {valueIcons[i]}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 mb-0.5">{v.title}</h3>
                      <p className="text-sm text-gray-500 leading-snug">{v.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 lg:py-20"
        style={{ background: "linear-gradient(135deg, #2E241A 0%, #4A3A2A 50%, #2E241A 100%)" }}
      >
        <div className="absolute top-10 right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-emerald-400/8 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-full text-sm text-emerald-200 border border-white/10 mb-4">
              <Phone className="w-4 h-4" /> {t.about.cta}
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">{t.about.cta}</h2>
            <p className="text-emerald-100/60 mb-8 max-w-md mx-auto text-lg">{t.about.ctaSub}</p>
            <div className="flex items-center justify-center gap-4">
              <a href="tel:+1234567890" className="inline-flex items-center gap-2 bg-white text-[#4A3A2A] px-8 py-3.5 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-xl hover:-translate-y-0.5">
                <Phone className="w-4 h-4" />
                {t.nav.callNow}
              </a>
              <Link href="/categories" className="inline-flex items-center gap-2 text-white px-6 py-3.5 rounded-2xl font-medium border border-white/20 hover:bg-white/10 transition-all">
                {t.nav.categories}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
