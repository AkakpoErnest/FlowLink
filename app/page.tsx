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
      <section className="relative overflow-hidden pt-16 bg-white">
        <div className="container mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* ── LEFT — copy ── */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Now live on HashKey Chain
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight">
                  Enterprise Crypto Payments,{' '}
                  <span className="text-blue-600">Built for Compliance</span>
                </h1>
                <p className="text-xl text-slate-500 leading-relaxed max-w-xl">
                  Built-in KYC, sanctions screening, and real-time settlement on HashKey Chain — so your team stays compliant by default, not by accident.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base px-8 h-12 shadow-sm">
                  <Link href="/login">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Link
                  href="/#how-it-works"
                  className="group flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"
                >
                  See how it works
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Trust bar */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-slate-400 border-t border-slate-100 pt-6">
                <span>Built on HashKey Chain</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>KYC/AML built-in</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>Real-time settlement</span>
              </div>
            </div>

            {/* ── RIGHT — product mockup on light background ── */}
            <div className="relative flex justify-center lg:justify-end">
              {/* Light background panel */}
              <div className="absolute inset-0 bg-slate-50 rounded-3xl" />

              {/* Side image */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-10">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative w-full max-w-md py-8 px-4">
                {/* Browser chrome card */}
                <div className="relative bg-white rounded-2xl shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)] border border-slate-200 overflow-hidden">

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
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                        EK
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">Ernest Korkua</div>
                        <div className="text-xs text-slate-400">0x4f2a...93b1 · HashKey Chain</div>
                      </div>
                      <div className="ml-auto flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Active
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="text-xs text-slate-400 mb-1 uppercase tracking-wide font-medium">Amount requested</div>
                      <div className="text-4xl font-black text-slate-900">
                        500 <span className="text-xl font-semibold text-slate-400">USDC</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">≈ $500.00 USD · HashKey Chain</div>
                    </div>

                    {/* Compliance checks */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Compliance Status</div>
                      {[
                        { icon: UserCheck, label: 'KYC Verification', status: 'Passed' },
                        { icon: Ban,       label: 'Sanctions Screening', status: 'Clear' },
                        { icon: FileCheck, label: 'AML Check', status: 'Clear' },
                      ].map((check) => (
                        <div key={check.label} className="flex items-center gap-2.5 py-1.5 px-3 rounded-lg bg-green-50 border border-green-100">
                          <check.icon className="h-4 w-4 text-green-600 shrink-0" />
                          <span className="text-sm text-slate-700 flex-1 font-medium">{check.label}</span>
                          <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                            ✓ {check.status}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Pay CTA */}
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-colors">
                      Pay 500 USDC
                    </button>
                  </div>
                </div>

                {/* Floating badge — top right */}
                <div className="absolute -top-3 -right-3 bg-white rounded-xl shadow-lg border border-slate-100 px-3.5 py-2 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Verified in 0.3s</div>
                    <div className="text-xs text-slate-400">Real-time screening</div>
                  </div>
                </div>

                {/* Floating badge — bottom left */}
                <div className="absolute -bottom-3 -left-3 bg-white rounded-xl shadow-lg border border-slate-100 px-3.5 py-2 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">AML Screened</div>
                    <div className="text-xs text-slate-400">Real-time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ─────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-slate-500 font-medium">
              Join 500+ businesses processing payments on HashKey Chain
            </p>
            <div className="flex items-center gap-8">
              {[
                { name: 'HashKey', label: 'Built on HashKey Chain' },
                { name: 'USDC', label: 'USDC Native' },
                { name: 'Wagmi', label: 'Powered by Wagmi' },
              ].map((partner) => (
                <div key={partner.name} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                    {partner.name[0]}
                  </div>
                  <span className="text-sm font-semibold text-slate-600">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 py-12">
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
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Everything you need, nothing you don't</p>
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

            {/* Card 1 — featured, navy, spans 3 */}
            <div className="md:col-span-3 rounded-2xl p-7 bg-[#0F1B2D] text-white relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Compliance baked in</h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                Every transaction is screened against OFAC, UN, and EU sanctions lists before it moves. KYC happens automatically. Your auditors will love you.
              </p>
              <div className="mt-5 flex gap-2">
                {['AML', 'KYC', 'Sanctions'].map(t => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300 font-medium">{t}</span>
                ))}
              </div>
            </div>

            {/* Card 2 — blue accent, spans 3 */}
            <div className="md:col-span-3 rounded-2xl p-7 bg-slate-50 border border-slate-200 group hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Payment links that just work</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                One link. A QR code. Fixed or open amount. Share it anywhere and let payers send crypto — regardless of which wallet they use.
              </p>
              <div className="mt-5 font-mono text-xs text-blue-500 bg-white border border-blue-100 rounded-lg px-3 py-2 inline-block">
                flowlink.app/pay/your-name
              </div>
            </div>

            {/* Card 3 — AI Agent, spans 2 */}
            <div className="md:col-span-2 rounded-2xl p-6 bg-white border border-slate-200 group hover:border-slate-300 hover:shadow-sm transition-all duration-200">
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-violet-600" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200">New</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">AI Agent Invoices</h3>
              <p className="text-slate-500 text-sm leading-relaxed">AI agents that issue, track, and settle invoices autonomously on-chain.</p>
            </div>

            {/* Card 4 — HashKey, spans 2 */}
            <div className="md:col-span-2 rounded-2xl p-6 bg-white border border-slate-200 group hover:border-slate-300 hover:shadow-sm transition-all duration-200">
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Layers className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">HSK</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">HashKey Chain Native</h3>
              <p className="text-slate-500 text-sm leading-relaxed">The only regulated blockchain built for institutional finance. We're native on it.</p>
            </div>

            {/* Card 5 — Vaults, spans 2 */}
            <div className="md:col-span-2 rounded-2xl p-6 bg-white border border-slate-200 group hover:border-slate-300 hover:shadow-sm transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-5">
                <Building2 className="h-6 w-6 text-slate-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Smart Vaults</h3>
              <p className="text-slate-500 text-sm leading-relaxed">On-chain vaults with programmable policies, allowlists, and spending limits.</p>
            </div>

            {/* Card 6 — Payroll, full width */}
            <div className="md:col-span-6 rounded-2xl p-7 bg-slate-50 border border-slate-200 group hover:border-slate-300 transition-all duration-200">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <Briefcase className="h-6 w-6 text-green-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">Payroll that doesn't make you cry</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 font-semibold">Automated</span>
                  </div>
                  <p className="text-slate-500 text-sm">Upload a CSV. Set the rules. Hit send. FlowLink screens every recipient and batches the whole payroll into a single on-chain transaction.</p>
                </div>
                <div className="flex gap-2 shrink-0 flex-wrap">
                  {['CSV import', 'Batch payments', 'Schedule'].map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-white text-slate-600 border border-slate-200 font-medium">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-[#F8FAFC] py-24 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-16">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Three steps. That's it.</p>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              From idea to paid in{' '}
              <span className="text-blue-600">under 5 minutes</span>
            </h2>
            <p className="text-lg text-slate-500">No compliance lawyers. No API integration. No waiting for bank approvals. Just a link.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                label: 'You do this',
                title: 'Create your link',
                desc: 'Pick your token, set an amount (or leave it open), and copy your link. Thirty seconds, tops.',
                detail: '30 seconds',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
                icon: FileText,
              },
              {
                step: '02',
                label: 'FlowLink handles this',
                title: 'We screen the payer',
                desc: 'KYC check. Sanctions scan. AML risk score. All before a single token moves. You\'re compliant by default.',
                detail: '0.3s per check',
                iconBg: 'bg-[#0F1B2D]',
                iconColor: 'text-white',
                icon: ShieldCheck,
                featured: true,
              },
              {
                step: '03',
                label: 'Magic happens here',
                title: 'Funds land on-chain',
                desc: 'Settlement on HashKey Chain in under a second. Full audit trail attached. Ready for your next report.',
                detail: '< 1 second',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
                icon: Zap,
              },
            ].map((s, i) => (
              <div key={i} className={`relative rounded-2xl p-7 border ${s.featured ? 'bg-[#0F1B2D] border-[#0F1B2D]' : 'bg-white border-slate-200'}`}>
                <div className={`text-xs font-semibold uppercase tracking-widest mb-4 ${s.featured ? 'text-slate-400' : 'text-slate-400'}`}>
                  {s.step} — {s.label}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${s.featured ? 'bg-white/10' : s.iconBg}`}>
                  <s.icon className={`h-6 w-6 ${s.featured ? 'text-white' : s.iconColor}`} />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${s.featured ? 'text-white' : 'text-slate-900'}`}>{s.title}</h3>
                <p className={`text-sm leading-relaxed mb-4 ${s.featured ? 'text-slate-400' : 'text-slate-500'}`}>{s.desc}</p>
                <div className={`text-sm font-bold ${s.featured ? 'text-blue-400' : 'text-blue-600'}`}>{s.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST / SECURITY ─────────────────────────────────────── */}
      <section id="security" className="bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div className="space-y-8">
              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Built for regulated industries</p>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  Serious about compliance.{' '}
                  <span className="text-slate-400">Not boring about it.</span>
                </h2>
                <p className="text-lg text-slate-500 leading-relaxed">
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
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all duration-150">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 mb-0.5">{item.title}</div>
                      <div className="text-sm text-slate-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — compliance dashboard (light version) */}
            <div className="relative">
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900">Compliance Dashboard</div>
                  <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Live
                  </div>
                </div>

                {/* Score */}
                <div className="bg-white rounded-xl p-5 border border-slate-100 flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-xs text-slate-400 mb-1 uppercase tracking-wide">Score</div>
                    <div className="text-6xl font-black text-blue-600 leading-none">97</div>
                    <div className="text-xs text-slate-400 mt-1">/ 100</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[100, 96, 99, 92].map((v, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${v}%` }} />
                        </div>
                        <span className="text-xs text-slate-400 w-8 text-right">{v}%</span>
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
                    <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white border border-slate-100">
                      <span className="text-sm text-slate-500">{row.label}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-900 mr-2">{row.value}</span>
                        <span className={`text-xs font-medium ${row.ok ? 'text-green-600' : 'text-amber-500'}`}>{row.change}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap pt-1">
                  {['KYC / AML Built-in', 'Sanctions Screening', 'On-chain Settlement', 'Audit Logs'].map((b) => (
                    <span key={b} className="text-xs px-2.5 py-1 rounded-full bg-white text-slate-600 border border-slate-200 font-medium">
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
      <section className="bg-[#0F1B2D] py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest">Ready when you are</p>
            <h2 className="text-5xl font-extrabold text-white tracking-tight leading-tight">
              Stop worrying about compliance.{' '}
              <span className="text-blue-400">Start getting paid.</span>
            </h2>
            <p className="text-xl text-slate-400">
              Your first compliant payment link is 5 minutes away. No compliance team. No months of setup. No excuses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-base px-10 h-12">
                <Link href="/login">
                  Create Your First Payment Link
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Link
                href="/#how-it-works"
                className="group inline-flex items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors font-medium h-12 px-6"
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
