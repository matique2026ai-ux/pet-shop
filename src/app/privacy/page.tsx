"use client";

import { useI18n } from "@/lib/i18n-context";
import AnimatedSection from "@/components/animated-section";
import { Shield, Clock, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  const { t, dir } = useI18n();

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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1A2E] via-[#2D2B45] to-[#1A1A2E] py-20 lg:py-24">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#C4933F] rounded-full opacity-5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#DFB96A] rounded-full opacity-5 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 bg-[#C4933F]/20 backdrop-blur-sm border border-[#C4933F]/40 text-[#DFB96A] rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              {privacyData.heroBadge}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5 drop-shadow-lg">
              {privacyData.title}
            </h1>
            <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto mb-4">
              {privacyData.subtitle}
            </p>
            <div className="flex items-center justify-center gap-1.5 text-xs text-white/50">
              <Clock className="w-3.5 h-3.5" />
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
                <div key={idx} className="group relative pl-4 border-l-2 border-transparent hover:border-[#C4933F] transition-colors duration-300">
                  <h2 className="text-lg sm:text-xl font-bold text-[#0B1E36] mb-3 flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[#C4933F]/10 text-[#C4933F] flex items-center justify-center text-xs font-bold shrink-0">
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
                <FileText className="w-6 h-6 text-[#C4933F] shrink-0 mt-0.5" />
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
                className="inline-flex items-center gap-2 text-xs font-extrabold text-[#C4933F] hover:text-[#A87A2E] transition-colors"
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
