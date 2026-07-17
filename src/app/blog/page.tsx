"use client";

import { useI18n } from "@/lib/i18n-context";
import { BookOpen, Search } from "lucide-react";
import AnimatedSection from "@/components/animated-section";
import BlogCard from "@/components/blog-card";
import { useEffect, useState } from "react";
import type { BlogPost } from "@/lib/use-translated-data";

export default function BlogListingPage() {
  const { t, dir } = useI18n();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const getLocalized = (jsonStr: any, lang: string) => {
    if (typeof jsonStr === "string") {
      try {
        const obj = JSON.parse(jsonStr);
        return obj[lang] || obj["ar"] || obj["en"] || "";
      } catch {
        return jsonStr;
      }
    }
    if (jsonStr && typeof jsonStr === "object") {
      return jsonStr[lang] || jsonStr["ar"] || jsonStr["en"] || "";
    }
    return "";
  };

  const filteredPosts = posts.filter(post => {
    const title = getLocalized(post.title, "ar").toLowerCase() + " " + getLocalized(post.title, "fr").toLowerCase() + " " + getLocalized(post.title, "en").toLowerCase();
    const content = getLocalized(post.content, "ar").toLowerCase() + " " + getLocalized(post.content, "fr").toLowerCase() + " " + getLocalized(post.content, "en").toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || content.includes(query);
  });

  return (
    <div className="min-h-screen bg-[#F8F7F4] pt-24 pb-20" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full text-sm text-[#C4933F] border border-[#ECD8A6] shadow-sm mb-3">
              <BookOpen className="w-4 h-4" /> {t.blog?.subtitle || "Our Blog"}
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#1A1A2E] mb-4">{t.blog?.title || "Blog"}</h1>
            <div className="mt-3 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-[#C4933F] to-[#DFB96A]" />
          </div>
          
          <div className="max-w-xl mx-auto mb-12 relative">
            <input
              type="text"
              placeholder={t.products?.searchPlaceholder || "Search articles..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E2DDD4] rounded-full py-3 px-12 focus:outline-none focus:ring-2 focus:ring-[#C4933F] focus:border-transparent shadow-sm"
            />
            <div className={`absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'right-4' : 'left-4'} text-[#9E9282]`}>
              <Search className="w-5 h-5" />
            </div>
          </div>
        </AnimatedSection>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-96 border border-[#E2DDD4]" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-[#C4933F]/30 mx-auto mb-4" />
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
