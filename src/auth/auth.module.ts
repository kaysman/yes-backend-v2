import { UserModule } from 'src/user/user.module';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
        secret: 'topSecret51',
        signOptions: {
            expiresIn: "7d"
        },
    }),
    UserModule,
],
controllers: [AuthController],
providers: [AuthService, JwtStrategy],
exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
