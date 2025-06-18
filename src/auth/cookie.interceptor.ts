import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    
    return next.handle().pipe(
      map(data => {
        if (data.token) {
          // Set access token cookie
          response.cookie('access_token', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000, // 1 hour
          });

          // Set refresh token cookie
          if (data.refreshToken) {
            response.cookie('refresh_token', data.refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 604800000, // 7 days
            });
          }

          // Return the full response including tokens
          return data;
        }
        return data;
      }),
    );
  }
} 