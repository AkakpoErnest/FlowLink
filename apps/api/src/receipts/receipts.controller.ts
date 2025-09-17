import { Controller, Post, Body } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post()
  async generateReceipt(@Body() body: any) {
    return {
      success: true,
      data: {
        pdfUrl: '/receipts/demo-receipt.pdf',
        json: {
          entityType: body.entityType,
          entityId: body.entityId,
          timestamp: new Date().toISOString(),
        },
      },
    };
  }
}

