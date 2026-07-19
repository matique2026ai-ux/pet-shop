"use client";

import { useI18n } from "@/lib/i18n-context";
import { useCart } from "@/lib/cart-context";
import { useTranslatedData } from "@/lib/use-translated-data";
import { useSiteSettings } from "@/lib/site-settings";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, Phone, Search, Truck, ChevronRight, User, LogIn, Loader2, Cat, Dog, Bird, Fish, Rabbit, PawPrint, BookOpen, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import AuthModal from "@/components/auth-modal";
import { LogoC4 } from "@/components/brand-logo";

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

export default function Navbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const { t, lang, setLang, dir } = useI18n();
  const { totalItems } = useCart();
  const { categories } = useTranslatedData();
  const { store } = useSiteSettings();
  const storePhone = store?.phone || "+2130776075355";
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

  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const toggleCat = (catId: string) => {
    setExpandedCats((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const storeName = store?.storeName || store?.name || (
    lang === "ar"
      ? "طيور الجمال والجواد"
      : "Paws & Wings"
  );

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get("ref") || params.get("agent");
        if (ref) {
          localStorage.setItem("pet_shop_referral", ref.trim());
        }
      } catch (err) {
        console.error("Failed to capture referral parameter", err);
      }
    }
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
    { href: "/blog",                   label: t.nav.blog, badge: false },
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
          <Zap className="w-3.5 h-3.5 fill-current" />
          <Truck className="w-3.5 h-3.5" />
          {lang === "ar"
            ? "توصيل سريع لسطيف خلال 24-48 ساعة — اطلب الآن!"
            : lang === "fr"
            ? "Livraison rapide à Sétif en 24-48h — Commandez maintenant!"
            : "Fast delivery to Sétif in 24-48h — Order now!"}
        </span>
      </div>

      {/* ── Main Navbar ── */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 overflow-hidden ${
        isScrolled 
          ? "bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-lg py-1" 
          : "bg-black/40 backdrop-blur-xl border-b border-white/10 py-0"
      }`}>
        {/* Background Footprints */}
        <MixedFootprint type="cat" className="absolute top-2 left-[15%] w-8 h-8 rotate-[-15deg] text-white/6" />
        <MixedFootprint type="dog" className="absolute bottom-2 right-[25%] w-7 h-7 rotate-[25deg] text-white/5" />
        <MixedFootprint type="bird" className="absolute top-4 right-[45%] w-6 h-6 rotate-[-45deg] text-[#F1C290]/6" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-16">

            {/* Logo Component C4 */}
            <Link href="/" className="relative h-16 w-16 sm:w-20 md:w-24 shrink-0 group logo-gold-pulse">
              <LogoC4 className="absolute top-1.5 left-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 z-50 filter drop-shadow-md transition-transform duration-300 group-hover:scale-105" />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-0">
              {desktopLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`group relative px-3 py-2 text-[13px] whitespace-nowrap rounded-lg transition-colors font-medium ${
                    isActive(l.href)
                      ? "text-[#E3602D] font-semibold"
                      : "text-white/80 hover:text-[#F1C290]"
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
                    className={`absolute left-2 right-2 bottom-0.5 h-0.5 rounded-full bg-[#E3602D] origin-${isRtl ? "right" : "left"} transition-transform duration-300 ${
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
                  className="w-32 lg:w-44 pl-8 pr-3 py-1.5 rounded-full bg-white/10 text-white text-sm placeholder-[#9E9282] border border-white/20 focus:outline-none focus:border-[#E3602D] transition-colors rtl:pr-8 rtl:pl-3"
                />
                <button
                  type="button"
                  onClick={doSearch}
                  aria-label={t.nav.search}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-[#E3602D] transition-colors rtl:right-2.5 rtl:left-auto"
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
                className="xl:hidden p-2 text-white/70 hover:text-[#F1C290] hover:bg-white/10 rounded-lg transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Language switcher */}
              <div dir="ltr" className="hidden md:flex items-center rounded-full border border-white/20 p-0.5 text-xs font-semibold bg-white/10">
                {langOptions.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    aria-label={l.label}
                    className={`px-2.5 py-1 rounded-full transition-colors ${
                      lang === l.code
                        ? "bg-[#E3602D] text-white shadow-sm"
                        : "text-white/70 hover:text-[#F1C290]"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* Auth */}
              <div className="hidden sm:block">
                {authLoading ? (
                  <div className="w-9 h-9 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-[#E3602D] animate-spin" />
                  </div>
                ) : user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F1C290] to-[#E3602D] text-white flex items-center justify-center font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
                      aria-label={t.auth.myAccount}
                    >
                      {(profile?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                    </button>
                    {userMenuOpen && (
                      <div className={`absolute ${isRtl ? "left-0" : "right-0"} mt-2 w-52 bg-[#1E2D24]/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/10 py-2 z-50`}>
                        <div className="px-4 py-2 border-b border-white/10">
                          <p className="text-sm font-semibold text-white truncate">{profile?.full_name || user.email}</p>
                          <p className="text-xs text-white/50 truncate">{user.email}</p>
                        </div>
                        <Link href="/account" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-white/80 hover:text-[#F1C290] hover:bg-white/10 transition-colors">
                          {t.auth.myAccount}
                        </Link>
                        <button
                          onClick={async () => { await logout(); setUserMenuOpen(false); }}
                          className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:text-[#F1C290] hover:bg-white/10 transition-colors"
                        >
                          {t.auth.logout}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => { setAuthTab("login"); setAuthOpen(true); }}
                    className="p-2 text-white/70 hover:text-[#F1C290] hover:bg-white/10 rounded-lg transition-colors"
                    aria-label={t.auth.login}
                    title={t.auth.login}
                  >
                    <User className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Call button */}
              <a
                href={telHref}
                className="hidden xl:flex items-center gap-2 bg-gradient-to-r from-[#F5851F] to-[#E06A0A] text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
              >
                <Phone className="w-4 h-4" />
                {t.nav.callNow}
              </a>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-white/70 hover:text-[#F1C290] hover:bg-white/10 rounded-lg transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 rounded-full bg-gradient-to-br from-[#F5851F] to-[#E06A0A] text-white text-xs w-4 h-4 flex items-center justify-center font-bold shadow-sm">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Hamburger */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-white/70 hover:text-[#F1C290]">
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
            className="hidden lg:block absolute left-0 right-0 bg-[#1E2D24]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl shadow-[#E3602D]/10"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[#E3602D] mb-4">{t.nav.categories}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products/${cat.id}`}
                        onClick={() => setMegaOpen(false)}
                        className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors"
                      >
                        <span className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-[#F5EDD6] text-[#E3602D] group-hover:bg-[#E3602D] group-hover:text-white transition-colors">
                          {catIcons[cat.icon] ?? <PawPrint className="w-5 h-5" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-semibold text-white text-sm group-hover:text-[#E3602D] transition-colors truncate">{cat.name}</span>
                          <span className="block text-[11px] text-white/50">{t.nav.subcategoryCount.replace("{n}", String(cat.subcategories.length))}</span>
                        </span>
                      </Link>
                    ))}
                    <Link
                      href="/blog"
                      onClick={() => setMegaOpen(false)}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFF7ED] transition-colors border border-dashed border-[#F5851F]/40"
                    >
                      <span className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-[#FFEDD5] text-[#F5851F] group-hover:bg-[#F5851F] group-hover:text-white transition-colors">
                        <BookOpen className="w-5 h-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-white text-sm group-hover:text-[#F5851F] transition-colors">{t.nav.blog}</span>
                        <span className="block text-[11px] text-white/50">{t.nav.blog}</span>
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A1A2E] to-[#2D2B45] p-6 h-full min-h-[180px] flex flex-col justify-between">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-[#E3602D]/20 text-[#F1C290] rounded-full px-2.5 py-1 mb-3">
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
          <div className="lg:hidden border-t border-white/10 bg-[#1E2D24]/95 backdrop-blur-xl max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-3 space-y-1">
              {user ? (
                <div className="flex items-center justify-between py-2 border-b border-white/10 mb-1">
                  <span className="text-sm font-semibold text-white truncate">{profile?.full_name || user.email}</span>
                  <button onClick={async () => { await logout(); setMobileOpen(false); }} className="text-sm text-white/50 hover:text-[#E3602D]">{t.auth.logout}</button>
                </div>
              ) : (
                <div className="flex items-center justify-between py-2 border-b border-white/10 mb-1">
                  <button
                    onClick={() => { setAuthTab("login"); setAuthOpen(true); setMobileOpen(false); }}
                    className="flex items-center gap-2 py-2 text-[#E3602D] font-semibold text-sm"
                  >
                    <LogIn className="w-4 h-4" /> {t.auth.login}
                  </button>
                </div>
              )}

              {/* Language Selector for Mobile */}
              <div className="flex items-center justify-between py-2 border-b border-white/10 mb-2">
                <span className="text-sm font-medium text-white/80">
                  {lang === "ar" ? "اللغة" : lang === "fr" ? "Langue" : "Language"}
                </span>
                <div dir="ltr" className="flex items-center rounded-full border border-white/20 p-0.5 text-xs font-semibold bg-white/10">
                  {langOptions.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      aria-label={l.label}
                      className={`px-2.5 py-1 rounded-full transition-colors ${
                        lang === l.code
                          ? "bg-[#E3602D] text-white shadow-sm"
                          : "text-white/70 hover:text-[#F1C290]"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <Link href="/account"                onClick={() => setMobileOpen(false)} className="block py-2 text-white/80 hover:text-[#F1C290] text-sm font-medium">{t.auth.myAccount}</Link>
              <Link href="/"                       onClick={() => setMobileOpen(false)} className="block py-2 text-white/80 hover:text-[#F1C290] text-sm font-medium">{t.nav.home}</Link>
              <Link href="/products?filter=new"    onClick={() => setMobileOpen(false)} className="block py-2 text-white/80 hover:text-[#F1C290] text-sm font-medium">{t.nav.newArrivals}</Link>
              <Link href="/products?filter=offers" onClick={() => setMobileOpen(false)} className="block py-2 text-white/80 hover:text-[#F1C290] text-sm font-medium">{t.nav.offers}</Link>

              <div className="border-t border-white/10 pt-2 mt-2">
                <p className="text-[11px] text-white/50 font-semibold uppercase tracking-wider mb-2 px-1">{t.nav.categories}</p>
                {categories.map((cat) => {
                  const isExpanded = !!expandedCats[cat.id];
                  return (
                    <div key={cat.id} className="border-b border-white/5 last:border-b-0">
                      <button
                        onClick={() => toggleCat(cat.id)}
                        className="flex items-center justify-between w-full py-2.5 px-1 text-white/80 hover:text-[#F1C290] text-sm font-medium transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-[#E3602D]">
                            {catIcons[cat.icon] ?? <PawPrint className="w-4 h-4" />}
                          </span>
                          <span className="text-white font-semibold">{cat.name}</span>
                        </span>
                        <ChevronRight 
                          className={`w-4 h-4 text-white/50 transition-transform duration-300 ${
                            isExpanded ? "rotate-90 text-[#E3602D]" : "rtl:rotate-180"
                          }`}
                        />
                      </button>

                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isExpanded ? "max-h-[500px] opacity-100 mb-2" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="ms-9 pl-2 border-l-2 border-[#F5EDD6] rtl:border-l-0 rtl:border-r-2 rtl:border-[#F5EDD6] rtl:pr-2 py-1 space-y-1">
                          <Link
                            href={`/products/${cat.id}`}
                            onClick={() => setMobileOpen(false)}
                            className="block py-1.5 px-2 text-xs font-semibold text-[#E3602D] hover:bg-white/10 rounded-lg transition-colors"
                          >
                            {lang === "ar" ? "عرض كل " + cat.name : lang === "fr" ? "Voir tout " + cat.name : "View all " + cat.name}
                          </Link>

                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/products/${cat.id}?sub=${sub.id}`}
                              onClick={() => setMobileOpen(false)}
                              className="block py-1.5 px-2 text-xs text-white/70 hover:text-[#F1C290] hover:bg-white/10 rounded-lg transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-white/10 pt-2 mt-2 space-y-1">
                <Link href="/blog"      onClick={() => setMobileOpen(false)} className="block py-2 text-white/80 hover:text-[#F1C290] text-sm font-medium">
                  {t.nav.blog}
                </Link>
                <Link href="/faq"      onClick={() => setMobileOpen(false)} className="block py-2 text-white/80 hover:text-[#F1C290] text-sm font-medium">{t.nav.faq}</Link>
                <Link href="/shipping" onClick={() => setMobileOpen(false)} className="block py-2 text-white/80 hover:text-[#F1C290] text-sm font-medium">{t.nav.shipping}</Link>
                <Link href="/about"    onClick={() => setMobileOpen(false)} className="block py-2 text-white/80 hover:text-[#F1C290] text-sm font-medium">{t.nav.about}</Link>
                <Link href="/contact"  onClick={() => setMobileOpen(false)} className="block py-2 text-white/80 hover:text-[#F1C290] text-sm font-medium">{t.nav.contact}</Link>
              </div>
            </div>
          </div>
        )}
      </nav>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialTab={authTab} />
    </>
  );
}


