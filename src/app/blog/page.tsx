"use client";

import { useI18n } from "@/lib/i18n-context";
import { BookOpen, Search, Sparkles, PawPrint, Feather, Heart, Stethoscope } from "lucide-react";
import AnimatedSection from "@/components/animated-section";
import BlogCard from "@/components/blog-card";
import { useEffect, useState } from "react";
import type { BlogPost } from "@/lib/use-translated-data";

export default function BlogListingPage() {
  const { t, lang, dir } = useI18n();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string>("all");

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog posts:", err);
        setLoading(false);
      });
  }, []);

  const getLocalized = (jsonStr: any, langKey: string) => {
    if (typeof jsonStr === "string") {
      try {
        const obj = JSON.parse(jsonStr);
        return obj[langKey] || obj["ar"] || obj["fr"] || obj["en"] || "";
      } catch {
        return jsonStr;
      }
    }
    if (jsonStr && typeof jsonStr === "object") {
      return jsonStr[langKey] || jsonStr["ar"] || jsonStr["fr"] || jsonStr["en"] || "";
    }
    return "";
  };

  const filteredPosts = posts.filter(post => {
    const title = getLocalized(post.title, "ar").toLowerCase() + " " + getLocalized(post.title, "fr").toLowerCase() + " " + getLocalized(post.title, "en").toLowerCase();
    const content = getLocalized(post.content, "ar").toLowerCase() + " " + getLocalized(post.content, "fr").toLowerCase() + " " + getLocalized(post.content, "en").toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = title.includes(query) || content.includes(query);
    const matchesTag = activeTag === "all" || title.includes(activeTag.toLowerCase()) || content.includes(activeTag.toLowerCase());
    return matchesSearch && matchesTag;
  });

  const tags = [
    { id: "all", label: lang === "ar" ? "الكل" : lang === "fr" ? "Tous" : "All" },
    { id: "طيور", label: lang === "ar" ? "🦜 الطيور" : lang === "fr" ? "Oiseaux" : "Birds" },
    { id: "قطط", label: lang === "ar" ? "🐱 القطط" : lang === "fr" ? "Chats" : "Cats" },
    { id: "كلاب", label: lang === "ar" ? "🐶 الكلاب" : lang === "fr" ? "Chiens" : "Dogs" },
    { id: "تغذية", label: lang === "ar" ? "🥗 التغذية" : lang === "fr" ? "Nutrition" : "Nutrition" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] pb-20" dir={dir}>
      {/* ══════════════════════════════════
          CREATIVE HERO SECTION
      ══════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-[#0F1913] via-[#1C2C22] to-[#0A120D] text-white mb-12">
        {/* Glow & Paw Decor */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F5851F]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
        <PawPrint className="absolute top-8 left-[6%] w-24 h-24 text-white/5 rotate-[-20deg] pointer-events-none select-none" />
        <PawPrint className="absolute bottom-8 right-[8%] w-32 h-32 text-white/5 rotate-[15deg] pointer-events-none select-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <AnimatedSection className="max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs sm:text-sm font-semibold text-[#F1C290] border border-white/15 mb-6 shadow-xl">
              <BookOpen className="w-4 h-4 text-[#F5851F]" />
              <span>{lang === "ar" ? "مدونة ومرشد مخالب وأجنحة" : lang === "fr" ? "Guide et conseils vétérinaires" : "Pet Care Guide & Blog"}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.15] mb-5">
              {lang === "ar" ? (
                <>
                  نصائح وإرشادات <span className="bg-gradient-to-r from-[#F5851F] via-[#F1C290] to-emerald-400 bg-clip-text text-transparent">احترافية</span> لحيوانك الأليف
                </>
              ) : lang === "fr" ? (
                <>
                  Conseils et Guides <span className="bg-gradient-to-r from-[#F5851F] via-[#F1C290] to-emerald-400 bg-clip-text text-transparent">Experts</span>
                </>
              ) : (
                <>
                  Expert Pet <span className="bg-gradient-to-r from-[#F5851F] via-[#F1C290] to-emerald-400 bg-clip-text text-transparent">Care & Tips</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-emerald-100/70 max-w-2xl mx-auto font-light leading-relaxed mb-8">
              {lang === "ar"
                ? "مقالات علمية وعملية مُعدّة من خبراء العناية والتغذية لمساعدتك في الحفاظ على صحة وسعادة حيوانك الأليف."
                : lang === "fr"
                ? "Articles et guides rédigés par nos spécialistes pour prendre soin de vos animaux au quotidien."
                : "Articles and practical guides prepared by our experts to keep your pets healthy and happy."}
            </p>

            {/* Search Input Box */}
            <div className="max-w-xl mx-auto mb-6 relative">
              <input
                type="text"
                placeholder={lang === "ar" ? "ابحث عن أي مقال أو نصيحة..." : lang === "fr" ? "Rechercher un article..." : "Search articles & guides..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full py-3.5 px-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F5851F] focus:bg-black/30 shadow-2xl transition-all text-sm"
              />
              <div className={`absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'right-4' : 'left-4'} text-[#F1C290]`}>
                <Search className="w-5 h-5" />
              </div>
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {tags.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTag(t.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeTag === t.id
                      ? "bg-[#F5851F] text-white shadow-lg shadow-[#F5851F]/30"
                      : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/10"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-96 border border-[#E2DDD4]" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-[#E3602D]/30 mx-auto mb-4" />
            <p className="text-xl text-[#9E9282]">{t.blog?.noArticles || "No articles found."}</p>
          </div>
        ) : (
          <AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
