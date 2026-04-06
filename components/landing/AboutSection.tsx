"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"

function CountUp({
  to,
  suffix = "",
  prefix = "",
  duration = 2,
}: {
  to: number
  suffix?: string
  prefix?: string
  duration?: number
}) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - elapsed, 3)
      setValue(Math.round(eased * to))
      if (elapsed < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, to, duration])

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}

const stats = [
  { label: "Stablecoin Market", value: 260, prefix: "$", suffix: "B+", duration: 1.8 },
  { label: "AI Agents Active", value: 49000, prefix: "", suffix: "+", duration: 2.0 },
  { label: "Compliance Layers", value: 3, prefix: "", suffix: "", duration: 1.2 },
]

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: "-150px" })

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden py-32"
      style={{
        background:
          "linear-gradient(160deg, #0f2420 0%, #1a3530 50%, #2a5248 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(52,211,153,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-xs font-mono text-emerald-400/70 tracking-[0.2em] uppercase mb-6"
            >
              / About FlowLink
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-light text-white leading-tight mb-8"
            >
              Compliance for the
              <br />
              <span className="text-emerald-300">agentic economy</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="text-white/45 leading-relaxed mb-10 text-base"
            >
              As AI agents become economic actors, the compliance layer must
              evolve. FlowLink's ProofLink Engine verifies every participant —
              human or agent — before value moves. Built on HashKey Chain, the
              only regulated blockchain for institutional finance.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="flex gap-4 flex-wrap"
            >
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 bg-white text-[#1a3530] font-semibold text-sm px-6 py-3 rounded-full hover:bg-white/90 transition-all duration-200"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 border border-white/25 text-white/70 text-sm px-6 py-3 rounded-full hover:bg-white/5 transition-all duration-200"
              >
                See how it works
              </a>
            </motion.div>
          </div>

          {/* Right: stats */}
          <div className="grid grid-cols-1 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: "easeOut" }}
                className="flex items-center justify-between p-6 rounded-2xl border border-white/8 bg-white/[0.03]"
              >
                <span className="text-white/45 text-sm font-medium">{stat.label}</span>
                <span className="text-3xl font-light text-white">
                  <CountUp
                    to={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    duration={stat.duration}
                  />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
