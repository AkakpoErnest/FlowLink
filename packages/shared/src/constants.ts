export const SUPPORTED_CHAINS = {
  1: 'Ethereum',
  137: 'Polygon',
  11155111: 'Sepolia',
  80002: 'Polygon Amoy',
} as const;

export const MOCK_SANCTIONS_LIST = [
  '0xdeadbeef1234567890abcdef1234567890abcdef',
  '0xbadcafe1234567890abcdef1234567890abcdef',
];

export const MOCK_ATTESTATION_WALLETS = {
  POAP: [
    '0x1111111111111111111111111111111111111111',
    '0x2222222222222222222222222222222222222222',
  ],
  KYCHAIN_LOW: [
    '0x3333333333333333333333333333333333333333',
    '0x4444444444444444444444444444444444444444',
  ],
  KYCHAIN_FULL: [
    '0x5555555555555555555555555555555555555555',
  ],
};

export const DEFAULT_POLICY_RULES = {
  geofencing: ['SG', 'HK', 'MY', 'TH'],
  sanctionsCheck: true,
  perTxLimit: 10000,
  kycLevel: 'LOW' as const,
  allowlistOnly: false,
};

export const RECEIPT_ISSUER = 'FlowLink Pte. Ltd.';

