import Link from "next/link"
import { Link2 } from "lucide-react"

export function Footer() {
  return (
    <footer
      className="border-t border-white/8 py-10 px-8"
      style={{ background: "#0a1e1a" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
            <Link2 className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-sm tracking-tight">
            <span className="text-white">Flow</span>
            <span className="text-emerald-400">Link</span>
          </span>
        </Link>

        <div className="flex items-center gap-8 text-xs text-white/30">
          <a href="#layers" className="hover:text-white/60 transition-colors">Layers</a>
          <a href="#features" className="hover:text-white/60 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white/60 transition-colors">How It Works</a>
          <Link href="/auth/signin" className="hover:text-white/60 transition-colors">Sign In</Link>
        </div>

        <p className="text-xs text-white/20">
          © 2026 FlowLink · Built on HashKey Chain
        </p>
      </div>
    </footer>
  )
}
