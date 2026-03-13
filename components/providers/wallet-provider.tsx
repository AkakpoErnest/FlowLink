'use client'

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
<<<<<<< HEAD
import { mainnet, polygon, arbitrum, optimism, sepolia } from 'wagmi/chains'
import { http } from 'viem'
import { hashkey, hashkeyTestnet } from 'viem/chains'
=======
import { mainnet, polygon, arbitrum, optimism, sepolia, polygonMumbai } from 'wagmi/chains'
import { http } from 'viem'
import { hashkeyChain, hashkeyTestnet } from '@/lib/hashkey'
>>>>>>> fix-vercel-build

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
<<<<<<< HEAD
    hashkey,      // HashKey Chain mainnet (ID: 177)
    hashkeyTestnet, // HashKey Chain testnet (ID: 133)
    sepolia,
=======
    sepolia, // For testing
    polygonMumbai, // For testing
    hashkeyChain,
    hashkeyTestnet,
>>>>>>> fix-vercel-build
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
<<<<<<< HEAD
    [hashkey.id]: http('https://mainnet.hsk.xyz'),
    [hashkeyTestnet.id]: http('https://hashkeychain-testnet.alt.technology'),
    [sepolia.id]: http(),
=======
    [sepolia.id]: http(),
    [polygonMumbai.id]: http(),
    [hashkeyChain.id]: http(),
    [hashkeyTestnet.id]: http(),
>>>>>>> fix-vercel-build
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
<<<<<<< HEAD
          initialChain={hashkey} // Default to HashKey Chain
=======
          initialChain={polygon} // Default to Polygon for better UX
>>>>>>> fix-vercel-build
          showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
