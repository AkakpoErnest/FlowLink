'use client'

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mainnet, polygon, arbitrum, optimism, sepolia, polygonMumbai } from 'wagmi/chains'
import { http } from 'viem'
import { hashkeyChain, hashkeyTestnet } from '@/lib/hashkey'

import '@rainbow-me/rainbowkit/styles.css'

// Get project ID from environment or use a demo one
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

const config = getDefaultConfig({
  appName: 'FlowLink - Crypto Payments Platform',
  projectId,
  chains: [
    mainnet,
    polygon,
    arbitrum,
    optimism,
    sepolia, // For testing
    polygonMumbai, // For testing
    hashkeyChain,
    hashkeyTestnet,
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [sepolia.id]: http(),
    [polygonMumbai.id]: http(),
    [hashkeyChain.id]: http(),
    [hashkeyTestnet.id]: http(),
  },
  ssr: true, // Enable SSR support
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          appInfo={{
            appName: 'FlowLink',
            learnMoreUrl: 'https://flowlink.app',
            disclaimer: ({ Text, Link }) => (
              <Text>
                By connecting your wallet, you agree to the{' '}
                <Link href="https://flowlink.app/terms">Terms of Service</Link> and{' '}
                <Link href="https://flowlink.app/privacy">Privacy Policy</Link>.
              </Text>
            ),
          }}
          initialChain={polygon} // Default to Polygon for better UX
          showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
