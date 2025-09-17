import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateJwt(wallet: string): Promise<string> {
    const payload = { wallet, sub: wallet };
    return this.jwtService.sign(payload);
  }

  async validateUser(wallet: string): Promise<any> {
    // Mock user validation
    return { wallet };
  }
}

