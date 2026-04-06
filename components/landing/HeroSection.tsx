"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0f2420 0%, #1a3530 35%, #2a5248 65%, #1e3d35 100%)",
      }}
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 120%, rgba(52,211,153,0.12) 0%, transparent 70%)",
        }}
      />
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 container mx-auto px-8 pt-28 pb-24 max-w-6xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 bg-white/8 border border-white/15 rounded-full px-4 py-1.5 text-sm text-white/80 mb-10"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          The Compliance Layer for the Agentic Economy
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.75, ease: "easeOut" }}
          className="font-bold text-white leading-[1.0] tracking-tight mb-8 max-w-4xl"
          style={{ fontSize: "clamp(4rem, 9vw, 8rem)" }}
        >
          Fast, audited,
          <br />
          <span className="font-light text-white/65">fully compliant</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.7, ease: "easeOut" }}
          className="text-white/55 text-lg leading-relaxed max-w-xl mb-12"
        >
          FlowLink is the compliance infrastructure for stablecoin payments —
          from human-to-human today to agent-to-agent by 2027. Built-in KYC,
          sanctions screening, and FATF Travel Rule compliance.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.7, ease: "easeOut" }}
          className="flex items-center gap-4 flex-wrap"
        >
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 bg-white text-[#1a3530] font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-white/90 transition-all duration-200 shadow-lg shadow-white/10"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#layers"
            className="inline-flex items-center gap-2 border border-white/25 text-white/80 font-medium text-sm px-7 py-3.5 rounded-full hover:bg-white/5 hover:border-white/40 transition-all duration-200"
          >
            See how it works
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-xs text-white/35 tracking-widest uppercase font-medium">
          Scroll down to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-1.5 h-1.5 rounded-full bg-emerald-400/60"
        />
      </motion.div>
    </section>
  )
}
