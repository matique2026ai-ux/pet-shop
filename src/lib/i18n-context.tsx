"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import en from "./translations/en"
import fr from "./translations/fr"
import ar from "./translations/ar"

export type Lang = "en" | "fr" | "ar"

const translations: Record<Lang, typeof en> = { en, fr, ar }

interface I18nContextType {
  lang: Lang
  t: typeof en
  dir: "ltr" | "rtl"
  setLang: (lang: Lang) => void
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  t: en,
  dir: "ltr",
  setLang: () => {},
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en")

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null
    if (saved && ["en", "fr", "ar"].includes(saved)) setLangState(saved)
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem("lang", l)
  }, [])

  const t = translations[lang]
  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr"

  return (
    <I18nContext.Provider value={{ lang, t, dir, setLang }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => useContext(I18nContext)
