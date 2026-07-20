"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";

type ActionType = "cat-walk" | "cat-peek" | "bird-fly" | "bird-swoop" | "hamster-scurry" | "hamster-peek" | "dog-run" | "dog-peek";

interface PetEvent {
  id: number;
  action: ActionType;
  direction: "ltr" | "rtl";
  posY: number;
  message: string;
}

const CAT_MESSAGES_AR = ["ميااااو! 🐾", "أهلاً بك في متجرنا! 🐱", "هل تبحث عن طعام لي؟ 😸", "مياو~ 🐾"];
const CAT_MESSAGES_FR = ["Miaouuu~ 🐾", "Bienvenue chez nous ! 🐱", "Des croquettes pour moi ? 😸", "Purrr~ 🐾"];

const BIRD_MESSAGES_AR = ["زقزقة! 🎵", "تغريد جميل! 🎶", "طيور الجمال والجواد! 🐤", "تويت تويت! 🦜"];
const BIRD_MESSAGES_FR = ["Chirp chirp ! 🎵", "Cuicui ! 🎶", "Coucou ! 🐤", "Tweeeet ! 🦜"];

const HAMSTER_MESSAGES_AR = ["سقسقة! 🐹", "وجدتك! 🌻", "سرعة التوصيل! ⚡", "أهلاً! 🐾"];
const HAMSTER_MESSAGES_FR = ["Pouic pouic ! 🐹", "Un tournesol ? 🌻", "Rapide ! ⚡", "Salut ! 🐾"];

const DOG_MESSAGES_AR = ["هو هو! 🐾", "مرحباً يا صديقي! 🐶", "هل نحظى ببعض اللعب؟ 🦴", "واو واو! 🐕"];
const DOG_MESSAGES_FR = ["Ouaf ouaf ! 🐾", "Salut ami ! 🐶", "Un os pour moi ? 🦴", "Wouf ! 🐕"];

/* 100% Transparent Vector Animal Icons (NO Background Box) */
function RealisticDogVector({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dogFur" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="50%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="dogEar" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
        <linearGradient id="dogChest" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
      </defs>
      {/* Wagging Tail */}
      <path d="M72 42 Q86 28 84 15 Q80 10 75 22 Q72 32 68 40" stroke="url(#dogFur)" strokeWidth="7" strokeLinecap="round" />
      {/* Dog Body */}
      <ellipse cx="48" cy="48" rx="26" ry="18" fill="url(#dogFur)" />
      <ellipse cx="42" cy="52" rx="16" ry="12" fill="url(#dogChest)" />
      {/* Dog Legs */}
      <rect x="26" y="56" width="7" height="18" rx="3.5" fill="#B45309" />
      <rect x="36" y="58" width="7" height="16" rx="3.5" fill="#78350F" />
      <rect x="54" y="56" width="7" height="18" rx="3.5" fill="#B45309" />
      <rect x="64" y="58" width="7" height="16" rx="3.5" fill="#78350F" />
      {/* Collar */}
      <rect x="22" y="38" width="8" height="12" rx="3" fill="#EF4444" transform="rotate(-15 22 38)" />
      <circle cx="28" cy="48" r="2.5" fill="#F59E0B" />
      {/* Dog Head */}
      <circle cx="24" cy="32" r="15" fill="url(#dogFur)" />
      <ellipse cx="16" cy="36" rx="9" ry="7" fill="url(#dogChest)" />
      {/* Floppy Ear */}
      <path d="M22 18 Q12 18 14 34 Q20 32 24 24 Z" fill="url(#dogEar)" />
      {/* Eye */}
      <circle cx="20" cy="28" r="2.5" fill="#000000" />
      <circle cx="19" cy="27" r="0.9" fill="#FFFFFF" />
      {/* Nose */}
      <ellipse cx="11" cy="34" rx="3" ry="2.5" fill="#1F2937" />
      {/* Happy Mouth / Tongue */}
      <path d="M12 37 Q14 42 16 38" stroke="#1F2937" strokeWidth="1.2" fill="none" />
      <path d="M13 39 Q14 44 16 43 Q17 41 15 38 Z" fill="#F43F5E" />
    </svg>
  );
}

