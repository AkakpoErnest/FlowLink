'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function CtaSection() {
  return (
    <section className="bg-[#0F1B2D] py-24">
      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-xl space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight" variants={itemVariants}>
            Try it on testnet
          </motion.h2>
          <motion.p className="text-lg text-slate-400" variants={itemVariants}>
            FlowLink is live on HashKey Chain Testnet. Create a payment link, go through the full KYC and sanctions flow, and watch settlement happen on-chain. No real money involved.
          </motion.p>

          <motion.div variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-base px-8 h-12">
                <Link href="/login">
                  Create a payment link
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
