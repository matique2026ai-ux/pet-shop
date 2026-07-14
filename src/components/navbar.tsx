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
  const { store } = useSiteSettings();
  const storePhone = store?.phone || "+213555123456";
  const telHref = "tel:" + storePhone.replace(/[^0-9+]/g, "");
  const { user, profile, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [megaOpen, setMegaOpen] = useState(false);
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
    { href: "/products", label: t.nav.products },
    { href: "/vet", label: t.nav.vet, badge: true },
    { href: "/products?filter=offers", label: t.nav.offers },
    { href: "/shipping", label: t.nav.shipping },
    { href: "/contact", label: t.nav.contact },
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
      <nav className="bg-[#1E3A8A] border-b border-[#1E40AF] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-[#1E3A8A]" />
            </span>
            <span className="font-bold text-white hidden sm:block">Paws & Wings</span>
          </Link>

          <div className="hidden lg:flex items-center gap-0">
            {desktopLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`group relative px-2 py-2 text-[13px] whitespace-nowrap rounded-lg transition-colors ${isActive(l.href) ? "text-white font-semibold" : "text-white/85 hover:text-white hover:bg-white/10"}`}
              >
                <span className="flex items-center gap-1.5">
                  {l.label}
                  {l.badge && (
                      <span className="align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F97316] text-white">
                      {lang === "ar" ? "قريبًا" : lang === "fr" ? "Bientôt" : "Soon"}
                    </span>
                  )}
                </span>
                <span
                  className={`absolute left-2 right-2 bottom-1 h-0.5 rounded-full bg-[#F97316] origin-${isRtl ? "right" : "left"} transition-transform duration-300 ${isActive(l.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className={`${searchOpen ? "flex" : "hidden"} xl:flex items-center relative`}>
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
                className="w-32 lg:w-40 pl-8 pr-3 py-1.5 rounded-lg bg-white/10 text-white text-sm placeholder-white/50 border border-white/20 focus:outline-none focus:bg-white/20 transition-colors rtl:pr-8 rtl:pl-3"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none rtl:right-2 rtl:left-auto" />
            </div>
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (!searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
              }}
              className="xl:hidden p-2 text-white hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            <div dir="ltr" className="flex items-center rounded-full bg-white/15 p-0.5 text-xs font-semibold">
              {langOptions.map((l) => (
                <button key={l.code} onClick={() => setLang(l.code)} aria-label={l.label} className={`px-2.5 py-1 rounded-full transition-colors ${lang === l.code ? "bg-white text-[#1E3A8A]" : "text-white hover:text-white/80"}`}>
                  {l.label}
                </button>
              ))}
            </div>

              {authLoading ? (
              <div className="w-9 h-9 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-9 h-9 rounded-full bg-white text-[#1E3A8A] flex items-center justify-center font-semibold text-sm hover:bg-white/90 transition-colors"
                  aria-label={t.auth.myAccount}
                >
                  {(profile?.full_name?.[0] || user.email?.[0] || "U").toUpperCase()}
                </button>
                {userMenuOpen && (
                  <div className={`absolute ${isRtl ? "left-0" : "right-0"} mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50`}>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{profile?.full_name || user.email}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link href="/account" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:text-[#1E3A8A] hover:bg-gray-50 transition-colors">
                      {t.auth.myAccount}
                    </Link>
                    <button
                      onClick={async () => { await logout(); setUserMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-[#1E3A8A] hover:bg-gray-50 transition-colors"
                    >
                      {t.auth.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => { setAuthTab("login"); setAuthOpen(true); }}
                  className="p-2 text-white hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  aria-label={t.auth.login}
                title={t.auth.login}
              >
                <User className="w-5 h-5" />
              </button>
            )}

            <a href={telHref} className="hidden xl:flex items-center gap-2 bg-[#F97316] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#EA580C] transition-colors">
              <Phone className="w-4 h-4" />
              {t.nav.callNow}
            </a>

            <Link href="/cart" className="relative p-2 text-white hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 rounded-full bg-[#F97316] text-white text-xs w-4 h-4 flex items-center justify-center">
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
          className="hidden lg:block absolute left-0 right-0 bg-white border-t border-emerald-600/20 shadow-2xl shadow-emerald-900/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#1E3A8A] mb-4">{t.nav.categories}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products/${cat.id}`}
                      onClick={() => setMegaOpen(false)}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8FAFC] transition-colors"
                    >
                      <span className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        {catIcons[cat.icon] ?? <PawPrint className="w-5 h-5" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-gray-900 text-sm group-hover:text-emerald-700 transition-colors truncate">{cat.name}</span>
                        <span className="block text-[11px] text-gray-400">{t.nav.subcategoryCount.replace("{n}", String(cat.subcategories.length))}</span>
                      </span>
                    </Link>
                  ))}
                  <Link
                    href="/vet"
                    onClick={() => setMegaOpen(false)}
                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 transition-colors border border-dashed border-amber-200"
                  >
                    <span className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <Stethoscope className="w-5 h-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-gray-900 text-sm group-hover:text-amber-700 transition-colors">{t.nav.vet}</span>
                      <span className="block text-[11px] text-gray-400">{lang === "ar" ? "قريبًا" : lang === "fr" ? "Bientôt" : "Soon"}</span>
                    </span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 h-full min-h-[180px] flex flex-col justify-between text-white">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white/15 rounded-full px-2.5 py-1 mb-3">
                      <Truck className="w-3.5 h-3.5" /> {lang === "ar" ? "توصيل سطيف 24-48س" : lang === "fr" ? "Livraison Sétif 24-48h" : "Sétif delivery 24-48h"}
                    </span>
                    <h4 className="text-lg font-bold leading-snug">Paws &amp; Wings</h4>
                    <p className="text-sm text-emerald-100 mt-1">
                      {lang === "ar" ? "كل ما يحتاجه حيوانك الأليف في مكان واحد." : lang === "fr" ? "Tout pour votre compagnon en un seul endroit." : "Everything your pet needs in one place."}
                    </p>
                  </div>
                  <Link href="/products" onClick={() => setMegaOpen(false)} className="mt-4 inline-flex items-center justify-center gap-1.5 bg-white text-emerald-700 font-semibold text-sm rounded-xl px-4 py-2.5 hover:bg-[#F8FAFC] transition-colors">
                    {lang === "ar" ? "تسوّق الكل" : lang === "fr" ? "Tout voir" : "Shop All"} <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {user ? (
              <div className="flex items-center justify-between py-2 border-b border-gray-100 mb-1">
                <span className="text-sm font-semibold text-gray-900 truncate">{profile?.full_name || user.email}</span>
                <button onClick={async () => { await logout(); setMobileOpen(false); }} className="text-sm text-gray-500 hover:text-[#1E3A8A]">{t.auth.logout}</button>
              </div>
            ) : (
              <button
                onClick={() => { setAuthTab("login"); setAuthOpen(true); setMobileOpen(false); }}
                className="flex items-center gap-2 w-full py-2 text-[#1E3A8A] font-semibold text-sm"
              >
                <LogIn className="w-4 h-4" /> {t.auth.login}
              </button>
            )}
            <Link href="/account" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-[#1E3A8A] text-sm font-medium">{t.auth.myAccount}</Link>
            <Link href="/" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-[#1E3A8A] text-sm font-medium">{t.nav.home}</Link>
            <Link href="/products?filter=new" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-[#1E3A8A] text-sm font-medium">{t.nav.newArrivals}</Link>
            <Link href="/products?filter=offers" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-[#1E3A8A] text-sm font-medium">{t.nav.offers}</Link>
            <div className="border-t border-gray-100 pt-2 mt-2">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-2 px-1">{t.nav.categories}</p>
              {categories.map((cat) => (
                <div key={cat.id}>
                  <Link href={`/products/${cat.id}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2 px-1 text-gray-700 hover:text-[#1E3A8A] text-sm font-medium">
                    <span className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                      {catIcons[cat.icon] ?? <PawPrint className="w-4 h-4" />}
                    </span>
                    {cat.name}
                  </Link>
                  <div className="ms-9 mb-1 flex flex-wrap gap-1">
                    {cat.subcategories.map((sub) => (
                      <Link key={sub.id} href={`/products/${cat.id}?sub=${sub.id}`} onClick={() => setMobileOpen(false)} className="text-xs text-gray-500 hover:text-[#1E3A8A] px-2 py-1 bg-gray-50 rounded-md">
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
              <Link href="/vet" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-[#1E3A8A] text-sm font-medium">
                {t.nav.vet}
                <span className="ml-1.5 inline-block align-middle text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F97316] text-white">
                  {lang === "ar" ? "قريبًا" : lang === "fr" ? "Bientôt" : "Soon"}
                </span>
              </Link>
              <Link href="/faq" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-[#1E3A8A] text-sm font-medium">{t.nav.faq}</Link>
              <Link href="/shipping" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-[#1E3A8A] text-sm font-medium">{t.nav.shipping}</Link>
              <Link href="/about" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-[#1E3A8A] text-sm font-medium">{t.nav.about}</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-[#1E3A8A] text-sm font-medium">{t.nav.contact}</Link>
            </div>
          </div>
        </div>
      )}

      </nav>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialTab={authTab} />
    </>
  );
}
