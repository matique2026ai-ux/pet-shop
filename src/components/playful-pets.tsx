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

/* 100% Transparent Real Pet Photography Cutouts (NO Background Box) */
function RealCatPhoto({ className }: { className?: string }) {
  return <img src="/cat-real.png" alt="Cat" className={`${className} object-contain select-none pointer-events-none`} />;
}

function RealDogPhoto({ className }: { className?: string }) {
  return <img src="/dog-real.png" alt="Dog" className={`${className} object-contain select-none pointer-events-none`} />;
}

function RealBirdPhoto({ className }: { className?: string }) {
  return <img src="/bird-real.png" alt="Bird" className={`${className} object-contain select-none pointer-events-none`} />;
}

function RealHamsterPhoto({ className }: { className?: string }) {
  return <img src="/hamster-real.png" alt="Hamster" className={`${className} object-contain select-none pointer-events-none`} />;
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
                <RealCatPhoto className="w-24 h-24 sm:w-32 sm:h-32 bg-transparent" />
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
              <RealCatPhoto className="w-28 h-28 sm:w-36 sm:h-36 bg-transparent" />
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
                <RealBirdPhoto className="w-20 h-20 sm:w-28 sm:h-28 bg-transparent animate-pulse" />
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
                <RealBirdPhoto className="w-22 h-22 sm:w-30 sm:h-30 bg-transparent" />
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
                <RealDogPhoto className="w-26 h-26 sm:w-34 sm:h-34 bg-transparent" />
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
              <RealDogPhoto className="w-28 h-28 sm:w-36 sm:h-36 bg-transparent" />
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
                <RealHamsterPhoto className="w-20 h-20 sm:w-28 sm:h-28 bg-transparent" />
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
              <RealHamsterPhoto className="w-24 h-24 sm:w-32 sm:h-32 bg-transparent" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
