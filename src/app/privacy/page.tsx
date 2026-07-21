"use client";

import { useI18n } from "@/lib/i18n-context";
import AnimatedSection from "@/components/animated-section";
import { Shield, Clock, FileText, CheckCircle, PawPrint, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  const { t, dir, lang } = useI18n();

  // Safeguard against missing translation keys
  const privacyData = (t as any).privacy || {
    title: "Privacy Policy",
    subtitle: "How we collect, use, and protect your information.",
    heroBadge: "Privacy Protected",
    lastUpdated: "Last updated",
    sections: []
  };

  const sections = (privacyData.sections || []) as { title: string; text: string }[];

  return (
    <div className="bg-[#F8F7F4] min-h-screen pb-20" dir={dir}>
      {/* ═══════════════════════════════
          HERO
      ═══════════════════════════════ */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-[#0F1913] via-[#1C2C22] to-[#0A120D] text-white">
        {/* Glow & Paw Decor */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F5851F]/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
        <PawPrint className="absolute top-8 left-[6%] w-24 h-24 text-white/5 rotate-[-20deg] pointer-events-none select-none" />
        <PawPrint className="absolute bottom-8 right-[8%] w-32 h-32 text-white/5 rotate-[15deg] pointer-events-none select-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs sm:text-sm font-semibold text-[#F1C290] border border-white/15 mb-6 shadow-xl">
              <Shield className="w-4 h-4 text-[#F5851F]" />
              <span>{privacyData.heroBadge}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-xl">
              {privacyData.title}
            </h1>
            <p className="text-base sm:text-xl text-emerald-100/70 max-w-xl mx-auto mb-5 font-light leading-relaxed">
              {privacyData.subtitle}
            </p>
            <div className="flex items-center justify-center gap-1.5 text-xs text-white/60 font-medium">
              <Clock className="w-4 h-4 text-[#F1C290]" />
              <span>{privacyData.lastUpdated}</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════
          CONTENT
      ═══════════════════════════════ */}
      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-white rounded-3xl border border-[#F0EDE6] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-6 sm:p-10 space-y-8">
              {sections.map((section, idx) => (
                <div key={idx} className="group relative pl-4 border-l-2 border-transparent hover:border-[#E3602D] transition-colors duration-300">
                  <h2 className="text-lg sm:text-xl font-bold text-[#1E2D24] mb-3 flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[#E3602D]/10 text-[#E3602D] flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    {section.title}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed pl-8">
                    {section.text}
                  </p>
                </div>
              ))}
              
              {/* Extra legal note for Algerian compliance */}
              <div className="mt-10 p-5 rounded-2xl bg-[#FBF8F3] border border-[#ECDCAE]/40 flex items-start gap-4">
                <FileText className="w-6 h-6 text-[#E3602D] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#8A6022] mb-1">
                    {dir === "rtl" ? "التزام بالشفافية القانونية" : "Engagement de Transparence"}
                  </h4>
                  <p className="text-xs text-[#7A6F61] leading-relaxed">
                    {dir === "rtl" 
                      ? "يتعهّد موقع طيور الجمال والجواد بالمعالجة النزيهة للبيانات الشخصية ووضعها فقط في خدمة تأكيد وتنفيذ عقود البيع الإلكتروني وتفادي أي استخدام تجاري دون موافقة صريحة من العميل."
                      : "Paws & Wings s'engage à traiter de bonne foi les données personnelles exclusivement pour la validation et l'exécution des contrats de vente électronique, en évitant toute utilisation commerciale non sollicitée."}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Back to Home CTA */}
          <AnimatedSection>
            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-[#E3602D] hover:text-[#A87A2E] transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                {dir === "rtl" ? "العودة إلى الصفحة الرئيسية" : "Retour à l'accueil"}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
