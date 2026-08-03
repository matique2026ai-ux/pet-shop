"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { useTranslatedData } from "@/lib/use-translated-data";
import { useRecentlyViewed } from "@/lib/use-recently-viewed";
import { useSiteSettings } from "@/lib/site-settings";
import AnimatedSection, { StaggerSection, FadeIn } from "@/components/animated-section";
import PetNutritionCalculator from "@/components/pet-nutrition-calculator";

import ProductCard, { ProductCardSkeleton } from "@/components/product-card";
import BlogCard from "@/components/blog-card";
import { Star, Truck, Shield, BookOpen, ChevronLeft, ChevronRight, Heart, Sparkles, Award, PawPrint, CheckCircle, MapPin, MessageCircle } from "lucide-react";
import { formatWhatsAppNumber } from "@/lib/phone-utils";



const benefitIconComponents = [
  <Truck    className="w-6 h-6" key="truck" />,
  <Shield   className="w-6 h-6" key="shield" />,
  <Heart    className="w-6 h-6" key="heart" />,
];

const benefitColors = [
  { icon: "from-[#E3602D] to-[#F1C290]", bg: "bg-[#FBF8F3]", border: "border-[#ECDCAE]" },
  { icon: "from-[#A87A2E] to-[#E3602D]", bg: "bg-[#F7EFE0]", border: "border-[#F1C290]" },
  { icon: "from-[#E3602D] to-[#8A6022]", bg: "bg-[#FBF8F3]", border: "border-[#ECDCAE]" },
];

const DEFAULT_HERO_VIDEOS = [
  "https://cdn.pixabay.com/video/2021/05/12/73981-549736333_large.mp4",
  "https://cdn.pixabay.com/video/2023/05/05/161726-824133858_large.mp4",
  "https://cdn.pixabay.com/video/2022/12/03/141480-777708175_large.mp4",
];

