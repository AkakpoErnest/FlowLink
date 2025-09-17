"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicySimulateSchema = exports.AttestationSchema = exports.RiskScoreSchema = exports.GenerateReceiptSchema = exports.PayrollItemSchema = exports.CreatePayrollBatchSchema = exports.RouteQuoteSchema = exports.SettlePaymentSchema = exports.PaymentIntentSchema = exports.CreatePaymentLinkSchema = exports.CreateVaultSchema = exports.CreatePolicySchema = exports.PolicyRulesSchema = exports.KycLevelSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("./types");
exports.KycLevelSchema = zod_1.z.nativeEnum(types_1.KycLevel);
exports.PolicyRulesSchema = zod_1.z.object({
    geofencing: zod_1.z.array(zod_1.z.string()).optional(),
    sanctionsCheck: zod_1.z.boolean().optional(),
    perTxLimit: zod_1.z.number().optional(),
    kycLevel: exports.KycLevelSchema.optional(),
    allowlistOnly: zod_1.z.boolean().optional(),
});
exports.CreatePolicySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    rules: exports.PolicyRulesSchema,
});
exports.CreateVaultSchema = zod_1.z.object({
    policyId: zod_1.z.string().uuid(),
    chainId: zod_1.z.number().int().positive(),
});
exports.CreatePaymentLinkSchema = zod_1.z.object({
    sourceToken: zod_1.z.string(),
    destStable: zod_1.z.string(),
    amountMin: zod_1.z.number().positive(),
    amountMax: zod_1.z.number().positive(),
    requiresKyc: zod_1.z.boolean(),
    policyId: zod_1.z.string().uuid().optional(),
});
exports.PaymentIntentSchema = zod_1.z.object({
    fromWallet: zod_1.z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    amountIn: zod_1.z.string(),
    countryCode: zod_1.z.string().length(2),
    chainId: zod_1.z.number().int().positive(),
});
exports.SettlePaymentSchema = zod_1.z.object({
    txHash: zod_1.z.string().optional(),
});
exports.RouteQuoteSchema = zod_1.z.object({
    fromToken: zod_1.z.string(),
    destStable: zod_1.z.string(),
    amountIn: zod_1.z.string(),
    chainId: zod_1.z.number().int().positive(),
});
exports.CreatePayrollBatchSchema = zod_1.z.object({
    chainId: zod_1.z.number().int().positive(),
    rules: exports.PolicyRulesSchema,
});
exports.PayrollItemSchema = zod_1.z.object({
    recipientWallet: zod_1.z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.string(),
    countryCode: zod_1.z.string().length(2),
    kycLevelRequired: exports.KycLevelSchema,
});
exports.GenerateReceiptSchema = zod_1.z.object({
    entityType: zod_1.z.enum(['LINK', 'PAYROLL', 'VAULT']),
    entityId: zod_1.z.string(),
});
exports.RiskScoreSchema = zod_1.z.object({
    wallet: zod_1.z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});
exports.AttestationSchema = zod_1.z.object({
    wallet: zod_1.z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});
exports.PolicySimulateSchema = zod_1.z.object({
    policyId: zod_1.z.string().uuid(),
    txs: zod_1.z.array(zod_1.z.object({
        from: zod_1.z.string().regex(/^0x[a-fA-F0-9]{40}$/),
        to: zod_1.z.string().regex(/^0x[a-fA-F0-9]{40}$/),
        amount: zod_1.z.number().positive(),
        countryCode: zod_1.z.string().length(2),
        chainId: zod_1.z.number().int().positive(),
    })),
});
//# sourceMappingURL=schemas.js.map