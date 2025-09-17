import { Injectable } from '@nestjs/common';
import { MOCK_SANCTIONS_LIST, DEFAULT_POLICY_RULES } from '@flowlink/shared';
import { PolicyRules, ComplianceResult, KycLevel } from '@flowlink/shared';

@Injectable()
export class ComplianceService {
  async evaluateCompliance(input: {
    fromWallet: string;
    amount: number;
    currency: string;
    countryCode: string;
    chainId: number;
    kycLevel: KycLevel;
    policyRules: PolicyRules;
    allowlist: string[];
  }): Promise<ComplianceResult> {
    const reasons: string[] = [];
    let allowed = true;

    // 1. Sanctions Check
    if (input.policyRules.sanctionsCheck) {
      if (MOCK_SANCTIONS_LIST.includes(input.fromWallet.toLowerCase())) {
        allowed = false;
        reasons.push('Wallet address is on sanctions list');
      }
    }

    // 2. Geofencing
    if (input.policyRules.geofencing && input.policyRules.geofencing.length > 0) {
      if (!input.policyRules.geofencing.includes(input.countryCode)) {
        allowed = false;
        reasons.push(`Country ${input.countryCode} not allowed by geofencing policy`);
      }
    }

    // 3. KYC Level Check
    if (input.policyRules.kycLevel) {
      const kycLevels = [KycLevel.NONE, KycLevel.LOW, KycLevel.FULL];
      const userLevel = kycLevels.indexOf(input.kycLevel);
      const requiredLevel = kycLevels.indexOf(input.policyRules.kycLevel);
      
      if (userLevel < requiredLevel) {
        allowed = false;
        reasons.push(`KYC level ${input.kycLevel} below required ${input.policyRules.kycLevel}`);
      }
    }

    // 4. Per Transaction Limit
    if (input.policyRules.perTxLimit) {
      if (input.amount > input.policyRules.perTxLimit) {
        allowed = false;
        reasons.push(`Amount ${input.amount} exceeds limit ${input.policyRules.perTxLimit}`);
      }
    }

    // 5. Allowlist Only
    if (input.policyRules.allowlistOnly) {
      if (!input.allowlist.includes(input.fromWallet.toLowerCase())) {
        allowed = false;
        reasons.push('Wallet not on allowlist');
      }
    }

    // Calculate risk score if not blocked
    let riskScore = 50; // Base score
    
    // Risk adjustments
    if (input.allowlist.includes(input.fromWallet.toLowerCase())) {
      riskScore += 20; // Lower risk if on allowlist
    }
    
    if (MOCK_SANCTIONS_LIST.includes(input.fromWallet.toLowerCase())) {
      riskScore -= 30; // Higher risk if on sanctions (though blocked above)
    }

    // Attestation bonuses (simplified)
    if (input.kycLevel === KycLevel.FULL) {
      riskScore += 10;
    } else if (input.kycLevel === KycLevel.LOW) {
      riskScore += 5;
    }

    // Clamp score to 0-100
    riskScore = Math.max(0, Math.min(100, riskScore));

    if (allowed && riskScore < 40) {
      reasons.push('High risk transaction detected');
    }

    return {
      allowed,
      reasons,
      riskScore,
    };
  }

  async simulatePolicy(input: {
    policyId: string;
    txs: Array<{
      from: string;
      to: string;
      amount: number;
      countryCode: string;
      chainId: number;
    }>;
    policyRules: PolicyRules;
    allowlist: string[];
  }): Promise<{
    allowed: string[];
    blocked: Array<{ id: string; reasons: string[] }>;
  }> {
    const allowed: string[] = [];
    const blocked: Array<{ id: string; reasons: string[] }> = [];

    for (let i = 0; i < input.txs.length; i++) {
      const tx = input.txs[i];
      const result = await this.evaluateCompliance({
        fromWallet: tx.from,
        amount: tx.amount,
        currency: 'USDC',
        countryCode: tx.countryCode,
        chainId: tx.chainId,
        kycLevel: KycLevel.LOW, // Mock KYC level
        policyRules: input.policyRules,
        allowlist: input.allowlist,
      });

      if (result.allowed) {
        allowed.push(i.toString());
      } else {
        blocked.push({
          id: i.toString(),
          reasons: result.reasons,
        });
      }
    }

    return { allowed, blocked };
  }
}

