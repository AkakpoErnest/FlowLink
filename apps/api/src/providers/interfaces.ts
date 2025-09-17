import { z } from 'zod';

// Risk Provider Interfaces
export const RiskScoreSchema = z.object({
  score: z.number().min(0).max(100),
  reasons: z.array(z.string()),
});

export type RiskScore = z.infer<typeof RiskScoreSchema>;

export interface RiskAdapter {
  score(wallet: string): Promise<RiskScore>;
}

// KYC Provider Interfaces
export const KycStatusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  level: z.enum(['LOW', 'FULL']).nullable(),
  reasons: z.array(z.string()),
});

export const KycStartSchema = z.object({
  externalRef: z.string(),
});

export type KycStatus = z.infer<typeof KycStatusSchema>;
export type KycStart = z.infer<typeof KycStartSchema>;

export interface KycAdapter {
  start(userId: string): Promise<KycStart>;
  status(externalRef: string): Promise<KycStatus>;
}

// Travel Rule Provider Interfaces
export const TravelRulePayloadSchema = z.object({
  transactionId: z.string(),
  originatorVasp: z.string(),
  beneficiaryVasp: z.string(),
  amount: z.string(),
  currency: z.string(),
  chainId: z.number(),
});

export const TravelRuleResponseSchema = z.object({
  status: z.enum(['SUCCESS', 'FAILED', 'PENDING']),
  counterparty: z.string().optional(),
});

export type TravelRulePayload = z.infer<typeof TravelRulePayloadSchema>;
export type TravelRuleResponse = z.infer<typeof TravelRuleResponseSchema>;

export interface TravelRuleAdapter {
  send(payload: TravelRulePayload): Promise<TravelRuleResponse>;
  receive(payload: TravelRulePayload): Promise<TravelRuleResponse>;
}

// DEX Router Provider Interfaces
export const DexQuoteRequestSchema = z.object({
  fromToken: z.string(),
  destToken: z.string(),
  amount: z.string(),
  chainId: z.number(),
});

export const DexQuoteResponseSchema = z.object({
  amountOut: z.string(),
  steps: z.array(z.object({
    dex: z.string(),
    tokenIn: z.string(),
    tokenOut: z.string(),
    amountIn: z.string(),
    amountOut: z.string(),
  })),
});

export type DexQuoteRequest = z.infer<typeof DexQuoteRequestSchema>;
export type DexQuoteResponse = z.infer<typeof DexQuoteResponseSchema>;

export interface DexRouterAdapter {
  quote(request: DexQuoteRequest): Promise<DexQuoteResponse>;
}

// Stablecoin Registry Interfaces
export const StablecoinSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  chainId: z.number(),
  address: z.string(),
  decimals: z.number(),
  isVerified: z.boolean(),
});

export type Stablecoin = z.infer<typeof StablecoinSchema>;

export interface StablecoinRegistry {
  list(): Promise<Stablecoin[]>;
  get(symbol: string, chainId: number): Promise<Stablecoin | null>;
}
