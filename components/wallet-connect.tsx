'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Wallet, 
  ChevronDown, 
  Copy, 
  ExternalLink, 
  LogOut,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useWalletConnection } from '@/hooks/use-wallet'
import { useToast } from '@/hooks/use-toast'
import { ConnectButton } from '@rainbow-me/rainbowkit'

interface WalletConnectProps {
  variant?: 'button' | 'card' | 'dropdown'
  showBalance?: boolean
  showChain?: boolean
  className?: string
}

export function WalletConnect({ 
  variant = 'button', 
  showBalance = true, 
  showChain = true,
  className = '' 
}: WalletConnectProps) {
  const { toast } = useToast()
  const {
    isConnected,
    isConnecting,
    address,
    walletDisplayName,
    balanceDisplay,
    chainName,
    connectors,
    connectToWallet,
    disconnectFromWallet,
  } = useWalletConnection()

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      })
    }
  }

  const openExplorer = () => {
    if (address) {
      const explorerUrl = `https://polygonscan.com/address/${address}`
      window.open(explorerUrl, '_blank')
    }
  }

  if (variant === 'card') {
    return (
      <Card className={`border-emerald-500/20 shadow-2xl ${className}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connect Wallet</CardTitle>
          <CardDescription>
            Connect your crypto wallet to access FlowLink features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {connectors.map((connector) => (
                  <Button
                    key={connector.id}
                    onClick={() => connectToWallet(connector.id)}
                    disabled={isConnecting}
                    className="w-full justify-start h-12"
                    variant="outline"
                  >
                    {isConnecting ? (
                      <Loader2 className="h-4 w-4 mr-3 animate-spin" />
                    ) : (
                      <Wallet className="h-4 w-4 mr-3" />
                    )}
                    <div className="text-left">
                      <div className="font-medium">{connector.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {connector.id === 'injected' ? 'Browser wallet' : 'Mobile wallet'}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <p>Supported wallets: MetaMask, WalletConnect, Coinbase Wallet, and more</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span className="font-medium text-emerald-500">Wallet Connected</span>
                </div>
                <p className="text-sm text-muted-foreground">{walletDisplayName}</p>
              </div>

              {showBalance && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Balance</span>
                    <span className="font-medium">{balanceDisplay} MATIC</span>
                  </div>
                </div>
              )}

              {showChain && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Network</span>
                    <Badge variant="secondary">{chainName}</Badge>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyAddress}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Address
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openExplorer}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Explorer
                </Button>
              </div>

              <Button
                variant="destructive"
                onClick={disconnectFromWallet}
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect Wallet
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={className}>
            <Wallet className="h-4 w-4 mr-2" />
            {isConnected ? walletDisplayName : 'Connect Wallet'}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {!isConnected ? (
            <>
              {connectors.map((connector) => (
                <DropdownMenuItem
                  key={connector.id}
                  onClick={() => connectToWallet(connector.id)}
                  disabled={isConnecting}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  {connector.name}
                </DropdownMenuItem>
              ))}
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={copyAddress}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Address
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openExplorer}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={disconnectFromWallet}>
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Default button variant
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected = ready && account && chain

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    disabled={isConnecting}
                    className={className}
                  >
                    {isConnecting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Wallet className="h-4 w-4 mr-2" />
                    )}
                    Connect Wallet
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="destructive" className={className}>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Wrong Network
                  </Button>
                )
              }

              return (
                <div className="flex gap-2">
                  <Button
                    onClick={openChainModal}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </Button>

                  <Button onClick={openAccountModal} className={className}>
                    <Wallet className="h-4 w-4 mr-2" />
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ''}
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
