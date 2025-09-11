import { DashboardHeader } from "@/components/dashboard-header"
import { CreateLinkForm } from "@/components/create-link-form"
import { PaymentLinksTable } from "@/components/payment-links-table"
import { PaymentsTable } from "@/components/payments-table"
import { StatsCards } from "@/components/stats-cards"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Payment Dashboard</h1>
          <p className="text-muted-foreground">
            Create compliant payment links with built-in KYC and sanctions checking
          </p>
        </div>

        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CreateLinkForm />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <PaymentLinksTable />
            <PaymentsTable />
          </div>
        </div>
      </main>
    </div>
  )
}
