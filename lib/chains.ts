// Multi-chain registry for FlowLink
// Add new chains here and they propagate everywhere automatically

export interface ChainToken {
  symbol: string
  name: string
  address: string  // empty string = native token
  decimals: number
}

export interface SupportedChain {
  id: number
  key: string          // used in DB (PaymentLink.network)
  name: string
  testnet: boolean
  explorerUrl: string
  nativeSymbol: string
  tokens: ChainToken[]
}

export const SUPPORTED_CHAINS: SupportedChain[] = [
  {
    id: 44787,
    key: 'celo-alfajores',
    name: 'Celo Alfajores',
    testnet: true,
    explorerUrl: 'https://alfajores.celoscan.io',
    nativeSymbol: 'CELO',
    tokens: [
      {
        symbol: 'cUSD',
        name: 'Celo Dollar',
        address: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
        decimals: 18,
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B',
        decimals: 6,
      },
      {
        symbol: 'CELO',
        name: 'Celo (native)',
        address: '',  // native — use sendTransaction
        decimals: 18,
      },
    ],
  },
  {
    id: 42220,
    key: 'celo',
    name: 'Celo',
    testnet: false,
    explorerUrl: 'https://celoscan.io',
    nativeSymbol: 'CELO',
    tokens: [
      {
        symbol: 'cUSD',
        name: 'Celo Dollar',
        address: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
        decimals: 18,
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        address: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C',
        decimals: 6,
      },
      {
        symbol: 'USDT',
        name: 'Tether USD',
        address: '0x617f3112bf5397D0467D315cC709EF968D9ba546',
        decimals: 6,
      },
      {
        symbol: 'CELO',
        name: 'Celo (native)',
        address: '',
        decimals: 18,
      },
    ],
  },
  {
    id: 133,
    key: 'hashkey-testnet',
    name: 'HashKey Testnet',
    testnet: true,
    explorerUrl: 'https://hashkeychain-testnet-explorer.alt.technology',
    nativeSymbol: 'HSK',
    tokens: [
      {
        symbol: 'HSK',
        name: 'HashKey Token (native)',
        address: '',
        decimals: 18,
      },
      // USDC/USDT addresses TBD — check HashKey testnet explorer
      // {  symbol: 'USDC', address: '0x...', decimals: 6 },
    ],
  },
  {
    id: 177,
    key: 'hashkey',
    name: 'HashKey Chain',
    testnet: false,
    explorerUrl: 'https://explorer.hsk.xyz',
    nativeSymbol: 'HSK',
    tokens: [
      {
        symbol: 'HSK',
        name: 'HashKey Token (native)',
        address: '',
        decimals: 18,
      },
    ],
  },
]

export function getChain(key: string): SupportedChain | undefined {
  return SUPPORTED_CHAINS.find(c => c.key === key)
}

export function getChainById(id: number): SupportedChain | undefined {
  return SUPPORTED_CHAINS.find(c => c.id === id)
}

export function getToken(chainKey: string, symbol: string): ChainToken | undefined {
  return getChain(chainKey)?.tokens.find(t => t.symbol === symbol)
}

export function isNativeToken(token: ChainToken): boolean {
  return token.address === ''
}

// Default chain for new payment links
export const DEFAULT_CHAIN_KEY = 'celo-alfajores'
