import { Injectable } from '@nestjs/common';

@Injectable()
export class ReceiptsService {
  async generateReceipt(data: any) {
    return {
      pdfUrl: '/receipts/demo-receipt.pdf',
      json: {
        entityType: data.entityType,
        entityId: data.entityId,
        timestamp: new Date().toISOString(),
        hash: 'demo-hash-123',
      },
    };
  }
}

