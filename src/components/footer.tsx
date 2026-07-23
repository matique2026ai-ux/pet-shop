"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Mail, CheckCircle, Truck, PawPrint } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import { useSiteSettings } from "@/lib/site-settings";
import { LogoC4 } from "@/components/brand-logo";
import { formatWhatsAppNumber } from "@/lib/phone-utils";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.652a11.882 11.882 0 005.71 1.454h.006c6.585 0 11.946-5.359 11.949-11.945a11.821 11.821 0 00-3.495-8.457z" />
    </svg>
  );
}

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
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

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const { t, lang } = useI18n();
  const { store, content, delivery } = useSiteSettings();
  const [email, setEmail]         = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to subscribe.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  const s = (k: string, fallback: string) => (store && store[k] ? store[k] : fallback);
  const addressLines = (s("address", t.contact.addressText || "Larbi Ben M'hidi Street\nSétif 19000, Algeria")).split("\n");
  const phone        = s("phone",    t.contact.phoneText    || "+213 661 234 567");
  const deliveryPrefix = lang === "ar" ? "توصيل" : lang === "fr" ? "Livraison" : "Delivery";
  const coverage = delivery
    ? `${deliveryPrefix} ${delivery.city} • ${delivery.eta}`
    : `${deliveryPrefix} Sétif • 24-48h`;
  const emailAddr  = s("email",     t.contact.emailText || "hello@pawsandwings.com");
  const whatsapp   = formatWhatsAppNumber(store?.whatsapp, "213776075355");
  const instagram  = s("instagram", "https://instagram.com");
  const facebook   = s("facebook",  "https://facebook.com");
  const tiktok     = store && store.tiktok ? store.tiktok : "";

  const storeName = store?.storeName || store?.name || (
    lang === "ar" ? "طيور الجمال والجواد" : "Paws & Wings"
  );

  return (
    <footer className="bg-[#1A120B] border-t border-stone-800 pt-16 pb-8 text-slate-300 relative overflow-hidden">
      {/* Background Footprints */}
      <MixedFootprint type="cat" className="absolute top-6 left-[8%] w-12 h-12 rotate-[-25deg] text-white/8 z-0" />
      <MixedFootprint type="dog" className="absolute top-[40%] right-[6%] w-16 h-16 rotate-[35deg] text-white/6 z-0" />
      <MixedFootprint type="bird" className="absolute bottom-8 left-[25%] w-10 h-10 rotate-[-45deg] text-white/6 z-0" />
      <MixedFootprint type="cat" className="absolute bottom-12 right-[22%] w-12 h-12 rotate-[15deg] text-[#F1C290]/8 z-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Centered Brand Section */}
        <div className="flex flex-col items-center justify-center text-center mb-16 pb-12 border-b border-stone-800/60">
           <Link href="/">
              <LogoC4 light={true} className="w-32 h-32 md:w-40 md:h-40 mb-6 drop-shadow-2xl opacity-90 hover:scale-105 transition-transform duration-500" />
           </Link>
           <h2 className="text-xl md:text-2xl font-black text-white tracking-wider mb-4 font-cairo">
             {storeName}
           </h2>
           <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
              {t.footer.madeWith} <Heart className="w-4 h-4 inline text-[#F5851F] fill-[#F5851F]" />
           </p>
           {/* Delivery badge */}
           <div className="inline-flex items-center gap-2 text-xs md:text-sm text-[#F1C290] bg-[#E3602D]/10 border border-[#E3602D]/20 rounded-full px-5 py-2.5">
             <Truck className="w-4 h-4 shrink-0" />
             <span>{coverage}</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 gap-y-12">

          {/* Quick links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/products", label: t.nav.products },
                { href: "/blog",      label: t.nav.blog },
                { href: "/faq",      label: t.nav.faq },
                { href: "/shipping", label: t.nav.shipping },
                { href: "/privacy",  label: (t.nav as any).privacy || "Privacy" },
                { href: "/about",    label: t.nav.about },
                { href: "/contact",  label: t.nav.contact },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-slate-400 hover:text-[#F1C290] transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#E3602D] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className="col-span-1">
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              {t.footer.contactInfo}
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {addressLines.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
              <li className="break-all">
                <a href={`mailto:${emailAddr}`} className="hover:text-[#F1C290] transition-colors">
                  {emailAddr}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter + Social */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              {t.footer.newsletter}
            </h3>
            {subscribed ? (
              <div className="flex items-center gap-2 text-[#F1C290] text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>{t.footer.subscribed}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 mb-5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.footer.emailPlaceholder}
                  required
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-white text-sm placeholder-slate-500 border border-white/10 focus:outline-none focus:border-[#E3602D] transition-colors"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="px-3 py-2 bg-gradient-to-r from-[#E3602D] to-[#A87A2E] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center min-w-[40px]"
                >
                  {subscribing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                </button>
              </form>
            )}

            {/* Social icons */}
            <div className="flex gap-2.5 mt-4">
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-[#E4405F] hover:border-transparent transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-[#1877F2] hover:border-transparent transition-all"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-[#25D366] hover:border-transparent transition-all"
                aria-label="WhatsApp"
              >
                <WhatsappIcon className="w-4 h-4" />
              </a>
              {tiktok && (
                <a
                  href={tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-black hover:border-transparent transition-all"
                  aria-label="TikTok"
                >
                  <TiktokIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col items-center gap-6">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              {content && content.footerText
                ? content.footerText
                : `© ${new Date().getFullYear()} ${storeName}. ${t.footer.rights}`}
            </span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
              className="hover:text-[#F1C290] transition-colors"
            >
              {t.cookies.settings}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
