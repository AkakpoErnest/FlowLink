'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard-overview"
import { PaymentLinksModule } from "@/components/payment-links-module"
import { ComplianceVaultsModule } from "@/components/compliance-vaults-module"
import { PayrollRailsModule } from "@/components/payroll-rails-module"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4" />
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  // @ts-ignore
  const name = session.user?.name || session.user?.walletAddress || 'User'

  return (
    <ThemeProvider>
      <DashboardLayout>
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-lg p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {name}!
            </h1>
            <p className="text-slate-300">
              Manage your crypto payments, compliance, and business operations from your dashboard.
            </p>
          </div>

          <DashboardOverview />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PaymentLinksModule />
            <ComplianceVaultsModule />
            <PayrollRailsModule />
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => router.push('/links')}
              >
                Create Payment Link
              </Button>
              <Button
                variant="outline"
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                onClick={() => router.push('/dashboard')}
              >
                View Analytics
              </Button>
              <Button
                variant="outline"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                onClick={() => router.push('/dashboard')}
              >
                Manage Vaults
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ThemeProvider>
  )
}
