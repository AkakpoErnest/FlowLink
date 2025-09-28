// HashKey Chain Configuration
// Based on HashKey's compliance-friendly blockchain infrastructure

export const hashkeyChain = {
  id: 230315, // HashKey Chain ID (to be verified with official docs)
  name: 'HashKey Chain',
  network: 'hashkey',
  nativeCurrency: {
    decimals: 18,
    name: 'HashKey Token',
    symbol: 'HSK',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.hashkey-chain.io'], // To be verified
    },
    public: {
      http: ['https://rpc.hashkey-chain.io'], // To be verified
    },
  },
  blockExplorers: {
    default: {
      name: 'HashKey Explorer',
      url: 'https://explorer.hashkey-chain.io', // To be verified
    },
  },
  testnet: false,
}

export const hashkeyTestnet = {
  id: 230315, // HashKey Testnet Chain ID (to be verified)
  name: 'HashKey Testnet',
  network: 'hashkey-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HashKey Test Token',
    symbol: 'tHSK',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.hashkey-chain.io'], // To be verified
    },
    public: {
      http: ['https://testnet-rpc.hashkey-chain.io'], // To be verified
    },
  },
  blockExplorers: {
    default: {
      name: 'HashKey Testnet Explorer',
      url: 'https://testnet-explorer.hashkey-chain.io', // To be verified
    },
  },
  testnet: true,
}

// HashKey-specific token configurations
export const hashkeyTokens = {
  // Real World Asset (RWA) tokens that HashKey supports
  RWATokens: [
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0x...', // HashKey USDC contract address
      decimals: 6,
      type: 'stablecoin',
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      address: '0x...', // HashKey USDT contract address
      decimals: 6,
      type: 'stablecoin',
    },
    // Add more RWA tokens as they become available
  ],
  
  // Money Market Fund (MMF) tokens
  MMFTokens: [
    {
      symbol: 'HSK-MMF',
      name: 'HashKey Money Market Fund',
      address: '0x...', // MMF contract address
      decimals: 18,
      type: 'fund',
    },
  ],
  
  // Bond tokens
  BondTokens: [
    {
      symbol: 'HSK-BOND',
      name: 'HashKey Bond Token',
      address: '0x...', // Bond contract address
      decimals: 18,
      type: 'bond',
    },
  ],
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

