"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-500 ${
        scrolled
          ? "bg-[#1a3530]/90 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      } ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}
      style={{ transitionProperty: "background-color, border-color, opacity, transform" }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
        <Image
          src="/flowlink-logo-final.png"
          alt="FlowLink"
          width={36}
          height={36}
          className="rounded-xl opacity-95 group-hover:opacity-100 transition-opacity"
          priority
        />
        <span className="font-semibold text-white text-lg leading-none">FlowLink</span>
      </Link>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-8 text-sm text-white/60">
        {["Home", "Layers", "Features", "About"].map((item) => (
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

      {/* CTAs */}
      <div className="hidden md:flex items-center gap-3 shrink-0">
        <Link
          href="/login"
          className="text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
        >
          Sign In
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white text-sm font-medium px-5 py-2 rounded-full transition-all duration-200"
        >
          Get Started Free
        </Link>
      </div>
    </header>
  )
}
