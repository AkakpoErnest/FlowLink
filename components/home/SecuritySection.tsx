'use client'

import { motion } from 'framer-motion'
import { UserCheck, Lock, Globe, Clock } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

const securityItems = [
  { icon: UserCheck, title: 'AML / KYC screening', desc: 'Real-time checks against OFAC, UN, and EU sanctions lists. Every payer, every time.' },
  { icon: Lock,      title: 'Audit-ready records',  desc: 'Immutable on-chain trail with full transaction lineage. Your auditors can self-serve.' },
  { icon: Globe,     title: 'HashKey Chain native', desc: "Built natively on the only regulated blockchain designed for institutional finance." },
  { icon: Clock,     title: '24/7 monitoring',      desc: 'Automatic alerts for suspicious patterns. You sleep. We watch.' },
]

export default function SecuritySection() {
  return (
    <section id="security" className="bg-white py-24 border-b border-slate-100">
      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-xl mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Compliant by default
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            Whether you're a VASP, a treasury desk, or just a team that doesn't want to end up in a regulatory grey zone — FlowLink has you covered from day one.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 gap-4 max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {securityItems.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-4 p-5 rounded-xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/30 transition-colors duration-150 cursor-default"
              variants={itemVariants}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.15 }}
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <item.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 mb-0.5">{item.title}</div>
                <div className="text-sm text-slate-500">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
