"use client"

import { motion } from "framer-motion"
import { useRef } from "react"

interface Props {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
}

export default function AnimatedSection({ children, className, delay = 0, direction = "up" }: Props) {
  const ref = useRef(null)

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 60 : direction === "down" ? -60 : 0,
      x: direction === "left" ? 60 : direction === "right" ? -60 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={direction === "none" ? undefined : variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
