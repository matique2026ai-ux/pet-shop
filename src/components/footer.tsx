"use client";

import Link from "next/link";
import { Heart, Globe, Camera, MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

export default function Footer() {
  const { t } = useI18n();

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
            <h3 className="font-semibold text-white mb-4">{t.footer.followUs}</h3>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors">
                <Camera className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-stone-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors">
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
