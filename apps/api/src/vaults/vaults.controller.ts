import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { VaultsService } from './vaults.service';

@Controller('vaults')
export class VaultsController {
  constructor(private readonly vaultsService: VaultsService) {}

  @Post()
  async createVault(@Body() body: any) {
    return {
      success: true,
      data: { id: 'vault-1', policyId: body.policyId, chainId: body.chainId },
    };
  }

  @Get()
  async getVaults() {
    return {
      success: true,
      data: [{ id: 'vault-1', policyId: 'policy-1', chainId: 137 }],
    };
  }

  @Get(':id')
  async getVault(@Param('id') id: string) {
    return {
      success: true,
      data: { id, policyId: 'policy-1', chainId: 137 },
    };
  }
}

