"use client";

import React from "react";

export function SetifMotorcycleCourierIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="scooterBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E3602D" />
          <stop offset="100%" stopColor="#1E2D24" />
        </linearGradient>
        <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F1C290" />
          <stop offset="100%" stopColor="#E3602D" />
        </linearGradient>
        <linearGradient id="helmetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E2D24" />
          <stop offset="100%" stopColor="#0E1611" />
        </linearGradient>
        <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Speed lines */}
      <g stroke="#E3602D" strokeWidth="3" strokeLinecap="round" opacity="0.4">
        <line x1="20" y1="120" x2="80" y2="120" strokeDasharray="12 6" />
        <line x1="40" y1="145" x2="110" y2="145" strokeDasharray="16 8" />
        <line x1="10" y1="170" x2="70" y2="170" strokeDasharray="10 5" />
      </g>

      {/* Road Shadow */}
      <ellipse cx="210" cy="205" rx="140" ry="12" fill="#000000" opacity="0.15" />

      <g filter="url(#dropShadow)">
        {/* Rear Wheel */}
        <circle cx="120" cy="180" r="26" fill="#1A1A1A" stroke="#4A4A4A" strokeWidth="6" />
        <circle cx="120" cy="180" r="12" fill="#D4D4D4" />
        <circle cx="120" cy="180" r="4" fill="#1A1A1A" />

        {/* Front Wheel */}
        <circle cx="290" cy="180" r="26" fill="#1A1A1A" stroke="#4A4A4A" strokeWidth="6" />
        <circle cx="290" cy="180" r="12" fill="#D4D4D4" />
        <circle cx="290" cy="180" r="4" fill="#1A1A1A" />

        {/* Scooter Frame & Body */}
        <path d="M120 180 L160 140 H230 L270 175 L290 180" stroke="#1E2D24" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M140 145 H250 L270 115 H210 L160 145 Z" fill="url(#scooterBody)" />

        {/* Front Shield & Headlight */}
        <path d="M255 125 L285 85 H265 L240 125 Z" fill="#1E2D24" />
        <circle cx="282" cy="90" r="7" fill="#FFF5C0" stroke="#E3602D" strokeWidth="2" />
        <path d="M289 90 L330 80 L330 100 Z" fill="#FFF5C0" opacity="0.25" />

        {/* Footrest Platform */}
        <rect x="190" y="155" width="50" height="8" rx="4" fill="#333" />

        {/* Delivery Trunk / Express Box */}
        <rect x="80" y="90" width="65" height="55" rx="8" fill="url(#boxGrad)" stroke="#FFFFFF" strokeWidth="2" />
        {/* Paw Icon on Box */}
        <path d="M112.5 110 c-1.2 0-2.2.9-2.2 2.2 0 1.5 1.5 2.6 2.2 2.6s2.2-1.1 2.2-2.6c0-1.3-1-2.2-2.2-2.2zm-3.3-2.2c-.6 0-1.1.5-1.1 1.1s.5 1.1 1.1 1.1 1.1-.5 1.1-1.1-.5-1.1-1.1-1.1zm6.6 0c-.6 0-1.1.5-1.1 1.1s.5 1.1 1.1 1.1 1.1-.5 1.1-1.1-.5-1.1-1.1-1.1z" fill="#FFFFFF" transform="scale(1.6) translate(-42, -40)" />
        <text x="112" y="136" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">SÉTIF</text>

        {/* Young Courier Driver */}
        {/* Legs */}
        <path d="M190 120 L195 155 L215 155" stroke="#1E2D24" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Torso / Jacket */}
        <path d="M165 100 Q185 95 200 115 L180 135 Z" fill="#1E2D24" stroke="#E3602D" strokeWidth="2" />
        {/* Arms holding handlebar */}
        <path d="M185 105 L245 98" stroke="#1E2D24" strokeWidth="7" strokeLinecap="round" />

        {/* Helmet & Visor */}
        <circle cx="175" cy="72" r="18" fill="url(#helmetGrad)" stroke="#E3602D" strokeWidth="2.5" />
        {/* Visor */}
        <path d="M180 66 Q195 72 185 82 Z" fill="#F1C290" />
      </g>
    </svg>
  );
}

export function SetifMotorcycleDeliveryBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E2D24] via-[#15221B] to-[#0E1611] border border-[#E3602D]/40 p-4 shadow-lg text-white ${className}`}>
      <div className="flex items-center gap-4">
        <div className="w-24 h-20 shrink-0 flex items-center justify-center bg-emerald-950/40 rounded-xl p-1 border border-[#E3602D]/20">
          <SetifMotorcycleCourierIllustration className="w-full h-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E3602D] text-white text-[10px] font-extrabold uppercase tracking-wider mb-1 shadow-sm">
            <span>🛵 توصيل بلدية سطيف</span>
          </div>
          <h4 className="text-sm font-bold text-[#F1C290] truncate">
            شاب توصيل بالدراجة النارية (Express Moto)
          </h4>
          <p className="text-xs text-emerald-100/80 leading-snug mt-0.5">
            توصيل سريع ومباشر لباب المنزل في بلدية سطيف خلال <span className="font-bold text-amber-300">12 إلى 24 ساعة</span> فقط.
          </p>
        </div>
      </div>
    </div>
  );
}
