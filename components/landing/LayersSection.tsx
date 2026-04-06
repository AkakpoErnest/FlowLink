"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const layers = [
  {
    num: "01",
    title: "Human-to-Human",
    subtitle: "Business Stablecoin Payments",
    tag: "Live",
    tagColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    desc: "Instant, compliant stablecoin payments between verified businesses. KYC, sanctions screening, and FATF Travel Rule built in from day one.",
  },
  {
    num: "02",
    title: "Human-to-Agent & Agent-to-Human",
    subtitle: "AI-Assisted Transactions",
    tag: "Q3 2026",
    tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    desc: "Agents that pay and get paid on behalf of humans. Every transaction carries a verifiable compliance certificate.",
  },
  {
    num: "03",
    title: "Agent-to-Agent",
    subtitle: "Autonomous Agentic Commerce",
    tag: "Q1 2027",
    tagColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    desc: "Fully autonomous agents transacting with each other. FlowLink's KYA framework ensures every agent identity is verified and auditable.",
  },
]

function LayerItem({
  layer,
  style,
}: {
  layer: (typeof layers)[0]
  style: Record<string, ReturnType<typeof useTransform>>
}) {
  return (
    <motion.div
      style={style}
      className="flex items-start gap-8 py-8 border-b border-white/8 last:border-0"
    >
      <span className="text-xs font-mono text-white/20 mt-1 w-8 shrink-0">{layer.num}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
          <h3 className="text-2xl md:text-3xl font-light text-white">{layer.title}</h3>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${layer.tagColor}`}
          >
            {layer.tag === "Live" && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
            {layer.tag}
          </span>
        </div>
        <p className="text-white/40 text-sm font-medium mb-3 tracking-wide">{layer.subtitle}</p>
        <p className="text-white/30 text-sm leading-relaxed max-w-xl">{layer.desc}</p>
      </div>
    </motion.div>
  )
}

export function LayersSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Item 1: appears immediately, stays
  const y1 = useTransform(scrollYProgress, [0, 0.15], [50, 0])
  const op1 = useTransform(scrollYProgress, [0, 0.15], [0, 1])

  // Item 2: appears at 30%
  const y2 = useTransform(scrollYProgress, [0.28, 0.45], [50, 0])
  const op2 = useTransform(scrollYProgress, [0.28, 0.45], [0, 1])

  // Item 3: appears at 60%
  const y3 = useTransform(scrollYProgress, [0.58, 0.75], [50, 0])
  const op3 = useTransform(scrollYProgress, [0.58, 0.75], [0, 1])

  // Header slides in at start
  const headerY = useTransform(scrollYProgress, [0, 0.1], [30, 0])
  const headerOp = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <div ref={containerRef} id="layers" className="relative h-[350vh] bg-[#050a09]">
      <div className="sticky top-0 h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 overflow-hidden">
        <div className="max-w-5xl w-full mx-auto">
          {/* Label */}
          <motion.div style={{ y: headerY, opacity: headerOp }}>
            <p className="text-xs font-mono text-emerald-400/70 tracking-[0.2em] uppercase mb-5">
              / How FlowLink Scales Compliance
            </p>
            <h2 className="text-5xl md:text-6xl font-light text-white mb-12 tracking-tight">
              Three Layers
            </h2>
          </motion.div>

          {/* Items */}
          <div className="divide-y divide-white/0">
            <LayerItem layer={layers[0]} style={{ y: y1, opacity: op1 }} />
            <LayerItem layer={layers[1]} style={{ y: y2, opacity: op2 }} />
            <LayerItem layer={layers[2]} style={{ y: y3, opacity: op3 }} />
          </div>
        </div>
      </div>
    </div>
  )
}