/* 100% Transparent Vector Animal Icons (NO Background Box) */
function RealisticCatVector({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="catFur" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="catBelly" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
      </defs>
      <path d="M75 45 Q88 30 85 15 Q82 5 78 12 Q75 25 68 40" stroke="url(#catFur)" strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="48" cy="50" rx="26" ry="18" fill="url(#catFur)" />
      <ellipse cx="46" cy="54" rx="16" ry="11" fill="url(#catBelly)" />
      <rect x="26" y="58" width="6" height="16" rx="3" fill="#D97706" />
      <rect x="36" y="60" width="6" height="14" rx="3" fill="#B45309" />
      <rect x="54" y="58" width="6" height="16" rx="3" fill="#D97706" />
      <rect x="64" y="60" width="6" height="14" rx="3" fill="#B45309" />
      <circle cx="22" cy="36" r="14" fill="url(#catFur)" />
      <ellipse cx="18" cy="40" rx="7" ry="5" fill="url(#catBelly)" />
      <polygon points="12,25 8,10 20,20" fill="#B45309" />
      <polygon points="14,23 11,13 19,19" fill="#FCA5A5" />
      <polygon points="24,20 32,10 30,25" fill="#B45309" />
      <polygon points="25,19 30,13 29,23" fill="#FCA5A5" />
      <ellipse cx="15" cy="33" rx="3" ry="4" fill="#10B981" />
      <circle cx="15" cy="33" r="1.5" fill="#047857" />
      <ellipse cx="27" cy="33" rx="3" ry="4" fill="#10B981" />
      <circle cx="27" cy="33" r="1.5" fill="#047857" />
      <polygon points="18,39 20,41 22,39" fill="#F43F5E" />
      <path d="M12 40 L2 38 M12 42 L3 43 M26 40 L36 38 M26 42 L35 43" stroke="#FFF" strokeWidth="1.2" opacity="0.9" />
    </svg>
  );
}

function RealisticBirdVector({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="birdBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="60%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="birdWing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <path d="M15 45 L2 55 M15 45 L5 62 M15 45 L10 66" stroke="#047857" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="45" cy="42" rx="22" ry="14" fill="url(#birdBody)" transform="rotate(-10 45 42)" />
      <circle cx="68" cy="30" r="12" fill="url(#birdBody)" />
      <circle cx="72" cy="27" r="3" fill="#FFFFFF" />
      <circle cx="73" cy="27" r="1.5" fill="#000000" />
      <path d="M78 30 Q88 33 82 40 Q77 36 78 30 Z" fill="#F59E0B" />
      <path d="M35 36 Q45 10 60 15 Q50 30 38 40 Z" fill="url(#birdWing)" stroke="#047857" strokeWidth="1" />
      <path d="M42 38 Q55 2 72 10 Q60 25 45 42 Z" fill="#6EE7B7" opacity="0.8" />
    </svg>
  );
}

function RealisticHamsterVector({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 90 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hamsterFur" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id="hamsterCheek" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
      </defs>
      <ellipse cx="48" cy="44" rx="24" ry="18" fill="url(#hamsterFur)" />
      <ellipse cx="42" cy="46" rx="16" ry="12" fill="url(#hamsterCheek)" />
      <circle cx="26" cy="38" r="14" fill="url(#hamsterFur)" />
      <ellipse cx="22" cy="42" rx="9" ry="7" fill="url(#hamsterCheek)" />
      <circle cx="20" cy="24" r="4.5" fill="#D97706" />
      <circle cx="20" cy="24" r="2.5" fill="#FCA5A5" />
      <circle cx="32" cy="25" r="4.5" fill="#D97706" />
      <circle cx="32" cy="25" r="2.5" fill="#FCA5A5" />
      <circle cx="18" cy="34" r="2.5" fill="#000000" />
      <circle cx="17" cy="33" r="0.8" fill="#FFFFFF" />
      <circle cx="12" cy="40" r="2" fill="#F43F5E" />
      <polygon points="10,48 6,42 12,44" fill="#78350F" />
      <circle cx="16" cy="48" r="3" fill="#D97706" />
    </svg>
  );
}

