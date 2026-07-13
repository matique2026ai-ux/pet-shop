"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import AnimatedSection from "@/components/animated-section";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

const faqItems: { q: string; a: string }[] = [
  {
    q: "What payment methods do you accept?",
    a: "We accept cash on delivery (COD) and bank transfers across Algeria.",
  },
  {
    q: "How long does delivery take?",
    a: "Delivery takes 2-5 business days depending on your wilaya (province).",
  },
  {
    q: "What is your return policy?",
    a: "You can return unused products within 7 days of delivery. Contact us to initiate a return.",
  },
  {
    q: "Do you deliver outside Algeria?",
    a: "Currently we only deliver within Algeria. International delivery coming soon.",
  },
  {
    q: "How can I track my order?",
    a: "After placing an order, we'll contact you by phone to confirm delivery details.",
  },
  {
    q: "Are your products authentic?",
    a: "Yes, all our products are sourced from trusted brands and verified suppliers.",
  },
  {
    q: "Can I cancel my order?",
    a: "You can cancel within 24 hours of placing the order. After that, it's already being processed.",
  },
  {
    q: "Do you have a physical store?",
    a: "Yes, visit our store in Algiers. Check the Contact page for details.",
  },
];

export default function FAQPage() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div>
      <section className="relative overflow-hidden py-16 lg:py-24 flex items-center min-h-[50vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-full text-sm text-emerald-200 border border-white/10 mb-4">
              <Sparkles className="w-4 h-4" /> {t.faq.title}
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">{t.faq.title}</h1>
            <p className="text-emerald-100/70 text-lg max-w-lg">{t.faq.subtitle}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden transition-all duration-300"
                  style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
                >
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-gray-900 text-sm">{item.q}</span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                        openIndex === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === i ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-5 pt-0 text-sm text-gray-500 leading-relaxed border-t border-gray-100 ml-11 pl-0">
                      {item.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
