"use client"

import { useEffect } from "react"
import { Inter, Playfair_Display, Noto_Naskh_Arabic } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { I18nProvider, useI18n } from "@/lib/i18n-context"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const notoArabic = Noto_Naskh_Arabic({ subsets: ["arabic"], variable: "--font-arabic" })

function HtmlWrapper({ children }: { children: React.ReactNode }) {
  const { dir, lang } = useI18n()

  useEffect(() => {
    document.documentElement.dir = dir
    document.documentElement.lang = lang
  }, [dir, lang])

  return <>{children}</>
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${inter.variable} ${playfair.variable} ${notoArabic.variable}`}>
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
