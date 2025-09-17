import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RiskAdapter, RiskScore } from '../interfaces';

@Injectable()
export class TrmRiskAdapter implements RiskAdapter {
  private readonly logger = new Logger(TrmRiskAdapter.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('TRM_API_KEY') || '';
    this.baseUrl = this.configService.get<string>('TRM_BASE_URL') || 'https://api.trmlabs.com';
  }

  async score(wallet: string): Promise<RiskScore> {
    try {
      // TODO: Implement TRM Labs API integration
      this.logger.warn('TRM Labs integration not implemented yet, falling back to mock');
      
      // Placeholder implementation
      const response = await fetch(`${this.baseUrl}/v1/risk-score`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: wallet }),
      });

      if (!response.ok) {
        throw new Error(`TRM API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        score: data.riskScore || 50,
        reasons: data.reasons || ['TRM risk assessment'],
      };
    } catch (error) {
      this.logger.error('TRM API error:', error);
      // Fallback to default score
      return {
        score: 50,
        reasons: ['TRM API unavailable'],
      };
    }
  }
}
