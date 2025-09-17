import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ComplianceService } from '../common/services/compliance.service';
import { AttestationService } from '../attestation/attestation.service';
import { generatePaymentCode } from '@flowlink/shared';
import { LinkTxnStatus, PaymentLinkStatus, KycLevel } from '@prisma/client';

@Injectable()
export class PaymentLinksService {
  constructor(
    private prisma: PrismaService,
    private complianceService: ComplianceService,
    private attestationService: AttestationService,
  ) {}

  async createPaymentLink(data: any) {
    const code = generatePaymentCode();
    
    const paymentLink = await this.prisma.paymentLink.create({
      data: {
        code,
        creatorUserId: 'user-1', // Mock user ID
        sourceToken: data.sourceToken,
        destStable: data.destStable,
        amountMin: data.amountMin,
        amountMax: data.amountMax,
        requiresKyc: data.requiresKyc,
        policyId: data.policyId,
        status: PaymentLinkStatus.ACTIVE,
      },
    });

    return {
      id: paymentLink.id,
      code: paymentLink.code,
      qrSvg: `<svg>QR Code for ${code}</svg>`, // Mock QR code
    };
  }

  async getPaymentLink(code: string) {
    const paymentLink = await this.prisma.paymentLink.findUnique({
      where: { code },
      include: { policy: true },
    });

    if (!paymentLink) {
      throw new NotFoundException('Payment link not found');
    }

    return {
      id: paymentLink.id,
      code: paymentLink.code,
      sourceToken: paymentLink.sourceToken,
      destStable: paymentLink.destStable,
      amountMin: paymentLink.amountMin,
      amountMax: paymentLink.amountMax,
      requiresKyc: paymentLink.requiresKyc,
      policy: paymentLink.policy,
    };
  }

  async createPaymentIntent(code: string, data: any) {
    const paymentLink = await this.getPaymentLink(code);
    
    // Create transaction record
    const linkTxn = await this.prisma.linkTxn.create({
      data: {
        paymentLinkId: paymentLink.id,
        srcWallet: data.fromWallet,
        amountIn: parseFloat(data.amountIn),
        destStable: paymentLink.destStable,
        status: LinkTxnStatus.INIT,
        reasons: [],
      },
    });

    // Check compliance
    const attestations = await this.attestationService.getAttestations(data.fromWallet);
    const complianceResult = await this.complianceService.evaluateCompliance({
      fromWallet: data.fromWallet,
      amount: parseFloat(data.amountIn),
      currency: paymentLink.destStable,
      countryCode: data.countryCode,
      chainId: data.chainId,
      kycLevel: attestations.kychain?.level || KycLevel.NONE,
      policyRules: paymentLink.policy?.rules || {},
      allowlist: [], // Mock allowlist
    });

    // Update transaction status
    const status = complianceResult.allowed ? LinkTxnStatus.ROUTING : LinkTxnStatus.BLOCKED;
    
    await this.prisma.linkTxn.update({
      where: { id: linkTxn.id },
      data: {
        status,
        reasons: complianceResult.reasons,
      },
    });

    return {
      status,
      reasons: complianceResult.reasons,
      riskScore: complianceResult.riskScore,
    };
  }

  async settlePayment(code: string, data: any) {
    const paymentLink = await this.getPaymentLink(code);
    
    // Find the latest transaction for this payment link
    const linkTxn = await this.prisma.linkTxn.findFirst({
      where: {
        paymentLinkId: paymentLink.id,
        status: LinkTxnStatus.ROUTING,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!linkTxn) {
      throw new NotFoundException('No pending transaction found');
    }

    // Mock settlement - in real implementation, this would verify on-chain transaction
    const status = data.txHash ? LinkTxnStatus.SETTLED : LinkTxnStatus.FAILED;
    
    await this.prisma.linkTxn.update({
      where: { id: linkTxn.id },
      data: {
        status,
        txHash: data.txHash,
        amountOut: linkTxn.amountIn * 0.998, // Mock 0.2% fee
      },
    });

    return {
      status,
      txHash: data.txHash,
    };
  }
}
