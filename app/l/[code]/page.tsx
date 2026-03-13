"use client"

import { PaymentFlow } from '@/components/payment-flow'

interface PaymentLinkPageProps {
  params: {
    code: string
  }
}

export default function PaymentLinkPage({ params }: PaymentLinkPageProps) {
  // Mock payment link data - in real app, fetch from API
  const paymentLink = {
    id: params.code,
    code: params.code,
    sourceToken: "USDC",
    destStable: "USDC", 
    amountMin: 100,
    amountMax: 1000,
    requiresKyc: true
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-purple-50/30">
      <div className="container mx-auto px-4 py-8">
        <PaymentFlow paymentLink={paymentLink} />
      </div>
    </div>
  )
}