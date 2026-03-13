import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Github, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-900 border-t border-emerald-500/20">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <img src="/flowlink-logo-new.png" alt="FlowLink" className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                FlowLink
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              The most trusted platform for compliant crypto payments. Flow across chains. Link the future.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 p-2">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 p-2">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 p-2">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 p-2">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300 text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300 text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300 text-sm">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300 text-sm">
                  Compliance
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300 text-sm">
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300 text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300 text-sm">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300 text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300 text-sm">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300 text-sm">
                  Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300 text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300 text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="https://card3.ai/profile?card_code=qXIOdwGUB" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300 text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300 text-sm">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300 text-sm">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Android App Download Section */}
        <div id="android-app" className="border-t border-emerald-500/20 pt-12 mb-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 text-sm font-medium">Mobile App</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-300 via-green-400 to-teal-500 bg-clip-text text-transparent">
              Try Our Beta Android App
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience FlowLink on your mobile device with our beta Android application. Get early access to mobile crypto payments.
            </p>
            
            <div className="flex justify-center">
              <div className="group relative">
                <a 
                  href="/flowlink-android-app.apk" 
                  download="FlowLink-Android-App.apk"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 group-hover:scale-105"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">📱</span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm opacity-90">Download</div>
                    <div className="text-lg font-bold">Android Beta App</div>
                  </div>
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-sm">↓</span>
                  </div>
                </a>
                
                {/* Hover glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-teal-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
                  Beta Version
                </span>
                <span className="mx-2">•</span>
                Requires Android 7.0 or higher
                <span className="mx-2">•</span>
                Free to download
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-emerald-500/20 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-semibold text-white mb-2">Stay Updated</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get the latest updates on crypto compliance and FlowLink features.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-slate-800 border border-emerald-500/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-emerald-500/50 transition-colors duration-300"
              />
              <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 px-4">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-500/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-muted-foreground text-sm">
              © 2024 FlowLink. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-emerald-400 transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}