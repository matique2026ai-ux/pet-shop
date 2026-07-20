"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { useTranslatedData } from "@/lib/use-translated-data";
import { useRecentlyViewed } from "@/lib/use-recently-viewed";
import { useSiteSettings } from "@/lib/site-settings";
import AnimatedSection, { StaggerSection, FadeIn } from "@/components/animated-section";

import ProductCard, { ProductCardSkeleton } from "@/components/product-card";
import BlogCard from "@/components/blog-card";
import { SHIMMER_BLUR } from "@/lib/blur";
import { ArrowRight, Star, Truck, Shield, RefreshCw, BookOpen, ChevronLeft, ChevronRight, Heart, Sparkles, Award, Cat, Dog, Bird, Fish, Rabbit, PawPrint } from "lucide-react";



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

function CategoryFootprintDecor({ category }: { category: string }) {
  if (category === "cats") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="absolute -bottom-6 -left-6 w-24 h-24 text-[#E3602D]/4 pointer-events-none transform -rotate-12 select-none group-hover:scale-110 group-hover:text-[#E3602D]/8 transition-all duration-500 z-0"
        aria-hidden="true"
      >
        <path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3zm-4.5-3c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm9 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-6.5-3.5C9.17 7.5 8.5 8.17 8.5 9s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm4 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
      </svg>
    );
  }
  if (category === "birds") {
    return (
      <svg
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        className="absolute -bottom-6 -left-6 w-24 h-24 text-[#E3602D]/6 pointer-events-none transform rotate-45 select-none group-hover:scale-110 group-hover:text-[#E3602D]/10 transition-all duration-500 z-0"
        aria-hidden="true"
      >
        <line x1="12" y1="4" x2="12" y2="20" />
        <line x1="12" y1="12" x2="6" y2="8" />
        <line x1="12" y1="12" x2="18" y2="8" />
        <line x1="12" y1="16" x2="8" y2="19" />
        <line x1="12" y1="16" x2="16" y2="19" />
      </svg>
    );
  }
  if (category === "dogs") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="absolute -bottom-6 -left-6 w-28 h-28 text-[#E3602D]/4 pointer-events-none transform -rotate-45 select-none group-hover:scale-110 group-hover:text-[#E3602D]/8 transition-all duration-500 z-0"
        aria-hidden="true"
      >
        <path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3zm-4.5-3c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm9 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-6.5-3.5C9.17 7.5 8.5 8.17 8.5 9s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm4 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="absolute -bottom-6 -left-6 w-24 h-24 text-[#E3602D]/4 pointer-events-none transform rotate-12 select-none group-hover:scale-110 group-hover:text-[#E3602D]/8 transition-all duration-500 z-0"
      aria-hidden="true"
    >
      <path d="M12 3C8.5 3 5 6.5 5 11c0 4.5 3.5 7.5 5.5 8.5C11 19.8 11.5 20 12 20s1-.2 1.5-.5c2-1 5.5-4 5.5-8.5 0-4.5-3.5-8-7-8zm-2 14c-1.5-1-3.5-3-3.5-6 0-3 2-5 3.5-5 .5 0 1 .5 1 1 0 1.5-1 3-1 5 0 1 .5 2 1 2.5-.5.5-1 1.5-1 2.5zm4.5-2.5c.5-.5 1-1.5 1-2.5 0-2-1-3.5-1-5 0-.5.5-1 1-1 1.5 0 3.5 2 3.5 5 0 3-2 5-3.5 6 0-1-.5-2-1-2.5z" />
    </svg>
  );
}

const catIcons: Record<string, React.ReactNode> = {
  cats:         <Cat    className="w-8 h-8" />,
  dogs:         <Dog    className="w-8 h-8" />,
  birds:        <Bird   className="w-8 h-8" />,
  fish:         <Fish   className="w-8 h-8" />,
  "small-pets": <Rabbit className="w-8 h-8" />,
};

function PawIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3z"/>
      <circle cx="6.5" cy="11.5" r="1.5" />
      <circle cx="10" cy="8.5" r="1.5" />
      <circle cx="14" cy="8.5" r="1.5" />
      <circle cx="17.5" cy="11.5" r="1.5" />
    </svg>
  );
}

