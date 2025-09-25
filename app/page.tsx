import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
      <div className="container mx-auto px-4 py-20 text-center">
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
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything you need for compliant crypto payments</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From individual payment links to enterprise payroll automation, FlowLink scales with your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="relative">
                <img 
                  src={index === 0 ? "/image5.jpeg" : index === 1 ? "/image6.jpeg" : index === 2 ? "/image7.jpeg" : "/crypto-emotions.jpeg"}
                  alt={feature.title}
                  className="w-full h-32 object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
              </div>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
                <Button asChild variant="outline" className="w-full">
                  <Link href={feature.link}>
                    {feature.linkText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-emerald-500/30 shadow-lg bg-white/10 backdrop-blur-sm flex items-center justify-center p-4">
                <img 
                  src="/flowlink-logo-new.png" 
                  alt="FlowLink Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4">Why choose FlowLink?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for enterprises that demand compliance, security, and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
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
              <Link href="/contact">
                Talk to Sales
              </Link>
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}