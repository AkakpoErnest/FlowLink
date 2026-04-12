import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PaymentFlow } from '@/components/payment-flow'

interface Props {
  params: { code: string }
}

export default async function PaymentLinkPage({ params }: Props) {
  const link = await prisma.paymentLink.findUnique({
    where: { code: params.code },
    include: {
      user: { select: { walletAddress: true, name: true, email: true } },
    },
  })

  if (!link || link.status !== 'active') notFound()

  const recipientAddress = link.recipientAddress ?? link.user.walletAddress

  if (!recipientAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-2">
          <p className="text-slate-900 font-semibold">Payment unavailable</p>
          <p className="text-sm text-slate-500">The payment link owner hasn't connected a wallet yet.</p>
        </div>
      </div>
    )
  }

  const isInvoiceLink = link.name?.startsWith('Invoice')
  const ownerName = isInvoiceLink
    ? (link.name ?? 'Invoice Payment')
    : (link.user.name ?? link.user.email ?? 'Unknown')

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header bar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden">
              <img src="/ai-assistant-icon.png" alt="FlowLink" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-slate-900">Flow</span>
              <span className="text-emerald-600">Link</span>
            </span>
          </div>
        </div>
      </header>
      <div className="max-w-lg mx-auto px-4 py-10">
        <PaymentFlow
          paymentLink={{
            id: link.id,
            code: link.code,
            name: link.name,
            network: link.network,
            sourceToken: link.sourceToken,
            amountMin: link.amountMin,
            amountMax: link.amountMax,
            recipientAddress,
            ownerName,
          }}
        />
      </div>
    </div>
  )
}
