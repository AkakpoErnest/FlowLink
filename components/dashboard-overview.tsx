"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Shield, Zap, CheckCircle, Loader2, Download, ChevronDown, Link2, FileText, Wallet } from "lucide-react"
import { AgentPaymentWidget } from "@/components/agent-payment-widget"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"

interface Stats {
  totalVolume: number
  activePaymentLinks: number
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

function StatIcon({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, #0a2e2e 0%, #0f3d3d 100%)' }}
    >
      {children}
    </div>
  )
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
    let cancelled = false
    const controller = new AbortController()

    async function loadAll() {
      try {
        const [statsRes, paymentsRes, linksRes] = await Promise.allSettled([
          fetch('/api/dashboard/stats', { signal: controller.signal }),
          fetch('/api/payments?limit=5', { signal: controller.signal }),
          fetch('/api/payment-links', { signal: controller.signal }),
        ])

        if (cancelled) return

        // Parse payments — API returns { success, data, total } wrapper
        let recentPayments: RecentPayment[] = []
        let totalPayments = 0
        if (paymentsRes.status === 'fulfilled' && paymentsRes.value.ok) {
          const json = await paymentsRes.value.json()
          recentPayments = Array.isArray(json) ? json : (json.data ?? json.payments ?? [])
          totalPayments = json.total ?? recentPayments.length
        }
        setRecent(recentPayments)

        // Try dedicated stats route first; fall back to computing from links
        if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
          const data = await statsRes.value.json()
          setStats({
            totalVolume: data.totalVolume ?? 0,
            activePaymentLinks: data.activePaymentLinks ?? 0,
            totalPayments: data.totalPayments ?? totalPayments,
            pendingInvoices: data.pendingInvoices ?? 0,
          })
        } else {
          // Compute stats from payment-links (fallback)
          let activePaymentLinks = 0
          let totalVolume = 0
          if (linksRes.status === 'fulfilled' && linksRes.value.ok) {
            const json = await linksRes.value.json()
            const links: any[] = Array.isArray(json) ? json : (json.data ?? [])
            activePaymentLinks = links.filter((l: any) => l.status === 'active').length
            totalVolume = links.reduce((s: number, l: any) => s + (Number(l.totalVolume) || 0), 0)
            setHasPaymentLink(links.length > 0)
          }
          setStats({ totalVolume, activePaymentLinks, totalPayments, pendingInvoices: 0 })
        }
      } catch (e) {
        if (cancelled) return
        console.error('Dashboard load error:', e)
        setStats({ totalVolume: 0, activePaymentLinks: 0, totalPayments: 0, pendingInvoices: 0 })
        setRecent([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadAll()
    return () => { cancelled = true; controller.abort() }
  }, [])

  const s = stats ?? { totalVolume: 0, activePaymentLinks: 0, totalPayments: 0, pendingInvoices: 0 }
  const statCards = [
    {
      title: 'Total Volume',
      value: `$${s.totalVolume.toLocaleString()}`,
      icon: (
        <StatIcon>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3,20 8,14 12,17 17,9 22,12 25,7" />
            <polyline points="21,7 25,7 25,11" />
          </svg>
        </StatIcon>
      ),
    },
    {
      title: 'Active Payment Links',
      value: s.activePaymentLinks.toString(),
      icon: (
        <StatIcon>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="8" height="8" rx="1.5"/>
            <rect x="5.5" y="5.5" width="3" height="3" fill="#34d399" stroke="none" rx="0.5"/>
            <rect x="17" y="3" width="8" height="8" rx="1.5"/>
            <rect x="19.5" y="5.5" width="3" height="3" fill="#34d399" stroke="none" rx="0.5"/>
            <rect x="3" y="17" width="8" height="8" rx="1.5"/>
            <rect x="5.5" y="19.5" width="3" height="3" fill="#34d399" stroke="none" rx="0.5"/>
            <path d="M19 20 L22 17 M17 22 C16 22 14.5 20.5 14.5 19 C14.5 17.5 16 16 17.5 16 L19 16 M22 19 C23 19 24.5 20.5 24.5 22 C24.5 23.5 23 25 21.5 25 L20 25"/>
          </svg>
        </StatIcon>
      ),
    },
    {
      title: 'Total Payments',
      value: s.totalPayments.toString(),
      icon: (
        <StatIcon>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="11" x2="23" y2="11"/>
            <polyline points="17,6 23,11 17,16"/>
            <line x1="23" y1="17" x2="5" y2="17"/>
            <polyline points="11,22 5,17 11,12"/>
          </svg>
        </StatIcon>
      ),
    },
    {
      title: 'Pending Invoices',
      value: s.pendingInvoices.toString(),
      icon: (
        <StatIcon>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4 L18 4 L22 8 L22 15 M6 4 L6 24 L15 24"/>
            <polyline points="18,4 18,8 22,8"/>
            <line x1="10" y1="11" x2="18" y2="11"/>
            <line x1="10" y1="14" x2="15" y2="14"/>
            <circle cx="20" cy="21" r="5"/>
            <polyline points="20,18.5 20,21 22,22.5"/>
          </svg>
        </StatIcon>
      ),
    },
  ]

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
      desc: "Connect your wallet so you can receive funds on Celo.",
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
          : statCards.map((card) => (
              <Card key={card.title} className={card.title === 'Total Volume' ? 'relative overflow-hidden' : ''}>
                {card.title === 'Total Volume' && (
                  <img src="/image7.jpeg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none" />
                )}
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                  <CardTitle className={`text-sm font-medium ${card.title === 'Total Volume' ? 'text-slate-700' : 'text-slate-500'}`}>{card.title}</CardTitle>
                  {card.icon}
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-2xl font-bold text-slate-900">{card.value}</div>
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
            <CardDescription>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                Celo Mainnet · Live
              </span>
            </CardDescription>
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
