import { DM_Sans } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'
import { WalletProvider } from '@/components/providers/wallet-provider'
import AiChat from '@/components/ai-chat'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="FlowLink - Crypto Payments You Can Trust" />
        <title>FlowLink - Crypto Payments Platform</title>
      </head>
      <body className={`font-sans ${dmSans.variable} ${GeistMono.variable}`}>
        <WalletProvider>
          {children}
          <AiChat />
          <Toaster />
          <SonnerToaster position="bottom-right" richColors />
          <Analytics />
        </WalletProvider>
      </body>
    </html>
  )
}
