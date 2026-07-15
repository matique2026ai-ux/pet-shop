"use client";

import React from "react";

/* Component C1: Isolated Central Icon (Horse in Gold, Bird in Blue) */
export function LogoC1({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Horse body silhouette */}
      <path
        d="M14 44 C14 44 16 36 22 33 C25 31 28 32 30 30 C32 28 32 24 34 22 C36 20 40 20 42 22 C44 24 43 28 41 30 C39 32 36 32 35 34 C33 36 34 40 34 44"
        stroke="url(#goldGradLogo)" strokeWidth="2" strokeLinecap="round" fill="none"
      />
      {/* Horse head */}
      <path
        d="M40 22 C41 19 43 17 45 18 C47 19 47 22 46 24 C45 25 43 25 42 24"
        stroke="url(#goldGradLogo)" strokeWidth="1.8" strokeLinecap="round" fill="none"
      />
      {/* Horse legs */}
      <line x1="22" y1="44" x2="20" y2="52" stroke="url(#goldGradLogo)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="28" y1="44" x2="27" y2="52" stroke="url(#goldGradLogo)" strokeWidth="2" strokeLinecap="round"/>
      <line x1="34" y1="44" x2="35" y2="52" stroke="url(#goldGradLogo)" strokeWidth="2" strokeLinecap="round"/>
      {/* Eagle wings spread */}
      <path
        d="M8 28 C10 22 16 20 22 22 C24 23 26 25 26 27"
        stroke="url(#blueGradLogo)" strokeWidth="2" strokeLinecap="round" fill="none"
      />
      <path
        d="M56 22 C54 18 48 17 42 20 C40 21 38 24 38 27"
        stroke="url(#blueGradLogo)" strokeWidth="2" strokeLinecap="round" fill="none"
      />
      {/* Eagle body center */}
      <ellipse cx="32" cy="26" rx="5" ry="4" fill="url(#blueGradLogo)" opacity="0.9"/>
      {/* Eagle head */}
      <circle cx="32" cy="20" r="3.5" fill="url(#blueGradLogo)"/>
      {/* Eagle beak (Gold) */}
      <path d="M34 19 L37 21 L34 21 Z" fill="url(#goldGradLogo)"/>
      {/* Small wing feathers */}
      <path d="M10 26 L6 20 M13 24 L9 18 M16 23 L13 17" stroke="url(#blueGradLogo)" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M54 20 L58 14 M51 19 L55 13 M48 19 L51 13" stroke="url(#blueGradLogo)" strokeWidth="1.2" strokeLinecap="round"/>
      <defs>
        <linearGradient id="goldGradLogo" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#DFB96A"/>
          <stop offset="50%"  stopColor="#C4933F"/>
          <stop offset="100%" stopColor="#8A6022"/>
        </linearGradient>
        <linearGradient id="blueGradLogo" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#2A75B3"/>
          <stop offset="50%"  stopColor="#124473"/>
          <stop offset="100%" stopColor="#0B233C"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/* Component C2: Main Texts (Main title "طيور الجمال والجواد" + subtitle "متجر إلكتروني للحيوانات الأليفة والخيل") */
export function LogoC2({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={`flex flex-col text-right select-none ${className}`} dir="rtl">
      <span className={`text-lg sm:text-2xl font-black tracking-tight leading-tight ${light ? "text-white" : "text-[#0B1E36]"}`}>
        طيور الجمال والجواد
      </span>
      <span className={`text-[9px] sm:text-xs font-bold leading-normal mt-0.5 ${light ? "text-[#DFB96A]" : "text-[#C4933F]"}`}>
        متجر إلكتروني للحيوانات الأليفة والخيل
      </span>
    </div>
  );
}

/* Component C3: Founded Text ("تأسس 2024") */
export function LogoC3({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={`text-center font-bold text-xs select-none ${light ? "text-[#DFB96A]/80" : "text-[#C4933F]"}`} dir="rtl">
      تأسس 2024
    </div>
  );
}

/* Component C4: Responsive Horizontal Logo (Icon + Combined Text) */
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

/* Full Logo Stack (Icon + Texts + Founded 2024) */
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
