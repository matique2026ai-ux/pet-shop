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
    default: "طيور الجمال والجواد | Tawra Al-Jamal Wa Al-Jawad",
    template: "%s | طيور الجمال والجواد",
  },
  alternates: {
    languages: {
      en: "/",
      fr: "/",
      ar: "/",
    },
  },
  description: "طيور الجمال والجواد — المتجر الإلكتروني الرائد في الجزائر لكل ما يخص الحيوانات الأليفة والخيول. أغذية، إكسسوارات، ورعاية بيطرية متكاملة.",
  keywords: ["طيور الجمال والجواد", "متجر حيوانات أليفة سطيف", "عيادة بيطرية سطيف", "Tawra Al-Jamal Wa Al-Jawad", "مستلزمات الخيول والحيوانات الأليفة", "توصيل سريع سطيف", "pet shop horses Algeria"],
  other: {
    "geo.region": "DZ-19",
    "geo.placename": "Sétif",
    "geo.position": "36.1898;5.4123",
    "ICBM": "36.1898, 5.4123",
    "language": "ar, fr, en",
  },
  openGraph: {
    title: "طيور الجمال والجواد | Tawra Al-Jamal Wa Al-Jawad",
    description: "متجر إلكتروني متكامل للحيوانات الأليفة والخيول في الجزائر. جودة، مصداقية، وتوصيل سريع.",
    url: "https://www.tawra-aljamal.com",
    siteName: "طيور الجمال والجواد",
    locale: "ar_DZ",
    type: "website",
    images: [{ url: "https://www.tawra-aljamal.com/favicon.svg", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "طيور الجمال والجواد | Tawra Al-Jamal Wa Al-Jawad",
    description: "متجر إلكتروني متكامل للحيوانات الأليفة والخيول في الجزائر.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cairo.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="font-outfit bg-white text-slate-800 antialiased">
        <I18nProvider>
          <CartProvider>
            <AuthProvider>
            <OrganizationSchema />
            <WebSiteSchema />
            <LocalBusinessSchema />
            <Navbar />
            <main className="min-h-screen app-shell">{children}</main>
            <Footer />
            <WhatsAppButton />
            <CookieConsent />
            </AuthProvider>
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
