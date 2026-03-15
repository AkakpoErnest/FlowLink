// HashKey Chain Configuration

// Testnet (Chain ID 133) — what we use in the app today
export const hashkeyChain = {
  id: 133,
  name: 'HashKey Testnet',
  network: 'hashkey-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HashKey Token',
    symbol: 'HSK',
  },
  rpcUrls: {
    default: {
      http: ['https://hashkeychain-testnet.alt.technology'],
    },
    public: {
      http: ['https://hashkeychain-testnet.alt.technology'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HashKey Testnet Explorer',
      url: 'https://hashkeychain-testnet-explorer.alt.technology',
    },
  },
  testnet: true,
}

// Mainnet (Chain ID 230315) — for future use
export const hashkeyMainnet = {
  id: 230315,
  name: 'HashKey Chain',
  network: 'hashkey',
  nativeCurrency: {
    decimals: 18,
    name: 'HashKey Token',
    symbol: 'HSK',
  },
  rpcUrls: {
    default: { http: ['https://mainnet.hsk.xyz'] },
    public:  { http: ['https://mainnet.hsk.xyz'] },
  },
  blockExplorers: {
    default: { name: 'HashKey Explorer', url: 'https://explorer.hsk.xyz' },
  },
  testnet: false,
}

// Alias for backwards compat
export const hashkeyTestnet = hashkeyChain

// HashKey-specific token configurations
export const hashkeyTokens = {
  stablecoins: [
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0x9aa7fEc87CA69695Dd1f879567CcF49F3ba417E',
      decimals: 6,
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      decimals: 6,
    },
  ],

  // Kept for utils compatibility
  RWATokens: [] as Array<{ symbol: string; name: string; address: string; decimals: number; apy?: string }>,
  MMFTokens: [] as Array<{ symbol: string; name: string; address: string; decimals: number }>,
  BondTokens: [] as Array<{ symbol: string; name: string; address: string; decimals: number }>,
}

// HashKey compliance features
export const hashkeyCompliance = {
  // KYC requirements
  kycRequired: true,
  kycProviders: ['HashKey KYC', 'Third-party KYC'],

  // Sanctions screening
  sanctionsScreening: true,

  // Transaction limits
  dailyLimit: '1000000', // 1M USD equivalent
  monthlyLimit: '10000000', // 10M USD equivalent

  // Supported jurisdictions
  supportedJurisdictions: ['Hong Kong', 'Singapore', 'Japan', 'US'],
}

// HashKey API endpoints (to be verified with official docs)
export const hashkeyApi = {
  baseUrl: 'https://api.hashkey-chain.io',
  endpoints: {
    balance: '/v1/balance',
    transactions: '/v1/transactions',
    compliance: '/v1/compliance',
    rwa: '/v1/rwa',
    quotes: '/v1/quotes',
  },
}

// HashKey integration utilities
export const hashkeyUtils = {
  // Format addresses for HashKey
  formatAddress: (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  },

  // Calculate transaction fees
  calculateFee: (gasLimit: bigint, gasPrice: bigint) => {
    return gasLimit * gasPrice;
  },

  // Check if token is supported
  isTokenSupported: (tokenAddress: string) => {
    const allTokens = [
      ...hashkeyTokens.RWATokens,
      ...hashkeyTokens.MMFTokens,
      ...hashkeyTokens.BondTokens,
    ];
    return allTokens.some(token => token.address.toLowerCase() === tokenAddress.toLowerCase());
  },

  // Get token info
  getTokenInfo: (tokenAddress: string) => {
    const allTokens = [
      ...hashkeyTokens.RWATokens,
      ...hashkeyTokens.MMFTokens,
      ...hashkeyTokens.BondTokens,
    ];
    return allTokens.find(token => token.address.toLowerCase() === tokenAddress.toLowerCase());
  },
}
