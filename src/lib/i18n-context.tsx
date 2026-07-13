"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { en } from "./translations/en";
import { fr } from "./translations/fr";
import { ar } from "./translations/ar";

type Language = "en" | "fr" | "ar";
type DeepStringify<T> = { [K in keyof T]: T[K] extends string ? string : T[K] extends object ? DeepStringify<T[K]> : never };
type Translations = DeepStringify<typeof en>;

const translations: Record<Language, Translations> = { en: en as unknown as Translations, fr: fr as unknown as Translations, ar: ar as unknown as Translations };

interface I18nContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: Translations;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: en,
  dir: "ltr",
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language | null;
    if (saved && saved in translations) setLang(saved);
  }, []);

  const setLangPersist = (l: Language) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  const t = translations[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ lang, setLang: setLangPersist, t, dir }}>
      <div dir={dir}>{children}</div>
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
