"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Link2 } from "lucide-react"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-500 ${
        scrolled
          ? "bg-[#1a3530]/90 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
          <Link2 className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-lg tracking-tight">
          <span className="text-white">Flow</span>
          <span className="text-emerald-400">Link</span>
        </span>
      </Link>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-8 text-sm text-white/60">
        {["Home", "Layers", "Features", "About", "Demo"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="hover:text-white transition-colors duration-200 relative group"
          >
            {item}
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-emerald-400 group-hover:w-full transition-all duration-300" />
          </a>
        ))}
      </nav>

      {/* CTA */}
      <Link
        href="/auth/signin"
        className="hidden md:inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white text-sm font-medium px-5 py-2 rounded-full transition-all duration-200"
      >
        Get Started
      </Link>
    </motion.header>
  )
}
