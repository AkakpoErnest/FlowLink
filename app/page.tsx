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
  Globe,
  Clock,
  DollarSign,
  ShieldCheck,
  UserCheck,
  Ban,
  FileCheck,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 bg-slate-950">
        {/* Dark left panel grid — only on left side */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-[54%] bg-[linear-gradient(rgba(20,184,166,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Light panel behind right (mockup) side — angled cut */}
        <div
          className="hidden lg:block absolute inset-y-0 right-0 w-[52%] bg-gradient-to-br from-slate-100 to-slate-50"
          style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)' }}
        />

        {/* Teal glow — left side only */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-teal-600/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* ── LEFT — copy ── */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                Now live on HashKey Chain Testnet
              </div>

              <div className="space-y-3">
                <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
                  Enterprise Crypto Payments,{' '}
                  <span className="text-teal-400">Built for Compliance</span>
                </h1>
                {/* Micro-tagline */}
                <p className="text-sm font-medium text-teal-400/70 tracking-wide">
                  Get compliant payment links live in minutes. No code, no waiting.
                </p>
                <p className="text-xl text-slate-400 leading-relaxed max-w-xl pt-1">
                  Built-in KYC, sanctions screening, and real-time settlement on HashKey Chain — so your team stays compliant by default, not by accident.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base px-8 h-12 shadow-lg shadow-teal-900/30">
                  <Link href="/login">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {/* Secondary as text link — subtle */}
                <Link
                  href="/#how-it-works"
                  className="group flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors font-medium"
                >
                  See how it works
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Trust micro-proof — custom icons */}
              <div className="flex flex-wrap items-center gap-6 pt-1">
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  <DollarSign className="h-4 w-4 text-teal-500 shrink-0" />
                  No setup fees
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-teal-500 shrink-0" />
                  SOC 2 compliant
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  <Clock className="h-4 w-4 text-teal-500 shrink-0" />
                  24/7 monitoring
                </div>
              </div>
            </div>

            {/* ── RIGHT — product mockup ── */}
            <div className="relative flex justify-center lg:justify-end">
              {/* Glow ring behind mockup */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[90%] h-[90%] rounded-3xl bg-teal-400/8 blur-2xl" />
              </div>

              {/* Slight tilt — unfolds on hover */}
              <div className="relative w-full max-w-md lg:rotate-1 lg:translate-y-2 hover:rotate-0 hover:translate-y-0 transition-all duration-500">
                {/* Browser chrome card */}
                <div className="relative bg-white rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] border border-slate-200/80 overflow-hidden">

                  {/* Browser bar */}
                  <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-3">
                    <div className="flex gap-1.5 shrink-0">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 bg-white border border-slate-200 rounded-md px-3 py-1 flex items-center gap-1.5">
                      <Lock className="h-3 w-3 text-slate-400 shrink-0" />
                      <span className="text-xs font-mono font-semibold text-slate-600 truncate">
                        flowlink.app/pay/ernest-korkua
                      </span>
                    </div>
                  </div>

                  {/* Payment UI */}
                  <div className="p-5 space-y-4">
                    {/* Merchant header */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm shrink-0">
                        EK
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">Ernest Korkua</div>
                        <div className="text-xs text-slate-400">0x4f2a...93b1 · HashKey Chain</div>
                      </div>
                      <div className="ml-auto flex items-center gap-1.5 text-xs text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                        Active
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-4 border border-slate-100">
                      <div className="text-xs text-slate-400 mb-1 uppercase tracking-wide font-medium">Amount requested</div>
                      <div className="text-4xl font-black text-slate-900">
                        500 <span className="text-xl font-semibold text-slate-400">USDC</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">≈ $500.00 USD · HashKey Testnet</div>
                    </div>

                    {/* Compliance checks — with specific icons */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Compliance Status</div>
                      {[
                        { icon: UserCheck, label: 'KYC Verification', status: 'Passed' },
                        { icon: Ban,       label: 'Sanctions Screening', status: 'Clear' },
                        { icon: FileCheck, label: 'AML Check', status: 'Clear' },
                      ].map((check) => (
                        <div key={check.label} className="flex items-center gap-2.5 py-1.5 px-3 rounded-lg bg-teal-50/60 border border-teal-100/80">
                          <check.icon className="h-4 w-4 text-teal-600 shrink-0" />
                          <span className="text-sm text-slate-700 flex-1 font-medium">{check.label}</span>
                          <span className="text-xs font-semibold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                            ✓ {check.status}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Pay CTA */}
                    <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-md shadow-teal-600/20">
                      Pay 500 USDC
                    </button>

                    {/* Certification badges */}
                    <div className="flex items-center justify-center gap-4 pt-0.5">
                      {[
                        { icon: ShieldCheck, label: 'SOC 2 Type II' },
                        { icon: Lock, label: 'ISO 27001' },
                        { icon: Shield, label: 'HashKey Certified' },
                      ].map((b) => (
                        <div key={b.label} className="flex items-center gap-1 text-slate-400">
                          <b.icon className="h-3 w-3" />
                          <span className="text-xs">{b.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating badge — top right — more prominent */}
                <div className="absolute -top-5 -right-5 bg-white rounded-2xl shadow-xl border border-teal-100 px-4 py-2.5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Verified in 0.3s</div>
                    <div className="text-xs text-teal-600 font-medium">Real-time screening</div>
                  </div>
                </div>

                {/* Floating badge — bottom left */}
                <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl border border-blue-100 px-4 py-2.5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">AML Compliant</div>
                    <div className="text-xs text-blue-600 font-medium">HashKey Standard</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fade to white */}
        <div className="h-24 bg-gradient-to-b from-slate-950 to-white" />
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-slate-100">
            {[
              { stat: '$2.4M+', label: 'Processed compliantly', sub: 'and counting' },
              { stat: '99.7%', label: 'Screening accuracy', sub: 'zero false negatives' },
              { stat: '< 1s', label: 'Settlement time', sub: 'on HashKey Chain' },
              { stat: '6', label: 'Chains supported', sub: 'more coming soon' },
            ].map((item) => (
              <div key={item.label} className="text-center md:px-8 first:pl-0 last:pr-0">
                <div className="text-3xl font-extrabold text-slate-900 mb-0.5">{item.stat}</div>
                <div className="text-sm font-medium text-slate-600">{item.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section id="features" className="bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold text-teal-600 uppercase tracking-widest mb-3">Everything you need, nothing you don't</p>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
              Payment links. Payroll. AI agents.{' '}
              <span className="text-slate-400">All compliant.</span>
            </h2>
            <p className="text-lg text-slate-500">
              Compliance without the compliance team. FlowLink handles the screening, the audit trail, and the on-chain settlement — you just get paid.
            </p>
          </div>

          {/* Bento-style asymmetric grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">

            {/* Card 1 — featured, teal gradient, spans 3 */}
            <div className="md:col-span-3 rounded-2xl p-7 bg-gradient-to-br from-teal-600 to-teal-800 text-white relative overflow-hidden group hover:shadow-xl hover:shadow-teal-900/20 transition-all duration-300">
              <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/5" />
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center mb-5">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Compliance baked in</h3>
              <p className="text-teal-100 leading-relaxed text-sm">
                Every transaction is screened against OFAC, UN, and EU sanctions lists before it moves. KYC happens automatically. Your auditors will love you.
              </p>
              <div className="mt-5 flex gap-2">
                {['AML', 'KYC', 'Sanctions'].map(t => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-teal-100 font-medium">{t}</span>
                ))}
              </div>
            </div>

            {/* Card 2 — blue accent, spans 3 */}
            <div className="md:col-span-3 rounded-2xl p-7 bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100 group hover:border-blue-200 hover:shadow-md transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Payment links that just work</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                One link. A QR code. Fixed or open amount. Share it anywhere and let payers send crypto — regardless of which wallet they use.
              </p>
              <div className="mt-5 font-mono text-xs text-blue-400 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 inline-block">
                flowlink.app/pay/your-name
              </div>
            </div>

            {/* Card 3 — AI Agent, violet, spans 2 */}
            <div className="md:col-span-2 rounded-2xl p-6 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 group hover:border-violet-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-violet-600" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 border border-orange-200">New</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">AI Agent Invoices</h3>
              <p className="text-slate-500 text-sm leading-relaxed">AI agents that issue, track, and settle invoices autonomously on-chain.</p>
            </div>

            {/* Card 4 — HashKey, indigo, spans 2 */}
            <div className="md:col-span-2 rounded-2xl p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 group hover:border-indigo-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">HSK</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">HashKey Chain Native</h3>
              <p className="text-slate-500 text-sm leading-relaxed">The only regulated blockchain built for institutional finance. We're native on it.</p>
            </div>

            {/* Card 5 — Vaults, cyan, spans 2 */}
            <div className="md:col-span-2 rounded-2xl p-6 bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100 group hover:border-cyan-200 hover:shadow-md transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-cyan-100 flex items-center justify-center mb-5">
                <Building2 className="h-5 w-5 text-cyan-700" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Smart Vaults</h3>
              <p className="text-slate-500 text-sm leading-relaxed">On-chain vaults with programmable policies, allowlists, and spending limits.</p>
            </div>

            {/* Card 6 — Payroll, full width, horizontal */}
            <div className="md:col-span-6 rounded-2xl p-7 bg-slate-900 text-white group hover:bg-slate-800 transition-all duration-200">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <Briefcase className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold">Payroll that doesn't make you cry</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Automated</span>
                  </div>
                  <p className="text-slate-400 text-sm">Upload a CSV. Set the rules. Hit send. FlowLink screens every recipient and batches the whole payroll into a single on-chain transaction.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {['CSV import', 'Batch payments', 'Schedule'].map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 border border-slate-600">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-slate-50 py-24 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-16">
            <p className="text-sm font-semibold text-teal-600 uppercase tracking-widest mb-3">Three steps. That's it.</p>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              From idea to paid in{' '}
              <span className="text-teal-600">under 5 minutes</span>
            </h2>
            <p className="text-lg text-slate-500">No compliance lawyers. No API integration. No waiting for bank approvals. Just a link.</p>
          </div>

          {/* Timeline flow — horizontal on desktop */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[52px] left-[calc(16.66%+16px)] right-[calc(16.66%+16px)] h-0.5 bg-gradient-to-r from-teal-300 via-teal-500 to-teal-300" />

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: FileText,
                  label: 'You do this',
                  labelColor: 'text-slate-400',
                  title: 'Create your link',
                  desc: 'Pick your token, set an amount (or leave it open), and copy your link. Thirty seconds, tops.',
                  detail: '30 seconds',
                  detailColor: 'text-teal-600',
                  bg: 'bg-white',
                  iconBg: 'bg-teal-100',
                  iconColor: 'text-teal-600',
                },
                {
                  icon: ShieldCheck,
                  label: 'FlowLink handles this',
                  labelColor: 'text-teal-500',
                  title: 'We screen the payer',
                  desc: 'KYC check. Sanctions scan. AML risk score. All before a single token moves. You\'re compliant by default.',
                  detail: '0.3s per check',
                  detailColor: 'text-teal-600',
                  bg: 'bg-teal-600',
                  iconBg: 'bg-white/20',
                  iconColor: 'text-white',
                  dark: true,
                },
                {
                  icon: Zap,
                  label: 'Magic happens here',
                  labelColor: 'text-slate-400',
                  title: 'Funds land on-chain',
                  desc: 'Settlement on HashKey Chain in under a second. Full audit trail attached. Ready for your next report.',
                  detail: '< 1 second',
                  detailColor: 'text-teal-600',
                  bg: 'bg-white',
                  iconBg: 'bg-teal-100',
                  iconColor: 'text-teal-600',
                },
              ].map((s, i) => (
                <div key={i} className={`relative rounded-2xl p-7 border ${s.dark ? 'border-teal-500 shadow-lg shadow-teal-900/10' : 'border-slate-200 shadow-sm'} ${s.bg}`}>
                  {/* Step label */}
                  <div className={`text-xs font-semibold uppercase tracking-widest mb-4 ${s.labelColor}`}>{s.label}</div>
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${s.iconBg}`}>
                    <s.icon className={`h-6 w-6 ${s.iconColor}`} />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${s.dark ? 'text-white' : 'text-slate-900'}`}>{s.title}</h3>
                  <p className={`text-sm leading-relaxed mb-4 ${s.dark ? 'text-teal-100' : 'text-slate-500'}`}>{s.desc}</p>
                  <div className={`text-sm font-bold ${s.dark ? 'text-teal-200' : s.detailColor}`}>⚡ {s.detail}</div>
                </div>
              ))}
            </div>
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
                <p className="text-sm font-semibold text-teal-400 uppercase tracking-widest mb-3">Built for regulated industries (and their auditors)</p>
                <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
                  Serious about compliance.{' '}
                  <span className="text-slate-400">Not boring about it.</span>
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Whether you're a licensed VASP, a treasury desk, or just a team that doesn't want to end up in a regulatory grey zone — FlowLink has you covered by default.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { icon: UserCheck, title: 'AML / KYC Screening', desc: 'Real-time checks against OFAC, UN, and EU sanctions lists. Every payer, every time.' },
                  { icon: Lock,      title: 'Audit-Ready Records',  desc: 'Immutable on-chain trail with full transaction lineage. Your auditors can self-serve.' },
                  { icon: Globe,     title: 'HashKey Chain Native', desc: 'The only blockchain built for regulated financial services. We\'re native on day one.' },
                  { icon: Clock,     title: '24/7 Monitoring',      desc: 'Automatic alerts for suspicious patterns. You sleep. We watch.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 transition-all duration-150">
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

            {/* Right — compliance dashboard */}
            <div className="relative">
              <div className="absolute inset-0 bg-teal-500/3 rounded-3xl blur-2xl" />
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white">Compliance Dashboard</div>
                  <div className="flex items-center gap-1.5 text-xs text-teal-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    Live · HashKey Testnet
                  </div>
                </div>

                {/* Score */}
                <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Score</div>
                    <div className="text-6xl font-black text-teal-400 leading-none">97</div>
                    <div className="text-xs text-slate-500 mt-1">/ 100</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[100, 96, 99, 92].map((v, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${v}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 w-8 text-right">{v}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checks */}
                <div className="space-y-2">
                  {[
                    { label: 'KYC Verifications',   value: '1,284', change: '+12 today',      ok: true },
                    { label: 'Sanctions Screened',   value: '3,921', change: 'All clear',       ok: true },
                    { label: 'Flagged Transactions', value: '3',     change: 'Under review',    ok: false },
                    { label: 'Compliance Rate',      value: '99.92%', change: '↑ 0.1% this week', ok: true },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-950/50 border border-slate-800">
                      <span className="text-sm text-slate-400">{row.label}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white mr-2">{row.value}</span>
                        <span className={`text-xs ${row.ok ? 'text-teal-400' : 'text-amber-400'}`}>{row.change}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cert badges */}
                <div className="flex gap-2 flex-wrap pt-1">
                  {['SOC 2 Type II', 'ISO 27001', 'HashKey Certified', 'GDPR Ready'].map((b) => (
                    <span key={b} className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                      ✓ {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="relative bg-slate-950 py-24 overflow-hidden">
        {/* Teal glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.12)_0%,transparent_70%)]" />
        <div className="container mx-auto px-6 text-center relative">
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-sm font-semibold text-teal-400 uppercase tracking-widest">Ready when you are</p>
            <h2 className="text-5xl font-extrabold text-white tracking-tight leading-tight">
              Stop worrying about compliance.{' '}
              <span className="text-teal-400">Start getting paid.</span>
            </h2>
            <p className="text-xl text-slate-400">
              Your first compliant payment link is 5 minutes away. No compliance team. No months of setup. No excuses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-base px-10 h-13 shadow-lg shadow-teal-900/40">
                <Link href="/login">
                  Create Your First Payment Link
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Link
                href="/#how-it-works"
                className="group inline-flex items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors font-medium h-13 px-6"
              >
                See how it works
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <p className="text-slate-500 text-sm">Free to start · No credit card · Cancel whenever</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
