import type { Metadata } from "next";
import { Cairo, Outfit } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n-context";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import WhatsAppButton from "@/components/whatsapp-button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CookieConsent from "@/components/cookie-consent";
import { OrganizationSchema, WebSiteSchema, LocalBusinessSchema } from "@/components/schema-jsonld";
import Script from "next/script";

import { FavoritesProvider } from "@/lib/favorites-context";
import FloatingCart from "@/components/floating-cart";
import PlayfulPets from "@/components/playful-pets";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});



const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});



export const metadata: Metadata = {
  title: {
    default: "مخالب وأجنحة | Paws & Wings",
    template: "%s | مخالب وأجنحة",
  },
  alternates: {
    languages: {
      en: "/",
      fr: "/",
      ar: "/",
    },
  },
  icons: {
    icon: "/logo-badge.png",
    shortcut: "/logo-badge.png",
    apple: "/logo-badge.png",
  },
  description: "مخالب وأجنحة — المتجر الإلكتروني الرائد في الجزائر لكل ما يخص الحيوانات الأليفة والخيول. أغذية، إكسسوارات، ورعاية بيطرية متكاملة.",
  keywords: ["مخالب وأجنحة", "متجر حيوانات أليفة سطيف", "عيادة بيطرية سطيف", "Paws & Wings", "مستلزمات الخيول والحيوانات الأليفة", "توصيل سريع سطيف", "pet shop horses Algeria"],
  other: {
    "geo.region": "DZ-19",
    "geo.placename": "Sétif",
    "geo.position": "36.1898;5.4123",
    "ICBM": "36.1898, 5.4123",
    "language": "ar, fr, en",
  },
  openGraph: {
    title: "مخالب وأجنحة | Paws & Wings",
    description: "متجر إلكتروني متكامل للحيوانات الأليفة والخيول في الجزائر. جودة، مصداقية، وتوصيل سريع.",
    url: "https://www.tawra-aljamal.com",
    siteName: "مخالب وأجنحة",
    locale: "ar_DZ",
    type: "website",
    images: [{ url: "https://www.tawra-aljamal.com/favicon.svg", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "مخالب وأجنحة | Paws & Wings",
    description: "متجر إلكتروني متكامل للحيوانات الأليفة والخيول في الجزائر.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import LiveSocialProof from "@/components/live-social-proof";
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cairo.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="font-outfit bg-surface text-slate-800 antialiased">
        <I18nProvider>
          <CartProvider>
            <FavoritesProvider>
              <AuthProvider>
              <OrganizationSchema />
              <WebSiteSchema />
              <LocalBusinessSchema />
              <Navbar />
              <main className="min-h-screen app-shell">{children}</main>
              <Footer />
              <WhatsAppButton />
              <CookieConsent />
              <GlobalFootprints />
              <FloatingCart />
              <PlayfulPets />
              <LiveSocialProof />
              <Toaster position="top-center" richColors />
              </AuthProvider>
            </FavoritesProvider>
          </CartProvider>
        </I18nProvider>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');`}
            </Script>
      </body>
    </html>
  );
}

function MixedFootprint({ type, className }: { type: "cat" | "dog" | "bird"; className: string }) {
  if (type === "bird") {
    return (
      <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none"
        className={`${className} pointer-events-none select-none z-0`}
        aria-hidden="true">
        <line x1="12" y1="4" x2="12" y2="20" />
        <line x1="12" y1="12" x2="6" y2="8" />
        <line x1="12" y1="12" x2="18" y2="8" />
        <line x1="12" y1="16" x2="8" y2="19" />
        <line x1="12" y1="16" x2="16" y2="19" />
      </svg>
    );
  }
  
  const path = "M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3zm-4.5-3c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm9 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-6.5-3.5C9.17 7.5 8.5 8.17 8.5 9s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm4 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z";
  
  return (
    <svg viewBox="0 0 24 24" fill="currentColor"
      className={`${className} pointer-events-none select-none z-0`}
      aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function GlobalFootprints() {
  return (
    <div className="fixed inset-0 pointer-events-none select-none z-[-1] overflow-hidden opacity-[0.15]">
      {/* Scattered watermarks */}
      <MixedFootprint type="cat" className="absolute top-[12%] left-[4%] w-24 h-24 rotate-[15deg] text-[#E3602D]/20" />
      <MixedFootprint type="dog" className="absolute top-[28%] right-[6%] w-28 h-28 rotate-[-25deg] text-[#E3602D]/15" />
      <MixedFootprint type="bird" className="absolute top-[52%] left-[10%] w-20 h-20 rotate-[40deg] text-[#E3602D]/15" />
      <MixedFootprint type="cat" className="absolute top-[72%] right-[10%] w-24 h-24 rotate-[-15deg] text-[#E3602D]/12" />
      <MixedFootprint type="dog" className="absolute bottom-[8%] left-[5%] w-28 h-28 rotate-[30deg] text-[#E3602D]/15" />
      <MixedFootprint type="bird" className="absolute bottom-[22%] right-[4%] w-24 h-24 rotate-[-35deg] text-[#E3602D]/20" />
    </div>
  );
}
