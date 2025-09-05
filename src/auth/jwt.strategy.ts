import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from 'src/config/app.interface';
import { Cookies } from 'src/common/enums/Cookies';
import { JwtPayload } from './interface/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.[Cookies.AUTHORIZATION] ?? null,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<AppConfig>('app').jwtKey,
    });
  }

  async validate(payload: JwtPayload): Promise<{ userId: string }> {
    return { userId: payload.user };
  }
}