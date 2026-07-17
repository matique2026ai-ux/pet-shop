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
import BlogCard from "@/components/blog-card";
import { SHIMMER_BLUR } from "@/lib/blur";
import { ArrowRight, Star, Truck, Shield, RefreshCw, BookOpen, ChevronLeft, ChevronRight, Heart, Sparkles, Award, Cat, Dog, Bird, Fish, Rabbit, PawPrint } from "lucide-react";



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

function CategoryFootprintDecor({ category }: { category: string }) {
  if (category === "cats") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="absolute -bottom-6 -left-6 w-24 h-24 text-[#C4933F]/4 pointer-events-none transform -rotate-12 select-none group-hover:scale-110 group-hover:text-[#C4933F]/8 transition-all duration-500 z-0"
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
        className="absolute -bottom-6 -left-6 w-24 h-24 text-[#C4933F]/6 pointer-events-none transform rotate-45 select-none group-hover:scale-110 group-hover:text-[#C4933F]/10 transition-all duration-500 z-0"
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
        className="absolute -bottom-6 -left-6 w-28 h-28 text-[#C4933F]/4 pointer-events-none transform -rotate-45 select-none group-hover:scale-110 group-hover:text-[#C4933F]/8 transition-all duration-500 z-0"
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
      className="absolute -bottom-6 -left-6 w-24 h-24 text-[#C4933F]/4 pointer-events-none transform rotate-12 select-none group-hover:scale-110 group-hover:text-[#C4933F]/8 transition-all duration-500 z-0"
      aria-hidden="true"
    >
      <path d="M12 3C8.5 3 5 6.5 5 11c0 4.5 3.5 7.5 5.5 8.5C11 19.8 11.5 20 12 20s1-.2 1.5-.5c2-1 5.5-4 5.5-8.5 0-4.5-3.5-8-7-8zm-2 14c-1.5-1-3.5-3-3.5-6 0-3 2-5 3.5-5 .5 0 1 .5 1 1 0 1.5-1 3-1 5 0 1 .5 2 1 2.5-.5.5-1 1.5-1 2.5zm4.5-2.5c.5-.5 1-1.5 1-2.5 0-2-1-3.5-1-5 0-.5.5-1 1-1 1.5 0 3.5 2 3.5 5 0 3-2 5-3.5 6 0-1-.5-2-1-2.5z" />
    </svg>
  );
}

const CATEGORY_THEMES: Record<string, {
  gradient: string;
  glowColor: string;
  icon: React.ReactNode;
  accentColor: string;
  badgeBg: string;
}> = {
  cats: {
    gradient: "from-[#F39C12] via-[#E67E22] to-[#D35400]",
    glowColor: "rgba(230,126,34,0.35)",
    icon: <Cat className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 transform rotate-12 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:text-white/15 pointer-events-none" />,
    accentColor: "text-[#FFE6CC]",
    badgeBg: "bg-white/15 backdrop-blur-md text-white border border-white/10",
  },
  dogs: {
    gradient: "from-[#F1C40F] via-[#F39C12] to-[#E67E22]",
    glowColor: "rgba(243,156,18,0.35)",
    icon: <Dog className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 transform -rotate-12 transition-all duration-500 group-hover:scale-110 group-hover:rotate-0 group-hover:text-white/15 pointer-events-none" />,
    accentColor: "text-[#FFF0D0]",
    badgeBg: "bg-white/15 backdrop-blur-md text-white border border-white/10",
  },
  birds: {
    gradient: "from-[#2ECC71] via-[#27AE60] to-[#16A085]",
    glowColor: "rgba(46,204,113,0.35)",
    icon: <Bird className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 transform rotate-45 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:text-white/15 pointer-events-none" />,
    accentColor: "text-[#E0F8E8]",
    badgeBg: "bg-white/15 backdrop-blur-md text-white border border-white/10",
  },
  fish: {
    gradient: "from-[#3498DB] via-[#2980B9] to-[#1F3A60]",
    glowColor: "rgba(52,152,219,0.35)",
    icon: <Fish className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 transform -rotate-45 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:text-white/15 pointer-events-none" />,
    accentColor: "text-[#E1F0FA]",
    badgeBg: "bg-white/15 backdrop-blur-md text-white border border-white/10",
  },
  "small-pets": {
    gradient: "from-[#9B59B6] via-[#8E44AD] to-[#6C3483]",
    glowColor: "rgba(155,89,182,0.35)",
    icon: <Rabbit className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 transform rotate-12 transition-all duration-500 group-hover:scale-110 group-hover:rotate-0 group-hover:text-white/15 pointer-events-none" />,
    accentColor: "text-[#F5E6FA]",
    badgeBg: "bg-white/15 backdrop-blur-md text-white border border-white/10",
  },
};

