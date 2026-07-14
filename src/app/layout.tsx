import type { Metadata } from "next";
import { Playfair_Display, Outfit, Tajawal } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n-context";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import WhatsAppButton from "@/components/whatsapp-button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { OrganizationSchema, WebSiteSchema, VeterinaryClinicSchema } from "@/components/schema-jsonld";
import Script from "next/script";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
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
  description: "Premium pet products and veterinary care for cats, dogs, birds, fish, and small pets. Shop the best food, toys, accessories and book vet appointments online.",
  keywords: ["pet shop", "veterinary clinic", "pet supplies", "cat food", "dog food", "pet care", "animal clinic"],
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
    <html lang="en" className={`${playfair.variable} ${outfit.variable} ${tajawal.variable}`} suppressHydrationWarning>
      <body className="font-outfit bg-emerald-50 text-gray-900 antialiased">
        <I18nProvider>
          <CartProvider>
            <AuthProvider>
            <OrganizationSchema />
            <WebSiteSchema />
            <VeterinaryClinicSchema />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <WhatsAppButton />
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
