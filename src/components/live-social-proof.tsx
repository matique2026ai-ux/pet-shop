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
      className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40 max-w-xs sm:max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-gray-200/80 shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 rtl:right-4 rtl:left-auto sm:rtl:right-6 sm:rtl:left-auto"
      dir={dir}
    >
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 rtl:right-auto rtl:left-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-emerald-50 shrink-0 border border-emerald-100">
          <Image src={current.image} alt={current.item} fill className="object-cover" sizes="48px" />
        </div>

        <div className="flex-1 min-w-0 pr-4 rtl:pr-0 rtl:pl-4">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mb-0.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{current.name} · {current.city}</span>
          </div>

          <p className="text-xs font-bold text-gray-900 truncate mb-0.5">
            {current.item}
          </p>

          <p className="text-[10px] text-gray-400 flex items-center gap-1">
            <ShoppingBag className="w-3 h-3 text-orange-500" />
            <span>{lang === "ar" ? `قام بشراء هذا المنتج ${current.time}` : `A acheté cet article ${current.time}`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
