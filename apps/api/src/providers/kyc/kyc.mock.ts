import { Injectable } from '@nestjs/common';
import { KycAdapter, KycStart, KycStatus } from '../interfaces';

@Injectable()
export class MockKycAdapter implements KycAdapter {
  private kycCases = new Map<string, KycStatus>();

  async start(userId: string): Promise<KycStart> {
    const externalRef = `mock_kyc_${userId}_${Date.now()}`;
    
    // Simulate different outcomes based on user ID
    const isApproved = userId.includes('approved') || Math.random() > 0.3;
    const hasFullKyc = userId.includes('full') || Math.random() > 0.5;
    
    const status: KycStatus = {
      status: isApproved ? 'APPROVED' : 'PENDING',
      level: isApproved ? (hasFullKyc ? 'FULL' : 'LOW') : null,
      reasons: isApproved 
        ? ['Identity verification completed', 'Document validation passed']
        : ['KYC process initiated', 'Awaiting document submission'],
    };

    this.kycCases.set(externalRef, status);
    
    return { externalRef };
  }

  async status(externalRef: string): Promise<KycStatus> {
    const status = this.kycCases.get(externalRef);
    
    if (!status) {
      return {
        status: 'PENDING',
        level: null,
        reasons: ['KYC case not found'],
      };
    }

    // Simulate status updates over time
    if (status.status === 'PENDING' && Math.random() > 0.7) {
      const updatedStatus: KycStatus = {
        status: 'APPROVED',
        level: Math.random() > 0.5 ? 'FULL' : 'LOW',
        reasons: ['Identity verification completed', 'Document validation passed'],
      };
      this.kycCases.set(externalRef, updatedStatus);
      return updatedStatus;
    }

    return status;
  }
}
