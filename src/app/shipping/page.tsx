"use client";

import { useI18n } from "@/lib/i18n-context";
import AnimatedSection from "@/components/animated-section";
import { Truck, RotateCcw, CreditCard, Sparkles, CheckCircle } from "lucide-react";

const icons = [<Truck className="w-6 h-6" />, <RotateCcw className="w-6 h-6" />, <CreditCard className="w-6 h-6" />];

export default function ShippingPage() {
  const { t, dir } = useI18n();

  return (
    <div>
      <section className="relative overflow-hidden py-16 lg:py-24 flex items-center min-h-[50vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e6f5f5] via-[#f5f5f5] to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#008080]/10 rounded-full text-sm text-[#008080] border border-[#008080]/15 mb-4">
              <Sparkles className="w-4 h-4" /> {t.shipping.title}
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold text-[#008080] mb-4 leading-tight">{t.shipping.title}</h1>
            <p className="text-gray-600 text-lg max-w-lg leading-relaxed">{t.shipping.subtitle}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-16 lg:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-[#008080] mb-6 text-center">{t.shipping.deliveryTableTitle}</h2>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" dir={dir}>
                  <thead>
                     <tr className="bg-[#e6f5f5] text-[#006666]">
                      <th className="text-right font-semibold py-3 px-4">{t.shipping.deliveryTableHeaders.region}</th>
                      <th className="text-right font-semibold py-3 px-4">{t.shipping.deliveryTableHeaders.eta}</th>
                      <th className="text-right font-semibold py-3 px-4">{t.shipping.deliveryTableHeaders.fee}</th>
                      <th className="text-right font-semibold py-3 px-4">{t.shipping.deliveryTableHeaders.free}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(t.shipping.deliveryTable as unknown as { region: string; eta: string; fee: string; free: string }[]).map((row, i) => (
                      <tr key={i} className={i % 2 === 1 ? "bg-gray-50/60" : ""}>
                        <td className="py-3 px-4 font-medium text-gray-900">{row.region}</td>
                        <td className="py-3 px-4 text-gray-600">{row.eta}</td>
                        <td className="py-3 px-4 text-gray-600">{row.fee}</td>
                        <td className="py-3 px-4 text-[#008080] font-medium">{row.free}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6">
            {(t.shipping.sections as unknown as { title: string; text: string }[]).map((s, i) => (
              <AnimatedSection key={i}>
                <div
                  className="bg-white rounded-2xl p-6 lg:p-8 flex items-start gap-5 transition-all duration-300 hover:-translate-y-0.5"
                  style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
                >
                  <span className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-white"
                    style={{ background: "linear-gradient(135deg, #008080, #FF7F50)" }}
                  >
                    {icons[i] || icons[0]}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-[#008080] mb-3">{s.title}</h2>
                    <div className="text-gray-600 leading-loose text-[15px]">
                      {s.text.split(". ").map((sentence: string, j: number) => (
                        <p key={j} className="mb-3 last:mb-0">{sentence}.</p>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="mt-12 bg-[#e6f5f5] rounded-3xl p-8 lg:p-10 text-center border border-[#b3e0e0]">
              <div className="w-14 h-14 bg-[#008080]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-[#008080]" />
              </div>
              <h2 className="text-2xl font-bold text-[#008080] mb-2">{t.shipping.title}</h2>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                {t.shipping.subtitle}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
