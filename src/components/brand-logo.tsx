"use client";

import React from "react";

/* Component C1: Transparent Circular Badge Logo (Icon + 'طيور الجمال والجواد' + 'تأسس 2024') */
export function LogoC1({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <img
      src="/logo-badge.png"
      alt="طيور الجمال والجواد"
      className={`${className} object-contain`}
      style={{ display: "inline-block" }}
    />
  );
}

/* Fallback Text (WITHOUT subtitle) */
export function LogoC2({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={`flex flex-col text-right select-none ${className}`} dir="rtl">
      <span className={`text-lg sm:text-2xl font-black tracking-tight leading-tight ${light ? "text-white" : "text-[#0B1E36]"} font-cairo`}>
        طيور الجمال والجواد
      </span>
    </div>
  );
}

export function LogoC3({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={`text-center font-bold text-xs select-none ${light ? "text-[#DFB96A]/80" : "text-[#C4933F]"} font-cairo`} dir="rtl">
      تأسس 2024
    </div>
  );
}

/* Component C4: Responsive logo wrapper for Navbar */
export function LogoC4({ className = "w-24 h-24", light = false }: { className?: string; light?: boolean }) {
  return (
    <LogoC1 className={className} />
  );
}

/* Full Logo Stack wrapper */
export function LogoFullStack({ className = "w-32 h-32", light = false }: { className?: string; light?: boolean }) {
  return (
    <LogoC1 className={className} />
  );
}
