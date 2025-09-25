import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Settings, User, Bell } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <img src="/flowlink-logo-new.png" alt="FlowLink" className="w-8 h-8" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              FlowLink
            </span>
          </Link>
          <Badge variant="outline" className="hidden sm:flex">
            Crypto Payments You Can Trust
          </Badge>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/links" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Payment Links
          </Link>
          <Link href="/vaults" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Vaults
          </Link>
          <Link href="/policies" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Policies
          </Link>
          <Link href="/payroll" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Payroll
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">
              <Wallet className="h-4 w-4 mr-2" />
              Sign In
            </Link>
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  )
}
