import { Injectable } from '@nestjs/common';
import { RiskAdapter, RiskScore } from '../interfaces';
import { MOCK_SANCTIONS_LIST, MOCK_ATTESTATION_WALLETS } from '@flowlink/shared';

@Injectable()
export class MockRiskAdapter implements RiskAdapter {
  async score(wallet: string): Promise<RiskScore> {
    // Mock risk scoring algorithm
    let score = 50; // Base score
    const reasons: string[] = [];

    // Check sanctions list
    if (MOCK_SANCTIONS_LIST.includes(wallet.toLowerCase())) {
      score -= 30;
      reasons.push('Wallet on sanctions list');
    }

    // Check attestations
    if (MOCK_ATTESTATION_WALLETS.POAP.includes(wallet.toLowerCase())) {
      score += 10;
      reasons.push('Has POAP attestation');
    }

    if (MOCK_ATTESTATION_WALLETS.KYCHAIN_FULL.includes(wallet.toLowerCase())) {
      score += 15;
      reasons.push('Has full KYC attestation');
    } else if (MOCK_ATTESTATION_WALLETS.KYCHAIN_LOW.includes(wallet.toLowerCase())) {
      score += 10;
      reasons.push('Has low KYC attestation');
    }

    // Clamp score to 0-100
    score = Math.max(0, Math.min(100, score));

    if (score < 40) {
      reasons.push('High risk profile');
    } else if (score > 80) {
      reasons.push('Low risk profile');
    }

    return {
      score,
      reasons,
    };
  }
}
