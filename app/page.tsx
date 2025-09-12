import { DashboardHeader } from "@/components/dashboard-header"
import { CreateLinkForm } from "@/components/create-link-form"
import { PaymentLinksTable } from "@/components/payment-links-table"
import { PaymentsTable } from "@/components/payments-table"
import { StatsCards } from "@/components/stats-cards"
import { Button } from "@/components/ui/button"
import { Play, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-12 space-y-12">
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            FlowLink Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Crypto Payments You Can Trust - Built with compliance and security at the core
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/demo">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Live Demo
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary/20 hover:border-primary/40 hover:bg-primary/5"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              View Docs
            </Button>
          </div>
        </div>

        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CreateLinkForm />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <PaymentLinksTable />
              <PaymentsTable />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
