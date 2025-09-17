import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('magic-link')
  async sendMagicLink(@Body() body: { email: string }) {
    // Mock magic link - in real implementation, this would send actual email
    return {
      success: true,
      message: 'Magic link sent (demo mode)',
    };
  }

  @Post('verify-wallet')
  async verifyWallet(@Body() body: { wallet: string; signature: string }) {
    // Mock wallet verification - in real implementation, this would verify signature
    const token = await this.authService.generateJwt(body.wallet);
    
    return {
      success: true,
      token,
    };
  }
}

