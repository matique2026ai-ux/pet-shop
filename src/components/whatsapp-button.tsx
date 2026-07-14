"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings";

const DEFAULT_PHONE = "+213555123456";
const MESSAGE = encodeURIComponent("Hello! I have a question about your pet products.");

export default function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  const { store } = useSiteSettings();
  const phone = (store && store.whatsapp ? store.whatsapp : DEFAULT_PHONE).replace(/[^0-9]/g, "");
  const handleClick = () => {
    window.open(
      `https://wa.me/${phone}?text=${MESSAGE}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </button>
  );
}
