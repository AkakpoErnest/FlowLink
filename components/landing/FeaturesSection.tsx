"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ShieldCheck, UserCheck, Globe, TrendingUp } from "lucide-react"

const features = [
  {
    num: "01",
    icon: ShieldCheck,
    title: "Real-Time Sanctions Screening",
    desc: "Instant checks against OFAC, UN, EU, and HKM consolidated lists. Every transaction, every time — sub-300ms response.",
  },
  {
    num: "02",
    icon: UserCheck,
    title: "KYC / KYA Verification",
    desc: "Identity verification for humans and agents alike. Our Know Your Agent framework extends KYC to the autonomous economy.",
  },
  {
    num: "03",
    icon: Globe,
    title: "Programmable Compliance Vaults",
    desc: "Smart-account factories with configurable policy rules — geofencing, transaction limits, time windows, and sanctions screening enforced on every payment.",
  },
  {
    num: "04",
    icon: TrendingUp,
    title: "AML Transaction Monitoring",
    desc: "Behavioural analytics flag suspicious patterns before they become incidents. Continuous monitoring with automated SAR generation.",
  },
]

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const headerY = useTransform(scrollYProgress, [0, 0.1], [30, 0])
  const headerOp = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  const y0 = useTransform(scrollYProgress, [0.04, 0.18], [45, 0])
  const op0 = useTransform(scrollYProgress, [0.04, 0.18], [0, 1])

  const y1 = useTransform(scrollYProgress, [0.22, 0.36], [45, 0])
  const op1 = useTransform(scrollYProgress, [0.22, 0.36], [0, 1])

  const y2 = useTransform(scrollYProgress, [0.42, 0.56], [45, 0])
  const op2 = useTransform(scrollYProgress, [0.42, 0.56], [0, 1])

  const y3 = useTransform(scrollYProgress, [0.62, 0.76], [45, 0])
  const op3 = useTransform(scrollYProgress, [0.62, 0.76], [0, 1])

  const itemStyles = [
    { y: y0, opacity: op0 },
    { y: y1, opacity: op1 },
    { y: y2, opacity: op2 },
    { y: y3, opacity: op3 },
  ]

  return (
    <div ref={containerRef} id="features" className="relative h-[450vh] bg-[#030706]">
      <div className="sticky top-0 h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 overflow-hidden">
        <div className="max-w-5xl w-full mx-auto">
          <motion.div style={{ y: headerY, opacity: headerOp }} className="mb-12">
            <p className="text-xs font-mono text-emerald-400/70 tracking-[0.2em] uppercase mb-5">
              / ProofLink Engine Capabilities
            </p>
            <h2 className="text-5xl md:text-6xl font-light text-white tracking-tight">
              Core Features
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.num}
                style={itemStyles[i]}
                className="group relative"
              >
                <div className="flex items-start gap-6 p-8 rounded-2xl border border-white/8 hover:border-emerald-500/30 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500">
                  <div className="shrink-0">
                    <span className="text-xs font-mono text-white/20 block mb-4">{feature.num}</span>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors duration-300">
                      <feature.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-light text-white mb-3">{feature.title}</h3>
                    <p className="text-white/35 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
