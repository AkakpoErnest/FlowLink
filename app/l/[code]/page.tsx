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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/20">
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <PaymentFlow
          paymentLink={{
            id: link.id,
            code: link.code,
            name: link.name,
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
