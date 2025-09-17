import { z } from 'zod';
import { KycLevel, PolicyRules } from './types';

export const KycLevelSchema = z.nativeEnum(KycLevel);

export const PolicyRulesSchema: z.ZodType<PolicyRules> = z.object({
  geofencing: z.array(z.string()).optional(),
  sanctionsCheck: z.boolean().optional(),
  perTxLimit: z.number().optional(),
  kycLevel: KycLevelSchema.optional(),
  allowlistOnly: z.boolean().optional(),
});

export const CreatePolicySchema = z.object({
  name: z.string().min(1),
  rules: PolicyRulesSchema,
});

export const CreateVaultSchema = z.object({
  policyId: z.string().uuid(),
  chainId: z.number().int().positive(),
});

export const CreatePaymentLinkSchema = z.object({
  sourceToken: z.string(),
  destStable: z.string(),
  amountMin: z.number().positive(),
  amountMax: z.number().positive(),
  requiresKyc: z.boolean(),
  policyId: z.string().uuid().optional(),
});

export const PaymentIntentSchema = z.object({
  fromWallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  amountIn: z.string(),
  countryCode: z.string().length(2),
  chainId: z.number().int().positive(),
});

export const SettlePaymentSchema = z.object({
  txHash: z.string().optional(),
});

export const RouteQuoteSchema = z.object({
  fromToken: z.string(),
  destStable: z.string(),
  amountIn: z.string(),
  chainId: z.number().int().positive(),
});

export const CreatePayrollBatchSchema = z.object({
  chainId: z.number().int().positive(),
  rules: PolicyRulesSchema,
});

export const PayrollItemSchema = z.object({
  recipientWallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  amount: z.number().positive(),
  currency: z.string(),
  countryCode: z.string().length(2),
  kycLevelRequired: KycLevelSchema,
});

export const GenerateReceiptSchema = z.object({
  entityType: z.enum(['LINK', 'PAYROLL', 'VAULT']),
  entityId: z.string(),
});

export const RiskScoreSchema = z.object({
  wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

export const AttestationSchema = z.object({
  wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

export const PolicySimulateSchema = z.object({
  policyId: z.string().uuid(),
  txs: z.array(z.object({
    from: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    to: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    amount: z.number().positive(),
    countryCode: z.string().length(2),
    chainId: z.number().int().positive(),
  })),
});

