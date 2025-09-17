import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PolicyService } from './policy.service';

@Controller('policy')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post()
  async createPolicy(@Body() body: any) {
    return {
      success: true,
      data: { id: 'policy-1', name: 'APAC-Standard' },
    };
  }

  @Get()
  async getPolicies() {
    return {
      success: true,
      data: [{ id: 'policy-1', name: 'APAC-Standard' }],
    };
  }

  @Post(':id/simulate')
  async simulatePolicy(@Param('id') id: string, @Body() body: any) {
    return {
      success: true,
      data: {
        allowed: ['0', '1'],
        blocked: [],
      },
    };
  }
}

