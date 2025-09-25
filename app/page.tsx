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
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-900/50 to-emerald-900/30 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="/hero-bg.jpeg" 
          alt="FlowLink Background" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            {/* FlowLink Logo Section */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-40 h-40 rounded-3xl shadow-2xl border-4 border-emerald-500/30 bg-white/10 backdrop-blur-sm flex items-center justify-center p-6 hover:scale-105 transition-transform duration-300">
                  <img 
                    src="/flowlink-logo-new.png" 
                    alt="FlowLink Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-3xl blur-xl -z-10"></div>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent leading-tight">
              Flow across chains.<br />Link the future.
            </h1>
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


      {/* Animation Showcase Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Experience the Future of Payments</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch how FlowLink transforms crypto payments with seamless, secure transactions.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 mb-16">
          {/* First Animation */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-emerald-500/20 shadow-2xl">
              <iframe 
                src="https://assets.pinterest.com/ext/embed.html?id=908882768553734677" 
                height="714" 
                width="345" 
                frameBorder="0" 
                scrolling="no"
                className="rounded-2xl shadow-xl"
                title="FlowLink Payment Animation 1"
              />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-3xl blur-xl -z-10"></div>
          </div>
          
          {/* Second Animation */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-emerald-500/20 shadow-2xl">
              <iframe 
                src="https://assets.pinterest.com/ext/embed.html?id=9710955442580080" 
                height="1167" 
                width="600" 
                frameBorder="0" 
                scrolling="no"
                className="rounded-2xl shadow-xl"
                title="FlowLink Payment Animation 2"
              />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-3xl blur-xl -z-10"></div>
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
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-4 border border-emerald-500/20 shadow-2xl">
                <iframe 
                  src="https://assets.pinterest.com/ext/embed.html?id=908882768553734677" 
                  height="357" 
                  width="172" 
                  frameBorder="0" 
                  scrolling="no"
                  className="rounded-2xl shadow-xl"
                  title="FlowLink Payment Demo"
                />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-3xl blur-xl -z-10"></div>
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