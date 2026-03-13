// HashKey Chain Configuration
<<<<<<< HEAD
// Official values sourced from viem chain definitions

export const hashkeyChain = {
  id: 177,
=======
// Based on HashKey's compliance-friendly blockchain infrastructure

export const hashkeyChain = {
  id: 230315, // HashKey Chain ID (to be verified with official docs)
>>>>>>> fix-vercel-build
  name: 'HashKey Chain',
  network: 'hashkey',
  nativeCurrency: {
    decimals: 18,
<<<<<<< HEAD
    name: 'HashKey EcoPoints',
=======
    name: 'HashKey Token',
>>>>>>> fix-vercel-build
    symbol: 'HSK',
  },
  rpcUrls: {
    default: {
<<<<<<< HEAD
      http: ['https://mainnet.hsk.xyz'],
    },
    public: {
      http: ['https://mainnet.hsk.xyz'],
=======
      http: ['https://rpc.hashkey-chain.io'], // To be verified
    },
    public: {
      http: ['https://rpc.hashkey-chain.io'], // To be verified
>>>>>>> fix-vercel-build
    },
  },
  blockExplorers: {
    default: {
<<<<<<< HEAD
      name: 'HashKey Chain Explorer',
      url: 'https://hashkey.blockscout.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11' as `0x${string}`,
      blockCreated: 0,
=======
      name: 'HashKey Explorer',
      url: 'https://explorer.hashkey-chain.io', // To be verified
>>>>>>> fix-vercel-build
    },
  },
  testnet: false,
}

export const hashkeyTestnet = {
<<<<<<< HEAD
  id: 133,
  name: 'HashKey Chain Testnet',
  network: 'hashkey-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HashKey EcoPoints',
=======
  id: 230315, // HashKey Testnet Chain ID (to be verified)
  name: 'HashKey Testnet',
  network: 'hashkey-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HashKey Test Token',
>>>>>>> fix-vercel-build
    symbol: 'tHSK',
  },
  rpcUrls: {
    default: {
<<<<<<< HEAD
      http: ['https://hashkeychain-testnet.alt.technology'],
    },
    public: {
      http: ['https://hashkeychain-testnet.alt.technology'],
=======
      http: ['https://testnet-rpc.hashkey-chain.io'], // To be verified
    },
    public: {
      http: ['https://testnet-rpc.hashkey-chain.io'], // To be verified
>>>>>>> fix-vercel-build
    },
  },
  blockExplorers: {
    default: {
<<<<<<< HEAD
      name: 'HashKey Chain Testnet Explorer',
      url: 'https://hashkeychain-testnet-explorer.alt.technology',
=======
      name: 'HashKey Testnet Explorer',
      url: 'https://testnet-explorer.hashkey-chain.io', // To be verified
>>>>>>> fix-vercel-build
    },
  },
  testnet: true,
}

// HashKey-specific token configurations
export const hashkeyTokens = {
<<<<<<< HEAD
  // Stablecoins on HashKey Chain
  stablecoins: [
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3' as `0x${string}`,
=======
  // Real World Asset (RWA) tokens that HashKey supports
  RWATokens: [
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0x...', // HashKey USDC contract address
>>>>>>> fix-vercel-build
      decimals: 6,
      type: 'stablecoin',
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
<<<<<<< HEAD
      address: '0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b4' as `0x${string}`,
      decimals: 6,
      type: 'stablecoin',
    },
  ],

  // Real World Asset (RWA) tokens that HashKey supports
  RWATokens: [
    {
      symbol: 'HSK-MMF',
      name: 'HashKey Money Market Fund',
      address: '0x0000000000000000000000000000000000000001' as `0x${string}`,
      decimals: 18,
      type: 'fund',
      apy: '4.2%',
    },
    {
      symbol: 'HSK-BOND',
      name: 'HashKey Bond Token',
      address: '0x0000000000000000000000000000000000000002' as `0x${string}`,
      decimals: 18,
      type: 'bond',
      apy: '5.8%',
=======
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
>>>>>>> fix-vercel-build
    },
  ],
}

// HashKey compliance features
export const hashkeyCompliance = {
<<<<<<< HEAD
  kycRequired: true,
  kycProviders: ['HashKey KYC', 'Sumsub', 'Veriff'],
  sanctionsScreening: true,
  dailyLimit: '1000000',
  monthlyLimit: '10000000',
  supportedJurisdictions: ['Hong Kong', 'Singapore', 'Japan', 'United States'],
=======
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
>>>>>>> fix-vercel-build
}

// HashKey integration utilities
export const hashkeyUtils = {
<<<<<<< HEAD
  formatAddress: (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`,

  calculateFee: (gasLimit: bigint, gasPrice: bigint) => gasLimit * gasPrice,

  isTokenSupported: (tokenAddress: string) => {
    const all = [...hashkeyTokens.stablecoins, ...hashkeyTokens.RWATokens]
    return all.some(t => t.address.toLowerCase() === tokenAddress.toLowerCase())
  },

  getTokenInfo: (tokenAddress: string) => {
    const all = [...hashkeyTokens.stablecoins, ...hashkeyTokens.RWATokens]
    return all.find(t => t.address.toLowerCase() === tokenAddress.toLowerCase())
  },

  getExplorerTxUrl: (txHash: string) =>
    `${hashkeyChain.blockExplorers.default.url}/tx/${txHash}`,

  getExplorerAddressUrl: (address: string) =>
    `${hashkeyChain.blockExplorers.default.url}/address/${address}`,
}
=======
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

>>>>>>> fix-vercel-build
