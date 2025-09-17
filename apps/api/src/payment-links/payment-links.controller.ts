import { Controller, Post, Get, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentLinksService } from './payment-links.service';
import { CreatePaymentLinkSchema, PaymentIntentSchema, SettlePaymentSchema } from '@flowlink/shared';

@Controller('links')
export class PaymentLinksController {
  constructor(private readonly paymentLinksService: PaymentLinksService) {}

  @Post()
  async createPaymentLink(@Body() body: any) {
    try {
      const validated = CreatePaymentLinkSchema.parse(body);
      const result = await this.paymentLinksService.createPaymentLink(validated);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          errorCode: 'PAYMENT_LINK_CREATION_ERROR',
          message: 'Failed to create payment link',
          details: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':code')
  async getPaymentLink(@Param('code') code: string) {
    try {
      const result = await this.paymentLinksService.getPaymentLink(code);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          errorCode: 'PAYMENT_LINK_NOT_FOUND',
          message: 'Payment link not found',
          details: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post(':code/intent')
  async createPaymentIntent(@Param('code') code: string, @Body() body: any) {
    try {
      const validated = PaymentIntentSchema.parse(body);
      const result = await this.paymentLinksService.createPaymentIntent(code, validated);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          errorCode: 'PAYMENT_INTENT_ERROR',
          message: 'Failed to create payment intent',
          details: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post(':code/settle')
  async settlePayment(@Param('code') code: string, @Body() body: any) {
    try {
      const validated = SettlePaymentSchema.parse(body);
      const result = await this.paymentLinksService.settlePayment(code, validated);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          errorCode: 'PAYMENT_SETTLEMENT_ERROR',
          message: 'Failed to settle payment',
          details: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

