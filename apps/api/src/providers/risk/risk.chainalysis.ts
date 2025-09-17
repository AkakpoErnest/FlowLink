import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RiskAdapter, RiskScore } from '../interfaces';

@Injectable()
export class ChainalysisRiskAdapter implements RiskAdapter {
  private readonly logger = new Logger(ChainalysisRiskAdapter.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('CHAINALYSIS_API_KEY') || '';
    this.baseUrl = this.configService.get<string>('CHAINALYSIS_BASE_URL') || 'https://api.chainalysis.com';
  }

  async score(wallet: string): Promise<RiskScore> {
    try {
      // TODO: Implement Chainalysis API integration
      this.logger.warn('Chainalysis integration not implemented yet, falling back to mock');
      
      // Placeholder implementation
      const response = await fetch(`${this.baseUrl}/api/v1/risk-score`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: wallet }),
      });

      if (!response.ok) {
        throw new Error(`Chainalysis API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        score: data.riskScore || 50,
        reasons: data.reasons || ['Chainalysis risk assessment'],
      };
    } catch (error) {
      this.logger.error('Chainalysis API error:', error);
      // Fallback to default score
      return {
        score: 50,
        reasons: ['Chainalysis API unavailable'],
      };
    }
  }
}
