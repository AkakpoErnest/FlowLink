export declare enum KycLevel {
    NONE = "NONE",
    LOW = "LOW",
    FULL = "FULL"
}
export declare enum PolicyStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    DISABLED = "DISABLED"
}
export declare enum PaymentLinkStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    DISABLED = "DISABLED"
}
export declare enum LinkTxnStatus {
    INIT = "INIT",
    BLOCKED = "BLOCKED",
    ROUTING = "ROUTING",
    SETTLED = "SETTLED",
    FAILED = "FAILED"
}
export declare enum PayrollBatchStatus {
    DRAFT = "DRAFT",
    READY = "READY",
    PROCESSING = "PROCESSING",
    DONE = "DONE",
    FAILED = "FAILED"
}
export declare enum PayrollItemStatus {
    PENDING = "PENDING",
    BLOCKED = "BLOCKED",
    QUEUED = "QUEUED",
    SENT = "SENT",
    FAILED = "FAILED"
}
export declare enum ReceiptEntityType {
    LINK = "LINK",
    PAYROLL = "PAYROLL",
    VAULT = "VAULT"
}
export interface PolicyRules {
    geofencing?: string[];
    sanctionsCheck?: boolean;
    perTxLimit?: number;
    kycLevel?: KycLevel;
    allowlistOnly?: boolean;
}
export interface StableToken {
    symbol: string;
    chainId: number;
    address: string;
}
export interface ComplianceResult {
    allowed: boolean;
    reasons: string[];
    riskScore?: number;
}
export interface RouteQuote {
    dex: string;
    amountOut: string;
    steps: RouteStep[];
}
export interface RouteStep {
    dex: string;
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    amountOut: string;
}
export interface AttestationResult {
    poap?: boolean;
    kychain?: {
        level: KycLevel | null;
    };
}
export interface RiskProfile {
    score: number;
    reasons: string[];
}
//# sourceMappingURL=types.d.ts.map