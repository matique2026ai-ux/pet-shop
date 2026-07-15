"use client";

import React from "react";

/* Component C1: Isolated Central Icon (Falcon + Horse) from public/logo-a.png */
export function LogoC1({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <img
      src="/logo-a.png"
      alt="طيور الجمال والجواد"
      className={`${className} object-contain`}
      style={{ display: "inline-block" }}
    />
  );
}

/* Component C2: Main Text ("طيور الجمال والجواد" only, WITHOUT subtitle) */
export function LogoC2({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={`flex flex-col text-right select-none ${className}`} dir="rtl">
      <span className={`text-lg sm:text-2xl font-black tracking-tight leading-tight ${light ? "text-white" : "text-[#0B1E36]"} font-cairo`}>
        طيور الجمال والجواد
      </span>
    </div>
  );
}

/* Component C3: Founded Text ("تأسس 2024") */
export function LogoC3({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={`text-center font-bold text-xs select-none ${light ? "text-[#DFB96A]/80" : "text-[#C4933F]"} font-cairo`} dir="rtl">
      تأسس 2024
    </div>
  );
}

/* Component C4: Responsive Horizontal Logo (Icon + Main Text only) */
export function LogoC4({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`} dir="rtl">
      {/* Icon */}
      <LogoC1 className="w-10 h-10 sm:w-14 sm:h-14 shrink-0" />
      {/* Text block */}
      <LogoC2 light={light} />
    </div>
  );
}

/* Full Logo Stack (Icon + Main Text + Founded 2024) */
export function LogoFullStack({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-3 select-none ${className}`} dir="rtl">
      {/* Icon */}
      <LogoC1 className="w-20 h-20 sm:w-24 sm:h-24" />
      {/* Text block */}
      <LogoC2 className="text-center items-center" light={light} />
      {/* Founded */}
      <LogoC3 light={light} />
    </div>
  );
}
