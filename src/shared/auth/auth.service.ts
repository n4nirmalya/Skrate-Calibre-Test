import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}
  async token(username: any, roles:any){
    const payload = {username,roles};
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}