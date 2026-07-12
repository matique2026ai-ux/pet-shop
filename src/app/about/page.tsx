"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, PawPrint, Bird, Shield, Award, Users, ChevronRight } from "lucide-react"
import AnimatedSection from "@/components/animated-section"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
}

export default function AboutPage() {
  return (
    <>
      <section className="relative min-h-[50vh] flex items-center bg-gradient-to-br from-brand-900 via-brand-800 to-vet-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-brand-400/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white text-xs font-semibold rounded-full mb-6">
              <Heart className="w-3 h-3" /> Our Story
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">About Paws & Wings</h1>
            <p className="text-lg text-white/70 max-w-xl">Where passion for animals meets professional care. Since 2018, we&apos;ve been the trusted destination for pet lovers.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <span className="text-brand-600 text-sm font-semibold tracking-widest uppercase">Who We Are</span>
              <h2 className="text-4xl font-bold mt-3 mb-6 tracking-tight">A Pet Shop & Vet Clinic Combined</h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>Paws & Wings was born from a simple idea: that pet owners should have a single, trusted destination for all their needs — from premium food and accessories to expert veterinary care.</p>
                <p>Founded in 2018 by Dr. Amina Benali, a passionate veterinarian with over 12 years of experience, our clinic-plus-store concept has made us a beloved part of the Algiers community.</p>
                <p>What sets us apart is our holistic approach. When you shop with us, you&apos;re not just buying pet supplies — you&apos;re getting advice from people who truly understand animals. Our team includes veterinarians, certified nurses, and pet care specialists who are always happy to help.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="bg-gradient-to-br from-brand-100 via-white to-vet-100 rounded-[2rem] p-8 border border-neutral-100">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: PawPrint, label: "500+ Cat Products" },
                    { icon: Bird, label: "300+ Bird Products" },
                    { icon: Shield, label: "Quality Guaranteed" },
                    { icon: Award, label: "Award Winning Vet" },
                    { icon: Users, label: "5000+ Happy Pets" },
                    { icon: Heart, label: "Family Owned" },
                  ].map((item, i) => (
                    <motion.div key={item.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                      variants={fadeUp}
                      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-100">
                      <item.icon className="w-5 h-5 text-brand-600" />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection className="text-center mb-14">
            <span className="text-brand-600 text-sm font-semibold tracking-widest uppercase">Why Choose Us</span>
            <h2 className="text-4xl font-bold mt-3 tracking-tight">What Makes Us Different</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: PawPrint, title: "Pet-First Philosophy", desc: "Every decision we make puts your pet's health and happiness first. From product selection to medical care, your pet is our priority." },
              { icon: Award, title: "Expert Team", desc: "Our staff includes licensed veterinarians, certified nurses, and trained pet care specialists with years of hands-on experience." },
              { icon: Shield, title: "Quality Assurance", desc: "We carefully select every product in our store. Only trusted brands and premium quality items that meet our strict standards." },
            ].map((item, i) => (
              <motion.div key={item.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white rounded-2xl p-8 border border-neutral-100 text-center hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-500">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-brand-500 to-brand-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Visit Us Today</h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">Come see why thousands of pet parents trust Paws & Wings.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-brand-700 font-semibold rounded-full hover:bg-neutral-100 transition-colors shadow-lg">
              Get Directions <ChevronRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}



