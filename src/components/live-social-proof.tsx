"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag, X, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

const DEMO_PURCHASES = [
  { name: "أحمد م.", city: "سطيف (حي الهضاب)", item: "قفص عصافير ملون صغير", time: "منذ 4 دقائق", image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=150&auto=format&fit=crop&q=80" },
  { name: "سارة ك.", city: "سطيف (عين التبني)", item: "طعام قطط رطب بالدجاج والجبن", time: "منذ 8 دقائق", image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=150&auto=format&fit=crop&q=80" },
  { name: "كريم ب.", city: "العلمة", item: "حبوب وفيتامينات طيور كناري", time: "منذ 12 دقيقة", image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=150&auto=format&fit=crop&q=80" },
  { name: "فاطمة الزهراء", city: "سطيف (وسط المدينة)", item: "مكافأة مصاصة دجاج ولحم", time: "منذ 15 دقيقة", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&auto=format&fit=crop&q=80" },
  { name: "ياسين ع.", city: "عين ولمان", item: "شامبو بيطري للحيوانات الأليفة", time: "منذ 22 دقيقة", image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&auto=format&fit=crop&q=80" },
];

export default function LiveSocialProof() {
  const { lang, dir } = useI18n();
  const [current, setCurrent] = useState<typeof DEMO_PURCHASES[0] | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show first toast after 10s
    const firstTimer = setTimeout(() => {
      showRandomToast();
    }, 10000);

    // Show recurring toast every 35s
    const interval = setInterval(() => {
      showRandomToast();
    }, 35000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  const showRandomToast = () => {
    const random = DEMO_PURCHASES[Math.floor(Math.random() * DEMO_PURCHASES.length)];
    setCurrent(random);
    setVisible(true);

    // Auto dismiss after 6s
    setTimeout(() => {
      setVisible(false);
    }, 6500);
  };

  if (!visible || !current) return null;

  return (
    <div
      className="fixed bottom-24 left-4 sm:bottom-8 sm:left-8 z-40 max-w-[320px] w-full bg-white/80 backdrop-blur-xl rounded-2xl p-3 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-in slide-in-from-bottom-8 fade-in duration-500 rtl:right-4 rtl:left-auto sm:rtl:right-8 sm:rtl:left-auto"
      dir={dir}
    >
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 rtl:right-auto rtl:left-2 p-1.5 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-100/50 transition-colors z-10"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-3.5 relative z-0">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#E3602D] to-[#F1C290] rounded-xl opacity-30 blur-sm animate-pulse" />
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm shrink-0">
            <Image src={current.image} alt={current.item} fill className="object-cover" sizes="56px" />
          </div>
        </div>

        <div className="flex-1 min-w-0 pr-5 rtl:pr-0 rtl:pl-5">
          <div className="flex items-center gap-1 mb-1">
            <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
              <CheckCircle2 className="w-2.5 h-2.5" />
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {lang === "ar" ? "شراء مؤكد" : "Achat Vérifié"}
            </span>
          </div>

          <h4 className="text-sm font-extrabold text-[#1A1A2E] truncate mb-0.5 leading-tight">
            {current.name}
          </h4>
          
          <p className="text-xs font-medium text-gray-700 truncate mb-1">
            {current.item}
          </p>

          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{current.city} • {current.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
