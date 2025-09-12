"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, ExternalLink, Download, QrCode, Wallet, Shield, FileText, Clock, User } from "lucide-react"
import Image from "next/image"

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)

  const steps = [
    {
      title: "Generate Payment Link",
      description: "Create a compliant payment link for contractor",
      icon: <ExternalLink className="w-6 h-6" />,
    },
    {
      title: "Scan QR Code",
      description: "Contractor scans QR code with mobile wallet",
      icon: <QrCode className="w-6 h-6" />,
    },
    {
      title: "Connect MetaMask",
      description: "Connect wallet and approve transaction",
      icon: <Wallet className="w-6 h-6" />,
    },
    {
      title: "Instant Compliance",
      description: "Automatic KYC & sanctions screening",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      title: "Generate Receipt",
      description: "PDF receipt with compliance certificate",
      icon: <FileText className="w-6 h-6" />,
    },
  ]

  const simulatePayment = async () => {
    setIsProcessing(true)
    
    // Simulate step progression
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCurrentStep(i + 1)
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    setPaymentComplete(true)
    setIsProcessing(false)
    
    // Show receipt after 2 seconds
    setTimeout(() => {
      setShowReceipt(true)
    }, 2000)
  }

  const resetDemo = () => {
    setCurrentStep(0)
    setIsProcessing(false)
    setPaymentComplete(false)
    setShowReceipt(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
            Live Demo: One-Click Compliant Payments
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Watch how boring finance friction becomes seamless compliance
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge variant="outline" className="text-lg px-4 py-2">
              💰 Pay 1000 USDC to Contractor
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              ⚡ Instant Compliance
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              📄 PDF Receipt
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Demo Flow */}
          <div className="space-y-6">
            {/* Payment Link Card */}
            <Card className="border-primary/20 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <ExternalLink className="w-5 h-5" />
                  Payment Link Generated
                </CardTitle>
                <CardDescription>
                  Compliant payment link for contractor payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Payment Link:</p>
                  <code className="text-sm break-all">
                    https://flowlink.app/pay/contractor-1000-usdc-{Date.now().toString().slice(-8)}
                  </code>
                </div>
                
                {/* QR Code Placeholder */}
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-white border-2 border-primary/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="w-16 h-16 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">QR Code</p>
                      <p className="text-xs text-muted-foreground">Scan to pay</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={simulatePayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg"
                >
                  {isProcessing ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : paymentComplete ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Payment Complete!
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Start Demo Payment
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* MetaMask Simulation */}
            {currentStep >= 3 && (
              <Card className="border-accent/20 shadow-xl animate-in slide-in-from-bottom-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent">
                    <Wallet className="w-5 h-5" />
                    MetaMask Connected
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Contractor Wallet</p>
                      <p className="text-sm text-muted-foreground">0x742d...35Cc</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-bold">1000 USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gas Fee:</span>
                      <span>$2.50</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>1000 USDC + Gas</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    Confirm Transaction
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Side - Progress & Compliance */}
          <div className="space-y-6">
            {/* Progress Steps */}
            <Card className="border-primary/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Payment Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                        currentStep > index 
                          ? 'bg-green-500 text-white' 
                          : currentStep === index && isProcessing
                          ? 'bg-primary text-white animate-pulse'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {currentStep > index ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          step.icon
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium transition-colors duration-300 ${
                          currentStep > index ? 'text-green-600' : 
                          currentStep === index && isProcessing ? 'text-primary' : 
                          'text-muted-foreground'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card className="border-green-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  Compliance Verified
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>KYC Verification:</span>
                  <Badge className="bg-green-500">✓ Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sanctions Check:</span>
                  <Badge className="bg-green-500">✓ Clear</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>AML Screening:</span>
                  <Badge className="bg-green-500">✓ Passed</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Regulatory Status:</span>
                  <Badge className="bg-green-500">✓ Compliant</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Receipt Popup */}
        {showReceipt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-500">
            <Card className="w-full max-w-2xl mx-4 border-primary/20 shadow-2xl animate-in slide-in-from-bottom-4">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 text-center">
                <CardTitle className="text-2xl text-primary">🎉 Payment Complete!</CardTitle>
                <CardDescription>Compliance receipt generated successfully</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Compliance Receipt Generated</h3>
                  <p className="text-muted-foreground">
                    Your compliant payment receipt is ready for download
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction ID</p>
                    <p className="font-mono text-sm">0x742d...35Cc</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-bold">1000 USDC</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p>{new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className="bg-green-500">Compliant</Badge>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-primary to-accent"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/receipt/pdf', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            transactionId: '0x742d35Cc1234567890abcdef',
                            amount: '1000 USDC',
                            date: new Date().toISOString(),
                            status: 'Compliant'
                          })
                        })
                        const data = await response.json()
                        if (data.success) {
                          // In a real app, this would download the actual PDF
                          alert('PDF Receipt downloaded successfully! 🎉')
                        }
                      } catch (error) {
                        console.error('Error generating PDF:', error)
                      }
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF Receipt
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetDemo}
                    className="flex-1"
                  >
                    Run Demo Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
