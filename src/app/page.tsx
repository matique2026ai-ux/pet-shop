"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { useTranslatedData } from "@/lib/use-translated-data";
import { useRecentlyViewed } from "@/lib/use-recently-viewed";
import { useSiteSettings } from "@/lib/site-settings";
import AnimatedSection, { StaggerSection, FadeIn } from "@/components/animated-section";
import { motion } from "framer-motion";
import ProductCard from "@/components/product-card";
import VetCard from "@/components/vet-card";
import { SHIMMER_BLUR } from "@/lib/blur";
import { ArrowRight, Star, Truck, Shield, RefreshCw, Stethoscope, ChevronLeft, ChevronRight, Heart, Sparkles, Award } from "lucide-react";



const benefitIconComponents = [
  <Truck    className="w-6 h-6" key="truck" />,
  <Shield   className="w-6 h-6" key="shield" />,
  <Heart    className="w-6 h-6" key="heart" />,
];

const benefitColors = [
  { icon: "from-[#C4933F] to-[#DFB96A]", bg: "bg-[#FBF8F3]", border: "border-[#ECDCAE]" },
  { icon: "from-[#A87A2E] to-[#C4933F]", bg: "bg-[#F7EFE0]", border: "border-[#DFB96A]" },
  { icon: "from-[#C4933F] to-[#8A6022]", bg: "bg-[#FBF8F3]", border: "border-[#ECDCAE]" },
];

const DEFAULT_HERO_VIDEOS = [
  "https://cdn.pixabay.com/video/2021/05/12/73981-549736333_large.mp4",
  "https://cdn.pixabay.com/video/2023/05/05/161726-824133858_large.mp4",
  "https://cdn.pixabay.com/video/2022/12/03/141480-777708175_large.mp4",
];

