"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { BookOpen, Clock, User } from "lucide-react";
import type { BlogPost } from "@/lib/use-translated-data";

export default function BlogCard({ post }: { post: BlogPost }) {
  const { lang, dir, t } = useI18n();

  const getLocalized = (jsonStr: any) => {
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

  const title = getLocalized(post.title);
  const content = getLocalized(post.content);
  // Strip HTML and get excerpt
  const excerpt = content.replace(/<[^>]*>?/gm, '').substring(0, 120) + '...';

  const date = new Date(post.created_at).toLocaleDateString(
    lang === "ar" ? "ar-DZ" : lang === "fr" ? "fr-FR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <Link href={`/blog/${post.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E2DDD4] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-48 sm:h-56 overflow-hidden bg-[#F5EDD6]">
        {post.image_url ? (
          <Image 
            src={post.image_url} 
            alt={title} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#C4933F]/30">
            <BookOpen className="w-16 h-16" />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#C4933F] shadow-sm">
          {t.blog?.heroBadge || "Blog"}
        </div>
      </div>
      
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-4 text-xs text-[#9E9282] mb-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span className="truncate max-w-[100px]">{post.author}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-[#1A1A2E] mb-3 group-hover:text-[#C4933F] transition-colors line-clamp-2 leading-tight">
          {title}
        </h3>
        
        <p className="text-[#5C5348] text-sm line-clamp-3 leading-relaxed mb-4">
          {excerpt}
        </p>
        
        <div className="inline-flex items-center gap-1.5 text-sm font-bold text-[#C4933F]">
          {t.blog?.readMore || "Read More"} 
          {dir === "rtl" ? <span className="text-lg">←</span> : <span className="text-lg">→</span>}
        </div>
      </div>
    </Link>
  );
}
