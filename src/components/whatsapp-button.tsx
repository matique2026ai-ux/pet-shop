"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings";
import { useI18n } from "@/lib/i18n-context";
import { formatWhatsAppNumber } from "@/lib/phone-utils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const DEFAULT_PHONE = "213776075355";

export default function WhatsAppButton() {
  const pathname = usePathname();
  const { store } = useSiteSettings();
  const { dir, t } = useI18n();
  const [windowBounds, setWindowBounds] = useState({ left: -300, right: 300, top: -600, bottom: 20 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateBounds = () => {
        const isRtl = dir === "rtl";
        setWindowBounds({
          left: isRtl ? -20 : -(window.innerWidth - 80),
          right: isRtl ? (window.innerWidth - 80) : 20,
          top: -(window.innerHeight - 140),
          bottom: 20,
        });
      };
      updateBounds();
      window.addEventListener("resize", updateBounds);
      return () => window.removeEventListener("resize", updateBounds);
    }
  }, [dir]);

  if (pathname.startsWith("/admin")) return null;

  const phone = formatWhatsAppNumber(store?.whatsapp, DEFAULT_PHONE);

  const handleClick = () => {
    if (isDragging) return;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(t.nav.whatsappMessage)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <motion.button
      drag
      dragConstraints={windowBounds}
      dragElastic={0.15}
      dragMomentum={true}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setTimeout(() => setIsDragging(false), 150)}
      whileDrag={{ scale: 1.18, boxShadow: "0px 15px 30px rgba(0,0,0,0.3)" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={`fixed bottom-24 sm:bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-950/20 border-2 border-white/90 cursor-grab active:cursor-grabbing touch-none select-none transition-shadow ${
        dir === "rtl" ? "left-6" : "right-6"
      }`}
      aria-label={t.nav.whatsapp}
    >
      <MessageCircle className="h-7 w-7 pointer-events-none drop-shadow-sm" />
    </motion.button>
  );
}
