"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Globe, Camera, MessageCircle, Mail, CheckCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <footer className="bg-stone-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PW</span>
              </span>
              <span className="font-bold text-white">Paws & Wings</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              {t.footer.madeWith} <Heart className="w-3 h-3 inline text-emerald-500 fill-emerald-500" />
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/products", label: t.nav.products },
                { href: "/vet", label: t.nav.vet },
                { href: "/faq", label: t.nav.faq },
                { href: "/shipping", label: t.nav.shipping },
                { href: "/about", label: t.nav.about },
                { href: "/contact", label: t.nav.contact },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-emerald-500 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t.footer.contactInfo}</h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>{t.contact.addressText?.split("\n")[0] || "123 Pet Street"}</li>
              <li>{t.contact.addressText?.split("\n")[1] || "New York, NY 10001"}</li>
              <li>{t.contact.phoneText || "+1 (234) 567-890"}</li>
              <li>{t.contact.emailText || "hello@pawsandwings.com"}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">{t.footer.newsletter}</h3>
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>{t.footer.subscribed}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.footer.emailPlaceholder}
                  required
                  className="flex-1 px-3 py-2 rounded-lg bg-stone-800 text-white text-sm placeholder-stone-500 border border-stone-700 focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </form>
            )}
            <div className="flex gap-3 mt-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors" aria-label="Instagram">
                <Camera className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors" aria-label="Facebook">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://wa.me/+1234567890" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors" aria-label="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-8 pt-8 text-center text-sm text-stone-500">
          &copy; {new Date().getFullYear()} Paws & Wings. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
