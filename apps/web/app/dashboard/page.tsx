import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard-overview"
import { PaymentLinksModule } from "@/components/payment-links-module"
import { ComplianceVaultsModule } from "@/components/compliance-vaults-module"
import { PayrollRailsModule } from "@/components/payroll-rails-module"
import { RwaSubscriptionsModule } from "@/components/rwa-subscriptions-module"
import { ThemeProvider } from "@/components/theme-provider"

export default function DashboardPage() {
  return (
    <ThemeProvider>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Dashboard Overview */}
          <DashboardOverview />
          
          {/* Modules Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Links Module */}
            <PaymentLinksModule />
            
            {/* Compliance Vaults Module */}
            <ComplianceVaultsModule />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payroll Rails Module */}
            <PayrollRailsModule />
            
            {/* RWA Subscriptions Module */}
            <RwaSubscriptionsModule />
          </div>
        </div>
      </DashboardLayout>
    </ThemeProvider>
  )
}
