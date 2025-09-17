import { PaymentLinksTable } from '@/components/payment-links-table'

export default function LinksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Payment Links</h1>
          <p className="text-muted-foreground">
            Create and manage payment links for instant crypto transactions
          </p>
        </div>
        
        <PaymentLinksTable />
      </div>
    </div>
  )
}