export default function HomePage() {
  const { t, dir } = useI18n();
  const { content } = useSiteSettings();
  const { categories, products, vetServices, testimonials } = useTranslatedData();
  const c = (k: string, fb: string) => (content && content[k] ? content[k] : fb);
  const heroTitle    = c("heroTitle",    t.hero.title);
  const heroSubtitle = c("heroSubtitle", t.hero.subtitle);
  const heroCta1     = c("heroCta1",    t.hero.cta1);
  const heroCta2     = c("heroCta2",    t.hero.cta2);
  const isRtl        = dir === "rtl";
  const Arrow        = isRtl ? ChevronLeft : ChevronRight;
  const bestsellers  = products.filter((p) => p.rating >= 4.6).slice(0, 8);
  const { ids: recentIds } = useRecentlyViewed();
  const recentProducts = products.filter((p) => recentIds.includes(p.id)).slice(0, 4);
  const [videoIdx, setVideoIdx]     = useState(0);
  const [heroVideos, setHeroVideos] = useState<string[]>(DEFAULT_HERO_VIDEOS);
  const videoRef = useRef<HTMLVideoElement>(null);

  const customBg = content?.heroBackground;
  const isCustomVideo = customBg ? /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(customBg) : false;

  useEffect(() => {
    fetch("/api/hero-videos")
      .then((r) => r.json())
      .then((d) => { if (d.videos && d.videos.length > 0) setHeroVideos(d.videos); })
      .catch(() => {});
  }, []);

  const handleVideoEnd = () => setVideoIdx((videoIdx + 1) % heroVideos.length);

  useEffect(() => { videoRef.current?.load(); }, [videoIdx]);

  return (
    <>
      {/* ══════════════════════════════════
          HERO SECTION
      ══════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[560px] flex items-center">
        {customBg ? (
          isCustomVideo ? (
            <video
              autoPlay muted loop playsInline preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={customBg} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={customBg}
              alt={heroTitle}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )
        ) : (
          <video
            ref={videoRef}
            key={heroVideos[videoIdx]}
            autoPlay muted playsInline preload="metadata"
            onEnded={handleVideoEnd}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={heroVideos[videoIdx]} type="video/mp4" />
          </video>
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        {/* Gold shimmer overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#C4933F]/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 w-full">
          <StaggerSection className="text-center max-w-3xl mx-auto glass-panel-dark rounded-3xl p-8 lg:p-12 shadow-2xl">
            {/* Premium badge */}
            <FadeIn>
              <div className="inline-flex items-center gap-2 bg-[#C4933F]/20 backdrop-blur-sm border border-[#C4933F]/40 text-[#DFB96A] rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                {dir === "rtl" ? "متجر الحيوانات الأليفة الأول في سطيف" : "Premier Pet Shop in Sétif"}
              </div>
            </FadeIn>

            <FadeIn>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5 animate-shimmer drop-shadow-lg">
                {heroTitle}
              </h1>
            </FadeIn>
            
            <FadeIn>
              <p className="text-lg text-white/85 font-medium mb-8 max-w-xl mx-auto drop-shadow">
                {heroSubtitle}
              </p>
            </FadeIn>
            
            <FadeIn>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F5851F] to-[#E06A0A] text-white px-8 py-3.5 rounded-full font-bold text-base hover:opacity-90 transition-all shadow-lg shadow-[#F5851F]/40 hover:-translate-y-0.5"
                >
                  {heroCta1}
                  <Arrow className="w-5 h-5" />
                </Link>
                <Link
                  href="/vet"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-full font-bold text-base hover:bg-white/20 transition-all border-2 border-white/30"
                >
                  <Stethoscope className="w-5 h-5" />
                  {heroCta2}
                </Link>
              </div>
            </FadeIn>

            {/* Trust badges */}
            <FadeIn>
              <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
                {[
                  { icon: <Truck className="w-4 h-4" />, label: dir === "rtl" ? "توصيل سريع" : "Fast Delivery" },
                  { icon: <Award className="w-4 h-4" />, label: dir === "rtl" ? "جودة مضمونة" : "Quality Guaranteed" },
                  { icon: <Shield className="w-4 h-4" />, label: dir === "rtl" ? "دفع آمن" : "Secure Payment" },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-white/75 text-xs font-medium">
                    <span className="text-[#DFB96A]">{b.icon}</span>
                    {b.label}
                  </div>
                ))}
              </div>
            </FadeIn>
          </StaggerSection>
        </div>
      </section>

      {/* ══════════════════════════════════
          TAGLINE BAR
      ══════════════════════════════════ */}
      <section className="py-8 bg-white border-b border-[#F0EDE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center">
              <p className="text-lg font-semibold text-[#C4933F]">{t.home.tagline}</p>
              <p className="text-[#9E9282] text-sm mt-1">{t.home.taglineSub}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════
          CATEGORIES GRID
      ══════════════════════════════════ */}
      <section className="py-12 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#1A1A2E]">{t.nav.categories}</h2>
              <div className="mt-2 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-[#C4933F] to-[#DFB96A]" />
            </div>
          </AnimatedSection>
          {/* Scroll row sits OUTSIDE AnimatedSection to avoid Framer Motion intercepting touch events */}
          <div
            className="flex overflow-x-auto lg:grid lg:grid-cols-5 gap-4 pb-4 px-1 scrollbar-none"
            style={{ touchAction: "pan-x", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products/${cat.id}`}
                className="group relative block rounded-2xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-xl transition-all shrink-0 w-[145px] sm:w-[180px] lg:w-auto"
              >
                {cat.video_url ? (
                  <video
                    src={cat.video_url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    placeholder="blur"
                    blurDataURL={SHIMMER_BLUR}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  // Premium brand fallback gradient with official logo badge centered
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0B1E36] to-[#050D1A] flex flex-col items-center justify-center p-4">
                    <div className="relative w-16 h-16 opacity-35 group-hover:opacity-60 transition-opacity duration-300">
                      <Image
                        src="/logo-badge.png"
                        alt="Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-[#C4933F]/80 transition-all duration-400" />
                <div className="absolute bottom-0 inset-x-0 p-4 text-center">
                  <span className="text-white font-bold text-sm lg:text-base leading-tight block drop-shadow-lg">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          BESTSELLERS
      ══════════════════════════════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 mb-8 flex-wrap">
            <AnimatedSection>
              <h2 className="text-2xl font-bold text-[#1A1A2E]">{t.home.bestsellers}</h2>
              <div className="mt-1.5 w-14 h-1 rounded-full bg-gradient-to-r from-[#C4933F] to-[#DFB96A]" />
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <Link
                href="/products"
                className="flex items-center gap-1 text-[#C4933F] font-semibold text-sm hover:text-[#A87A2E] shrink-0 transition-colors"
              >
                {t.home.viewAll} <Arrow className="w-4 h-4" />
              </Link>
            </AnimatedSection>
          </div>
          <StaggerSection className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-7">
            {bestsellers.map((p) => (
              <FadeIn key={p.id}>
                <ProductCard product={p} />
              </FadeIn>
            ))}
          </StaggerSection>
        </div>
      </section>

      {/* ══════════════════════════════════
          RECENTLY VIEWED
      ══════════════════════════════════ */}
      {recentProducts.length > 0 && (
        <section className="py-12 bg-[#F8F7F4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A2E]">{t.products.recentlyViewed}</h2>
                <div className="mt-1.5 w-14 h-1 rounded-full bg-gradient-to-r from-[#C4933F] to-[#DFB96A]" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-7">
              {recentProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════
          BENEFITS
      ══════════════════════════════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-[#1A1A2E]">{t.home.benefitsTitle}</h2>
              <div className="mt-2 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-[#C4933F] to-[#DFB96A]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.home.benefits.map((b: { title: string; text: string }, i: number) => (
                <div key={i} className={`${benefitColors[i].bg} rounded-2xl p-7 text-center border ${benefitColors[i].border} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
                  <div className={`w-14 h-14 bg-gradient-to-br ${benefitColors[i].icon} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-md`}>
                    {benefitIconComponents[i]}
                  </div>
                  <h3 className="font-bold text-[#1A1A2E] mb-2 text-lg">{b.title}</h3>
                  <p className="text-sm text-[#7A6F61] leading-relaxed">{b.text}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════
          VET SERVICES
      ══════════════════════════════════ */}
      <section className="py-14 bg-[#F8F7F4] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #C4933F 1px, transparent 1px), radial-gradient(circle at 80% 50%, #C4933F 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-sm text-[#C4933F] border border-[#ECD8A6] shadow-sm mb-3">
                <Stethoscope className="w-4 h-4" /> {t.vet.subtitle}
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A2E]">{t.vet.servicesTitle}</h2>
              <div className="mt-3 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-[#C4933F] to-[#DFB96A]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {vetServices.slice(0, 4).map((s) => (
                <VetCard key={s.id} service={s} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/vet"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C4933F] to-[#A87A2E] text-white px-8 py-3.5 rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#C4933F]/30 hover:-translate-y-0.5"
              >
                {t.vet.bookNow}
                <Arrow className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">{t.vet.testimonialsTitle}</h2>
              <div className="mt-1.5 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-[#C4933F] to-[#DFB96A]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {testimonials.map((rev) => (
                <div key={rev.id} className="bg-[#FBF7EE] rounded-2xl p-6 border border-[#ECD8A6] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#5C5348] mb-4 leading-relaxed">&ldquo;{rev.text}&rdquo;</p>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#DFB96A] to-[#C4933F] rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm">
                      {rev.initials}
                    </div>
                    <span className="text-sm font-semibold text-[#1A1A2E]">{rev.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════
          CTA SECTION
      ══════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-br from-[#1A1A2E] via-[#2D2B45] to-[#1A1A2E] text-center relative overflow-hidden">
        {/* Gold glow accents */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#C4933F] rounded-full opacity-5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#F5851F] rounded-full opacity-5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 bg-[#C4933F]/15 border border-[#C4933F]/30 text-[#DFB96A] rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {dir === "rtl" ? "عروض حصرية" : "Exclusive Offers"}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">{t.home.ctaTitle}</h2>
            <p className="text-[#C8BFA8] mb-8 max-w-lg mx-auto">{t.home.ctaText}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F5851F] to-[#E06A0A] text-white px-7 py-3.5 rounded-full font-bold hover:opacity-90 transition-all shadow-lg shadow-[#F5851F]/30 hover:-translate-y-0.5"
              >
                {heroCta1}
                <Arrow className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-7 py-3.5 rounded-full font-bold hover:bg-white/15 transition-all border border-white/20"
              >
                {t.nav.contact}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
