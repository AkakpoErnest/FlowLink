import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RiskModule } from './risk/risk.module';
import { AttestationModule } from './attestation/attestation.module';
import { PolicyModule } from './policy/policy.module';
import { VaultsModule } from './vaults/vaults.module';
import { PaymentLinksModule } from './payment-links/payment-links.module';
import { RoutingModule } from './routing/routing.module';
import { PayrollModule } from './payroll/payroll.module';
import { ReceiptsModule } from './receipts/receipts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    RiskModule,
    AttestationModule,
    PolicyModule,
    VaultsModule,
    PaymentLinksModule,
    RoutingModule,
    PayrollModule,
    ReceiptsModule,
  ],
})
export class AppModule {}

