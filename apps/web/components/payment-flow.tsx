"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Wallet, 
  QrCode, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock,
  ArrowRight,
  ExternalLink
} from "lucide-react"

interface PaymentFlowProps {
  paymentLink: {
    id: string
    code: string
    sourceToken: string
    destStable: string
    amountMin: number
    amountMax: number
    requiresKyc: boolean
  }
}

export function PaymentFlow({ paymentLink }: PaymentFlowProps) {
  const [step, setStep] = useState<'form' | 'compliance' | 'route' | 'settle' | 'complete'>('form')
  const [amount, setAmount] = useState('')
  const [wallet, setWallet] = useState('')
  const [countryCode, setCountryCode] = useState('SG')
  const [complianceResult, setComplianceResult] = useState<any>(null)
  const [routeQuote, setRouteQuote] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const steps = [
    { id: 'form', title: 'Payment Details', icon: Wallet },
    { id: 'compliance', title: 'Compliance Check', icon: Shield },
    { id: 'route', title: 'Route Quote', icon: ArrowRight },
    { id: 'settle', title: 'Settle', icon: CheckCircle },
    { id: 'complete', title: 'Complete', icon: CheckCircle },
  ]

  const handleComplianceCheck = async () => {
    setLoading(true)
    setStep('compliance')
    
    // Simulate compliance check
    setTimeout(() => {
      const result = {
        allowed: Math.random() > 0.2, // 80% success rate
        riskScore: Math.floor(Math.random() * 40) + 60, // 60-100
        reasons: Math.random() > 0.2 ? ['KYC verified', 'Sanctions clear', 'Geofencing passed'] : ['High risk detected'],
        kycRequired: paymentLink.requiresKyc && Math.random() > 0.5,
      }
      setComplianceResult(result)
      setStep('route')
      setLoading(false)
    }, 2000)
  }

  const handleGetRoute = async () => {
    setLoading(true)
    
    // Simulate route quote
    setTimeout(() => {
      const quote = {
        amountOut: (parseFloat(amount) * 0.998).toString(),
        dex: '1inch',
        steps: [
          {
            dex: '1inch',
            tokenIn: paymentLink.sourceToken,
            tokenOut: paymentLink.destStable,
            amountIn: amount,
            amountOut: (parseFloat(amount) * 0.998).toString(),
          }
        ]
      }
      setRouteQuote(quote)
      setStep('settle')
      setLoading(false)
    }, 1500)
  }

  const handleSettle = async () => {
    setLoading(true)
    
    // Simulate settlement
    setTimeout(() => {
      setStep('complete')
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => (
              <div key={stepItem.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  steps.indexOf(step) >= index 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-muted-foreground text-muted-foreground'
                }`}>
                  <stepItem.icon className="h-5 w-5" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    steps.indexOf(step) >= index ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {stepItem.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 h-0.5 bg-muted mx-4 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      {step === 'form' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Payment Link: {paymentLink.code}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {paymentLink.sourceToken} → {paymentLink.destStable}
              {paymentLink.requiresKyc && ' • KYC Required'}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="amount">Amount ({paymentLink.sourceToken})</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`${paymentLink.amountMin} - ${paymentLink.amountMax}`}
                min={paymentLink.amountMin}
                max={paymentLink.amountMax}
              />
            </div>

            <div>
              <Label htmlFor="wallet">Wallet Address</Label>
              <Input
                id="wallet"
                type="text"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="0x..."
              />
            </div>

            <div>
              <Label htmlFor="country">Country Code</Label>
              <select
                id="country"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="SG">Singapore (SG)</option>
                <option value="HK">Hong Kong (HK)</option>
                <option value="MY">Malaysia (MY)</option>
                <option value="TH">Thailand (TH)</option>
              </select>
            </div>

            <Button 
              onClick={handleComplianceCheck}
              disabled={!amount || !wallet}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Checking Compliance...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Verify & Continue
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Compliance Results */}
      {step === 'compliance' && complianceResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Compliance Check Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-4 rounded-lg border ${
              complianceResult.allowed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {complianceResult.allowed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={`font-medium ${
                  complianceResult.allowed ? 'text-green-800' : 'text-red-800'
                }`}>
                  {complianceResult.allowed ? 'Compliance Check Passed' : 'Compliance Check Failed'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Risk Score:</span>
                  <Badge variant={complianceResult.riskScore > 80 ? 'success' : 'warning'}>
                    {complianceResult.riskScore}/100
                  </Badge>
                </div>
                <div>
                  <span className="text-sm font-medium">Reasons:</span>
                  <ul className="text-sm text-muted-foreground ml-4">
                    {complianceResult.reasons.map((reason: string, index: number) => (
                      <li key={index}>• {reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {complianceResult.allowed && (
              <Button onClick={handleGetRoute} className="w-full" size="lg">
                <ArrowRight className="h-4 w-4 mr-2" />
                Get Route Quote
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Route Quote */}
      {step === 'route' && routeQuote && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Route Quote
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <span className="text-sm font-medium">Input:</span>
                <p className="text-lg">{amount} {paymentLink.sourceToken}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Output:</span>
                <p className="text-lg">{routeQuote.amountOut} {paymentLink.destStable}</p>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium">Route Details:</span>
              {routeQuote.steps.map((step: any, index: number) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{step.dex}</span>
                    <Badge variant="outline">{step.amountOut} {step.tokenOut}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={handleSettle} className="w-full" size="lg">
              <CheckCircle className="h-4 w-4 mr-2" />
              Settle Payment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Settlement Complete */}
      {step === 'complete' && (
        <Card>
          <CardContent className="pt-6 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground">
                Your payment has been processed and settled successfully.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">
                Transaction Hash: 0x{Math.random().toString(16).substr(2, 64)}
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Receipt
              </Button>
              <Button className="flex-1" onClick={() => window.location.reload()}>
                Make Another Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
