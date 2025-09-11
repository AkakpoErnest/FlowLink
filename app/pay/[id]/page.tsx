import { PaymentFlow } from "@/components/payment-flow"
import { notFound } from "next/navigation"

// Mock function to get payment link details
async function getPaymentLink(id: string) {
  // In a real app, this would fetch from your database
  const mockLinks = {
    abc123: {
      id: "abc123",
      amount: "500.00",
      memo: "Service payment",
      requireKYC: true,
      checkSanctions: true,
      merchant: "0x1234567890123456789012345678901234567890",
      token: "USDC",
      status: "active",
    },
    def456: {
      id: "def456",
      amount: "250.00",
      memo: "Product purchase",
      requireKYC: false,
      checkSanctions: true,
      merchant: "0x1234567890123456789012345678901234567890",
      token: "USDC",
      status: "active",
    },
  }

  return mockLinks[id as keyof typeof mockLinks] || null
}

export default async function PaymentPage({ params }: { params: { id: string } }) {
  const paymentLink = await getPaymentLink(params.id)

  if (!paymentLink) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <span className="text-sm font-bold text-primary-foreground">C</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-card-foreground">CompliantPay</h1>
              <p className="text-xs text-muted-foreground">Secure Payment</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <PaymentFlow paymentLink={paymentLink} />
      </main>
    </div>
  )
}
