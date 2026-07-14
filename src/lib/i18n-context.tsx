"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { en } from "./translations/en";
import { fr } from "./translations/fr";
import { ar } from "./translations/ar";
import { setCookie } from "./cookies";

type Language = "en" | "fr" | "ar";
type DeepStringify<T> = { [K in keyof T]: T[K] extends string ? string : T[K] extends object ? DeepStringify<T[K]> : never };
type Translations = DeepStringify<typeof en>;

const translations: Record<Language, Translations> = { en: en as unknown as Translations, fr: fr as unknown as Translations, ar: ar as unknown as Translations };

const currencyMap: Record<Language, string> = { en: "د.ج", fr: "د.ج", ar: "د.ج" };

export type TranslationOverrides = Record<Language, Record<string, string>>;

interface I18nContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: Translations;
  dir: "ltr" | "rtl";
  currency: string;
  overrides: TranslationOverrides;
  reloadOverrides: () => void;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: en,
  dir: "ltr",
  currency: "$",
  overrides: { en: {}, fr: {}, ar: {} },
  reloadOverrides: () => {},
});

function deepClone<T>(o: T): T {
  return JSON.parse(JSON.stringify(o));
}

function applyOverrides(base: Translations, ov: Record<string, string> | undefined): Translations {
  if (!ov || Object.keys(ov).length === 0) return base;
  const clone = deepClone(base) as any;
  for (const [path, val] of Object.entries(ov)) {
    const parts = path.split(".");
    let cur = clone;
    for (let i = 0; i < parts.length - 1; i++) {
      if (typeof cur[parts[i]] !== "object" || cur[parts[i]] === null) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = val;
  }
  return clone as Translations;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const [overrides, setOverrides] = useState<TranslationOverrides>({ en: {}, fr: {}, ar: {} });

  const loadOverrides = () => {
    fetch("/api/settings?key=translations", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d && d.value && typeof d.value === "object") {
          setOverrides({
            en: d.value.en || {},
            fr: d.value.fr || {},
            ar: d.value.ar || {},
          });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language | null;
    if (saved && saved in translations) {
      setLang(saved);
    } else {
      const navLang = navigator.language.slice(0, 2);
      if (navLang === "ar") setLang("ar");
      else if (navLang === "fr") setLang("fr");
    }
    loadOverrides();
  }, []);

  const setLangPersist = (l: Language) => {
    setLang(l);
    localStorage.setItem("lang", l);
    setCookie("lang", l, 365);
  };

  const t = applyOverrides(translations[lang], overrides[lang]);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const currency = currencyMap[lang];

  return (
    <I18nContext.Provider value={{ lang, setLang: setLangPersist, t, dir, currency, overrides, reloadOverrides: loadOverrides }}>
      <div dir={dir}>{children}</div>
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
