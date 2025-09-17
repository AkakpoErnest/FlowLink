import { Module } from '@nestjs/common';
import { PaymentLinksController } from './payment-links.controller';
import { PaymentLinksService } from './payment-links.service';
import { ComplianceService } from '../common/services/compliance.service';
import { AttestationModule } from '../attestation/attestation.module';

@Module({
  imports: [AttestationModule],
  controllers: [PaymentLinksController],
  providers: [PaymentLinksService, ComplianceService],
  exports: [PaymentLinksService],
})
export class PaymentLinksModule {}

