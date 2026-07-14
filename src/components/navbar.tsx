"use client";

import { useI18n } from "@/lib/i18n-context";
import { useCart } from "@/lib/cart-context";
import { useTranslatedData } from "@/lib/use-translated-data";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, Phone, ChevronDown, Globe, Search, Cat, Dog, Bird, Fish, Rabbit, PawPrint, Stethoscope } from "lucide-react";

const languages = [
  { code: "en" as const, label: "EN" },
  { code: "fr" as const, label: "FR" },
  { code: "ar" as const, label: "AR" },
];

const catIcons: Record<string, React.ReactNode> = {
  cat: <Cat className="w-5 h-5" />,
  dog: <Dog className="w-5 h-5" />,
  bird: <Bird className="w-5 h-5" />,
  fish: <Fish className="w-5 h-5" />,
  rabbit: <Rabbit className="w-5 h-5" />,
};

export default function Navbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const { t, lang, setLang, dir } = useI18n();
  const { totalItems } = useCart();
  const { categories } = useTranslatedData();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(categories[0]?.id ?? null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const catBtnRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRtl = dir === "rtl";

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node) &&
          catBtnRef.current && !catBtnRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMegaEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMegaOpen(true);
  };

  const handleMegaLeave = () => {
    timeoutRef.current = setTimeout(() => setMegaOpen(false), 150);
  };

  const desktopLinks = [
    { href: "/", label: t.nav.home },
    { href: "/products?filter=new", label: t.nav.newArrivals },
    { href: "/products?filter=offers", label: t.nav.offers },
    { href: "/vet", label: t.nav.vet, badge: true },
    { href: "/faq", label: t.nav.faq },
    { href: "/shipping", label: t.nav.shipping },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    if (base === "/") return pathname === "/";
    return pathname === base || pathname.startsWith(base + "/");
  };

  return (
    <nav className="bg-emerald-950/60 backdrop-blur-xl border-b border-emerald-800/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-white" />
            </span>
            <span className="font-bold text-white hidden sm:block">Paws & Wings</span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {desktopLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`group relative px-3 py-2 text-sm rounded-lg transition-colors ${isActive(l.href) ? "text-emerald-300" : "text-white hover:text-emerald-300 hover:bg-white/10"}`}
              >
                <span className="flex items-center gap-1.5">
                  {l.label}
                  {l.badge && (
                    <span className="align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-[#3a220a]">
                      {lang === "ar" ? "قريبًا" : lang === "fr" ? "Bientôt" : "Soon"}
                    </span>
                  )}
                </span>
                <span
                  className={`absolute left-3 right-3 bottom-1 h-0.5 rounded-full bg-emerald-400 origin-${isRtl ? "right" : "left"} transition-transform duration-300 ${isActive(l.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                />
              </Link>
            ))}
            <div className="relative" onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setMegaOpen(true); }} onMouseLeave={handleMegaLeave}>
              <button
                ref={catBtnRef}
                onClick={() => setMegaOpen(!megaOpen)}
                className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors ${megaOpen ? "text-emerald-300 bg-white/10" : "text-white hover:text-emerald-300 hover:bg-white/10"}`}
              >
                {t.nav.categories}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`${searchOpen ? "flex" : "hidden"} lg:flex items-center relative`}>
              <input
                ref={searchRef}
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchVal.trim()) {
                    router.push(`/products?q=${encodeURIComponent(searchVal.trim())}`);
                    setSearchVal("");
                    setSearchOpen(false);
                  }
                }}
                placeholder={t.nav.searchPlaceholder}
                className="w-32 lg:w-40 pl-8 pr-3 py-1.5 rounded-lg bg-white/10 text-white text-sm placeholder-white/50 border border-white/20 focus:outline-none focus:bg-white/20 transition-colors"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
            </div>
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (!searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
              }}
              className="lg:hidden p-2 text-white hover:text-emerald-300"
            >
              <Search className="w-4 h-4" />
            </button>

            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 text-sm text-white hover:text-emerald-300 px-2 py-1.5 rounded-lg hover:bg-white/10">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{languages.find((l) => l.code === lang)?.label}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langOpen && (
                <div className={`absolute ${isRtl ? "left-0" : "right-0"} mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-[80px]`}>
                  {languages.map((l) => (
                    <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }} className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 ${lang === l.code ? "text-emerald-600 font-medium" : "text-gray-600"}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a href="tel:+213555123456" className="hidden sm:flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
              <Phone className="w-4 h-4" />
              {t.nav.callNow}
            </a>

            <Link href="/cart" className="relative p-2 text-white hover:text-emerald-300">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 rounded-full bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-white">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {megaOpen && (
        <div
          ref={megaRef}
          onMouseEnter={handleMegaEnter}
          onMouseLeave={handleMegaLeave}
          className="hidden lg:block absolute left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products/${cat.id}`}
                  onClick={() => setMegaOpen(false)}
                  className="group p-4 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  style={{ background: activeCat === cat.id ? "#fef8e7" : "#FAFAFA" }}
                  onMouseEnter={() => setActiveCat(cat.id)}
                >
                  <span className="w-11 h-11 rounded-xl flex items-center justify-center text-white mb-3 transition-transform group-hover:scale-110"
                    style={{ background: activeCat === cat.id ? "#b87a30" : "#f5c76a" }}
                  >
                    {catIcons[cat.icon] ?? <PawPrint className="w-5 h-5" />}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{cat.name}</h3>
                  <p className="text-xs text-gray-400 mb-3">{t.nav.subcategoryCount.replace("{n}", String(cat.subcategories.length))}</p>
                  <div className="flex flex-wrap gap-1">
                    {cat.subcategories.slice(0, 3).map((sub) => (
                      <span key={sub.id} className="px-2 py-0.5 bg-white text-[10px] text-gray-500 rounded-md border border-gray-100">
                        {sub.name}
                      </span>
                    ))}
                    {cat.subcategories.length > 3 && (
                      <span className="px-2 py-0.5 text-[10px] text-gray-400">+{cat.subcategories.length - 3}</span>
                    )}
                  </div>
                </Link>
              ))}
              <Link
                href="/vet"
                onClick={() => setMegaOpen(false)}
                className="group p-4 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 border-2 border-dashed border-gray-200 hover:border-[#b87a30]/30 flex flex-col items-center justify-center text-center"
              >
                <span className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#fef8e7] text-[#b87a30] mb-3">
                  <Stethoscope className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{t.nav.vet}</h3>
                <p className="text-xs text-gray-400">{t.nav.bookAppointment}</p>
              </Link>
            </div>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            <Link href="/" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-emerald-600 text-sm font-medium">{t.nav.home}</Link>
            <Link href="/products?filter=new" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-emerald-600 text-sm font-medium">{t.nav.newArrivals}</Link>
            <Link href="/products?filter=offers" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-emerald-600 text-sm font-medium">{t.nav.offers}</Link>
            <div className="border-t border-gray-100 pt-2 mt-2">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-2 px-1">{t.nav.categories}</p>
              {categories.map((cat) => (
                <div key={cat.id}>
                  <Link href={`/products/${cat.id}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2 px-1 text-gray-700 hover:text-emerald-600 text-sm font-medium">
                    <span className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                      {catIcons[cat.icon] ?? <PawPrint className="w-4 h-4" />}
                    </span>
                    {cat.name}
                  </Link>
                  <div className="ms-9 mb-1 flex flex-wrap gap-1">
                    {cat.subcategories.map((sub) => (
                      <Link key={sub.id} href={`/products/${cat.id}?sub=${sub.id}`} onClick={() => setMobileOpen(false)} className="text-xs text-gray-500 hover:text-emerald-600 px-2 py-1 bg-gray-50 rounded-md">
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
              <Link href="/vet" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-emerald-600 text-sm font-medium">
                {t.nav.vet}
                <span className="ml-1.5 inline-block align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-[#3a220a]">
                  {lang === "ar" ? "قريبًا" : lang === "fr" ? "Bientôt" : "Soon"}
                </span>
              </Link>
              <Link href="/faq" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-emerald-600 text-sm font-medium">{t.nav.faq}</Link>
              <Link href="/shipping" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-emerald-600 text-sm font-medium">{t.nav.shipping}</Link>
              <Link href="/about" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-emerald-600 text-sm font-medium">{t.nav.about}</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-emerald-600 text-sm font-medium">{t.nav.contact}</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
