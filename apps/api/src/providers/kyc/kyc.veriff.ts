import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KycAdapter, KycStart, KycStatus } from '../interfaces';

@Injectable()
export class VeriffKycAdapter implements KycAdapter {
  private readonly logger = new Logger(VeriffKycAdapter.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('VERIFF_API_KEY') || '';
    this.baseUrl = this.configService.get<string>('VERIFF_BASE_URL') || 'https://stationapi.veriff.com';
  }

  async start(userId: string): Promise<KycStart> {
    try {
      // TODO: Implement Veriff API integration
      this.logger.warn('Veriff integration not implemented yet, falling back to mock');
      
      const response = await fetch(`${this.baseUrl}/v1/sessions`, {
        method: 'POST',
        headers: {
          'X-AUTH-CLIENT': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verification: {
            callback: `${process.env.WEB_URL}/hooks/kyc/veriff`,
            person: {
              firstName: 'John',
              lastName: 'Doe',
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Veriff API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        externalRef: data.id || `veriff_${userId}_${Date.now()}`,
      };
    } catch (error) {
      this.logger.error('Veriff API error:', error);
      throw error;
    }
  }

  async status(externalRef: string): Promise<KycStatus> {
    try {
      // TODO: Implement Veriff status check
      const response = await fetch(`${this.baseUrl}/v1/sessions/${externalRef}`, {
        method: 'GET',
        headers: {
          'X-AUTH-CLIENT': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Veriff API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        status: data.verification?.status === 'APPROVED' ? 'APPROVED' : 'PENDING',
        level: data.verification?.status === 'APPROVED' ? 'FULL' : null,
        reasons: data.verification?.reason ? [data.verification.reason] : [],
      };
    } catch (error) {
      this.logger.error('Veriff API error:', error);
      return {
        status: 'PENDING',
        level: null,
        reasons: ['Veriff API unavailable'],
      };
    }
  }
}
