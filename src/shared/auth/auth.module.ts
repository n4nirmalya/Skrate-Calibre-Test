import { Module } from '@nestjs/common';
import { JwtModule} from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './auth.constants';
import { JWT_EXPIRY } from '../constant/constant';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: JWT_EXPIRY },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports:[JwtModule, AuthService]
})
export class AuthModule {}