export default function HomePage() {
  const { t, dir, lang } = useI18n();
  const { content, store } = useSiteSettings();
  const { categories, products, testimonials, blogPosts, productsLoaded } = useTranslatedData();
  
  const getLocalizedContent = (baseKey: string, fallback: string) => {
    if (lang === "fr" && content && content[`${baseKey}Fr`]) return content[`${baseKey}Fr`];
    if (lang === "en" && content && content[`${baseKey}En`]) return content[`${baseKey}En`];
    return content && content[baseKey] ? content[baseKey] : fallback;
  };

  const heroTitle    = getLocalizedContent("heroTitle",    t.hero.title);
  const heroSubtitle = getLocalizedContent("heroSubtitle", t.hero.subtitle);
  const heroCta1     = getLocalizedContent("heroCta1",    t.hero.cta1);
  const heroCta2     = getLocalizedContent("heroCta2",    t.hero.cta2);
  const isRtl        = dir === "rtl";
  const Arrow        = isRtl ? ChevronLeft : ChevronRight;
  const highRated = products.filter((p) => p.rating >= 4.6);
  const bestsellers = highRated.length > 0 ? highRated.slice(0, 8) : products.slice(0, 8);
  const catCounts: Record<string, number> = {};
  categories.forEach((cat) => {
    catCounts[cat.id] = products.filter((p) => p.category === cat.id).length;
  });
  const { ids: recentIds } = useRecentlyViewed();
  const recentProducts = products.filter((p) => recentIds.includes(p.id)).slice(0, 4);
  const [videoIdx, setVideoIdx]     = useState(0);
  const [heroVideos, setHeroVideos] = useState<string[]>(DEFAULT_HERO_VIDEOS);
  const [isMobile, setIsMobile]     = useState(false);

  const customBg = content?.heroBackground;
  const isCustomVideo = customBg ? /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(customBg) : false;

  useEffect(() => {
    // Detect mobile screens to disable heavy video background
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetch("/api/hero-videos")
      .then((r) => r.json())
      .then((d) => { if (d.videos && d.videos.length > 0) setHeroVideos(d.videos); })
      .catch(() => {});
  }, []);

  const handleVideoEnded = () => {
    if (heroVideos.length > 1) {
      setVideoIdx((prev) => (prev + 1) % heroVideos.length);
    }
  };

  return (
    <>
      {/* ══════════════════════════════════
          HERO SECTION
      ══════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[560px] sm:min-h-[640px] flex items-center justify-center">
        {customBg ? (
          !isMobile && isCustomVideo ? (
            <video
              autoPlay muted loop playsInline preload="metadata"
              className="absolute inset-0 w-full h-full object-cover z-0"
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
              className="object-cover z-0"
            />
          )
        ) : (
          heroVideos.length > 0 ? (
            <video
              key={heroVideos[videoIdx]}
              autoPlay
              muted
              playsInline
              preload="metadata"
              onEnded={handleVideoEnded}
              className="absolute inset-0 w-full h-full object-cover opacity-100 z-0"
            >
              <source src={heroVideos[videoIdx]} type="video/mp4" />
            </video>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#121B15] via-[#1E2D24] to-[#121B15] z-0" />
          )
        )}
        
        {/* Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/85 z-0" />
        
        {/* Ambient Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 to-transparent z-0" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-36 sm:pt-24 sm:pb-36 lg:pt-28 lg:pb-40 w-full flex flex-col items-center text-center">
          <StaggerSection className="text-center max-w-4xl mx-auto flex flex-col items-center w-full">
            {/* Premium badge */}
            <FadeIn>
              <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-lg border border-white/20 text-white rounded-full px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold mb-5 sm:mb-8 shadow-lg">
                <Sparkles className="w-4 h-4 text-[#F1C290] shrink-0" />
                <span>{t.home.heroBadge}</span>
              </div>
            </FadeIn>

            {/* Main Hero Title */}
            <FadeIn>
              <h1 
                className="text-3xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.25] sm:leading-tight mb-4 sm:mb-6 tracking-tight drop-shadow-2xl px-2"
                style={{ textShadow: '0 8px 30px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.7)' }}
              >
                {heroTitle}
              </h1>
            </FadeIn>
            
            {/* Subtitle */}
            <FadeIn>
              <p 
                className="text-sm sm:text-xl text-gray-100 font-normal mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-3"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}
              >
                {heroSubtitle}
              </p>
            </FadeIn>
            
            {/* Action Buttons */}
            <FadeIn>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 w-full max-w-xs sm:max-w-none mx-auto relative z-30 mb-4 sm:mb-0">
                <Link
                  href="/products"
                  className="relative group inline-flex justify-center items-center gap-2.5 bg-gradient-to-r from-[#F5851F] to-[#E06A0A] text-white px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-extrabold text-base sm:text-lg transition-all duration-300 hover:scale-105 shadow-xl shadow-[#F5851F]/30 hover:shadow-[#F5851F]/50 w-full sm:w-auto"
                >
                  <span>{heroCta1}</span>
                  {dir === "rtl" ? (
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
                  )}
                  <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-colors" />
                </Link>
                <a
                  href={`https://wa.me/${formatWhatsAppNumber(store?.whatsapp, "213776075355")}?text=${encodeURIComponent(t.nav.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center gap-2.5 bg-white/10 backdrop-blur-md text-white px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 border border-white/25 hover:bg-white/20 hover:border-white/50 hover:scale-105 w-full sm:w-auto"
                >
                  <MessageCircle className="w-5 h-5 text-[#4ade80] shrink-0" />
                  <span>{heroCta2}</span>
                </a>
              </div>
            </FadeIn>
          </StaggerSection>
        </div>

        {/* Sleek Mobile-Responsive Trust Bar */}
        <div className="absolute bottom-0 inset-x-0 border-t border-white/15 bg-black/60 backdrop-blur-xl z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-4">
            <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center justify-center sm:justify-around gap-1.5 sm:gap-6 text-center">
              {[
                { icon: <Truck className="w-3.5 h-3.5 sm:w-5 sm:h-5" />, label: t.home.trustBarDelivery },
                { icon: <Award className="w-3.5 h-3.5 sm:w-5 sm:h-5" />, label: t.home.trustBarQuality },
                { icon: <Shield className="w-3.5 h-3.5 sm:w-5 sm:h-5" />, label: t.home.trustBarSecure },
              ].map((b, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-white/95 text-[11px] sm:text-base font-medium">
                  <div className="bg-white/15 p-1.5 sm:p-2 rounded-full border border-white/10 shrink-0">
                    <span className="text-[#F1C290]">{b.icon}</span>
                  </div>
                  <span className="line-clamp-1">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          TAGLINE BAR
      ══════════════════════════════════ */}
      <section className="py-8 border-b border-[#F0EDE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center">
              <p className="text-lg font-semibold text-[#E3602D]">{t.home.tagline}</p>
              <p className="text-[#9E9282] text-sm mt-1">{t.home.taglineSub}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════
          CATEGORIES — IMMERSIVE SHOWCASE
      ══════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-[#0B0F0D] via-[#121A15] to-[#0E1611] relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/8 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#F5851F]/6 rounded-full blur-[140px] pointer-events-none" />
        <PawPrint className="absolute top-12 left-[5%] w-20 h-20 rotate-[-18deg] text-white/[0.03] pointer-events-none select-none" />
        <PawPrint className="absolute bottom-10 right-[6%] w-24 h-24 rotate-[22deg] text-[#F1C290]/[0.03] pointer-events-none select-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <AnimatedSection>
            <div className="text-center mb-12 lg:mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.07] backdrop-blur-md border border-white/[0.1] text-[#F1C290] text-xs sm:text-sm font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#F5851F]" />
                {t.categories.subtitle}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {t.nav.categories}
              </h2>
              <div className="mt-4 w-20 h-1 rounded-full bg-gradient-to-r from-[#F5851F] to-[#F1C290] mx-auto" />
            </div>
          </AnimatedSection>

          {/* Main Featured Card + Side Cards Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
            {/* Featured (first) category — large hero card */}
            {categories.length > 0 && (
              <AnimatedSection className="lg:col-span-7">
                <Link href={`/products/${categories[0].id}`} className="group block h-full">
                  <div className="relative rounded-3xl overflow-hidden h-[320px] sm:h-[380px] lg:h-full lg:min-h-[420px]">
                    {categories[0].video_url ? (
                      <video src={categories[0].video_url} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                    ) : categories[0].image_url ? (
                      <Image src={categories[0].image_url} alt={categories[0].name} fill className="object-cover transition-transform duration-[1.2s] group-hover:scale-110" sizes="(max-width: 1024px) 100vw, 58vw" priority />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-[#0E1611]" />
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Content overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                      {/* Count badge */}
                      <div className="absolute top-5 right-5 rtl:right-auto rtl:left-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 text-white text-xs font-bold shadow-lg">
                          {catCounts[categories[0].id] || 0} {t.categories.items}
                        </span>
                      </div>
                      
                      {/* Subcategory pills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {categories[0].subcategories?.slice(0, 4).map((sub) => (
                          <span key={sub.id} className="px-3 py-1 bg-white/10 backdrop-blur-md text-white/90 text-[11px] sm:text-xs font-medium rounded-full border border-white/15 transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/30">
                            {sub.name}
                          </span>
                        ))}
                        {categories[0].subcategories && categories[0].subcategories.length > 4 && (
                          <span className="px-3 py-1 bg-[#F5851F]/20 backdrop-blur-md text-[#F1C290] text-[11px] sm:text-xs font-medium rounded-full border border-[#F5851F]/30">
                            +{categories[0].subcategories.length - 4}
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 leading-tight drop-shadow-lg">
                        {categories[0].name}
                      </h3>
                      <p className="text-sm sm:text-base text-white/70 mb-4 max-w-md line-clamp-2">
                        {categories[0].description}
                      </p>
                      <div className="inline-flex items-center gap-2 text-[#F1C290] font-bold text-sm group-hover:gap-3 transition-all duration-300">
                        {t.categories.browseAll}
                        <Arrow className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            )}

            {/* Right side — stacked smaller cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4 lg:gap-5">
              {categories.slice(1, 5).map((cat, idx) => (
                <AnimatedSection key={cat.id}>
                  <Link href={`/products/${cat.id}`} className="group block h-full">
                    <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden h-[180px] sm:h-[200px]">
                      {cat.video_url ? (
                        <video src={cat.video_url} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : cat.image_url ? (
                        <Image src={cat.image_url} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 1024px) 50vw, 25vw" priority={idx < 2} />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-[#0E1611]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
                      <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/20 transition-colors duration-500" />

                      {/* Count badge */}
                      <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-lg border border-white/15 text-white text-[10px] font-bold">
                          {catCounts[cat.id] || 0}
                        </span>
                      </div>

                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <h3 className="text-base sm:text-lg font-bold text-white leading-tight mb-1 drop-shadow-lg line-clamp-1">
                          {cat.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#F1C290] font-semibold group-hover:gap-2.5 transition-all duration-300">
                          {t.categories.browseAll}
                          <Arrow className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Extra categories row if more than 5 */}
          {categories.length > 5 && (
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
              {categories.slice(5).map((cat) => (
                <AnimatedSection key={cat.id}>
                  <Link href={`/products/${cat.id}`} className="group block">
                    <div className="relative rounded-2xl overflow-hidden h-[160px]">
                      {cat.image_url ? (
                        <Image src={cat.image_url} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 640px) 50vw, 25vw" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-[#0E1611]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <h3 className="text-sm sm:text-base font-bold text-white mb-0.5 drop-shadow-lg line-clamp-1">{cat.name}</h3>
                        <span className="text-[10px] text-[#F1C290] font-medium">{catCounts[cat.id] || 0} {t.categories.items}</span>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <AnimatedSection>
            <div className="text-center mt-10 lg:mt-14">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F5851F] to-[#E06A0A] text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#F5851F]/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#F5851F]/30"
              >
                {t.home.viewAll}
                <Arrow className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════
          BESTSELLERS
      ══════════════════════════════════ */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 mb-8 flex-wrap">
            <AnimatedSection>
              <h2 className="text-2xl font-bold text-[#1A1A2E]">{t.home.bestsellers}</h2>
              <div className="mt-1.5 w-14 h-1 rounded-full bg-gradient-to-r from-[#E3602D] to-[#F1C290]" />
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <Link
                href="/products"
                className="flex items-center gap-1 text-[#E3602D] font-semibold text-sm hover:text-[#A87A2E] shrink-0 transition-colors"
              >
                {t.home.viewAll} <Arrow className="w-4 h-4" />
              </Link>
            </AnimatedSection>
          </div>
          <StaggerSection className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 gap-y-7">
            {!productsLoaded
              ? Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={`sk-${i}`} />
                ))
              : bestsellers.map((p) => (
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
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A2E]">{t.products.recentlyViewed}</h2>
                <div className="mt-1.5 w-14 h-1 rounded-full bg-gradient-to-r from-[#E3602D] to-[#F1C290]" />
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
              <div className="mt-2 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-[#E3602D] to-[#F1C290]" />
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
          PET NUTRITION CALCULATOR
      ══════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <PetNutritionCalculator />
        </AnimatedSection>
      </div>

      {/* ══════════════════════════════════
          BLOG ARTICLES
      ══════════════════════════════════ */}
      <section className="py-14 bg-[#F8F7F4] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #E3602D 1px, transparent 1px), radial-gradient(circle at 80% 50%, #E3602D 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-sm text-[#E3602D] border border-[#ECD8A6] shadow-sm mb-3">
                <BookOpen className="w-4 h-4" /> {t.blog?.subtitle || "Our Blog"}
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A2E]">{t.blog?.latestArticlesTitle || "Latest Articles"}</h2>
              <div className="mt-3 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-[#E3602D] to-[#F1C290]" />
            </div>
            
            {(!blogPosts || blogPosts.length === 0) ? (
              <div className="text-center py-10">
                <p className="text-[#9E9282]">{t.blog?.noArticles || "No articles published yet."}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.slice(0, 3).map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}

            <div className="text-center mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E3602D] to-[#A87A2E] text-white px-8 py-3.5 rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#E3602D]/30 hover:-translate-y-0.5"
              >
                {t.blog?.viewArticles || "View Articles"}
                <Arrow className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════ */}
      {/* ══════════════════════════════════
          TESTIMONIALS (Local Social Proof & Verified Reviews)
      ══════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-b from-white via-[#FBF8F3] to-[#F5F2EB] relative overflow-hidden">
        {/* Background Footprints */}
        <PawPrint className="absolute top-10 right-[10%] w-14 h-14 rotate-[15deg] text-[#E3602D]/4 pointer-events-none select-none" />
        <PawPrint className="absolute bottom-4 left-[8%] w-12 h-12 rotate-[-35deg] text-[#E3602D]/4 pointer-events-none select-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            {/* Header with Trust Score */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#ECD8A6] shadow-sm">
              <div className="text-center md:text-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3602D]/10 text-[#E3602D] text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.vet.verifiedBadge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A2E] leading-tight">
                  {t.vet.testimonialsTitle}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {t.vet.verifiedSubtitle}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                {/* Rating Badge */}
                <div className="flex items-center gap-3 bg-[#FAF5EC] px-4 py-2.5 rounded-2xl border border-[#ECD8A6]">
                  <div className="text-2xl font-black text-[#1A1A2E]">4.9</div>
                  <div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium">
                    {t.vet.ordersCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((rev) => (
                <div 
                  key={rev.id} 
                  className="bg-white rounded-3xl p-6 border border-[#ECD8A6]/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group"
                >
                  <div>
                    {/* Top Row: Stars + Verified Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        {t.vet.verifiedPurchase}
                      </span>
                    </div>

                    {/* Review Quote Text */}
                    <p className="text-xs sm:text-sm text-[#4A4238] mb-5 leading-relaxed font-normal">
                      &ldquo;{rev.text}&rdquo;
                    </p>

                    {rev.productTag && (
                      <div className="mb-4">
                        <span className="inline-block text-[10px] text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                          {rev.productTag}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Customer Info Footer */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#F5851F] to-[#E06A0A] rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md relative">
                        <span>{rev.initials}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1A1A2E] leading-tight">{rev.name}</h4>
                        {rev.city && (
                          <span className="flex items-center gap-0.5 text-[10px] text-gray-400 font-medium mt-0.5">
                            <MapPin className="w-3 h-3 text-[#E3602D]" />
                            {rev.city}
                          </span>
                        )}
                      </div>
                    </div>
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
      <section className="py-16 bg-[#1A120B] text-center relative overflow-hidden">
        {/* Background Footprints */}
        <PawPrint className="absolute top-4 left-[10%] w-12 h-12 rotate-[-15deg] text-white/3 pointer-events-none select-none" />
        <PawPrint className="absolute bottom-4 right-[12%] w-16 h-16 rotate-[25deg] text-[#F1C290]/2 pointer-events-none select-none" />
        {/* Gold glow accents */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#E3602D] rounded-full opacity-5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#F5851F] rounded-full opacity-5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 bg-[#E3602D]/15 border border-[#E3602D]/30 text-[#F1C290] rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {dir === "rtl" ? "عروض حصرية" : lang === "fr" ? "Offres Exclusives" : "Exclusive Offers"}
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
