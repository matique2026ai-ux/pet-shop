"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

type PetType = "cat" | "bird" | "hamster";

interface PetEvent {
  id: number;
  type: PetType;
  direction: "ltr" | "rtl";
  posY: number; // percentage from top (15% to 75%)
}

export default function PlayfulPets() {
  const pathname = usePathname();
  const [activePet, setActivePet] = useState<PetEvent | null>(null);

  useEffect(() => {
    // Don't show in admin dashboard
    if (pathname?.startsWith("/admin")) return;

    // Trigger first pet after 4 seconds
    const firstTimer = setTimeout(() => {
      spawnPet();
    }, 4000);

    // Trigger pets periodically (every 25 seconds)
    const interval = setInterval(() => {
      spawnPet();
    }, 25000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [pathname]);

  const spawnPet = () => {
    const types: PetType[] = ["cat", "bird", "hamster"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomDir = Math.random() > 0.5 ? "ltr" : "rtl";
    const posY = randomType === "bird" ? 12 + Math.random() * 20 : 45 + Math.random() * 30;

    setActivePet({
      id: Date.now(),
      type: randomType,
      direction: randomDir,
      posY,
    });

    // Auto clear pet after animation completes
    setTimeout(() => {
      setActivePet(null);
    }, randomType === "hamster" ? 6800 : 7200);
  };

  if (!activePet || pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden select-none">
      <AnimatePresence key={activePet.id}>
        {/* WALKING CAT */}
        {activePet.type === "cat" && (
          <motion.div
            initial={{ x: activePet.direction === "ltr" ? "-100px" : "100vw" }}
            animate={{ x: activePet.direction === "ltr" ? "100vw" : "-100px" }}
            transition={{ duration: 6.5, ease: "easeInOut" }}
            style={{ top: `${activePet.posY}%` }}
            className="absolute"
          >
            <div className={`transform ${activePet.direction === "rtl" ? "scale-x-[-1]" : ""}`}>
              <div className="relative flex flex-col items-center">
                <div className="bg-amber-100/95 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300 shadow-md mb-1 whitespace-nowrap animate-bounce">
                  Meow~ 🐾
                </div>
                <svg className="w-12 h-12 text-[#E3602D] filter drop-shadow-md" viewBox="0 0 64 64" fill="currentColor">
                  <path d="M48 38c0-4.4-3.6-8-8-8H24c-4.4 0-8 3.6-8 8v10h32V38z" />
                  <circle cx="20" cy="28" r="9" />
                  <polygon points="13,20 18,12 21,21" />
                  <polygon points="27,20 22,12 19,21" />
                  <path d="M48 42c6 0 10-4 10-10s-2-8-5-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
                  <circle cx="17" cy="27" r="1.5" fill="#fff" />
                  <circle cx="23" cy="27" r="1.5" fill="#fff" />
                </svg>
              </div>
            </div>
          </motion.div>
        )}

        {/* FLUTTERING BIRD */}
        {activePet.type === "bird" && (
          <motion.div
            initial={{ x: activePet.direction === "ltr" ? "-80px" : "100vw", y: 0 }}
            animate={{ 
              x: activePet.direction === "ltr" ? "100vw" : "-80px",
              y: [0, -20, 10, -25, 0]
            }}
            transition={{ duration: 5.8, ease: "linear" }}
            style={{ top: `${activePet.posY}%` }}
            className="absolute"
          >
            <div className={`transform ${activePet.direction === "rtl" ? "scale-x-[-1]" : ""}`}>
              <div className="relative flex flex-col items-center">
                <div className="bg-emerald-100/95 text-emerald-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-md mb-1 whitespace-nowrap">
                  Chirp! 🐤
                </div>
                <svg className="w-10 h-10 text-emerald-600 filter drop-shadow-md animate-bounce" viewBox="0 0 64 64" fill="currentColor">
                  <path d="M12 32c0 0 10-14 24-10c14 4 20 18 20 18s-12 4-22-4c-6-5-14-2-22-4z" />
                  <path d="M24 24c0 0 8-12 16-8c4 2 6 10 2 12c-4 2-14-1-18-4z" fill="#34D399" />
                  <circle cx="48" cy="28" r="1.5" fill="#fff" />
                  <polygon points="56,28 62,31 55,34" fill="#F59E0B" />
                </svg>
              </div>
            </div>
          </motion.div>
        )}

        {/* CURIOUS HAMSTER */}
        {activePet.type === "hamster" && (
          <motion.div
            initial={{ x: activePet.direction === "ltr" ? "-80px" : "100vw" }}
            animate={{ 
              x: activePet.direction === "ltr" 
                ? ["-80px", "45vw", "45vw", "100vw"] 
                : ["100vw", "45vw", "45vw", "-80px"]
            }}
            transition={{ 
              duration: 6.4, 
              times: [0, 0.35, 0.65, 1],
              ease: "easeInOut"
            }}
            style={{ top: `${activePet.posY}%` }}
            className="absolute"
          >
            <div className={`transform ${activePet.direction === "rtl" ? "scale-x-[-1]" : ""}`}>
              <div className="relative flex flex-col items-center">
                <div className="bg-orange-100/95 text-orange-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-orange-300 shadow-md mb-1 whitespace-nowrap animate-pulse">
                  Squeak! 🐹
                </div>
                <svg className="w-11 h-11 text-amber-600 filter drop-shadow-md" viewBox="0 0 64 64" fill="currentColor">
                  <ellipse cx="32" cy="38" rx="16" ry="12" fill="#D97706" />
                  <ellipse cx="32" cy="40" rx="10" ry="7" fill="#FDE68A" />
                  <circle cx="20" cy="32" r="10" fill="#D97706" />
                  <circle cx="17" cy="30" r="2" fill="#000" />
                  <circle cx="16" cy="21" r="3.5" fill="#F43F5E" />
                  <circle cx="25" cy="22" r="3.5" fill="#F43F5E" />
                </svg>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
