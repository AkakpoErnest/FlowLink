'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { 
  ArrowLeft,
  CheckCircle,
  Download,
  Smartphone,
  Shield,
  Zap,
  Globe,
  Lock
} from 'lucide-react'

export default function AndroidDownloadPage() {
  const mobileFeatures = [
    {
      icon: CheckCircle,
      title: "QR Code Generation",
      description: "Create instant QR codes for payments"
    },
    {
      icon: CheckCircle,
      title: "Offline Mode",
      description: "Work without internet connection"
    },
    {
      icon: CheckCircle,
      title: "Real-time Notifications",
      description: "Instant payment confirmations"
    },
    {
      icon: CheckCircle,
      title: "Biometric Security",
      description: "Fingerprint and face unlock"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-900 relative overflow-hidden">
      <Header />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-green-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-teal-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-emerald-400/10 rounded-full blur-lg animate-pulse delay-3000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-green-500/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Back Button */}
        <div className="container mx-auto px-4 pt-8">
          <Button asChild variant="ghost" className="text-emerald-400 hover:text-emerald-300">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-16 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 text-sm font-medium">Mobile App</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-emerald-300 via-green-400 to-teal-500 bg-clip-text text-transparent">
                Download FlowLink Mobile
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Take your crypto payments on the go. Create payment links, manage compliance, and process transactions from anywhere.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Mobile Phone Mockup */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative group">
                  {/* Phone Frame */}
                  <div className="w-80 h-[600px] bg-gradient-to-br from-slate-900/90 via-emerald-950/80 to-slate-800/90 backdrop-blur-xl rounded-[3rem] shadow-2xl border-2 border-emerald-500/30 p-6 group-hover:scale-105 transition-all duration-500">
                    {/* Phone Screen */}
                    <div className="w-full h-full bg-gradient-to-br from-emerald-950/40 via-teal-950/30 to-emerald-900/40 rounded-[2.5rem] border border-emerald-500/20 flex flex-col items-center justify-center space-y-8 p-8">
                      
                      {/* Phone Status Bar */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white/70 text-xs">
                        <span>9:41</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-4 h-2 bg-white/30 rounded-sm">
                            <div className="w-3 h-full bg-white rounded-sm"></div>
                          </div>
                          <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                          <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                          <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* App Icon */}
                      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-xl border-2 border-emerald-400/30">
                        <div className="relative w-16 h-16">
                          {/* Circular design */}
                          <div className="absolute inset-0 rounded-full border-4 border-blue-500/60"></div>
                          <div className="absolute inset-2 rounded-full border-4 border-emerald-400/60"></div>
                          {/* FL Letters */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-blue-500 font-bold text-lg">FL</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* App Name */}
                      <div className="text-center space-y-2">
                        <h3 className="text-white text-2xl font-bold">FlowLink</h3>
                        <p className="text-emerald-300 text-base">Crypto Payments</p>
                      </div>
                      
                      {/* Features List */}
                      <div className="space-y-4 w-full max-w-48">
                        <div className="flex items-center space-x-3 text-emerald-300 text-sm">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <span>Create Payment Links</span>
                        </div>
                        <div className="flex items-center space-x-3 text-emerald-300 text-sm">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <span>KYC Verification</span>
                        </div>
                        <div className="flex items-center space-x-3 text-emerald-300 text-sm">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          <span>Multi-Chain Support</span>
                        </div>
                      </div>
                      
                      {/* Phone Home Indicator */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Phone Glow Effect */}
                  <div className="absolute -inset-6 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-[3.5rem] blur-2xl -z-10 group-hover:blur-3xl transition-all duration-500"></div>
                </div>
              </div>

              {/* Download Section */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-white mb-4">Available on</h3>
                  
                  {/* Android Download Button */}
                  <div className="space-y-4">
                    <a 
                      href="/flowlink-android-app.apk" 
                      download
                      className="flex items-center space-x-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 group hover:scale-105"
                    >
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm opacity-90">Download for</div>
                        <div className="font-semibold text-lg">Android</div>
                      </div>
                      <Download className="ml-auto h-6 w-6 group-hover:animate-bounce" />
                    </a>
                    
                    {/* iOS Coming Soon */}
                    <div className="flex items-center space-x-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white px-8 py-6 rounded-xl shadow-lg opacity-75">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm opacity-90">Coming Soon for</div>
                        <div className="font-semibold text-lg">iOS</div>
                      </div>
                      <Badge variant="secondary" className="ml-auto bg-orange-500/20 text-orange-400 border-orange-500/20">
                        Soon
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Mobile Features */}
                <div className="space-y-6">
                  <h4 className="text-2xl font-semibold text-white">Mobile Features</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {mobileFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 text-emerald-300 group hover:text-emerald-200 transition-colors duration-300">
                        <feature.icon className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                        <div>
                          <div className="font-medium text-sm">{feature.title}</div>
                          <div className="text-xs text-slate-400">{feature.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Features */}
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-white">Security & Compliance</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-3 text-emerald-300">
                      <Shield className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm">Bank-grade Encryption</span>
                    </div>
                    <div className="flex items-center space-x-3 text-emerald-300">
                      <Lock className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm">SOC 2 Compliant</span>
                    </div>
                    <div className="flex items-center space-x-3 text-emerald-300">
                      <Zap className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm">Real-time Monitoring</span>
                    </div>
                    <div className="flex items-center space-x-3 text-emerald-300">
                      <Globe className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm">Multi-Chain Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}



