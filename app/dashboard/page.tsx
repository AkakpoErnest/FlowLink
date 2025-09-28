'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard-overview"
import { PaymentLinksModule } from "@/components/payment-links-module"
import { ComplianceVaultsModule } from "@/components/compliance-vaults-module"
import { PayrollRailsModule } from "@/components/payroll-rails-module"
import { RWASubscriptionsModule } from "@/components/rwa-subscriptions-module"
import { ThemeProvider } from "@/components/theme-provider"
import { useAuthStore } from '@/lib/auth'

export default function DashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, user, isLoading } = useAuthStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router, mounted])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <ThemeProvider>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-lg p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-slate-300">
              Manage your crypto payments, compliance, and business operations from your dashboard.
            </p>
          </div>

          {/* Dashboard Overview */}
          <DashboardOverview />

          {/* Main Modules Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Links */}
            <PaymentLinksModule />

            {/* Compliance Vaults */}
            <ComplianceVaultsModule />

            {/* Payroll Rails */}
            <PayrollRailsModule />

            {/* RWA Subscriptions */}
            <RWASubscriptionsModule />
          </div>

          {/* Quick Actions */}
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