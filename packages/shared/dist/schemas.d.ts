import { z } from 'zod';
import { KycLevel, PolicyRules } from './types';
export declare const KycLevelSchema: z.ZodNativeEnum<typeof KycLevel>;
export declare const PolicyRulesSchema: z.ZodType<PolicyRules>;
export declare const CreatePolicySchema: z.ZodObject<{
    name: z.ZodString;
    rules: z.ZodType<PolicyRules, z.ZodTypeDef, PolicyRules>;
}, "strip", z.ZodTypeAny, {
    name: string;
    rules: PolicyRules;
}, {
    name: string;
    rules: PolicyRules;
}>;
export declare const CreateVaultSchema: z.ZodObject<{
    policyId: z.ZodString;
    chainId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    policyId: string;
    chainId: number;
}, {
    policyId: string;
    chainId: number;
}>;
export declare const CreatePaymentLinkSchema: z.ZodObject<{
    sourceToken: z.ZodString;
    destStable: z.ZodString;
    amountMin: z.ZodNumber;
    amountMax: z.ZodNumber;
    requiresKyc: z.ZodBoolean;
    policyId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sourceToken: string;
    destStable: string;
    amountMin: number;
    amountMax: number;
    requiresKyc: boolean;
    policyId?: string | undefined;
}, {
    sourceToken: string;
    destStable: string;
    amountMin: number;
    amountMax: number;
    requiresKyc: boolean;
    policyId?: string | undefined;
}>;
export declare const PaymentIntentSchema: z.ZodObject<{
    fromWallet: z.ZodString;
    amountIn: z.ZodString;
    countryCode: z.ZodString;
    chainId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    chainId: number;
    fromWallet: string;
    amountIn: string;
    countryCode: string;
}, {
    chainId: number;
    fromWallet: string;
    amountIn: string;
    countryCode: string;
}>;
export declare const SettlePaymentSchema: z.ZodObject<{
    txHash: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    txHash?: string | undefined;
}, {
    txHash?: string | undefined;
}>;
export declare const RouteQuoteSchema: z.ZodObject<{
    fromToken: z.ZodString;
    destStable: z.ZodString;
    amountIn: z.ZodString;
    chainId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    chainId: number;
    destStable: string;
    amountIn: string;
    fromToken: string;
}, {
    chainId: number;
    destStable: string;
    amountIn: string;
    fromToken: string;
}>;
export declare const CreatePayrollBatchSchema: z.ZodObject<{
    chainId: z.ZodNumber;
    rules: z.ZodType<PolicyRules, z.ZodTypeDef, PolicyRules>;
}, "strip", z.ZodTypeAny, {
    rules: PolicyRules;
    chainId: number;
}, {
    rules: PolicyRules;
    chainId: number;
}>;
export declare const PayrollItemSchema: z.ZodObject<{
    recipientWallet: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodString;
    countryCode: z.ZodString;
    kycLevelRequired: z.ZodNativeEnum<typeof KycLevel>;
}, "strip", z.ZodTypeAny, {
    countryCode: string;
    recipientWallet: string;
    amount: number;
    currency: string;
    kycLevelRequired: KycLevel;
}, {
    countryCode: string;
    recipientWallet: string;
    amount: number;
    currency: string;
    kycLevelRequired: KycLevel;
}>;
export declare const GenerateReceiptSchema: z.ZodObject<{
    entityType: z.ZodEnum<["LINK", "PAYROLL", "VAULT"]>;
    entityId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    entityType: "LINK" | "PAYROLL" | "VAULT";
    entityId: string;
}, {
    entityType: "LINK" | "PAYROLL" | "VAULT";
    entityId: string;
}>;
export declare const RiskScoreSchema: z.ZodObject<{
    wallet: z.ZodString;
}, "strip", z.ZodTypeAny, {
    wallet: string;
}, {
    wallet: string;
}>;
export declare const AttestationSchema: z.ZodObject<{
    wallet: z.ZodString;
}, "strip", z.ZodTypeAny, {
    wallet: string;
}, {
    wallet: string;
}>;
export declare const PolicySimulateSchema: z.ZodObject<{
    policyId: z.ZodString;
    txs: z.ZodArray<z.ZodObject<{
        from: z.ZodString;
        to: z.ZodString;
        amount: z.ZodNumber;
        countryCode: z.ZodString;
        chainId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        chainId: number;
        countryCode: string;
        amount: number;
        from: string;
        to: string;
    }, {
        chainId: number;
        countryCode: string;
        amount: number;
        from: string;
        to: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    policyId: string;
    txs: {
        chainId: number;
        countryCode: string;
        amount: number;
        from: string;
        to: string;
    }[];
}, {
    policyId: string;
    txs: {
        chainId: number;
        countryCode: string;
        amount: number;
        from: string;
        to: string;
    }[];
}>;
//# sourceMappingURL=schemas.d.ts.map