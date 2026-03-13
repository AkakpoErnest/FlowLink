import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import {
  Shield,
  Zap,
  Building2,
  Briefcase,
  ArrowRight,
  CheckCircle,
  Lock,
  Bot,
  Layers,
  FileText,
  ChevronRight,
  Globe,
  Clock,
  TrendingUp,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative bg-slate-950 overflow-hidden pt-16">
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-teal-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/6 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — copy */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                Now live on HashKey Chain Testnet
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
                  Enterprise Crypto Payments,{' '}
                  <span className="text-teal-400">Built for Compliance</span>
                </h1>
                <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
                  Create compliant payment links with built-in KYC, sanctions screening, and real-time settlement on HashKey Chain — in minutes, not months.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base px-8 h-12">
                  <Link href="/login">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-12 text-base">
                  <Link href="/#how-it-works">
                    See how it works
                  </Link>
                </Button>
              </div>

              {/* Trust micro-proof */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                {[
                  'No setup fees',
                  'SOC 2 compliant',
                  '24/7 monitoring',
                ].map((t) => (
                  <div key={t} className="flex items-center gap-1.5 text-sm text-slate-400">
                    <CheckCircle className="h-4 w-4 text-teal-500 shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — product mockup */}
            <div className="relative">
              {/* Browser chrome card */}
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                {/* Browser bar */}
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 bg-white border border-slate-200 rounded-md px-3 py-1 text-xs text-slate-400 font-mono">
                    flowlink.app/pay/ernest-korkua
                  </div>
                </div>

                {/* Payment UI */}
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">EK</div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">Ernest Korkua</div>
                      <div className="text-xs text-slate-400">0x4f2a...93b1 · HashKey Chain</div>
                    </div>
                    <div className="ml-auto flex items-center gap-1 text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-full border border-teal-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                      Active
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="text-xs text-slate-400 mb-1">Amount requested</div>
                    <div className="text-3xl font-bold text-slate-900">500 <span className="text-lg text-slate-400">USDC</span></div>
                    <div className="text-xs text-slate-400 mt-0.5">≈ $500.00 USD · HashKey Testnet</div>
                  </div>

                  {/* Compliance checks */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Compliance Status</div>
                    {[
                      { label: 'KYC Verification', status: 'Passed', color: 'teal' },
                      { label: 'Sanctions Screening', status: 'Clear', color: 'teal' },
                      { label: 'AML Check', status: 'Clear', color: 'teal' },
                    ].map((check) => (
                      <div key={check.label} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-teal-500 shrink-0" />
                        <span className="text-slate-600 flex-1">{check.label}</span>
                        <span className="text-xs text-teal-700 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">{check.status}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                    Pay 500 USDC
                  </button>

                  <p className="text-center text-xs text-slate-400">Secured by FlowLink · Powered by HashKey Chain</p>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-slate-100 px-3 py-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center">
                  <CheckCircle className="h-3.5 w-3.5 text-teal-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">Verified in 0.3s</div>
                  <div className="text-xs text-slate-400">Real-time screening</div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-6 bg-white rounded-xl shadow-lg border border-slate-100 px-3 py-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">AML Compliant</div>
                  <div className="text-xs text-slate-400">HashKey Standard</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fade to white for next section */}
        <div className="h-20 bg-gradient-to-b from-slate-950 to-white" />
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section className="bg-white border-y border-slate-100">
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { stat: '$2.4M+', label: 'Compliant payments processed' },
              { stat: '99.7%', label: 'Compliance screening rate' },
              { stat: '< 1s', label: 'Average settlement time' },
              { stat: '6', label: 'Supported chains' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-3xl font-extrabold text-slate-900 mb-1">{item.stat}</div>
                <div className="text-sm text-slate-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section id="features" className="bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium mb-4">
              Platform features
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Everything your finance team needs
            </h2>
            <p className="text-lg text-slate-500">
              From one-time payment links to automated payroll — FlowLink handles the compliance layer so you don't have to.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                color: 'teal',
                title: 'Compliance First',
                desc: 'Every transaction is screened in real-time against global sanctions lists and KYC requirements before it settles.',
                tag: 'AML · KYC · Sanctions',
              },
              {
                icon: Zap,
                color: 'blue',
                title: 'Instant Payment Links',
                desc: 'Generate a shareable payment link or QR code in seconds. Supports fixed and flexible amounts across chains.',
                tag: 'QR · Deep links · Multi-token',
              },
              {
                icon: Bot,
                color: 'violet',
                title: 'AI Agent Invoices',
                desc: 'Let AI agents issue and settle invoices autonomously on HashKey Chain — designed for programmatic treasury ops.',
                tag: 'New · Agent SDK · On-chain',
                badge: 'New',
              },
              {
                icon: Layers,
                color: 'indigo',
                title: 'HashKey Chain Native',
                desc: 'First-class integration with HashKey Chain — a regulated, compliant blockchain built for institutional finance.',
                tag: 'HSK · Testnet · Mainnet',
                badge: 'HSK',
              },
              {
                icon: Building2,
                color: 'cyan',
                title: 'Smart Vaults',
                desc: 'Deploy on-chain vaults with programmable compliance policies, allowlists, and spending limits.',
                tag: 'Smart contracts · Policy rules',
              },
              {
                icon: Briefcase,
                color: 'emerald',
                title: 'Payroll Automation',
                desc: 'Upload a CSV, define batch rules, and execute compliant multi-recipient payroll in a single transaction.',
                tag: 'Batch · CSV import · Schedule',
              },
            ].map((f, i) => {
              const iconBg: Record<string, string> = {
                teal: 'bg-teal-50 text-teal-600',
                blue: 'bg-blue-50 text-blue-600',
                violet: 'bg-violet-50 text-violet-600',
                indigo: 'bg-indigo-50 text-indigo-600',
                cyan: 'bg-cyan-50 text-cyan-600',
                emerald: 'bg-emerald-50 text-emerald-600',
              }
              return (
                <div key={i} className="group p-6 rounded-2xl border border-slate-200 hover:border-teal-200 hover:shadow-md transition-all duration-200 bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg[f.color]}`}>
                      <f.icon className="h-5 w-5" />
                    </div>
                    {f.badge && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                        {f.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{f.desc}</p>
                  <div className="text-xs text-slate-400 font-mono">{f.tag}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-slate-50 py-24 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium mb-4">
              How it works
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Compliant payments in 3 steps
            </h2>
            <p className="text-lg text-slate-500">No compliance team required. No months of integration. Just create, share, and collect.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200" />

            {[
              {
                step: '01',
                icon: FileText,
                title: 'Create a Payment Link',
                desc: 'Set your amount, supported tokens, and compliance rules. Your unique link is ready in under 30 seconds.',
              },
              {
                step: '02',
                icon: Shield,
                title: 'We Screen Every Payer',
                desc: 'FlowLink automatically runs KYC and sanctions checks before any funds move. You stay compliant by default.',
              },
              {
                step: '03',
                icon: Zap,
                title: 'Funds Settle On-Chain',
                desc: 'Payments clear in under a second on HashKey Chain. Full audit trail included — no manual reconciliation.',
              },
            ].map((s, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                  {s.step}
                </div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-5 mt-2">
                  <s.icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST / SECURITY ─────────────────────────────────────── */}
      <section id="security" className="bg-slate-950 py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-4">
                  Enterprise security
                </div>
                <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                  Built for regulated industries
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed">
                  FlowLink is built from the ground up for teams that operate in regulated environments — from licensed VASPs to institutional treasury desks.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Shield, title: 'AML / KYC Screening', desc: 'Real-time checks on every transaction against OFAC, UN, and EU sanctions lists.' },
                  { icon: Lock, title: 'Audit-Ready Records', desc: 'Immutable on-chain audit trail with full transaction lineage for every payment.' },
                  { icon: Globe, title: 'HashKey Chain Compliance', desc: 'Native integration with HashKey — a blockchain designed for regulated financial services.' },
                  { icon: Clock, title: '24/7 Monitoring', desc: 'Continuous monitoring with automatic alerts for suspicious activity patterns.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                      <item.icon className="h-4 w-4 text-teal-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white mb-0.5">{item.title}</div>
                      <div className="text-sm text-slate-400">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — compliance score card */}
            <div className="relative">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white">Compliance Dashboard</div>
                  <div className="text-xs text-slate-400">Live · HashKey Testnet</div>
                </div>

                {/* Score */}
                <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 text-center">
                  <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Compliance Score</div>
                  <div className="text-6xl font-black text-teal-400 mb-1">97</div>
                  <div className="text-xs text-slate-400">out of 100 · Excellent</div>
                </div>

                {/* Checks */}
                <div className="space-y-3">
                  {[
                    { label: 'KYC Verifications', value: '1,284', change: '+12 today', ok: true },
                    { label: 'Sanctions Screened', value: '3,921', change: 'All clear', ok: true },
                    { label: 'Flagged Transactions', value: '3', change: 'Under review', ok: false },
                    { label: 'Compliance Rate', value: '99.92%', change: '↑ 0.1% this week', ok: true },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                      <span className="text-sm text-slate-400">{row.label}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">{row.value}</div>
                        <div className={`text-xs ${row.ok ? 'text-teal-400' : 'text-amber-400'}`}>{row.change}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Badges */}
                <div className="flex gap-2 flex-wrap pt-1">
                  {['SOC 2 Type II', 'ISO 27001', 'HashKey Certified', 'GDPR Ready'].map((b) => (
                    <span key={b} className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-teal-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Start processing compliant payments today
            </h2>
            <p className="text-xl text-teal-100">
              No compliance team required. No months of setup. Get your first compliant payment link live in under 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button asChild size="lg" className="bg-white text-teal-700 hover:bg-teal-50 font-bold text-base px-10 h-12">
                <Link href="/login">
                  Create Your First Payment Link
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-teal-400 text-white hover:bg-teal-700 h-12 text-base">
                <Link href="/#how-it-works">
                  See how it works
                </Link>
              </Button>
            </div>
            <p className="text-teal-200 text-sm">Free to start · No credit card required · Cancel anytime</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
