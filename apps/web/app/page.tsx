import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatsCards } from '@/components/stats-cards'
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
      link: "/policies",
      linkText: "Build Policy",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Zap,
      title: "Instant Payments",
      description: "Create payment links with QR codes for instant cross-chain settlements",
      link: "/links",
      linkText: "Create Link",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Building2,
      title: "Smart Vaults",
      description: "Deploy compliant vaults with customizable policy rules and allowlists",
      link: "/vaults",
      linkText: "Deploy Vault",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Briefcase,
      title: "Payroll Automation",
      description: "Upload CSV files and automatically process compliant payroll batches",
      link: "/payroll",
      linkText: "Process Payroll",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
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
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-purple-50/30">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <Badge variant="outline" className="mb-4">
              🚀 Production Ready • Trusted by 500+ Companies
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              Flow across chains.<br />Link the future.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Crypto Payments You Can Trust - Create compliant payment links with built-in KYC, sanctions screening, and enterprise-grade security.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
              <Link href="/links">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/demo">
                Watch Demo
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

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <StatsCards />
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
            <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
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
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of businesses already using FlowLink for compliant crypto payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href="/links">
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
  )
}