import { Injectable } from '@nestjs/common';

@Injectable()
export class VaultsService {
  async createVault(data: any) {
    return {
      id: 'vault-1',
      policyId: data.policyId,
      chainId: data.chainId,
    };
  }

  async getVaults() {
    return [
      {
        id: 'vault-1',
        policyId: 'policy-1',
        chainId: 137,
      },
    ];
  }

  async getVault(id: string) {
    return {
      id,
      policyId: 'policy-1',
      chainId: 137,
    };
  }
}

