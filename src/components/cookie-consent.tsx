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
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] w-[calc(100%-2rem)] max-w-lg bg-stone-900/95 backdrop-blur rounded-2xl border border-stone-700 shadow-2xl p-5">
      <p className="text-sm text-stone-200 leading-relaxed">{t.cookies.desc}</p>
      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => choose("refused")}
          className="flex-1 px-4 py-2.5 rounded-xl border border-stone-600 text-stone-200 text-sm hover:bg-stone-800 transition-colors"
        >
          {t.cookies.refuse}
        </button>
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          {t.cookies.accept}
        </button>
      </div>
    </div>
  );
}
