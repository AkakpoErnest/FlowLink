import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FlowLink - Crypto Payments You Can Trust',
  description: 'Flow across chains. Link the future. Create compliant payment links with built-in KYC and sanctions checking.',
  keywords: ['crypto', 'payments', 'compliance', 'KYC', 'blockchain', 'Web3'],
  authors: [{ name: 'FlowLink Team' }],
  openGraph: {
    title: 'FlowLink - Crypto Payments You Can Trust',
    description: 'Create compliant payment links with built-in KYC and sanctions checking',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}