export default function HomePage() {
  const { t, dir, lang } = useI18n();
  const { content } = useSiteSettings();
  const { categories, products, vetServices, testimonials, blogPosts, productsLoaded } = useTranslatedData();
  
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
      <section className="relative overflow-hidden min-h-[500px] sm:min-h-[620px] flex items-center justify-center">
        {customBg ? (
          isCustomVideo ? (
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

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:pt-24 sm:pb-36 lg:pt-28 lg:pb-40 w-full flex flex-col items-center text-center">
          <StaggerSection className="text-center max-w-4xl mx-auto flex flex-col items-center w-full">
            {/* Premium badge */}
            <FadeIn>
              <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-lg border border-white/20 text-white rounded-full px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold mb-5 sm:mb-8 shadow-lg">
                <Sparkles className="w-4 h-4 text-[#F1C290] shrink-0" />
                <span>{dir === "rtl" ? "متجر الحيوانات الأليفة الأول في الجزائر" : "Premier Pet Shop in Algeria"}</span>
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
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 w-full max-w-xs sm:max-w-none mx-auto relative z-30">
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
                <Link
                  href="/blog"
                  className="inline-flex justify-center items-center gap-2.5 bg-white/10 backdrop-blur-md text-white px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 border border-white/25 hover:bg-white/20 hover:border-white/50 hover:scale-105 w-full sm:w-auto"
                >
                  <BookOpen className="w-5 h-5 text-[#F1C290] shrink-0" />
                  <span>{heroCta2}</span>
                </Link>
              </div>
            </FadeIn>
          </StaggerSection>
        </div>

        {/* Sleek Mobile-Responsive Trust Bar */}
        <div className="absolute bottom-0 inset-x-0 border-t border-white/15 bg-black/50 backdrop-blur-xl z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center justify-center sm:justify-around gap-2 sm:gap-6 text-center">
              {[
                { icon: <Truck className="w-4 h-4 sm:w-5 sm:h-5" />, label: dir === "rtl" ? "توصيل سريع لـ 58 ولاية" : "Fast Nationwide Delivery" },
                { icon: <Award className="w-4 h-4 sm:w-5 sm:h-5" />, label: dir === "rtl" ? "جودة مضمونة 100%" : "100% Quality Guaranteed" },
                { icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />, label: dir === "rtl" ? "تسوق إلكتروني آمن" : "Secure Online Shopping" },
              ].map((b, i) => (
                <div key={i} className="flex items-center justify-center gap-2 sm:gap-3 text-white/95 text-xs sm:text-base font-medium">
                  <div className="bg-white/15 p-1.5 sm:p-2 rounded-full border border-white/10 shrink-0">
                    <span className="text-[#F1C290]">{b.icon}</span>
                  </div>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          TAGLINE BAR
      ══════════════════════════════════ */}
      <section className="py-8 bg-white border-b border-[#F0EDE6]">
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
          CATEGORIES GRID
      ══════════════════════════════════ */}
      <section className="py-12 bg-[#F8F7F4] relative overflow-hidden">
        {/* Background Footprints */}
        <PawPrint className="absolute top-8 left-[5%] w-14 h-14 rotate-[-12deg] text-[#E3602D]/4 pointer-events-none select-none" />
        <PawPrint className="absolute bottom-6 right-[4%] w-16 h-16 rotate-[28deg] text-[#E3602D]/4 pointer-events-none select-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#1A1A2E]">{t.nav.categories}</h2>
              <div className="mt-2 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-[#E3602D] to-[#F1C290]" />
            </div>
          </AnimatedSection>
          {/* Scroll row sits OUTSIDE AnimatedSection to avoid Framer Motion intercepting touch events */}
          <div
            className="flex overflow-x-auto lg:grid lg:grid-cols-5 gap-4 lg:gap-6 pb-6 px-1 scrollbar-none"
            style={{ touchAction: "pan-x", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            {categories.map((cat) => {
              return (
                <Link
                  key={cat.id}
                  href={`/products/${cat.id}`}
                  className="group relative flex flex-col items-center justify-between p-6 rounded-[2rem] bg-gradient-to-br from-[#FDFBF7] to-[#F5EEDC] border border-[#E3602D]/10 shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md hover:border-[#E3602D]/35 shrink-0 w-[155px] sm:w-[190px] lg:w-auto min-h-[190px] sm:min-h-[220px] text-center"
                >
                  {/* Paw footprint background decoration in the card */}
                  <div className="absolute -bottom-2 -left-2 text-[#E3602D]/5 pointer-events-none w-20 h-20 rotate-12 transition-transform duration-500 group-hover:scale-110">
                    <PawIcon className="w-full h-full" />
                  </div>

                  {/* Icon Container */}
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-[#E3602D] shadow-sm border border-[#E3602D]/5 group-hover:bg-[#E3602D] group-hover:text-white transition-colors duration-300">
                    {catIcons[cat.id] ?? <PawPrint className="w-8 h-8" />}
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5 mt-4 relative z-10">
                    <h3 className="text-[#1A2D24] font-black text-sm sm:text-base lg:text-lg group-hover:text-[#E3602D] transition-colors line-clamp-1">
                      {cat.name}
                    </h3>
                    <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100/50">
                      {t.nav.subcategoryCount.replace("{n}", String(cat.subcategories ? cat.subcategories.length : 0))}
                    </span>
                  </div>
                </Link>
              );
            })}
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
        <section className="py-12 bg-[#F8F7F4]">
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
          VET SERVICES
      ══════════════════════════════════ */}
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
      <section className="py-14 bg-white relative overflow-hidden">
        {/* Background Footprints */}
        <PawPrint className="absolute top-10 right-[10%] w-12 h-12 rotate-[15deg] text-[#E3602D]/3 pointer-events-none select-none" />
        <PawPrint className="absolute bottom-4 left-[8%] w-10 h-10 rotate-[-35deg] text-[#E3602D]/3 pointer-events-none select-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">{t.vet.testimonialsTitle}</h2>
              <div className="mt-1.5 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-[#E3602D] to-[#F1C290]" />
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
                    <div className="w-9 h-9 bg-gradient-to-br from-[#F1C290] to-[#E3602D] rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm">
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
