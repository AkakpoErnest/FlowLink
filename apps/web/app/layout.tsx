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