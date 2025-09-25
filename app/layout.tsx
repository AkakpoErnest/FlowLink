import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { WalletProvider } from '@/components/providers/wallet-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="FlowLink - Crypto Payments You Can Trust" />
        <title>FlowLink - Crypto Payments Platform</title>
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <WalletProvider>
          {children}
          <Toaster />
          <Analytics />
        </WalletProvider>
      </body>
    </html>
  )
}