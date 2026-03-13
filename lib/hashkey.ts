// HashKey Chain Configuration
// Official values sourced from viem chain definitions

export const hashkeyChain = {
  id: 177,
  name: 'HashKey Chain',
  network: 'hashkey',
  nativeCurrency: {
    decimals: 18,
    name: 'HashKey EcoPoints',
    symbol: 'HSK',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.hsk.xyz'],
    },
    public: {
      http: ['https://mainnet.hsk.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HashKey Chain Explorer',
      url: 'https://hashkey.blockscout.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11' as `0x${string}`,
      blockCreated: 0,
    },
  },
  testnet: false,
}

export const hashkeyTestnet = {
  id: 133,
  name: 'HashKey Chain Testnet',
  network: 'hashkey-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HashKey EcoPoints',
    symbol: 'tHSK',
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
      name: 'HashKey Chain Testnet Explorer',
      url: 'https://hashkeychain-testnet-explorer.alt.technology',
    },
  },
  testnet: true,
}

// HashKey-specific token configurations
export const hashkeyTokens = {
  // Stablecoins on HashKey Chain
  stablecoins: [
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3' as `0x${string}`,
      decimals: 6,
      type: 'stablecoin',
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
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
    },
  ],
}

// HashKey compliance features
export const hashkeyCompliance = {
  kycRequired: true,
  kycProviders: ['HashKey KYC', 'Sumsub', 'Veriff'],
  sanctionsScreening: true,
  dailyLimit: '1000000',
  monthlyLimit: '10000000',
  supportedJurisdictions: ['Hong Kong', 'Singapore', 'Japan', 'United States'],
}

// HashKey integration utilities
export const hashkeyUtils = {
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
