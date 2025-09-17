import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AttestationService } from './attestation.service';

@Controller('attestations')
export class AttestationController {
  constructor(private readonly attestationService: AttestationService) {}

  @Get(':wallet')
  async getAttestations(@Param('wallet') wallet: string) {
    try {
      const result = await this.attestationService.getAttestations(wallet);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          errorCode: 'ATTESTATION_ERROR',
          message: 'Failed to fetch attestations',
          details: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

