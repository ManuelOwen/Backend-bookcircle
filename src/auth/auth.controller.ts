import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus, Get, UsePipes, ValidationPipe, BadRequestException, UseInterceptors, UnauthorizedException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { CookieInterceptor } from './cookie.interceptor';
import { Response } from 'express';

@Controller('auth')
@ApiTags('auth')
@UseInterceptors(CookieInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            full_name: { type: 'string' },
            organization: { type: 'string', nullable: true },
            role: { type: 'string' },
            bio: { type: 'string', nullable: true },
            avatar_url: { type: 'string', nullable: true },
            favorite_genres: { type: 'array', items: { type: 'string' } },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          }
        },
        token: { type: 'string' },
        refreshToken: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiBody({ type: CreateAuthDto })
  @UsePipes(new ValidationPipe({ 
    transform: true, 
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      const messages = errors.map(error => {
        return {
          field: error.property,
          message: Object.values(error.constraints || {}).join(', ')
        };
      });
      return new BadRequestException({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
  }))
  async register(@Body() createAuthDto: CreateAuthDto) {
    try {
      const result = await this.authService.register(createAuthDto);

      return {
        success: true,
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({
          success: false,
          message: error.message,
        });
      }
      throw error;
    }
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            full_name: { type: 'string' },
            organization: { type: 'string', nullable: true },
            role: { type: 'string' },
            bio: { type: 'string', nullable: true },
            avatar_url: { type: 'string', nullable: true },
            favorite_genres: { type: 'array', items: { type: 'string' } },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          }
        },
        token: { type: 'string' },
        refreshToken: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  @UsePipes(new ValidationPipe({ 
    transform: true, 
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      const messages = errors.map(error => {
        return {
          field: error.property,
          message: Object.values(error.constraints || {}).join(', ')
        };
      });
      return new BadRequestException({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
  }))
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto.email, loginDto.password);
      
      if (!result.token) {
        throw new Error('Token generation failed');
      }

      return {
        success: true,
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new UnauthorizedException({
          success: false,
          message: error.message,
        });
      }
      throw error;
    }
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Token successfully refreshed',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        token: { type: 'string' },
        refreshToken: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const result = await this.authService.refreshToken(refreshTokenDto.refreshToken);
      return {
        success: true,
        ...result
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({
          success: false,
          message: error.message,
        });
      }
      throw error;
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged out',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      }
    }
  })
  async logout(@Request() req) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        await this.authService.logout(token);
      }
      return {
        success: true,
        message: 'Successfully logged out'
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException({
          success: false,
          message: error.message,
        });
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Returns user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@Request() req) {
    try {
      const user = await this.authService.getUserById(req.user.userId);
      return { user };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Returns current user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@Request() req) {
    try {
      const user = await this.authService.getUserById(req.user.userId);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        success: true,
        user: {
          ...user,
          password: undefined // Remove password from response
        }
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to get current user');
    }
  }
}
