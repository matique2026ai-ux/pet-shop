"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings";
import { useI18n } from "@/lib/i18n-context";

const DEFAULT_PHONE = "+213555123456";

export default function WhatsAppButton() {
  const pathname = usePathname();
  const { store } = useSiteSettings();
  const { dir, t } = useI18n();
  if (pathname.startsWith("/admin")) return null;
  const phone = (store && store.whatsapp ? store.whatsapp : DEFAULT_PHONE).replace(/[^0-9]/g, "");
  const handleClick = () => {
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(t.nav.whatsappMessage)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 z-50 flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95 ${dir === "rtl" ? "left-6" : "right-6"}`}
      aria-label={t.nav.whatsapp}
    >
      <MessageCircle className="h-7 w-7" />
    </button>
  );
}
