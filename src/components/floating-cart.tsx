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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Don't show on cart page or admin pages
  if (pathname === "/cart" || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-sm"
        >
          <Link href="/cart" className="block w-full">
            <div className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-900/20 rounded-2xl px-6 py-4 flex items-center justify-between transition-colors">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 text-emerald-50" />
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-emerald-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                </div>
                <div className="flex flex-col text-start">
                  <span className="text-xs font-medium text-emerald-100">
                    {lang === "ar" ? "سلتك الآن" : "Votre Panier"}
                  </span>
                  <span className="text-base font-bold">
                    {totalPrice.toLocaleString("fr-DZ")} {currency}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm font-bold bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl">
                {lang === "ar" ? "إتمام الطلب" : "Commander"}
                <ChevronRight className={`w-4 h-4 ${lang === "ar" ? "rotate-180" : ""}`} />
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
