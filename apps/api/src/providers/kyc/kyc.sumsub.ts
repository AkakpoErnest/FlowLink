import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KycAdapter, KycStart, KycStatus } from '../interfaces';

@Injectable()
export class SumsubKycAdapter implements KycAdapter {
  private readonly logger = new Logger(SumsubKycAdapter.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('SUMSUB_API_KEY') || '';
    this.baseUrl = this.configService.get<string>('SUMSUB_BASE_URL') || 'https://api.sumsub.com';
  }

  async start(userId: string): Promise<KycStart> {
    try {
      // TODO: Implement Sumsub API integration
      this.logger.warn('Sumsub integration not implemented yet, falling back to mock');
      
      const response = await fetch(`${this.baseUrl}/resources/applicants`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          externalUserId: userId,
          levelName: 'basic-kyc-level',
        }),
      });

      if (!response.ok) {
        throw new Error(`Sumsub API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        externalRef: data.id || `sumsub_${userId}_${Date.now()}`,
      };
    } catch (error) {
      this.logger.error('Sumsub API error:', error);
      throw error;
    }
  }

  async status(externalRef: string): Promise<KycStatus> {
    try {
      // TODO: Implement Sumsub status check
      const response = await fetch(`${this.baseUrl}/resources/applicants/${externalRef}/one`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Sumsub API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        status: data.reviewResult?.reviewAnswer === 'GREEN' ? 'APPROVED' : 'PENDING',
        level: data.reviewResult?.reviewAnswer === 'GREEN' ? 'FULL' : null,
        reasons: data.reviewResult?.reviewRejectType ? [data.reviewResult.reviewRejectType] : [],
      };
    } catch (error) {
      this.logger.error('Sumsub API error:', error);
      return {
        status: 'PENDING',
        level: null,
        reasons: ['Sumsub API unavailable'],
      };
    }
  }
}
