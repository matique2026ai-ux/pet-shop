"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";

// Detect if the device is mobile / low-end — skip framer-motion to avoid OOM
function useIsLightMode() {
  const prefersReduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () =>
      setIsMobile(
        window.innerWidth < 768 ||
        /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return prefersReduced || isMobile;
}

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedSection({ children, className = "", delay = 0 }: Props) {
  const lite = useIsLightMode();
  if (lite) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const fadeInUpVariant: any = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export function StaggerSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const lite = useIsLightMode();
  if (lite) return <div className={className}>{children}</div>;
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, className = "" }: { children: ReactNode; className?: string }) {
  const lite = useIsLightMode();
  if (lite) return <div className={className}>{children}</div>;
  return (
    <motion.div variants={fadeInUpVariant} className={className}>
      {children}
    </motion.div>
  );
}
