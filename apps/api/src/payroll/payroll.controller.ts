import { Controller, Post, Body, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PayrollService } from './payroll.service';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('batches')
  async createBatch(@Body() body: any) {
    return {
      success: true,
      data: { id: 'batch-1', chainId: body.chainId, rules: body.rules },
    };
  }

  @Post('batches/:id/importCSV')
  @UseInterceptors(FileInterceptor('file'))
  async importCSV(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return {
      success: true,
      data: {
        items: [
          { recipientWallet: '0x123...', amount: 1000, currency: 'USDC', status: 'PENDING' },
        ],
        blocked: [],
      },
    };
  }

  @Post('batches/:id/dispatch')
  async dispatchBatch(@Param('id') id: string) {
    return {
      success: true,
      data: { status: 'PROCESSING', itemsProcessed: 1 },
    };
  }
}

