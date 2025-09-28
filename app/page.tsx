'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { 
  Shield, 
  Zap, 
  Building2, 
  Briefcase, 
  ArrowRight,
  CheckCircle,
  Globe,
  Lock
} from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: Shield,
      title: "Compliance First",
      description: "Built-in KYC verification and sanctions screening for every transaction",
      link: "/login",
      linkText: "Build Policy",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      icon: Zap,
      title: "Instant Payments",
      description: "Create payment links with QR codes for instant cross-chain settlements",
      link: "/login",
      linkText: "Create Link",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Building2,
      title: "Smart Vaults",
      description: "Deploy compliant vaults with customizable policy rules and allowlists",
      link: "/login",
      linkText: "Deploy Vault",
      color: "text-teal-600",
      bgColor: "bg-teal-100",
    },
    {
      icon: Briefcase,
      title: "Payroll Automation",
      description: "Upload CSV files and automatically process compliant payroll batches",
      link: "/login",
      linkText: "Process Payroll",
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
    },
  ]

  const benefits = [
    {
      icon: CheckCircle,
      title: "99.7% Compliance Rate",
      description: "Automated screening with real-time updates",
    },
    {
      icon: Globe,
      title: "Multi-Chain Support",
      description: "Ethereum, Polygon, and more networks",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "Bank-grade encryption and audit trails",
    },
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
       {/* Hero Section */}
       <div className="container mx-auto px-4 pt-32 pb-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            {/* FlowLink Logo Section with Unique Design */}
            <div className="flex justify-center mb-12">
              <div className="relative group">
                {/* Outer rotating ring */}
                <div className="absolute -inset-8 w-56 h-56 rounded-full border-2 border-emerald-500/20 animate-spin-slow">
                  <div className="absolute top-0 left-1/2 w-3 h-3 bg-emerald-400 rounded-full transform -translate-x-1/2"></div>
                </div>
                
                {/* Main logo container */}
                <div className="w-40 h-40 rounded-3xl shadow-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-slate-900/80 via-emerald-950/60 to-slate-800/80 backdrop-blur-xl flex items-center justify-center p-6 group-hover:scale-105 transition-all duration-500 relative overflow-hidden">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]"></div>
                  <img 
                    src="/flowlink-logo-new.png" 
                    alt="FlowLink Logo" 
                    className="w-full h-full object-contain relative z-10"
                  />
                </div>
                
                {/* Glow effects */}
                <div className="absolute -inset-6 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 rounded-3xl blur-2xl -z-10 group-hover:blur-3xl transition-all duration-500"></div>
                <div className="absolute -inset-10 bg-gradient-to-r from-emerald-400/5 via-green-400/5 to-teal-400/5 rounded-3xl blur-3xl -z-20"></div>
              </div>
            </div>
            
            {/* Unique Typography */}
            <div className="relative">
              <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-emerald-300 via-green-400 to-teal-500 bg-clip-text text-transparent leading-tight tracking-tight">
                <span className="inline-block hover:scale-105 transition-transform duration-300">Flow</span>{" "}
                <span className="inline-block hover:scale-105 transition-transform duration-300 delay-100">across</span>{" "}
                <span className="inline-block hover:scale-105 transition-transform duration-300 delay-200">chains.</span>
                <br />
                <span className="inline-block hover:scale-105 transition-transform duration-300 delay-300">Link</span>{" "}
                <span className="inline-block hover:scale-105 transition-transform duration-300 delay-400">the</span>{" "}
                <span className="inline-block hover:scale-105 transition-transform duration-300 delay-500">future.</span>
              </h1>
              
              {/* Text glow effect */}
              <div className="absolute inset-0 text-6xl md:text-7xl font-black text-emerald-500/20 blur-sm -z-10">
                <span className="inline-block">Flow</span>{" "}
                <span className="inline-block">across</span>{" "}
                <span className="inline-block">chains.</span>
                <br />
                <span className="inline-block">Link</span>{" "}
                <span className="inline-block">the</span>{" "}
                <span className="inline-block">future.</span>
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Crypto Payments You Can Trust - Create compliant payment links with built-in KYC, sanctions screening, and enterprise-grade security.
            </p>
          </div>
          
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg">
                  <Link href="/login">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/links">
                    View Payment Links
                  </Link>
                </Button>
              </div>

          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>No Setup Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>SOC 2 Compliant</span>
            </div>
          </div>
        </div>
      </div>



      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-16 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-l from-green-500/5 to-transparent rounded-full blur-2xl"></div>
        </div>

        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 text-sm font-medium">Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-300 via-green-400 to-teal-500 bg-clip-text text-transparent">
            Everything you need for compliant crypto payments
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From individual payment links to enterprise payroll automation, FlowLink scales with your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              <Card className="relative overflow-hidden border border-emerald-500/20 bg-gradient-to-br from-slate-900/60 via-emerald-950/30 to-slate-800/60 backdrop-blur-sm group-hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10">
                {/* Subtle background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/3 via-transparent to-green-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <CardContent className="p-6 relative z-10">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className={`p-3 rounded-xl ${feature.bgColor} group-hover:scale-110 transition-all duration-300 shadow-md`}>
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      {/* Subtle glow */}
                      <div className={`absolute inset-0 p-3 rounded-xl ${feature.bgColor} blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white text-center mb-3 group-hover:text-emerald-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground text-center leading-relaxed group-hover:text-emerald-100 transition-colors duration-300">
                    {feature.description}
                  </p>
                </CardContent>
                
                {/* Hover glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative py-24 overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/50 via-emerald-950/30 to-slate-900/50"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-l from-green-500/10 to-transparent rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-teal-500/10 to-transparent rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-emerald-500/30 shadow-2xl bg-gradient-to-br from-slate-900/80 via-emerald-950/60 to-slate-800/80 backdrop-blur-xl flex items-center justify-center p-6 group-hover:scale-105 transition-all duration-500">
                  <img 
                    src="/flowlink-logo-new.png" 
                    alt="FlowLink Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full blur-xl -z-10 group-hover:blur-2xl transition-all duration-500"></div>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 text-sm font-medium">Why Choose Us</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-emerald-300 via-green-400 to-teal-500 bg-clip-text text-transparent">
              Why choose FlowLink?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Built for enterprises that demand compliance, security, and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group text-center space-y-6 relative">
                <div className="relative">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg backdrop-blur-sm border border-emerald-500/20">
                    <benefit.icon className="h-10 w-10 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" />
                  </div>
                  {/* Icon glow effect */}
                  <div className="absolute inset-0 mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-lg text-muted-foreground group-hover:text-emerald-100 transition-colors duration-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
                
                {/* Floating particles */}
                <div className="absolute top-2 right-2 w-1 h-1 bg-emerald-400/60 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-green-400/40 rounded-full animate-pulse delay-1000"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img 
                src="/image7.jpeg" 
                alt="Get Started" 
                className="w-32 h-32 rounded-2xl shadow-2xl border border-emerald-500/20 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
          <h2 className="text-4xl font-bold">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of businesses already using FlowLink for compliant crypto payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700">
              <Link href="/login">
                Create Your First Payment Link
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/android">
                Download Mobile App
              </Link>
            </Button>
           </div>
         </div>
       </div>




      <Footer />
      
       </div>
    </div>
  )
}