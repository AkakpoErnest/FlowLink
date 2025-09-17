import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RiskService } from './risk.service';
import { RiskScoreSchema } from '@flowlink/shared';

@Controller('risk')
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Post('score')
  async getRiskScore(@Body() body: any) {
    try {
      const validated = RiskScoreSchema.parse(body);
      const result = await this.riskService.getRiskScore(validated.wallet);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          errorCode: 'RISK_SCORE_ERROR',
          message: 'Failed to calculate risk score',
          details: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

