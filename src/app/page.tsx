"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { useTranslatedData } from "@/lib/use-translated-data";
import { useRecentlyViewed } from "@/lib/use-recently-viewed";
import { useSiteSettings } from "@/lib/site-settings";
import AnimatedSection from "@/components/animated-section";
import ProductCard from "@/components/product-card";
import VetCard from "@/components/vet-card";
import { SHIMMER_BLUR } from "@/lib/blur";
import { ArrowRight, Star, Truck, Shield, RefreshCw, Clock, Stethoscope, ChevronLeft, ChevronRight, Heart } from "lucide-react";

const categoryImages: Record<string, string> = {
  cats: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
  dogs: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop",
  birds: "https://images.unsplash.com/photo-1480044965905-02098d419e96?w=400&h=400&fit=crop",
  fish: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&h=400&fit=crop",
  "small-pets": "https://images.unsplash.com/photo-1535241749838-299277b6305f?w=400&h=400&fit=crop",
};

const benefitIcons = [
  <Truck className="w-6 h-6" />,
  <Shield className="w-6 h-6" />,
  <Heart className="w-6 h-6" />,
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
  const heroTitle = c("heroTitle", t.hero.title);
  const heroSubtitle = c("heroSubtitle", t.hero.subtitle);
  const heroCta1 = c("heroCta1", t.hero.cta1);
  const heroCta2 = c("heroCta2", t.hero.cta2);
  const isRtl = dir === "rtl";
  const Arrow = isRtl ? ChevronLeft : ChevronRight;
  const bestsellers = products.filter((p) => p.rating >= 4.6).slice(0, 8);
  const { ids: recentIds } = useRecentlyViewed();
  const recentProducts = products.filter((p) => recentIds.includes(p.id)).slice(0, 4);
  const [videoIdx, setVideoIdx] = useState(0);
  const [heroVideos, setHeroVideos] = useState<string[]>(DEFAULT_HERO_VIDEOS);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetch("/api/hero-videos")
      .then((r) => r.json())
      .then((d) => {
        if (d.videos && d.videos.length > 0) setHeroVideos(d.videos);
      })
      .catch(() => {});
  }, []);

  const handleVideoEnd = () => {
    const next = (videoIdx + 1) % heroVideos.length;
    setVideoIdx(next);
  };

  useEffect(() => {
    videoRef.current?.load();
  }, [videoIdx]);

  return (
    <>
      <section className="relative overflow-hidden">
        <video ref={videoRef} key={videoIdx} autoPlay muted playsInline preload="metadata" onEnded={handleVideoEnd} className="absolute inset-0 w-full h-full object-cover">
          <source src={heroVideos[videoIdx]} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 animate-shimmer drop-shadow-md">
              {heroTitle}
            </h1>
            <p className="text-lg text-emerald-50 font-medium mb-8 max-w-xl mx-auto drop-shadow">
              {heroSubtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products" className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-600/30">
                {heroCta1}
                <Arrow className="w-5 h-5" />
              </Link>
              <Link href="/vet" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-white/20 transition-all border-2 border-white/30">
                <Stethoscope className="w-5 h-5" />
                {heroCta2}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-2">
              <p className="text-lg text-emerald-600 font-medium">{t.home.tagline}</p>
              <p className="text-gray-500 text-sm mt-1">{t.home.taglineSub}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/products/${cat.id}`} className="group relative block rounded-2xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-xl transition-all">
                  <Image src={categoryImages[cat.id] || categoryImages.cats} alt={cat.name} fill placeholder="blur" blurDataURL={SHIMMER_BLUR} sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-4 text-center">
                    <span className="text-white font-bold text-sm lg:text-base leading-tight block drop-shadow-lg">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-2 mb-8 flex-wrap">
              <h2 className="text-2xl font-bold text-gray-900 min-w-0">{t.home.bestsellers}</h2>
              <Link href="/products" className="flex items-center gap-1 text-emerald-600 font-medium text-sm hover:text-emerald-700 shrink-0">
                {t.home.viewAll} <Arrow className="w-4 h-4" />
              </Link>
            </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {recentProducts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">{t.products.recentlyViewed}</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8">
              {recentProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.home.benefitsTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.home.benefits.map((b: { title: string; text: string }, i: number) => (
                <div key={i} className="bg-emerald-50 rounded-2xl p-6 text-center border border-emerald-100">
                  <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                    {benefitIcons[i]}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{b.title}</h3>
                  <p className="text-sm text-gray-500">{b.text}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/30 to-white pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-sm text-emerald-700 border border-emerald-200/50 shadow-sm mb-3">
                <Stethoscope className="w-4 h-4" /> {t.vet.subtitle}
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{t.vet.servicesTitle}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {vetServices.slice(0, 4).map((s) => (
                <VetCard key={s.id} service={s} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/vet" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-7 py-3 rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5">
                {t.vet.bookNow}
                <Arrow className="w-4 h-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.vet.testimonialsTitle}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((rev) => (
                <div key={rev.id} className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">&ldquo;{rev.text}&rdquo;</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center text-xs font-bold text-emerald-700">
                      {rev.initials}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{rev.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12 bg-gray-900 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-white mb-4">
              {t.home.ctaTitle}
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              {t.home.ctaText}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                {heroCta1}
                <Arrow className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors border border-gray-700">
                {t.nav.contact}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
