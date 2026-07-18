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
    <div className={`fixed bottom-4 sm:bottom-6 ${lang === "ar" ? "right-4 sm:right-6" : "left-4 sm:left-6"} z-[70] w-[calc(100%-2rem)] sm:w-80 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-5`} dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-white/10 rounded-full shrink-0">
          <svg className="w-4 h-4 text-[#F1C290]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">{t.cookies.desc}</p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="flex-1 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#F5851F] to-[#E06A0A] text-white text-xs font-bold hover:opacity-90 transition-all shadow-lg"
        >
          {t.cookies.accept}
        </button>
        <button
          type="button"
          onClick={() => choose("refused")}
          className="flex-1 px-3 py-2.5 rounded-xl border border-white/20 text-white text-xs font-medium hover:bg-white/10 transition-colors"
        >
          {t.cookies.refuse}
        </button>
      </div>
    </div>
  );
}
