"use client"

import { motion } from "framer-motion"

const layers = [
  {
    num: "01",
    title: "Human-to-Human",
    subtitle: "Business Stablecoin Payments",
    tag: "Live",
    tagStyle: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    live: true,
    desc: "Instant, compliant stablecoin payments between verified businesses. KYC, sanctions screening, and FATF Travel Rule built in from day one.",
  },
  {
    num: "02",
    title: "Human-to-Agent & Agent-to-Human",
    subtitle: "AI-Assisted Transactions",
    tag: "Q1 2026",
    tagStyle: "bg-white/8 text-white/50 border-white/15",
    live: false,
    desc: "Agents that pay and get paid on behalf of humans. Every transaction carries a verifiable compliance certificate.",
  },
  {
    num: "03",
    title: "Agent-to-Agent",
    subtitle: "Autonomous Agentic Commerce",
    tag: "Q1 2026",
    tagStyle: "bg-white/8 text-white/50 border-white/15",
    live: false,
    desc: "Fully autonomous agents transacting with each other. FlowLink's KYA framework ensures every agent identity is verified and auditable.",
  },
]

export function LayersSection() {
  return (
    <section id="layers" className="bg-black py-24 md:py-32">
      <div className="container mx-auto px-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16"
        >
          <p className="text-xs font-mono text-emerald-400/70 tracking-[0.2em] uppercase mb-5">
            / How FlowLink Scales Compliance
          </p>
          <h2 className="text-5xl md:text-6xl font-light text-white tracking-tight">
            Three Layers
          </h2>
        </motion.div>

        {/* Rows */}
        <div className="divide-y divide-white/8">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: "easeOut" }}
              className={`group py-10 flex items-start gap-8 transition-opacity duration-300 ${
                i === 0 ? "opacity-100" : "opacity-60 hover:opacity-100"
              }`}
            >
              {/* Number */}
              <span className="text-xs font-mono text-emerald-400 mt-1.5 w-8 shrink-0">
                {layer.num}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h3 className="text-2xl md:text-3xl font-light text-white">
                    {layer.title}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${layer.tagStyle}`}
                  >
                    {layer.live && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                    {layer.tag}
                  </span>
                </div>
                <p className="text-white/40 text-sm font-medium tracking-wide mb-3">
                  {layer.subtitle}
                </p>
                <p className="text-white/30 text-sm leading-relaxed max-w-2xl">
                  {layer.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
