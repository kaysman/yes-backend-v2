import {
  ExtractJwt,
  Strategy,
  VerifiedCallback,
} from 'passport-jwt';
import { UserService } from 'src/user/user.service';

import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { JwtPayload } from './jwt-payload.dto';

@Injectable()
  export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
      
      constructor (private userService: UserService) {
          super({
              secretOrKey: 'topSecret51',
              jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          });
      }
  
      async validate(payload: JwtPayload, done: VerifiedCallback) {
          
          var user = await this.userService.getUserByPhoneNumber({phoneNumber: payload.username});
          if (!user) {
              done(new UnauthorizedException(), false);
          }
          return done(null, user);
      }
  
  } 