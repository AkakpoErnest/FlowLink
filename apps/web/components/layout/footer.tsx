import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">FL</span>
              </div>
              <span className="font-bold text-lg">FlowLink</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Crypto Payments You Can Trust. Flow across chains. Link the future.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/links" className="text-muted-foreground hover:text-foreground">
                  Payment Links
                </Link>
              </li>
              <li>
                <Link href="/vaults" className="text-muted-foreground hover:text-foreground">
                  Smart Vaults
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-muted-foreground hover:text-foreground">
                  Policy Builder
                </Link>
              </li>
              <li>
                <Link href="/payroll" className="text-muted-foreground hover:text-foreground">
                  Payroll Automation
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance */}
          <div className="space-y-4">
            <h4 className="font-semibold">Compliance</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/kyc" className="text-muted-foreground hover:text-foreground">
                  KYC Verification
                </Link>
              </li>
              <li>
                <Link href="/sanctions" className="text-muted-foreground hover:text-foreground">
                  Sanctions Screening
                </Link>
              </li>
              <li>
                <Link href="/travel-rule" className="text-muted-foreground hover:text-foreground">
                  Travel Rule
                </Link>
              </li>
              <li>
                <Link href="/audit" className="text-muted-foreground hover:text-foreground">
                  Audit Trail
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-foreground">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-muted-foreground hover:text-foreground">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-muted-foreground hover:text-foreground">
                  Status Page
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 FlowLink. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/security" className="text-muted-foreground hover:text-foreground">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
