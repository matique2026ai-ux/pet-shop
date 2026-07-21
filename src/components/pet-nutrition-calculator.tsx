"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Calculator, Droplets, Utensils, ArrowRight, PawPrint, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

export default function PetNutritionCalculator() {
  const { lang, dir } = useI18n();
  const [petType, setPetType] = useState<"cat" | "dog" | "bird">("cat");
  const [weight, setWeight] = useState<number>(3);
  const [ageGroup, setAgeGroup] = useState<"junior" | "adult" | "senior">("adult");
  const [activity, setActivity] = useState<"low" | "normal" | "high">("normal");

  // Calculate daily portion (g) & daily hydration (ml)
  let baseFactor = petType === "cat" ? 15 : petType === "dog" ? 18 : 8;
  if (ageGroup === "junior") baseFactor *= 1.3;
  if (ageGroup === "senior") baseFactor *= 0.85;
  if (activity === "high") baseFactor *= 1.2;
  if (activity === "low") baseFactor *= 0.9;

  const dailyPortion = Math.round(weight * baseFactor);
  const dailyWater = Math.round(weight * 50);

  const getProductRecommendation = () => {
    if (petType === "cat") return { label: lang === "ar" ? "أغذية القطط الممتازة" : "Nourriture pour chats", link: "/products/cats" };
    if (petType === "dog") return { label: lang === "ar" ? "أغذية الكلاب المغذية" : "Nourriture pour chiens", link: "/products/dogs" };
    return { label: lang === "ar" ? "حبوب وفيتامينات الطيور" : "Graines & Vitamines Oiseaux", link: "/products/birds" };
  };

  const rec = getProductRecommendation();

  return (
    <section className="py-12 bg-gradient-to-br from-[#121F18] via-[#1E2D24] to-[#0A120D] text-white rounded-3xl relative overflow-hidden my-12 shadow-2xl border border-white/10" dir={dir}>
      {/* Glow Orbs & Paw Decor */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#F5851F]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <PawPrint className="absolute top-6 left-6 w-20 h-20 text-white/5 rotate-[-20deg] pointer-events-none" />
      <PawPrint className="absolute bottom-6 right-6 w-24 h-24 text-white/5 rotate-[15deg] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#F1C290] border border-white/15 text-xs font-semibold mb-3 shadow-md">
            <Calculator className="w-4 h-4 text-[#F5851F]" />
            <span>{lang === "ar" ? "حاسبة التغذية الذكية 🥗" : "Calculateur Nutritionnel"}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            {lang === "ar" ? "احسب الاحتياج اليومي لحيوانك الأليف" : "Calculez les besoins de votre animal"}
          </h2>
          <p className="text-sm text-emerald-100/70">
            {lang === "ar"
              ? "اختر نوع حيوانك ووزنه لمعرفة كمية التغذية والماء الموصى بها بيطرياً يومياً."
              : "Sélectionnez votre animal pour obtenir sa portion quotidienne recommandée."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10">
          
          {/* ── LEFT (Inputs 7/12) ── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pet Selector */}
            <div>
              <label className="block text-xs font-bold text-[#F1C290] uppercase tracking-wider mb-2.5">
                1. {lang === "ar" ? "اختر نوع الحيوان" : "Type d'animal"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "cat", label: lang === "ar" ? "🐱 قطة" : "Chat", icon: "🐱" },
                  { id: "dog", label: lang === "ar" ? "🐶 كلب" : "Chien", icon: "🐶" },
                  { id: "bird", label: lang === "ar" ? "🦜 طائر" : "Oiseau", icon: "🦜" },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPetType(p.id as any)}
                    className={`py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border ${
                      petType === p.id
                        ? "bg-[#F5851F] text-white border-[#F5851F] shadow-lg shadow-[#F5851F]/30"
                        : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Weight Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#F1C290] uppercase tracking-wider">
                  2. {lang === "ar" ? "وزن الحيوان الأليف (كجم)" : "Poids (kg)"}
                </label>
                <span className="text-lg font-black text-white bg-emerald-500/20 px-3 py-0.5 rounded-full border border-emerald-500/30">
                  {weight} kg
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="40"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#F5851F]"
              />
            </div>

            {/* Age & Activity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#F1C290] uppercase tracking-wider mb-2">
                  3. {lang === "ar" ? "العمر" : "Âge"}
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value as any)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F5851F]"
                >
                  <option value="junior" className="bg-[#121F18] text-white">{lang === "ar" ? "صغير (أقل من سنة)" : "Junior"}</option>
                  <option value="adult" className="bg-[#121F18] text-white">{lang === "ar" ? "بالغ (1 - 7 سنوات)" : "Adulte"}</option>
                  <option value="senior" className="bg-[#121F18] text-white">{lang === "ar" ? "كبير (فوق 7 سنوات)" : "Senior"}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#F1C290] uppercase tracking-wider mb-2">
                  4. {lang === "ar" ? "نشاطه" : "Activité"}
                </label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value as any)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#F5851F]"
                >
                  <option value="low" className="bg-[#121F18] text-white">{lang === "ar" ? "هادئ / في المنزل" : "Calme"}</option>
                  <option value="normal" className="bg-[#121F18] text-white">{lang === "ar" ? "نشاط طبيعي" : "Normal"}</option>
                  <option value="high" className="bg-[#121F18] text-white">{lang === "ar" ? "نشيط جداً" : "Très actif"}</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── RIGHT (Results Card 5/12) ── */}
          <div className="lg:col-span-5 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-6 border border-white/15 shadow-xl space-y-5 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F1C290] bg-white/10 px-3 py-1 rounded-full border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#F5851F]" />
              <span>{lang === "ar" ? "النتيجة الموصى بها بيطرياً" : "Résultat Recommandé"}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-black/30 p-4 rounded-2xl border border-white/10">
                <Utensils className="w-6 h-6 text-[#F5851F] mx-auto mb-1" />
                <p className="text-2xl font-black text-white">{dailyPortion}g</p>
                <p className="text-[11px] text-white/60">{lang === "ar" ? "طعام / يومياً" : "Graines/Nourriture/j"}</p>
              </div>

              <div className="bg-black/30 p-4 rounded-2xl border border-white/10">
                <Droplets className="w-6 h-6 text-sky-400 mx-auto mb-1" />
                <p className="text-2xl font-black text-white">{dailyWater}ml</p>
                <p className="text-[11px] text-white/60">{lang === "ar" ? "ماء نقي / يومياً" : "Eau fraîche/j"}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <p className="text-xs text-emerald-200/80 mb-3 leading-relaxed">
                {lang === "ar"
                  ? "تصفح تشكيلة الأغذية المصممة لتربية صحية وسليمة:"
                  : "Découvrez nos produits adaptés :"}
              </p>
              <Link
                href={rec.link}
                className="w-full bg-gradient-to-r from-[#F5851F] to-[#E06A0A] text-white py-3 rounded-2xl font-bold text-xs sm:text-sm hover:opacity-95 transition-all shadow-lg shadow-[#F5851F]/30 inline-flex items-center justify-center gap-2"
              >
                <span>{rec.label}</span>
                <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
