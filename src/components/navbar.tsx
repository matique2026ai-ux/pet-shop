"use client";

import { useI18n } from "@/lib/i18n-context";
import { useCart } from "@/lib/cart-context";
import { useTranslatedData } from "@/lib/use-translated-data";
import { useSiteSettings } from "@/lib/site-settings";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, Phone, Search, Truck, ChevronRight, User, LogIn, Loader2, Cat, Dog, Bird, Fish, Rabbit, PawPrint, Stethoscope } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import AuthModal from "@/components/auth-modal";

const langOptions = [
  { code: "ar" as const, label: "ع" },
  { code: "fr" as const, label: "FR" },
  { code: "en" as const, label: "EN" },
];

const catIcons: Record<string, React.ReactNode> = {
  cat:    <Cat    className="w-5 h-5" />,
  dog:    <Dog    className="w-5 h-5" />,
  bird:   <Bird   className="w-5 h-5" />,
  fish:   <Fish   className="w-5 h-5" />,
  rabbit: <Rabbit className="w-5 h-5" />,
};

/* ─── Gold Eagle+Horse SVG Logo ─── */
function GoldLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Horse body silhouette */}
      <path
        d="M14 44 C14 44 16 36 22 33 C25 31 28 32 30 30 C32 28 32 24 34 22 C36 20 40 20 42 22 C44 24 43 28 41 30 C39 32 36 32 35 34 C33 36 34 40 34 44"
        stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" fill="none"
      />
      {/* Horse head */}
      <path
        d="M40 22 C41 19 43 17 45 18 C47 19 47 22 46 24 C45 25 43 25 42 24"
        stroke="url(#goldGrad)" strokeWidth="1.8" strokeLinecap="round" fill="none"
      />
      {/* Horse legs */}
      <line x1="22" y1="44" x2="20" y2="52" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="28" y1="44" x2="27" y2="52" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="34" y1="44" x2="35" y2="52" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round"/>
      {/* Eagle wings spread */}
      <path
        d="M8 28 C10 22 16 20 22 22 C24 23 26 25 26 27"
        stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" fill="none"
      />
      <path
        d="M56 22 C54 18 48 17 42 20 C40 21 38 24 38 27"
        stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" fill="none"
      />
      {/* Eagle body center */}
      <ellipse cx="32" cy="26" rx="5" ry="4" fill="url(#goldGrad)" opacity="0.9"/>
      {/* Eagle head */}
      <circle cx="32" cy="20" r="3.5" fill="url(#goldGrad)"/>
      {/* Eagle beak */}
      <path d="M34 19 L37 21 L34 21 Z" fill="url(#goldGrad2)"/>
      {/* Small wing feathers */}
      <path d="M10 26 L6 20 M13 24 L9 18 M16 23 L13 17" stroke="url(#goldGrad)" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M54 20 L58 14 M51 19 L55 13 M48 19 L51 13" stroke="url(#goldGrad)" strokeWidth="1.2" strokeLinecap="round"/>
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#DFB96A"/>
          <stop offset="50%"  stopColor="#C4933F"/>
          <stop offset="100%" stopColor="#8A6022"/>
        </linearGradient>
        <linearGradient id="goldGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#F5EDD6"/>
          <stop offset="100%" stopColor="#C4933F"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const { t, lang, setLang, dir } = useI18n();
  const { totalItems } = useCart();
  const { categories } = useTranslatedData();
  const { store } = useSiteSettings();
  const storePhone = store?.phone || "+213555123456";
  const telHref = "tel:" + storePhone.replace(/[^0-9+]/g, "");
  const { user, profile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [authOpen, setAuthOpen]         = useState(false);
  const [authTab, setAuthTab]           = useState<"login" | "register">("login");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef  = useRef<HTMLDivElement>(null);
  const [megaOpen, setMegaOpen]         = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [searchVal, setSearchVal]       = useState("");
  const searchRef  = useRef<HTMLInputElement>(null);
  const megaRef    = useRef<HTMLDivElement>(null);
  const catBtnRef  = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRtl = dir === "rtl";

  const storeName = lang === "ar"
    ? "طيور الجمال والجواد"
    : lang === "fr"
    ? "Paws & Wings"
    : "Paws & Wings";

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

  const doSearch = () => {
    if (searchVal.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal("");
      setSearchOpen(false);
    }
  };

  const desktopLinks = [
    { href: "/",                      label: t.nav.home },
    { href: "/products",              label: t.nav.products },
    { href: "/vet",                   label: t.nav.vet, badge: true },
    { href: "/products?filter=offers",label: t.nav.offers },
    { href: "/shipping",              label: t.nav.shipping },
    { href: "/contact",               label: t.nav.contact },
  ];

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    if (base === "/") return pathname === "/";
    return pathname === base || pathname.startsWith(base + "/");
  };

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <>
      {/* ── Announcement Bar ── */}
      <div className="announcement-bar hidden sm:block">
        <span className="inline-flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 inline" />
          {lang === "ar"
            ? "🎉 توصيل سريع لسطيف خلال 24-48 ساعة — اطلب الآن!"
            : lang === "fr"
            ? "🎉 Livraison rapide à Sétif en 24-48h — Commandez maintenant!"
            : "🎉 Fast delivery to Sétif in 24-48h — Order now!"}
        </span>
      </div>

      {/* ── Main Navbar ── */}
      <nav className="bg-white border-b border-[#E2DDD4] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <GoldLogo className="w-12 h-12 logo-gold-pulse" />
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-bold text-[#1A1A2E] text-sm leading-tight">{storeName}</span>
                <span className="text-[10px] text-[#9E9282]">
                  {lang === "ar" ? "متجر إلكتروني للحيوانات الأليفة" : lang === "fr" ? "Animalerie en ligne" : "Online Pet Shop"}
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-0">
              {desktopLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`group relative px-3 py-2 text-[13px] whitespace-nowrap rounded-lg transition-colors font-medium ${
                    isActive(l.href)
                      ? "text-[#C4933F] font-semibold"
                      : "text-[#3D3730] hover:text-[#C4933F]"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {l.label}
                    {l.badge && (
                      <span className="align-middle text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#F5851F] text-white">
                        {lang === "ar" ? "قريبًا" : lang === "fr" ? "Bientôt" : "Soon"}
                      </span>
                    )}
                  </span>
                  <span
                    className={`absolute left-2 right-2 bottom-0.5 h-0.5 rounded-full bg-[#C4933F] origin-${isRtl ? "right" : "left"} transition-transform duration-300 ${
                      isActive(l.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">

              {/* Search */}
              <div className={`${searchOpen ? "flex" : "hidden"} xl:flex items-center relative`}>
                <input
                  ref={searchRef}
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") doSearch(); }}
                  placeholder={t.nav.searchPlaceholder}
                  className="w-32 lg:w-44 pl-8 pr-3 py-1.5 rounded-full bg-[#F8F7F4] text-[#1A1A2E] text-sm placeholder-[#9E9282] border border-[#E2DDD4] focus:outline-none focus:border-[#C4933F] transition-colors rtl:pr-8 rtl:pl-3"
                />
                <button
                  type="button"
                  onClick={doSearch}
                  aria-label={t.nav.search}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9E9282] hover:text-[#C4933F] transition-colors rtl:right-2.5 rtl:left-auto"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => {
                  if (searchOpen && searchVal.trim()) { doSearch(); return; }
                  setSearchOpen(!searchOpen);
                  if (!searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
                }}
                aria-label={t.nav.search}
                className="xl:hidden p-2 text-[#5C5348] hover:text-[#C4933F] hover:bg-[#FBF7EE] rounded-lg transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Language switcher */}
              <div dir="ltr" className="flex items-center rounded-full border border-[#E2DDD4] p-0.5 text-xs font-semibold bg-[#F8F7F4]">
                {langOptions.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    aria-label={l.label}
                    className={`px-2.5 py-1 rounded-full transition-colors ${
                      lang === l.code
                        ? "bg-[#C4933F] text-white shadow-sm"
                        : "text-[#5C5348] hover:text-[#C4933F]"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* Auth */}
              {authLoading ? (
                <div className="w-9 h-9 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-[#C4933F] animate-spin" />
                </div>
              ) : user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-[#DFB96A] to-[#C4933F] text-white flex items-center justify-center font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
                    aria-label={t.auth.myAccount}
                  >
                    {(profile?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                  </button>
                  {userMenuOpen && (
                    <div className={`absolute ${isRtl ? "left-0" : "right-0"} mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#E2DDD4] py-2 z-50`}>
                      <div className="px-4 py-2 border-b border-[#F0EDE6]">
                        <p className="text-sm font-semibold text-[#1A1A2E] truncate">{profile?.full_name || user.email}</p>
                        <p className="text-xs text-[#9E9282] truncate">{user.email}</p>
                      </div>
                      <Link href="/account" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-[#3D3730] hover:text-[#C4933F] hover:bg-[#FBF7EE] transition-colors">
                        {t.auth.myAccount}
                      </Link>
                      <button
                        onClick={async () => { await logout(); setUserMenuOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-[#3D3730] hover:text-[#C4933F] hover:bg-[#FBF7EE] transition-colors"
                      >
                        {t.auth.logout}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => { setAuthTab("login"); setAuthOpen(true); }}
                  className="p-2 text-[#5C5348] hover:text-[#C4933F] hover:bg-[#FBF7EE] rounded-lg transition-colors"
                  aria-label={t.auth.login}
                  title={t.auth.login}
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              {/* Call button */}
              <a
                href={telHref}
                className="hidden xl:flex items-center gap-2 bg-gradient-to-r from-[#F5851F] to-[#E06A0A] text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
              >
                <Phone className="w-4 h-4" />
                {t.nav.callNow}
              </a>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-[#5C5348] hover:text-[#C4933F] hover:bg-[#FBF7EE] rounded-lg transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 rounded-full bg-gradient-to-br from-[#F5851F] to-[#E06A0A] text-white text-xs w-4 h-4 flex items-center justify-center font-bold shadow-sm">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Hamburger */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-[#5C5348] hover:text-[#C4933F]">
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mega Menu ── */}
        {megaOpen && (
          <div
            ref={megaRef}
            onMouseEnter={handleMegaEnter}
            onMouseLeave={handleMegaLeave}
            className="hidden lg:block absolute left-0 right-0 bg-white border-t border-[#F0EDE6] shadow-2xl shadow-[#C4933F]/10"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[#C4933F] mb-4">{t.nav.categories}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products/${cat.id}`}
                        onClick={() => setMegaOpen(false)}
                        className="group flex items-center gap-3 p-3 rounded-xl hover:bg-[#FBF7EE] transition-colors"
                      >
                        <span className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-[#F5EDD6] text-[#C4933F] group-hover:bg-[#C4933F] group-hover:text-white transition-colors">
                          {catIcons[cat.icon] ?? <PawPrint className="w-5 h-5" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-semibold text-[#1A1A2E] text-sm group-hover:text-[#C4933F] transition-colors truncate">{cat.name}</span>
                          <span className="block text-[11px] text-[#9E9282]">{t.nav.subcategoryCount.replace("{n}", String(cat.subcategories.length))}</span>
                        </span>
                      </Link>
                    ))}
                    <Link
                      href="/vet"
                      onClick={() => setMegaOpen(false)}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFF7ED] transition-colors border border-dashed border-[#F5851F]/40"
                    >
                      <span className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-[#FFEDD5] text-[#F5851F] group-hover:bg-[#F5851F] group-hover:text-white transition-colors">
                        <Stethoscope className="w-5 h-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-[#1A1A2E] text-sm group-hover:text-[#F5851F] transition-colors">{t.nav.vet}</span>
                        <span className="block text-[11px] text-[#9E9282]">{lang === "ar" ? "قريبًا" : lang === "fr" ? "Bientôt" : "Soon"}</span>
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1A2E] to-[#2D2B45] p-6 h-full min-h-[180px] flex flex-col justify-between">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-[#C4933F]/20 text-[#DFB96A] rounded-full px-2.5 py-1 mb-3">
                        <Truck className="w-3.5 h-3.5" />
                        {lang === "ar" ? "توصيل سطيف 24-48س" : lang === "fr" ? "Livraison Sétif 24-48h" : "Sétif delivery 24-48h"}
                      </span>
                      <h4 className="text-lg font-bold text-white leading-snug">{storeName}</h4>
                      <p className="text-sm text-[#C8BFA8] mt-1">
                        {lang === "ar" ? "كل ما يحتاجه حيوانك الأليف في مكان واحد." : lang === "fr" ? "Tout pour votre compagnon en un seul endroit." : "Everything your pet needs in one place."}
                      </p>
                    </div>
                    <Link
                      href="/products"
                      onClick={() => setMegaOpen(false)}
                      className="mt-4 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#F5851F] to-[#E06A0A] text-white font-semibold text-sm rounded-xl px-4 py-2.5 hover:opacity-90 transition-opacity"
                    >
                      {lang === "ar" ? "تسوّق الكل" : lang === "fr" ? "Tout voir" : "Shop All"} <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#F0EDE6] bg-white max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-3 space-y-1">
              {user ? (
                <div className="flex items-center justify-between py-2 border-b border-[#F0EDE6] mb-1">
                  <span className="text-sm font-semibold text-[#1A1A2E] truncate">{profile?.full_name || user.email}</span>
                  <button onClick={async () => { await logout(); setMobileOpen(false); }} className="text-sm text-[#9E9282] hover:text-[#C4933F]">{t.auth.logout}</button>
                </div>
              ) : (
                <button
                  onClick={() => { setAuthTab("login"); setAuthOpen(true); setMobileOpen(false); }}
                  className="flex items-center gap-2 w-full py-2 text-[#C4933F] font-semibold text-sm"
                >
                  <LogIn className="w-4 h-4" /> {t.auth.login}
                </button>
              )}
              <Link href="/account"                onClick={() => setMobileOpen(false)} className="block py-2 text-[#3D3730] hover:text-[#C4933F] text-sm font-medium">{t.auth.myAccount}</Link>
              <Link href="/"                       onClick={() => setMobileOpen(false)} className="block py-2 text-[#3D3730] hover:text-[#C4933F] text-sm font-medium">{t.nav.home}</Link>
              <Link href="/products?filter=new"    onClick={() => setMobileOpen(false)} className="block py-2 text-[#3D3730] hover:text-[#C4933F] text-sm font-medium">{t.nav.newArrivals}</Link>
              <Link href="/products?filter=offers" onClick={() => setMobileOpen(false)} className="block py-2 text-[#3D3730] hover:text-[#C4933F] text-sm font-medium">{t.nav.offers}</Link>

              <div className="border-t border-[#F0EDE6] pt-2 mt-2">
                <p className="text-[11px] text-[#9E9282] font-medium uppercase tracking-wider mb-2 px-1">{t.nav.categories}</p>
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <Link href={`/products/${cat.id}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2 px-1 text-[#3D3730] hover:text-[#C4933F] text-sm font-medium">
                      <span className="w-7 h-7 bg-[#FBF7EE] rounded-lg flex items-center justify-center text-[#C4933F]">
                        {catIcons[cat.icon] ?? <PawPrint className="w-4 h-4" />}
                      </span>
                      {cat.name}
                    </Link>
                    <div className="ms-9 mb-1 flex flex-wrap gap-1">
                      {cat.subcategories.map((sub) => (
                        <Link key={sub.id} href={`/products/${cat.id}?sub=${sub.id}`} onClick={() => setMobileOpen(false)} className="text-xs text-[#7A6F61] hover:text-[#C4933F] px-2 py-1 bg-[#F8F7F4] rounded-md">
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#F0EDE6] pt-2 mt-2 space-y-1">
                <Link href="/vet"      onClick={() => setMobileOpen(false)} className="block py-2 text-[#3D3730] hover:text-[#C4933F] text-sm font-medium">
                  {t.nav.vet}
                  <span className="ml-1.5 inline-block align-middle text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#F5851F] text-white">
                    {lang === "ar" ? "قريبًا" : lang === "fr" ? "Bientôt" : "Soon"}
                  </span>
                </Link>
                <Link href="/faq"      onClick={() => setMobileOpen(false)} className="block py-2 text-[#3D3730] hover:text-[#C4933F] text-sm font-medium">{t.nav.faq}</Link>
                <Link href="/shipping" onClick={() => setMobileOpen(false)} className="block py-2 text-[#3D3730] hover:text-[#C4933F] text-sm font-medium">{t.nav.shipping}</Link>
                <Link href="/about"    onClick={() => setMobileOpen(false)} className="block py-2 text-[#3D3730] hover:text-[#C4933F] text-sm font-medium">{t.nav.about}</Link>
                <Link href="/contact"  onClick={() => setMobileOpen(false)} className="block py-2 text-[#3D3730] hover:text-[#C4933F] text-sm font-medium">{t.nav.contact}</Link>
              </div>
            </div>
          </div>
        )}
      </nav>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialTab={authTab} />
    </>
  );
}
