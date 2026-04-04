import Link from 'next/link'
import {
  Link2,
  ArrowRight,
  Shield,
  CheckCircle,
  Lock,
  DollarSign,
  Clock,
  Globe,
  UserCheck,
  FileText,
  ShieldCheck,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="bg-[#0A0F1C] min-h-screen">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
            <Link2 className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight">
            <span className="text-white">Flow</span><span className="text-emerald-400">Link</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#security" className="hover:text-white transition-colors">Security</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            href="/login"
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      {/* ── Hero split ── */}
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        {/* Left dark panel */}
        <div className="flex flex-col justify-center px-12 py-16 lg:py-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white mb-8 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Now live on HashKey Chain Testnet
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Enterprise Crypto<br />
            Payments,{' '}
            <span className="text-emerald-400">
              Built for<br />Compliance
            </span>
          </h1>

          <p className="text-slate-400 text-lg mb-3">
            Get compliant payment links live in minutes. No code, no waiting.
          </p>
          <p className="text-slate-400 text-base mb-10 leading-relaxed">
            Built-in KYC, sanctions screening, and real-time settlement on HashKey Chain — so your
            team stays compliant by default, not by accident.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4 mb-12">
            <Link
              href="/login"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="text-white font-medium flex items-center gap-2 hover:text-emerald-400 transition-colors"
            >
              See how it works <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Trust bar */}
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> No setup fees
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> KYC/AML built-in
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> 24/7 monitoring
            </span>
          </div>
        </div>

        {/* Right light panel with mockup */}
        <div className="bg-slate-100 flex items-center justify-center px-8 py-16 relative">
          {/* Floating verified badge */}
          <div className="absolute top-12 right-8 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 z-10">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Verified in 0.3s</p>
              <p className="text-xs text-slate-500">Real-time screening</p>
            </div>
          </div>

          {/* Payment mockup card */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Browser bar */}
            <div className="bg-slate-100 px-4 py-3 flex items-center gap-2 border-b border-slate-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-slate-400 flex items-center gap-1 ml-2">
                <Lock className="w-3 h-3" /> flowlink.app/pay/ernest-...
              </div>
            </div>

            <div className="p-6">
              {/* Payee info */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
                    EK
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Ernest Korkua</p>
                    <p className="text-xs text-slate-500">0x4f2a...93b1 · HashKey Chain</p>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                </span>
              </div>

              {/* Amount */}
              <div className="mb-5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Amount Requested
                </p>
                <p className="text-4xl font-black text-slate-900">
                  500 <span className="text-2xl font-semibold text-slate-500">USDC</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">≈ $500.00 USD · HashKey Testnet</p>
              </div>

              {/* Compliance status */}
              <div className="mb-5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                  Compliance Status
                </p>
                <div className="space-y-2">
                  {[
                    { label: 'KYC Verification', status: 'Passed' },
                    { label: 'Sanctions Screening', status: 'Clear' },
                    { label: 'AML Check', status: 'Clear' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                    >
                      <span className="text-sm text-slate-600">{item.label}</span>
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pay button */}
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors">
                Pay 500 USDC
              </button>
            </div>

            {/* Bottom badges */}
            <div className="bg-slate-50 px-6 py-3 flex items-center justify-center gap-6 border-t border-slate-100">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Shield className="w-3 h-3" /> KYC/AML
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Globe className="w-3 h-3" /> HashKey Chain
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Real-time
              </span>
            </div>
          </div>

          {/* Bottom floating badge */}
          <div className="absolute bottom-12 left-8 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">AML Screened</p>
              <p className="text-xs text-slate-500">HashKey Standard</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <section id="features" className="py-24 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-14">
            <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              What&apos;s built in
            </h2>
            <p className="text-lg text-slate-400">
              The compliance layer is not an add-on. It&apos;s the product.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: UserCheck,
                title: 'KYC / AML screening',
                desc: 'Every payer is identity-verified before they can send funds. Automatic, not a manual review queue.',
                featured: true,
              },
              {
                icon: Shield,
                title: 'Sanctions checks',
                desc: 'Real-time screening against OFAC, UN, and EU lists on every payment attempt. Flagged wallets are blocked before settlement.',
                featured: false,
              },
              {
                icon: CheckCircle,
                title: 'On-chain settlement',
                desc: 'Payments settle directly on HashKey Chain. Immutable record, no intermediaries, no reconciliation overhead.',
                featured: false,
              },
            ].map((f) => (
              <div
                key={f.title}
                className={`rounded-2xl p-7 border ${
                  f.featured
                    ? 'bg-emerald-600 border-emerald-600'
                    : 'bg-white/5 border-white/10 hover:border-emerald-500/40'
                } transition-colors`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${
                    f.featured ? 'bg-white/10' : 'bg-emerald-500/10'
                  }`}
                >
                  <f.icon className={`h-5 w-5 ${f.featured ? 'text-white' : 'text-emerald-400'}`} />
                </div>
                <h3 className="text-base font-bold mb-2 text-white">{f.title}</h3>
                <p className={`text-sm leading-relaxed ${f.featured ? 'text-white/70' : 'text-slate-400'}`}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-16">
            <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
              How it works
            </h2>
            <p className="text-lg text-slate-400">Three steps. No compliance team needed.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: FileText,
                title: 'Create your link',
                desc: 'Pick a token and amount, or leave it open. Copy the link. Done.',
                featured: false,
              },
              {
                step: '02',
                icon: ShieldCheck,
                title: 'Payer gets screened',
                desc: 'Before any funds move, we run KYC identity verification and check against OFAC, UN, and EU sanctions lists.',
                featured: true,
              },
              {
                step: '03',
                icon: Link2,
                title: 'Funds settle on-chain',
                desc: 'Payment settles on HashKey Chain. Immutable on-chain record attached. No chasing, no reconciliation.',
                featured: false,
              },
            ].map((s) => (
              <div
                key={s.step}
                className={`rounded-2xl p-7 border ${
                  s.featured
                    ? 'bg-emerald-600 border-emerald-600'
                    : 'bg-white/5 border-white/10 hover:border-emerald-500/40'
                } transition-colors`}
              >
                <div
                  className={`text-xs font-mono font-semibold mb-4 ${
                    s.featured ? 'text-white/50' : 'text-slate-500'
                  }`}
                >
                  {s.step}
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                    s.featured ? 'bg-white/10' : 'bg-emerald-500/10'
                  }`}
                >
                  <s.icon className={`h-6 w-6 ${s.featured ? 'text-white' : 'text-emerald-400'}`} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{s.title}</h3>
                <p className={`text-sm leading-relaxed ${s.featured ? 'text-white/70' : 'text-slate-400'}`}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security ── */}
      <section id="security" className="py-24 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-14">
            <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
              Compliant by default
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Whether you&apos;re a VASP, a treasury desk, or just a team that doesn&apos;t want to end up
              in a regulatory grey zone — FlowLink has you covered from day one.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
            {[
              {
                icon: UserCheck,
                title: 'AML / KYC screening',
                desc: 'Real-time checks against OFAC, UN, and EU sanctions lists. Every payer, every time.',
              },
              {
                icon: Lock,
                title: 'Audit-ready records',
                desc: 'Immutable on-chain trail with full transaction lineage. Your auditors can self-serve.',
              },
              {
                icon: Globe,
                title: 'HashKey Chain native',
                desc: 'Built natively on the only regulated blockchain designed for institutional finance.',
              },
              {
                icon: Clock,
                title: '24/7 monitoring',
                desc: 'Automatic alerts for suspicious patterns. You sleep. We watch.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 p-5 rounded-xl border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-colors cursor-default"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white mb-0.5">{item.title}</div>
                  <div className="text-sm text-slate-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-emerald-600 py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-xl space-y-6">
            <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
              Try it on testnet
            </h2>
            <p className="text-lg text-white/80">
              FlowLink is live on HashKey Chain Testnet. Create a payment link, go through the full
              KYC and sanctions flow, and watch settlement happen on-chain. No real money involved.
            </p>
            <div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-emerald-600 font-bold text-base px-8 py-3.5 rounded-xl transition-colors"
              >
                Create a payment link <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 py-8 px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
              <Link2 className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm tracking-tight">
              <span className="text-white">Flow</span><span className="text-emerald-400">Link</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} FlowLink. Built on HashKey Chain.
          </p>
        </div>
      </footer>
    </div>
  )
}
