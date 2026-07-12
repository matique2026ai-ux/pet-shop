"use client"

import { useEffect } from "react"
import { Playfair_Display, Outfit, Noto_Sans_Arabic } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { I18nProvider, useI18n } from "@/lib/i18n-context"

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-body" })
const notoSansArabic = Noto_Sans_Arabic({ subsets: ["arabic"], weight: ["300", "400", "500", "600", "700"], variable: "--font-arabic" })

function HtmlWrapper({ children }: { children: React.ReactNode }) {
  const { dir, lang } = useI18n()

  useEffect(() => {
    document.documentElement.dir = dir
    document.documentElement.lang = lang
    document.documentElement.classList.toggle("lang-ar", lang === "ar")
  }, [dir, lang])

  return <>{children}</>
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${playfair.variable} ${outfit.variable} ${notoSansArabic.variable}`}>
      <body className="font-body antialiased bg-cream text-brown-900">
        <I18nProvider>
          <HtmlWrapper>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </HtmlWrapper>
        </I18nProvider>
      </body>
    </html>
  )
}
