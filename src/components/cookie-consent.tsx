"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { setCookie, getCookie } from "@/lib/cookies";

const KEY = "pawswings-consent";

export default function CookieConsent() {
  const { t, lang } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem(KEY) || getCookie("consent");
    if (!existing) setVisible(true);
    const handler = () => {
      localStorage.removeItem(KEY);
      setVisible(true);
    };
    window.addEventListener("open-cookie-settings", handler);
    return () => window.removeEventListener("open-cookie-settings", handler);
  }, []);

  const choose = (value: "accepted" | "refused") => {
    localStorage.setItem(KEY, value);
    setCookie("consent", value, 365);
    if (value === "accepted") {
      setCookie("lang", lang, 365);
      const cart = localStorage.getItem("cart");
      if (cart) setCookie("cart", cart, 7);
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[70] bg-stone-900/95 backdrop-blur border-t border-stone-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-stone-200 flex-1 leading-relaxed">{t.cookies.desc}</p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => choose("refused")}
            className="px-4 py-2 rounded-lg border border-stone-600 text-stone-200 text-sm hover:bg-stone-800 transition-colors"
          >
            {t.cookies.refuse}
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            {t.cookies.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
