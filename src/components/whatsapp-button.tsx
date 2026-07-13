"use client";

import { MessageCircle } from "lucide-react";

const PHONE_NUMBER = "+213555123456";
const MESSAGE = encodeURIComponent("Hello! I have a question about your pet products.");

export default function WhatsAppButton() {
  const handleClick = () => {
    window.open(
      `https://wa.me/${PHONE_NUMBER}?text=${MESSAGE}`,
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
