import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import AuthConfig from './auth.config';

@Injectable()
export class JwtStrategy extends Strategy {
  constructor(config = AuthConfig) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: config.accessToken.secretKey,
      },
      JwtStrategy.validate,
    );
  }

  static validate(payload: any) {
    return payload;
  }
}
