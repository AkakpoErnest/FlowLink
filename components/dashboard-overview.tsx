"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Shield, Zap, CheckCircle, Loader2, Download, ChevronDown, Link2, FileText, Wallet, TrendingUp, QrCode, ArrowLeftRight, Receipt } from "lucide-react"
import { AgentPaymentWidget } from "@/components/agent-payment-widget"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"

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

async function downloadReport(type: 'payments' | 'invoices' | 'payroll') {
  try {
    const res = await fetch(`/api/reports?type=${type}`)
    if (!res.ok) return
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flowlink-${type}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Export failed:', e)
  }
}

export function DashboardOverview() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<RecentPayment[]>([])
  const [compliance, setCompliance] = useState<ComplianceMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [agents, setAgents] = useState<{ id: string; name: string; walletAddress?: string | null }[]>([])
  const [hasPaymentLink, setHasPaymentLink] = useState(false)
  const [hasInvoice, setHasInvoice] = useState(false)
  const [dismissedOnboarding, setDismissedOnboarding] = useState(false)

  // @ts-ignore
  const walletAddress = session?.user?.walletAddress as string | null | undefined
  const firstName = session?.user?.name?.split(' ')[0] ?? 'there'

  useEffect(() => {
    async function load() {
      try {
        const [linksRes, paymentsRes, allPaymentsRes, invoicesRes, agentsRes] = await Promise.all([
          fetch('/api/payment-links'),
          fetch('/api/payments?limit=5'),
          fetch('/api/payments?limit=100'),
          fetch('/api/invoices'),
          fetch('/api/agents'),
        ])
        const [links, payments, allPayments, invoices, agentsData] = await Promise.all([
          linksRes.json(),
          paymentsRes.json(),
          allPaymentsRes.json(),
          invoicesRes.json(),
          agentsRes.json(),
        ])
        setAgents(agentsData.data ?? [])

        const allLinks = links.data ?? []
        const activeLinks = allLinks.filter((l: any) => l.status === 'active').length
        const totalVolume = allLinks.reduce((sum: number, l: any) => sum + (l.totalVolume ?? 0), 0)
        const pendingInvoices = invoices.stats?.pending ?? 0
        const totalInvoices = (invoices.stats?.pending ?? 0) + (invoices.stats?.paid ?? 0) + (invoices.stats?.draft ?? 0)

        setHasPaymentLink(allLinks.length > 0)
        setHasInvoice(totalInvoices > 0)

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
        { title: 'Total Volume', value: `$${stats.totalVolume.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bgFrom: 'from-emerald-50', bgTo: 'to-emerald-100' },
        { title: 'Active Payment Links', value: stats.activeLinks.toString(), icon: QrCode, color: 'text-blue-600', bgFrom: 'from-blue-50', bgTo: 'to-blue-100' },
        { title: 'Total Payments', value: stats.totalPayments.toString(), icon: ArrowLeftRight, color: 'text-violet-600', bgFrom: 'from-violet-50', bgTo: 'to-violet-100' },
        { title: 'Pending Invoices', value: stats.pendingInvoices.toString(), icon: Receipt, color: 'text-amber-600', bgFrom: 'from-amber-50', bgTo: 'to-amber-100' },
      ]
    : []

  const hasCompletedSetup = hasPaymentLink && hasInvoice && !!walletAddress
  const onboardingSteps = [
    {
      step: 1,
      title: "Create your first payment link",
      desc: "Share it with anyone to receive crypto payments instantly.",
      icon: Link2,
      done: hasPaymentLink,
    },
    {
      step: 2,
      title: "Link your wallet",
      desc: "Connect your wallet so you can receive funds on HashKey Chain.",
      icon: Wallet,
      done: !!walletAddress,
    },
    {
      step: 3,
      title: "Create an invoice",
      desc: "Professional invoices with built-in KYC/AML compliance.",
      icon: FileText,
      done: hasInvoice,
    },
  ]
  const completedSteps = onboardingSteps.filter(s => s.done).length

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            👋 Hey {firstName}!
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Here&apos;s what&apos;s happening with your payments today.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export Report
              <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => downloadReport('payments')}>
              Payments CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => downloadReport('invoices')}>
              Invoices CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => downloadReport('payroll')}>
              Payroll CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Onboarding steps — shown until all 3 are complete or dismissed */}
      {!hasCompletedSetup && !dismissedOnboarding && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Let&apos;s get you started!</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {completedSteps} of 3 steps complete
              </p>
            </div>
            <button
              onClick={() => setDismissedOnboarding(true)}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              I&apos;ll do this later
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {onboardingSteps.map(({ step, title, desc, icon: Icon, done }) => (
              <div
                key={step}
                className={cn(
                  "rounded-xl border p-5 transition-shadow hover:shadow-sm",
                  done ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-3",
                    done ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                  )}
                >
                  {done ? "✓" : step}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{title}</h3>
                <p className="text-xs text-slate-500">{desc}</p>
                {!done && (
                  <span className="text-xs text-emerald-600 font-medium mt-3 block">
                    Do it now →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
              <Card key={s.title} className={s.title === 'Total Volume' ? 'relative overflow-hidden' : ''}>
                {s.title === 'Total Volume' && (
                  <img src="/image7.jpeg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none" />
                )}
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                  <CardTitle className={`text-sm font-medium ${s.title === 'Total Volume' ? 'text-slate-700' : 'text-slate-500'}`}>{s.title}</CardTitle>
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.bgFrom} ${s.bgTo} flex items-center justify-center`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} strokeWidth={1.5} />
                  </div>
                </CardHeader>
                <CardContent className="relative">
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
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${p.status === 'completed' ? 'bg-emerald-600' : p.status === 'pending' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{p.payer ? `${p.payer.slice(0, 6)}…${p.payer.slice(-4)}` : 'Unknown'}</p>
                      <p className="text-xs text-slate-500 capitalize">{p.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{p.amount} {p.currency}</p>
                    <p className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</p>
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
                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-4xl font-black text-emerald-600">{compliance.score}</div>
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

      {/* Agent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentPaymentWidget agents={agents} />
      </div>
    </div>
  )
}
