import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus, Get, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
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
        token: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'User with this email already exists' })
  @ApiBody({ type: CreateAuthDto })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async register(@Body() createAuthDto: CreateAuthDto) {
    try {
      const result = await this.authService.register(createAuthDto);
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
        token: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  @UsePipes(new ValidationPipe({ 
    transform: true, 
    whitelist: true,
    forbidNonWhitelisted: true 
  }))
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto.email, loginDto.password);
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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Returns current user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getCurrentUser(@Request() req) {
    try {
      const user = await this.authService.getUserById(req.user.userId);
      return {
        success: true,
        user,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
