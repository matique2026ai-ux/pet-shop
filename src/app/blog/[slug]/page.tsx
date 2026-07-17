"use client";

import { useI18n } from "@/lib/i18n-context";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, User, Share2, MessageCircle } from "lucide-react";
import AnimatedSection from "@/components/animated-section";
import type { BlogPost } from "@/lib/use-translated-data";

import React, { use } from "react";

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t, dir, lang } = useI18n();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog post:", err);
        setLoading(false);
      });
      
    fetchComments();
  }, [slug]);

  const fetchComments = () => {
    fetch(`/api/blog/${slug}/comments`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setComments(data);
      })
      .catch(console.error);
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName || !newCommentText) return;
    setCommenting(true);
    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: newCommentName, comment: newCommentText })
      });
      if (res.ok) {
        setNewCommentName("");
        setNewCommentText("");
        fetchComments();
      }
    } catch (err) {
      console.error(err);
    }
    setCommenting(false);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] pt-24 pb-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C4933F]"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] pt-24 pb-20 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-[#1A1A2E] mb-4">Post not found</h1>
        <Link href="/blog" className="text-[#C4933F] hover:underline">Return to Blog</Link>
      </div>
    );
  }

  const title = getLocalized(post.title);
  const content = getLocalized(post.content);
  const date = new Date(post.created_at).toLocaleDateString(
    lang === "ar" ? "ar-DZ" : lang === "fr" ? "fr-FR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="min-h-screen bg-[#F8F7F4] pt-24 pb-20" dir={dir}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <AnimatedSection>
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#9E9282] hover:text-[#C4933F] mb-8 transition-colors">
            {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {t.blog?.viewArticles || "Back to Blog"}
          </Link>
          
          <h1 className="text-3xl md:text-5xl font-bold text-[#1A1A2E] mb-6 leading-tight">{title}</h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-[#9E9282] mb-8 pb-8 border-b border-[#E2DDD4]">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 cursor-pointer hover:text-[#C4933F]" onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied!");
              }} />
              <span>Share</span>
            </div>
          </div>
          
          {post.image_url && (
            <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden mb-10 shadow-md">
              <Image src={post.image_url} alt={title} fill className="object-cover" />
            </div>
          )}
          
          <div className="prose prose-lg prose-[#5C5348] max-w-none mb-16 whitespace-pre-wrap">
            {content}
          </div>
          
          {/* Comments Section */}
          <div className="mt-16 pt-10 border-t border-[#E2DDD4]">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-[#C4933F]" />
              {lang === "ar" ? "التعليقات" : lang === "fr" ? "Commentaires" : "Comments"} ({comments.length})
            </h2>
            
            <div className="space-y-6 mb-10">
              {comments.map((c) => (
                <div key={c.id} className="bg-white p-5 rounded-xl shadow-sm border border-[#E2DDD4]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-[#1A1A2E]">{c.user_name}</span>
                    <span className="text-xs text-[#9E9282]">{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[#5C5348] text-sm">{c.comment}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-[#FBF7EE] p-6 rounded-2xl border border-[#ECD8A6]">
              <h3 className="font-bold text-[#1A1A2E] mb-4">
                {lang === "ar" ? "أضف تعليقاً" : lang === "fr" ? "Ajouter un commentaire" : "Leave a comment"}
              </h3>
              <form onSubmit={submitComment} className="space-y-4">
                <input 
                  type="text" 
                  required
                  placeholder={lang === "ar" ? "الاسم" : "Name"}
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  className="w-full bg-white border border-[#E2DDD4] rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#C4933F] focus:border-transparent"
                />
                <textarea 
                  required
                  rows={4}
                  placeholder={lang === "ar" ? "تعليقك..." : "Your comment..."}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="w-full bg-white border border-[#E2DDD4] rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#C4933F] focus:border-transparent resize-none"
                />
                <button 
                  type="submit" 
                  disabled={commenting}
                  className="bg-[#1A1A2E] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50"
                >
                  {commenting ? "..." : (lang === "ar" ? "إرسال" : "Submit")}
                </button>
              </form>
            </div>
          </div>
          
        </AnimatedSection>
      </div>
    </div>
  );
}
