"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import AnimatedSection from "@/components/animated-section";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function FAQPage() {
  const { t, dir } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="bg-[#F8F7F4] min-h-screen" dir={dir}>

      {/* ═══════════════════════════════
          HERO
      ═══════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1A2E] via-[#2D2B45] to-[#1A1A2E] py-20 lg:py-28">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#C4933F] rounded-full opacity-5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#DFB96A] rounded-full opacity-5 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 bg-[#C4933F]/20 backdrop-blur-sm border border-[#C4933F]/40 text-[#DFB96A] rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              {t.faq.title}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-5 drop-shadow-lg">
              {t.faq.title}
            </h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto">
              {t.faq.subtitle}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════
          FAQ ACCORDION
      ═══════════════════════════════ */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="space-y-3">
              {(t.faq.items as unknown as { q: string; a: string }[]).map((item, i) => (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                    openIndex === i
                      ? "bg-white border-[#C4933F]/40 shadow-md shadow-[#C4933F]/10"
                      : "bg-white border-[#ECDCAE] hover:border-[#C4933F]/30 hover:shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-start"
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        openIndex === i
                          ? "bg-gradient-to-br from-[#C4933F] to-[#DFB96A] text-white"
                          : "bg-[#FBF8F3] text-[#C4933F]"
                      }`}>
                        <HelpCircle className="w-4 h-4" />
                      </span>
                      <span className="font-semibold text-[#1A1A2E] text-sm leading-snug text-start">{item.q}</span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-all duration-300 ${
                        openIndex === i ? "rotate-180 text-[#C4933F]" : "text-[#9E9282]"
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === i ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-5 pt-0 text-sm text-[#7A6F61] leading-relaxed border-t border-[#F0EDE6] ms-10">
                      {item.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Contact CTA */}
          <AnimatedSection>
            <div className="mt-12 text-center bg-gradient-to-br from-[#1A1A2E] to-[#2D2B45] rounded-3xl p-8 border border-[#C4933F]/20">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C4933F] to-[#DFB96A] flex items-center justify-center text-white mx-auto mb-4 shadow-md">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {dir === "rtl" ? "لم تجد ما تبحث عنه؟" : "Vous n'avez pas trouvé votre réponse ?"}
              </h3>
              <p className="text-white/60 text-sm mb-5">
                {dir === "rtl" ? "تواصل معنا مباشرة وسنجيب على أسئلتك" : "Contactez-nous directement et nous vous répondrons"}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C4933F] to-[#A87A2E] text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 transition-all shadow-md shadow-[#C4933F]/30 hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4" />
                {dir === "rtl" ? "تواصل معنا" : "Nous contacter"}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
