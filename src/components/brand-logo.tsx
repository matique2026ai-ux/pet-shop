"use client";

import React from "react";

/* Component C1: Elegant Vector Falcon + Running Horse Silhouette Logo */
export function LogoC1({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFB96A" />
          <stop offset="50%" stopColor="#C4933F" />
          <stop offset="100%" stopColor="#8A6022" />
        </linearGradient>
        <linearGradient id="logoBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2A75B3" />
          <stop offset="100%" stopColor="#0B1E36" />
        </linearGradient>
      </defs>

      {/* Decorative Golden Orbit Circle */}
      <circle cx="50" cy="50" r="46" stroke="url(#logoGold)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="50" cy="50" r="42" stroke="url(#logoGold)" strokeWidth="0.8" opacity="0.3" />

      {/* HORSE - Golden Silhouette (Galloping) */}
      <g transform="translate(18, 30) scale(0.65)">
        {/* Body & neck */}
        <path
          d="M12 40 C 25 30, 45 35, 55 20 C 58 15, 65 12, 72 15 C 75 16, 78 20, 75 25 C 72 30, 68 32, 65 35 C 55 45, 58 55, 45 65 C 35 72, 20 75, 12 70 C 8 68, 6 60, 12 40 Z"
          fill="url(#logoGold)"
        />
        {/* Flowing Mane details */}
        <path d="M50 25 C 55 18, 62 15, 68 18" stroke="url(#logoGold)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M45 32 C 50 25, 57 22, 62 25" stroke="url(#logoGold)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M40 39 C 45 32, 52 28, 57 32" stroke="url(#logoGold)" strokeWidth="2" strokeLinecap="round" />
        {/* Elegant Legs */}
        {/* Back legs extended */}
        <path d="M16 65 L2 78 L-5 82" stroke="url(#logoGold)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M22 62 L10 75 L5 78" stroke="url(#logoGold)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" fill="none" />
        {/* Front legs bent/raised */}
        <path d="M48 60 L58 75 L70 78" stroke="url(#logoGold)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M42 62 L50 72 L60 74" stroke="url(#logoGold)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" fill="none" />
        {/* Flowing Tail */}
        <path d="M12 70 C 2 75, -8 72, -15 65 C -10 62, -5 62, 0 65" fill="url(#logoGold)" />
      </g>

      {/* FALCON - Blue/Navy Silhouette (Flying upwards, wings spread) */}
      <g transform="translate(30, 16) scale(0.68)">
        {/* Main Body */}
        <path
          d="M30 45 C 35 40, 42 38, 48 42 C 52 45, 55 52, 52 58 C 48 64, 38 68, 30 65 C 24 62, 22 55, 26 48 C 28 45, 29 46, 30 45 Z"
          fill="url(#logoBlue)"
        />
        {/* Left Wing (detailed feathers in curved paths) */}
        <path
          d="M32 46 C 24 38, 12 36, 2 40 C -8 44, -18 36, -24 25 C -14 26, -4 30, 4 35 C 14 40, 22 42, 32 46 Z"
          fill="url(#logoBlue)"
        />
        {/* Layered wing feathers */}
        <path d="M12 37 C 2 32, -8 28, -15 20" stroke="url(#logoBlue)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 39 C 10 32, 2 28, -5 22" stroke="url(#logoBlue)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 41 C 18 34, 10 30, 4 25" stroke="url(#logoBlue)" strokeWidth="2" strokeLinecap="round" />

        {/* Right Wing (pointing upwards) */}
        <path
          d="M44 42 C 48 30, 52 18, 58 8 C 54 12, 50 18, 48 24 C 45 32, 44 38, 44 42 Z"
          fill="url(#logoBlue)"
        />
        <path d="M47 30 C 50 22, 54 14, 58 6" stroke="url(#logoBlue)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M45 35 C 48 27, 51 19, 54 11" stroke="url(#logoBlue)" strokeWidth="2.5" strokeLinecap="round" />

        {/* Falcon Head & Beak */}
        <circle cx="46" cy="46" r="6" fill="url(#logoBlue)" />
        <path d="M51 43.5 L56 46 L51 48.5 Z" fill="url(#logoGold)" />
      </g>
    </svg>
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
