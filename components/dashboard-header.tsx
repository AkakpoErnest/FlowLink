import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import Image from "next/image"

export function DashboardHeader() {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 p-2">
              <Image 
                src="/flowlink-logo-final.png" 
                alt="FlowLink Logo" 
                width={32} 
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                FlowLink
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Crypto Payments You Can Trust
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              className="border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-sm font-semibold text-primary-foreground">M</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
