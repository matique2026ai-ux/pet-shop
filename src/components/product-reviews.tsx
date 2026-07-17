"use client";

import { useState, useEffect, useCallback } from "react";
import { Star } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase";
import AuthModal from "@/components/auth-modal";

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { t, lang } = useI18n();
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [authOpen, setAuthOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("reviews")
        .select("id, user_name, rating, comment, created_at")
        .eq("product_id", productId)
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      setReviews((data as Review[]) ?? []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  const count = reviews.length;
  const average = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (rating < 1) {
      setError(t.reviews.ratingRequired);
      return;
    }
    setSubmitting(true);
    try {
      const supabase = createClient();
      const userName =
        profile?.full_name?.trim() ||
        user.email?.split("@")[0] ||
        "Customer";
      const { error: insertError } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: user.id,
        user_name: userName,
        rating,
        comment: comment.trim() || null,
        status: "pending",
      });
      if (insertError) {
        setError(t.reviews.errorGeneric);
        return;
      }
      setSubmitted(true);
      setRating(0);
      setComment("");
    } catch {
      setError(t.reviews.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString(lang === "ar" ? "ar-DZ" : lang === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="mt-14">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0B1E36]">{t.reviews.title}</h2>
          <p className="text-sm text-gray-500">{t.reviews.subtitle}</p>
        </div>
        {count > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i <= Math.round(average) ? "fill-[#E5B25A] text-[#E5B25A]" : "fill-gray-200 text-gray-200"}`}
                />
              ))}
            </div>
            <span className="font-bold text-gray-900">{average.toFixed(1)}</span>
            <span className="text-sm text-gray-500">
              {t.reviews.basedOn.replace("{n}", String(count))}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Reviews list */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-gray-400 text-sm">{t.products.loading}</div>
          ) : count === 0 ? (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center text-gray-500">
              {t.reviews.noReviews}
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{r.user_name}</span>
                  <span className="text-xs text-gray-400">{fmtDate(r.created_at)}</span>
                </div>
                <div className="flex items-center gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i <= r.rating ? "fill-[#E5B25A] text-[#E5B25A]" : "fill-gray-200 text-gray-200"}`}
                    />
                  ))}
                </div>
                {r.comment && <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{r.comment}</p>}
              </div>
            ))
          )}
        </div>

        {/* Write review */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 lg:sticky lg:top-24">
            <h3 className="font-bold text-gray-900 mb-4">{t.reviews.writeReview}</h3>
            {submitted ? (
              <p className="text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-sm">
                {t.reviews.pendingNote}
              </p>
            ) : !user ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">{t.reviews.loginPrompt}</p>
                <button
                  onClick={() => setAuthOpen(true)}
                  className="w-full bg-emerald-600 text-white rounded-xl py-2.5 font-semibold hover:bg-emerald-700 transition-colors"
                >
                  {t.reviews.loginButton}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.reviews.yourRating}</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i)}
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(0)}
                        aria-label={`${i}`}
                        className="p-0.5"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            i <= (hover || rating) ? "fill-[#E5B25A] text-[#E5B25A]" : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.reviews.yourReview}</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder={t.reviews.reviewPlaceholder}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#F97316] text-white rounded-xl py-2.5 font-semibold hover:bg-[#F97316]/90 transition-colors disabled:opacity-60"
                >
                  {submitting ? t.reviews.submitting : t.reviews.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialTab="login" />
    </div>
  );
}
