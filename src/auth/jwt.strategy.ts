import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

type JwtPayload = {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.access_token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<{ userId: string; email: string; role: string }> {
    try {
      if (!payload || !payload.userId) {
        throw new UnauthorizedException('Invalid token payload');
      }

      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new UnauthorizedException('Token has expired');
      }
      
      const user = await this.usersService.findOne(payload.userId);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}