"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Shield, CreditCard, Zap, CheckCircle, Clock, DollarSign, Loader2 } from "lucide-react"

interface Stats {
  totalVolume: number
  activeLinks: number
  totalPayments: number
  pendingInvoices: number
}

interface RecentPayment {
  id: string
  payer: string | null
  amount: number
  currency: string
  status: string
  kycPassed: boolean
  sanctionsChecked: boolean
  createdAt: string
}

interface ComplianceMetrics {
  kycRate: number
  amlRate: number
  monitoringRate: number
  score: number
}

export function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<RecentPayment[]>([])
  const [compliance, setCompliance] = useState<ComplianceMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [linksRes, paymentsRes, allPaymentsRes, invoicesRes] = await Promise.all([
          fetch('/api/payment-links'),
          fetch('/api/payments?limit=5'),
          fetch('/api/payments?limit=100'),
          fetch('/api/invoices'),
        ])
        const [links, payments, allPayments, invoices] = await Promise.all([
          linksRes.json(),
          paymentsRes.json(),
          allPaymentsRes.json(),
          invoicesRes.json(),
        ])

        const activeLinks = links.data?.filter((l: any) => l.status === 'active').length ?? 0
        const totalVolume = links.data?.reduce((sum: number, l: any) => sum + (l.totalVolume ?? 0), 0) ?? 0
        const pendingInvoices = invoices.stats?.pending ?? 0

        setStats({
          totalVolume,
          activeLinks,
          totalPayments: payments.total ?? 0,
          pendingInvoices,
        })
        setRecent(payments.data ?? [])

        // Compute real compliance metrics
        const all: RecentPayment[] = allPayments.data ?? []
        if (all.length > 0) {
          const kycRate = Math.round((all.filter(p => p.kycPassed).length / all.length) * 100)
          const amlRate = Math.round((all.filter(p => p.sanctionsChecked).length / all.length) * 100)
          const monitoringRate = Math.round((all.filter(p => p.status === 'completed').length / all.length) * 100)
          const score = Math.round((kycRate + amlRate + monitoringRate) / 3)
          setCompliance({ kycRate, amlRate, monitoringRate, score })
        }
      } catch (e) {
        console.error('Dashboard load error:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const statCards = stats
    ? [
        { title: 'Total Volume', value: `$${stats.totalVolume.toLocaleString()}`, icon: DollarSign, color: 'text-teal-600', bg: 'bg-teal-50' },
        { title: 'Active Payment Links', value: stats.activeLinks.toString(), icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Total Payments', value: stats.totalPayments.toString(), icon: Zap, color: 'text-violet-600', bg: 'bg-violet-50' },
        { title: 'Pending Invoices', value: stats.pendingInvoices.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
      ]
    : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 mt-0.5 text-sm">Your compliance payment activity</p>
        </div>
        <Button size="sm" className="bg-teal-600 hover:bg-teal-500 text-white">Generate Report</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
                  <span className="text-sm text-slate-400">Loading…</span>
                </CardContent>
              </Card>
            ))
          : statCards.map((s) => (
              <Card key={s.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">{s.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${s.bg}`}>
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent payments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900">Recent Payments</CardTitle>
            <CardDescription>Last 5 payments received</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : recent.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Zap className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No payments yet. Share a payment link to get started.</p>
              </div>
            ) : (
              recent.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${p.status === 'completed' ? 'bg-teal-500' : p.status === 'pending' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{p.payer ? `${p.payer.slice(0, 6)}…${p.payer.slice(-4)}` : 'Unknown'}</p>
                      <p className="text-xs text-slate-500 capitalize">{p.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{p.amount} {p.currency}</p>
                    <p className="text-xs text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Compliance score */}
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900">Compliance Status</CardTitle>
            <CardDescription>HashKey Testnet · Live</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {loading ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : compliance ? (
              <>
                <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-xl border border-teal-100">
                  <div className="text-4xl font-black text-teal-600">{compliance.score}</div>
                  <div>
                    <p className="font-semibold text-slate-900">Compliance Score</p>
                    <p className="text-sm text-slate-500">Based on {stats?.totalPayments ?? 0} payments</p>
                  </div>
                </div>
                {[
                  { label: 'KYC Verification', value: compliance.kycRate },
                  { label: 'AML Screening', value: compliance.amlRate },
                  { label: 'Transaction Monitoring', value: compliance.monitoringRate },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-semibold text-slate-900">{item.value}%</span>
                    </div>
                    <Progress value={item.value} className="h-1.5" />
                  </div>
                ))}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-100 text-sm text-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                  No alerts · All systems normal
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Shield className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No payment data yet. Compliance metrics will appear here once you receive payments.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
