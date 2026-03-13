'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { AIInvoiceModule } from '@/components/ai-invoice-module'
import { ThemeProvider } from '@/components/theme-provider'
import { useAuthStore } from '@/lib/auth'

export default function InvoicesPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router, mounted])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading invoices...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <ThemeProvider>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
            <h1 className="text-3xl font-bold text-white mb-2">AI Agent Invoices</h1>
            <p className="text-slate-300">
              Issue and manage crypto-native invoices for AI agents and automated services. Pay via HashKey Chain, Polygon, or Ethereum.
            </p>
          </div>
          <AIInvoiceModule />
        </div>
      </DashboardLayout>
    </ThemeProvider>
  )
}
