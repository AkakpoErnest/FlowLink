'use client'

import { motion } from 'framer-motion'
import { Shield, UserCheck, CheckCircle } from 'lucide-react'

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

const features = [
  {
    icon: UserCheck,
    title: 'KYC / AML screening',
    desc: 'Every payer is identity-verified before they can send funds. Automatic, not a manual review queue.',
    featured: true,
  },
  {
    icon: Shield,
    title: 'Sanctions checks',
    desc: 'Real-time screening against OFAC, UN, and EU lists on every payment attempt. Flagged wallets are blocked before settlement.',
  },
  {
    icon: CheckCircle,
    title: 'On-chain settlement',
    desc: 'Payments settle directly on HashKey Chain. Immutable record, no intermediaries, no reconciliation overhead.',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-24">
      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-xl mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
            What's built in
          </h2>
          <p className="text-lg text-slate-500">
            The compliance layer is not an add-on. It's the product.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={sectionVariants}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              className={`rounded-2xl p-7 border ${f.featured ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-slate-200'}`}
              variants={cardVariants}
              whileHover={{ y: -4, boxShadow: f.featured ? '0 20px 40px rgba(15,27,45,0.3)' : '0 20px 40px rgba(0,0,0,0.08)' }}
              transition={{ duration: 0.2 }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${f.featured ? 'bg-white/10' : 'bg-emerald-50'}`}>
                <f.icon className={`h-5 w-5 ${f.featured ? 'text-white' : 'text-emerald-600'}`} />
              </div>
              <h3 className={`text-base font-bold mb-2 ${f.featured ? 'text-white' : 'text-slate-900'}`}>{f.title}</h3>
              <p className={`text-sm leading-relaxed ${f.featured ? 'text-slate-400' : 'text-slate-500'}`}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
