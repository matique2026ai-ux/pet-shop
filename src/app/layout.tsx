import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n-context";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import WhatsAppButton from "@/components/whatsapp-button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CookieConsent from "@/components/cookie-consent";
import { OrganizationSchema, WebSiteSchema, VeterinaryClinicSchema, LocalBusinessSchema } from "@/components/schema-jsonld";
import Script from "next/script";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Paws & Wings | Pet Shop & Veterinary Clinic",
    template: "%s | Paws & Wings",
  },
  alternates: {
    languages: {
      en: "/",
      fr: "/",
      ar: "/",
    },
  },
  description: "Paws & Wings — أفضل محل مستلزمات الحيوانات الأليفة وعيادة بيطرية في سطيف والجزائر. أغذية، ألعاب، إكسسوارات للقطط والكلاب والطيور والأسماك، مع توصيل سريع.",
  keywords: ["محل حيوانات أليفة سطيف", "عيادة بيطرية سطيف", "pet shop Sétif", "veterinary clinic Algeria", "Paws & Wings", "مستلزمات القطط والكلاب", "animalerie Sétif Algérie", "توصيل حيوانات أليفة", "pet supplies Algeria"],
  other: {
    "geo.region": "DZ-19",
    "geo.placename": "Sétif",
    "geo.position": "36.1898;5.4123",
    "ICBM": "36.1898, 5.4123",
    "language": "fr, ar, en",
  },
  openGraph: {
    title: "Paws & Wings | Pet Shop & Veterinary Clinic",
    description: "Premium pet products and veterinary care for cats, dogs, birds, fish, and small pets.",
    url: "https://www.pawsandwings.com",
    siteName: "Paws & Wings",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://www.pawsandwings.com/placeholder.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paws & Wings | Pet Shop & Veterinary Clinic",
    description: "Premium pet products and veterinary care for your beloved pets.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/placeholder.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cairo.variable} suppressHydrationWarning>
      <body className="font-outfit bg-emerald-50 text-gray-900 antialiased">
        <I18nProvider>
          <CartProvider>
            <AuthProvider>
            <OrganizationSchema />
            <WebSiteSchema />
            <VeterinaryClinicSchema />
            <LocalBusinessSchema />
            <Navbar />
            <main className="min-h-screen">{children}</main>
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
