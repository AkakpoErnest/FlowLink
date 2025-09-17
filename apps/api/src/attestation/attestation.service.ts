import { Injectable } from '@nestjs/common';
import { AttestationResult, KycLevel } from '@flowlink/shared';
import { MOCK_ATTESTATION_WALLETS } from '@flowlink/shared';

@Injectable()
export class AttestationService {
  async getAttestations(wallet: string): Promise<AttestationResult> {
    const result: AttestationResult = {};

    // Mock POAP attestation
    if (MOCK_ATTESTATION_WALLETS.POAP.includes(wallet.toLowerCase())) {
      result.poap = true;
    }

    // Mock KYChain attestation
    if (MOCK_ATTESTATION_WALLETS.KYCHAIN_FULL.includes(wallet.toLowerCase())) {
      result.kychain = { level: KycLevel.FULL };
    } else if (MOCK_ATTESTATION_WALLETS.KYCHAIN_LOW.includes(wallet.toLowerCase())) {
      result.kychain = { level: KycLevel.LOW };
    } else {
      result.kychain = { level: null };
    }

    return result;
  }
}

