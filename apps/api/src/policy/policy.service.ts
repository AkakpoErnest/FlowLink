import { Injectable } from '@nestjs/common';

@Injectable()
export class PolicyService {
  async createPolicy(data: any) {
    return {
      id: 'policy-1',
      name: data.name || 'APAC-Standard',
      rules: data.rules || {},
    };
  }

  async getPolicies() {
    return [
      {
        id: 'policy-1',
        name: 'APAC-Standard',
        rules: {
          geofencing: ['SG', 'HK', 'MY', 'TH'],
          sanctionsCheck: true,
          perTxLimit: 10000,
          kycLevel: 'LOW',
        },
      },
    ];
  }

  async simulatePolicy(policyId: string, txs: any[]) {
    // Mock simulation
    return {
      allowed: txs.map((_, index) => index.toString()),
      blocked: [],
    };
  }
}

