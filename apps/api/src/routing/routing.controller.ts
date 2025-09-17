import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RoutingService } from './routing.service';
import { RouteQuoteSchema } from '@flowlink/shared';

@Controller('route')
export class RoutingController {
  constructor(private readonly routingService: RoutingService) {}

  @Post('quote')
  async getRouteQuote(@Body() body: any) {
    try {
      const validated = RouteQuoteSchema.parse(body);
      const result = await this.routingService.getRouteQuote(validated);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          errorCode: 'ROUTE_QUOTE_ERROR',
          message: 'Failed to get route quote',
          details: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

