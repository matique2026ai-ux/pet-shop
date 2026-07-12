"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Phone, PawPrint, Globe } from "lucide-react"
import { useI18n, type Lang } from "@/lib/i18n-context"

const langs: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
]

const navLinks = [
  { href: "/", key: "home" },
  { href: "/products", key: "shop" },
  { href: "/vet", key: "vet" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const

export default function Navbar() {
  const { t, lang, setLang } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-cream/90 backdrop-blur-md shadow-lg shadow-brown-900/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-18 md:h-20">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-gradient-to-br from-brown-600 to-brown-800 rounded-xl flex items-center justify-center shadow-lg shadow-brown-600/25">
              <PawPrint className="w-5 h-5 text-cream" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-heading font-bold leading-tight tracking-tight text-brown-900">Paws & Wings</span>
              <span className="text-[10px] text-brown-500 font-medium tracking-widest uppercase">{t.nav.callUs}</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-brown-700 hover:text-brown-900 rounded-lg hover:bg-brown-100/50 transition-all duration-200 relative group"
              >
                {t.nav[link.key]}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-brown-500 rounded-full group-hover:w-3/4 transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-brown-600 hover:text-brown-800 rounded-lg hover:bg-brown-100/50 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{langs.find(l => l.code === lang)?.label}</span>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div className="absolute top-full right-0 mt-1 bg-cream rounded-xl shadow-xl border border-brown-200 z-20 py-1 min-w-[110px]">
                    {langs.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangOpen(false) }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          lang === l.code ? "text-brown-800 bg-brown-100 font-semibold" : "text-brown-700 hover:bg-brown-50"
                        }`}
                      >
                        {l.label} — {l.code === "en" ? "English" : l.code === "fr" ? "Français" : "العربية"}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <a href="tel:+213555123456"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-brown-800 text-cream text-sm font-medium rounded-full hover:bg-brown-900 transition-all duration-200 shadow-lg shadow-brown-800/20">
              <Phone className="w-3.5 h-3.5" />
              <span>{t.nav.callUs}</span>
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-brown-100/50 transition-colors text-brown-700"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-brown-900/30 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className={`fixed top-0 h-full w-72 bg-cream z-50 shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${
          mobileOpen ? "translate-x-0" : lang === "ar" ? "-translate-x-full" : "translate-x-full"
        }`}
        style={lang === "ar" ? {} : {}}
      >
        <div className="p-6 pt-20">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-base font-medium text-brown-700 hover:text-brown-900 hover:bg-brown-100 rounded-xl transition-all"
              >
                {t.nav[link.key]}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex gap-2">
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                  lang === l.code ? "bg-brown-800 text-cream border-brown-800" : "border-brown-200 text-brown-600 hover:border-brown-400"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-brown-200">
            <a href="tel:+213555123456"
              className="flex items-center gap-3 px-4 py-3 bg-brown-800 text-cream rounded-xl font-medium hover:bg-brown-900 transition-colors">
              <Phone className="w-4 h-4" />
              +213 555 12 34 56
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
