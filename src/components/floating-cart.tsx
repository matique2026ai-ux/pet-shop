"use client";

import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n-context";
import Link from "next/link";
import { ShoppingCart, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function FloatingCart() {
  const { items, totalItems, totalPrice } = useCart();
  const { currency, lang } = useI18n();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Periodically remind the user when totalItems > 0
  useEffect(() => {
    if (totalItems === 0) {
      setIsVisible(false);
      return;
    }

    // Show immediately when items are added or changed
    setIsVisible(true);

    // Hide initial reveal after 10 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    // Periodically pop up every 25 seconds for 7 seconds to remind customer
    const interval = setInterval(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 7000);
    }, 25000);

    return () => {
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, [totalItems, pathname]);

  if (!mounted || totalItems === 0) return null;

  // Don't show on cart page or admin pages
  if (pathname === "/cart" || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md"
        >
          <Link href="/cart" className="block w-full group">
            {/* Orange Glassmorphism Capsule Bar */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#E3602D]/85 via-[#EB6B39]/85 to-[#E3602D]/85 backdrop-blur-md border border-white/30 text-white shadow-xl shadow-[#E3602D]/20 rounded-full p-2.5 sm:p-3 flex items-center justify-between transition-all duration-300 group-hover:from-[#E3602D]/95 group-hover:via-[#EB6B39]/95 group-hover:to-[#E3602D]/95 group-hover:backdrop-blur-xl group-hover:shadow-2xl group-hover:shadow-[#E3602D]/40 group-hover:border-white/50">
              
              {/* Subtle Animated Background Shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

              {/* Cart Icon & Info */}
              <div className="flex items-center gap-3.5 pl-2.5 rtl:pl-0 rtl:pr-2.5">
                <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white/20 border border-white/30 backdrop-blur-md shrink-0 shadow-inner">
                  <ShoppingCart className="w-5 h-5 text-white animate-bounce-short" />
                  <span className="absolute -top-1 -right-1 bg-amber-300 text-gray-900 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-white">
                    {totalItems}
                  </span>
                </div>

                <div className="flex flex-col text-start min-w-0">
                  <span className="text-[11px] font-semibold text-orange-100 uppercase tracking-wider flex items-center gap-1.5">
                    <span>{lang === "ar" ? "سلة التسوق" : "Mon Panier"}</span>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </span>
                  <span className="text-base font-extrabold tracking-tight text-white drop-shadow-sm">
                    {totalPrice.toLocaleString("fr-DZ")} {currency}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-1.5 bg-white text-[#E3602D] font-extrabold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full shadow-lg shadow-black/10 group-hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 border border-white/80">
                <span>{lang === "ar" ? "إتمام الطلب" : "Commander"}</span>
                <ChevronRight className={`w-4 h-4 text-[#E3602D] ${lang === "ar" ? "rotate-180" : ""}`} />
              </div>

            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
