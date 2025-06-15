import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

const SUPABASE_JWKS_URL = 'https://jhesuwxjrmllftcptlnv.supabase.co/auth/v1/keys';

const client = jwksClient({
  jwksUri: SUPABASE_JWKS_URL,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err, null);
    } else {
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    }
  });
}

@Injectable()
export class SupabaseJwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('No Authorization header');

    const token = authHeader.replace('Bearer ', '');
    try {
      const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });
      (request as any).user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 