export default function PlayfulPets() {
  const pathname = usePathname();
  const { lang } = useI18n();
  const [activePet, setActivePet] = useState<PetEvent | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    const scheduleNextPet = () => {
      const randomDelay = Math.floor(14000 + Math.random() * 18000);
      timerRef.current = setTimeout(() => {
        spawnRandomPet();
        scheduleNextPet();
      }, randomDelay);
    };

    const initialTimer = setTimeout(() => {
      spawnRandomPet();
      scheduleNextPet();
    }, 3500);

    return () => {
      clearTimeout(initialTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname, lang]);

  const spawnRandomPet = () => {
    const actions: ActionType[] = [
      "cat-walk",
      "cat-peek",
      "bird-fly",
      "bird-swoop",
      "hamster-scurry",
      "hamster-peek",
      "dog-run",
      "dog-peek",
    ];

    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomDir = Math.random() > 0.5 ? "ltr" : "rtl";
    const isAr = lang === "ar";

    let message = "";
    if (randomAction.startsWith("cat")) {
      const msgs = isAr ? CAT_MESSAGES_AR : CAT_MESSAGES_FR;
      message = msgs[Math.floor(Math.random() * msgs.length)];
    } else if (randomAction.startsWith("bird")) {
      const msgs = isAr ? BIRD_MESSAGES_AR : BIRD_MESSAGES_FR;
      message = msgs[Math.floor(Math.random() * msgs.length)];
    } else if (randomAction.startsWith("dog")) {
      const msgs = isAr ? DOG_MESSAGES_AR : DOG_MESSAGES_FR;
      message = msgs[Math.floor(Math.random() * msgs.length)];
    } else {
      const msgs = isAr ? HAMSTER_MESSAGES_AR : HAMSTER_MESSAGES_FR;
      message = msgs[Math.floor(Math.random() * msgs.length)];
    }

    let posY = 50;
    if (randomAction.startsWith("bird")) {
      posY = 10 + Math.random() * 25;
    } else if (randomAction.includes("walk") || randomAction.includes("scurry") || randomAction.includes("run")) {
      posY = 40 + Math.random() * 35;
    }

    setActivePet({
      id: Date.now(),
      action: randomAction,
      direction: randomDir,
      posY,
      message,
    });

    const duration = randomAction.includes("peek") ? 4500 : 6800;
    setTimeout(() => {
      setActivePet(null);
    }, duration);
  };

  if (!activePet || pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden select-none">
      <AnimatePresence key={activePet.id}>
        {/* CAT WALK ACROSS */}
        {activePet.action === "cat-walk" && (
          <motion.div
            initial={{ x: activePet.direction === "ltr" ? "-120px" : "100vw" }}
            animate={{ x: activePet.direction === "ltr" ? "100vw" : "-120px" }}
            transition={{ duration: 6.5, ease: "easeInOut" }}
            style={{ top: `${activePet.posY}%` }}
            className="absolute"
          >
            <div className={`transform ${activePet.direction === "rtl" ? "scale-x-[-1]" : ""}`}>
              <div className="relative flex flex-col items-center">
                <div className="bg-white/85 backdrop-blur-md text-amber-950 text-[11px] font-extrabold px-3 py-1 rounded-full border border-amber-200/60 shadow-sm mb-1 whitespace-nowrap animate-bounce">
                  {activePet.message}
                </div>
                <RealisticCatVector className="w-24 h-24 sm:w-32 sm:h-32 bg-transparent" />
              </div>
            </div>
          </motion.div>
        )}

        {/* CAT PEEK FROM BOTTOM */}
        {activePet.action === "cat-peek" && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: ["100%", "20%", "20%", "100%"] }}
            transition={{ duration: 4.2, times: [0, 0.25, 0.75, 1], ease: "easeInOut" }}
            style={{ left: activePet.direction === "ltr" ? "15%" : "75%" }}
            className="absolute bottom-0"
          >
            <div className="relative flex flex-col items-center">
              <div className="bg-white/85 backdrop-blur-md text-amber-950 text-[12px] font-extrabold px-3.5 py-1.5 rounded-full border border-amber-200/60 shadow-sm mb-2 whitespace-nowrap animate-pulse">
                {activePet.message}
              </div>
              <RealisticCatVector className="w-28 h-28 sm:w-36 sm:h-36 bg-transparent" />
            </div>
          </motion.div>
        )}

        {/* BIRD FLY STRAIGHT */}
        {activePet.action === "bird-fly" && (
          <motion.div
            initial={{ x: activePet.direction === "ltr" ? "-120px" : "100vw", y: 0 }}
            animate={{ 
              x: activePet.direction === "ltr" ? "100vw" : "-120px",
              y: [0, -25, 15, -30, 0]
            }}
            transition={{ duration: 5.8, ease: "linear" }}
            style={{ top: `${activePet.posY}%` }}
            className="absolute"
          >
            <div className={`transform ${activePet.direction === "rtl" ? "scale-x-[-1]" : ""}`}>
              <div className="relative flex flex-col items-center">
                <div className="bg-white/85 backdrop-blur-md text-emerald-950 text-[11px] font-extrabold px-3 py-1 rounded-full border border-emerald-200/60 shadow-sm mb-1 whitespace-nowrap">
                  {activePet.message}
                </div>
                <RealisticBirdVector className="w-20 h-20 sm:w-28 sm:h-28 bg-transparent animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}

        {/* BIRD SWOOP IN & OUT */}
        {activePet.action === "bird-swoop" && (
          <motion.div
            initial={{ x: activePet.direction === "ltr" ? "-100px" : "100vw", y: -50 }}
            animate={{ 
              x: activePet.direction === "ltr" ? "100vw" : "-100px",
              y: [-50, 150, 80, -80]
            }}
            transition={{ duration: 5.2, ease: "easeInOut" }}
            style={{ top: `${activePet.posY}%` }}
            className="absolute"
          >
            <div className={`transform ${activePet.direction === "rtl" ? "scale-x-[-1]" : ""}`}>
              <div className="relative flex flex-col items-center">
                <div className="bg-white/85 backdrop-blur-md text-emerald-950 text-[11px] font-extrabold px-3 py-1 rounded-full border border-emerald-200/60 shadow-sm mb-1 whitespace-nowrap animate-bounce">
                  {activePet.message}
                </div>
                <RealisticBirdVector className="w-22 h-22 sm:w-30 sm:h-30 bg-transparent" />
              </div>
            </div>
          </motion.div>
        )}

        {/* DOG RUN ACROSS */}
        {activePet.action === "dog-run" && (
          <motion.div
            initial={{ x: activePet.direction === "ltr" ? "-130px" : "100vw" }}
            animate={{ x: activePet.direction === "ltr" ? "100vw" : "-130px" }}
            transition={{ duration: 6.0, ease: "easeInOut" }}
            style={{ top: `${activePet.posY}%` }}
            className="absolute"
          >
            <div className={`transform ${activePet.direction === "rtl" ? "scale-x-[-1]" : ""}`}>
              <div className="relative flex flex-col items-center">
                <div className="bg-white/85 backdrop-blur-md text-amber-900 text-[11px] font-extrabold px-3 py-1 rounded-full border border-amber-200/60 shadow-sm mb-1 whitespace-nowrap animate-bounce">
                  {activePet.message}
                </div>
                <RealisticDogVector className="w-26 h-26 sm:w-34 sm:h-34 bg-transparent" />
              </div>
            </div>
          </motion.div>
        )}

        {/* DOG PEEK FROM CORNER */}
        {activePet.action === "dog-peek" && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: ["100%", "20%", "20%", "100%"] }}
            transition={{ duration: 4.2, times: [0, 0.25, 0.75, 1], ease: "easeInOut" }}
            style={{ left: activePet.direction === "ltr" ? "30%" : "60%" }}
            className="absolute bottom-0"
          >
            <div className="relative flex flex-col items-center">
              <div className="bg-white/85 backdrop-blur-md text-amber-900 text-[12px] font-extrabold px-3.5 py-1.5 rounded-full border border-amber-200/60 shadow-sm mb-2 whitespace-nowrap animate-pulse">
                {activePet.message}
              </div>
              <RealisticDogVector className="w-28 h-28 sm:w-36 sm:h-36 bg-transparent" />
            </div>
          </motion.div>
        )}

        {/* HAMSTER SCURRY & PAUSE */}
        {activePet.action === "hamster-scurry" && (
          <motion.div
            initial={{ x: activePet.direction === "ltr" ? "-100px" : "100vw" }}
            animate={{ 
              x: activePet.direction === "ltr" 
                ? ["-100px", "45vw", "45vw", "100vw"] 
                : ["100vw", "45vw", "45vw", "-100px"]
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
                <div className="bg-white/85 backdrop-blur-md text-orange-950 text-[11px] font-extrabold px-3 py-1 rounded-full border border-orange-200/60 shadow-sm mb-1 whitespace-nowrap animate-bounce">
                  {activePet.message}
                </div>
                <RealisticHamsterVector className="w-20 h-20 sm:w-28 sm:h-28 bg-transparent" />
              </div>
            </div>
          </motion.div>
        )}

        {/* HAMSTER PEEK FROM CORNER */}
        {activePet.action === "hamster-peek" && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: ["100%", "15%", "15%", "100%"] }}
            transition={{ duration: 4.0, times: [0, 0.3, 0.7, 1], ease: "easeInOut" }}
            style={{ left: activePet.direction === "ltr" ? "80%" : "10%" }}
            className="absolute bottom-0"
          >
            <div className="relative flex flex-col items-center">
              <div className="bg-white/85 backdrop-blur-md text-orange-950 text-[11px] font-extrabold px-3 py-1 rounded-full border border-orange-200/60 shadow-sm mb-1 whitespace-nowrap animate-pulse">
                {activePet.message}
              </div>
              <RealisticHamsterVector className="w-24 h-24 sm:w-32 sm:h-32 bg-transparent" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
