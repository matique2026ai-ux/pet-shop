"use client"

import Link from "next/link"
import { PawPrint, Phone, Mail, MapPin, Clock, Heart } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
                <PawPrint className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Paws & Wings</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">{t.footer.desc}</p>
            <div className="flex gap-3">
              {["facebook", "instagram", "youtube"].map((s) => (
                <a key={s} href="#" className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-brand-500 transition-colors">
                  <span className="text-xs font-bold uppercase text-neutral-400 hover:text-white">{s[0]}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/products", label: t.footer.allProducts },
                { href: "/products/cats", label: t.footer.catSupplies },
                { href: "/products/birds", label: t.footer.birdSupplies },
                { href: "/products/accessories", label: t.footer.accessories },
                { href: "/vet", label: t.nav.vet },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-brand-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.services}</h3>
            <ul className="space-y-2.5">
              {[
                "General Consultation",
                "Vaccination",
                "Surgery",
                "Pet Grooming",
                "Dental Care",
              ].map((s) => (
                <li key={s}>
                  <Link href="/vet" className="text-sm hover:text-brand-400 transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.visitUs}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <span>123 Rue Didouche Mourad, Algiers, Algeria</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="tel:+213555123456" className="hover:text-brand-400 transition-colors">+213 555 12 34 56</a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="mailto:hello@pawswings.dz" className="hover:text-brand-400 transition-colors">hello@pawswings.dz</a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Clock className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <div>
                  <p>Sat–Thu: 8:00 AM – 8:00 PM</p>
                  <p className="text-neutral-500">Friday: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} Paws & Wings. {t.footer.rights}
          </p>
          <p className="text-xs text-neutral-600 flex items-center gap-1">
            {t.footer.madeWith} <Heart className="w-3 h-3 text-red-500" /> {t.footer.forYourPets}
          </p>
        </div>
      </div>
    </footer>
  )
}
