import type { Metadata } from "next";
import { Playfair_Display, Outfit, Tajawal } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

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
  title: "Paws & Wings | Pet Shop & Veterinary Clinic",
  description: "Premium pet products and veterinary care for cats, birds, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable} ${tajawal.variable}`} suppressHydrationWarning>
      <body className="font-outfit bg-emerald-50 text-gray-900 antialiased">
        <I18nProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
