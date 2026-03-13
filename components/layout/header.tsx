'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-emerald-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img src="/flowlink-logo-new.png" alt="FlowLink" className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent group-hover:from-green-400 group-hover:to-emerald-500 transition-all duration-300">
              FlowLink
            </span>
          </Link>

          {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="/#features" 
                className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300 font-medium"
              >
                Features
              </Link>
              <Link 
                href="/#android-app" 
                className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300 font-medium"
              >
                Android App
              </Link>
              <Link 
                href="https://card3.ai/profile?card_code=qXIOdwGUB" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300 font-medium"
              >
                Contact
              </Link>
            </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-muted-foreground hover:text-emerald-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-emerald-500/20 bg-slate-950/95 backdrop-blur-xl">
            <nav className="py-4 space-y-4">
              <Link 
                href="/#features" 
                className="block text-muted-foreground hover:text-emerald-400 transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="/#android-app" 
                className="block text-muted-foreground hover:text-emerald-400 transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Android App
              </Link>
              <Link 
                href="https://card3.ai/profile?card_code=qXIOdwGUB" 
                target="_blank"
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-emerald-400 transition-colors duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 border-t border-emerald-500/20 space-y-3">
                <Button asChild variant="ghost" className="w-full text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                </Button>
                <Button asChild className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}