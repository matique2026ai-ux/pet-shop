"use client"

import { useEffect } from "react"
import { Inter, Playfair_Display, Tajawal } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { I18nProvider, useI18n } from "@/lib/i18n-context"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const tajawal = Tajawal({ subsets: ["arabic"], weight: ["200", "300", "400", "500", "700", "800", "900"], variable: "--font-arabic" })

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
    <html className={`${inter.variable} ${playfair.variable} ${tajawal.variable}`}>
      <body className="font-sans antialiased bg-neutral-50 text-neutral-900">
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