export default function HomePage() {
  const { t, dir, lang } = useI18n();
  const { content } = useSiteSettings();
  const { categories, products, vetServices, testimonials, blogPosts } = useTranslatedData();
  
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
  const bestsellers  = products.filter((p) => p.rating >= 4.6).slice(0, 8);
  const { ids: recentIds } = useRecentlyViewed();
  const recentProducts = products.filter((p) => recentIds.includes(p.id)).slice(0, 4);
  const [videoIdx, setVideoIdx]     = useState(0);
  const [heroVideos, setHeroVideos] = useState<string[]>(DEFAULT_HERO_VIDEOS);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const customBg = content?.heroBackground;
  const isCustomVideo = customBg ? /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(customBg) : false;

  useEffect(() => {
    fetch("/api/hero-videos")
      .then((r) => r.json())
      .then((d) => { if (d.videos && d.videos.length > 0) setHeroVideos(d.videos); })
      .catch(() => {});
  }, []);



  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (v) {
        if (i === videoIdx) {
          v.play().catch(() => {});
        } else {
          // Let it keep playing while it fades out, pause after 1500ms
          setTimeout(() => { 
            if (v) {
              v.pause();
              v.currentTime = 0; 
            }
          }, 1500);
        }
      }
    });
  }, [videoIdx]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>, index: number) => {
    const video = e.currentTarget;
    // Only trigger if this is the active video
    if (index === videoIdx && heroVideos.length > 1 && video.duration - video.currentTime <= 1.5) {
      setVideoIdx((prev) => (prev + 1) % heroVideos.length);
    }
  };

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
          heroVideos.map((src, i) => (
            <video
              key={src}
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              muted
              loop={heroVideos.length === 1}
              playsInline
              preload="auto"
              onTimeUpdate={(e) => handleTimeUpdate(e, i)}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] ease-in-out ${i === videoIdx ? "opacity-100 scale-100 z-0" : "opacity-0 scale-105 -z-10"}`}
            >
              <source src={src} type="video/mp4" />
            </video>
          ))
        )}
        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/20 via-black/50 to-black/90" />
        
        {/* Subtle Gold accent at bottom to blend with the tagline */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-40 lg:pt-32 lg:pb-48 w-full flex flex-col items-center justify-center">
          <StaggerSection className="text-center max-w-5xl mx-auto flex flex-col items-center">
            {/* Premium badge */}
            <FadeIn>
              <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] text-white rounded-full px-5 py-2 text-sm sm:text-base font-medium mb-8 transition-transform hover:scale-105 cursor-default">
                <Sparkles className="w-4 h-4 text-[#DFB96A]" />
                {dir === "rtl" ? "متجر الحيوانات الأليفة الأول في الجزائر" : "Premier Pet Shop in Algeria"}
              </div>
            </FadeIn>

            <FadeIn>
              <h1 
                className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-tight tracking-tight mb-6"
                style={{ textShadow: '0 10px 40px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.5)' }}
              >
                {heroTitle}
              </h1>
            </FadeIn>
            
            <FadeIn>
              <p 
                className="text-lg sm:text-2xl text-gray-200 font-light mb-12 max-w-3xl mx-auto leading-relaxed"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
              >
                {heroSubtitle}
              </p>
            </FadeIn>
            
            <FadeIn>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link
                  href="/products"
                  className="relative group inline-flex justify-center items-center gap-3 bg-gradient-to-r from-[#F5851F] to-[#E06A0A] text-white px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-[0_0_40px_rgba(245,133,31,0.4)] hover:shadow-[0_0_60px_rgba(245,133,31,0.6)] w-full sm:w-auto"
                >
                  {heroCta1}
                  {dir === "rtl" ? (
                    <Arrow className="w-5 h-5 group-hover:-translate-x-1 transition-transform rotate-180" />
                  ) : (
                    <Arrow className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                  <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-colors" />
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex justify-center items-center gap-3 bg-white/5 backdrop-blur-md text-white px-10 py-4 rounded-full font-bold text-lg transition-all border border-white/20 hover:bg-white/10 hover:border-white/40 hover:scale-105 w-full sm:w-auto"
                >
                  <BookOpen className="w-5 h-5 text-[#DFB96A]" />
                  {heroCta2}
                </Link>
              </div>
            </FadeIn>
          </StaggerSection>
        </div>

        {/* Sleek Trust Bar at the bottom of the hero */}
        <div className="absolute bottom-0 inset-x-0 border-t border-white/10 bg-black/40 backdrop-blur-xl z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-wrap items-center justify-center sm:justify-around gap-6">
              {[
                { icon: <Truck className="w-5 h-5" />, label: dir === "rtl" ? "توصيل سريع لـ 58 ولاية" : "Fast Nationwide Delivery" },
                { icon: <Award className="w-5 h-5" />, label: dir === "rtl" ? "جودة مضمونة 100%" : "100% Quality Guaranteed" },
                { icon: <Shield className="w-5 h-5" />, label: dir === "rtl" ? "تسوق إلكتروني آمن" : "Secure Online Shopping" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-3 text-white/90 text-sm sm:text-base font-medium">
                  <div className="bg-white/10 p-2 rounded-full border border-white/5">
                    <span className="text-[#DFB96A]">{b.icon}</span>
                  </div>
                  {b.label}
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
            className="flex overflow-x-auto lg:grid lg:grid-cols-5 gap-4 lg:gap-6 pb-6 px-1 scrollbar-none"
            style={{ touchAction: "pan-x", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            {categories.map((cat) => {
              const theme = CATEGORY_THEMES[cat.id] || {
                gradient: "from-[#F39C12] via-[#E67E22] to-[#D35400]",
                glowColor: "rgba(230,126,34,0.35)",
                icon: <PawPrint className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 transform rotate-12 transition-all duration-500 pointer-events-none" />,
                accentColor: "text-[#FFE6CC]",
                badgeBg: "bg-white/15 backdrop-blur-md text-white border border-white/10",
              };

              return (
                <Link
                  key={cat.id}
                  href={`/products/${cat.id}`}
                  className="group relative flex flex-col justify-end p-6 rounded-[2rem] overflow-hidden border border-[#F0EDE6]/40 shadow-[0_10px_35px_rgba(0,0,0,0.02)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_45px_var(--glow-color)] shrink-0 w-[155px] sm:w-[190px] lg:w-auto min-h-[220px] sm:min-h-[260px] text-left"
                  style={{
                    "--glow-color": theme.glowColor,
                  } as React.CSSProperties}
                >
                  {/* Card Background Media */}
                  {cat.video_url ? (
                    <div className="absolute inset-0 z-0">
                      <video
                        src={cat.video_url}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 z-10 transition-opacity duration-500 group-hover:opacity-95" />
                    </div>
                  ) : cat.image_url ? (
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        placeholder="blur"
                        blurDataURL={SHIMMER_BLUR}
                        sizes="(max-width: 640px) 155px, 190px"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10 z-10 transition-opacity duration-500 group-hover:opacity-95" />
                    </div>
                  ) : (
                    // Fallback using premium theme gradient mesh and large vector icon
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} z-0 transition-transform duration-700 group-hover:scale-105 overflow-hidden`}>
                      {theme.icon}
                      {/* Subtitle brand overlay to enrich layout */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent z-10" />
                    </div>
                  )}

                  {/* Footprint SVG for decorative texture */}
                  <CategoryFootprintDecor category={cat.id} />

                  {/* Card Content (Text and Badges) on top of background */}
                  <div className="relative z-20 flex flex-col items-start w-full">
                    {/* Floating badge */}
                    <span className={`text-[9px] sm:text-[10px] font-extrabold px-3 py-1 rounded-full ${theme.badgeBg} tracking-wide transition-all duration-300`}>
                      {t.nav.subcategoryCount.replace("{n}", String(cat.subcategories ? cat.subcategories.length : 0))}
                    </span>
                    
                    {/* Category Title */}
                    <h3 className="text-white font-black text-base sm:text-lg lg:text-xl mt-2 mb-1 drop-shadow-sm group-hover:text-[#DFB96A] transition-colors duration-300">
                      {cat.name}
                    </h3>
                  </div>

                  {/* Glassmorphic Action Button on hover */}
                  <div className="relative z-20 mt-2 flex items-center justify-center gap-1.5 w-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/25 text-white rounded-2xl py-2 text-[11px] font-black transition-all duration-300 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 shrink-0">
                    <span>{lang === "ar" ? "تصفح الآن" : lang === "fr" ? "Découvrir" : "Browse Now"}</span>
                    {dir === "rtl" ? (
                      <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    )}
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
      {/* ══════════════════════════════════
          BLOG ARTICLES
      ══════════════════════════════════ */}
      <section className="py-14 bg-[#F8F7F4] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #C4933F 1px, transparent 1px), radial-gradient(circle at 80% 50%, #C4933F 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-sm text-[#C4933F] border border-[#ECD8A6] shadow-sm mb-3">
                <BookOpen className="w-4 h-4" /> {t.blog?.subtitle || "Our Blog"}
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A2E]">{t.blog?.latestArticlesTitle || "Latest Articles"}</h2>
              <div className="mt-3 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-[#C4933F] to-[#DFB96A]" />
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
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C4933F] to-[#A87A2E] text-white px-8 py-3.5 rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#C4933F]/30 hover:-translate-y-0.5"
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
      <section className="py-16 bg-[#1A120B] text-center relative overflow-hidden">
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
