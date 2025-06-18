import { Injectable, ConflictException, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

type AuthResponse = {
  user: UserResponseDto;
  token: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  private blacklistedTokens: Set<string> = new Set();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createAuthDto: CreateAuthDto): Promise<AuthResponse> {
    const { email, password, firstName, lastName } = createAuthDto;
    
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ 
      where: { email } 
    });
    
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      full_name: `${firstName} ${lastName}`,
      role: UserRole.ADMIN,
      favorite_genres: []
    });

    const savedUser = await this.userRepository.save(user);
    
    const { token, refreshToken } = await this.generateTokens(savedUser);
    const userResponse = new UserResponseDto(savedUser);

    return { 
      user: {
        ...userResponse,
        created_at: savedUser.created_at,
        updated_at: savedUser.updated_at
      },
      token,
      refreshToken
    };
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          full_name: true,
          organization: true,
          role: true,
          bio: true,
          avatar_url: true,
          favorite_genres: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      
      const payload = { 
        userId: user.id,
        email: user.email,
        role: user.role
      };

      const jwtSecret = this.configService.getOrThrow<string>('JWT_SECRET');

      const token = this.jwtService.sign(payload, {
        secret: jwtSecret,
        expiresIn: '1d',
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: jwtSecret,
        expiresIn: '7d',
      });

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword,
        token,
        refreshToken
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });

      const user = await this.userRepository.findOne({ 
        where: { id: payload.userId } 
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { token, refreshToken: newRefreshToken } = await this.generateTokens(user);
      const userResponse = new UserResponseDto(user);

      return {
        user: {
          ...userResponse,
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        token,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(token: string): Promise<void> {
    this.blacklistedTokens.add(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  private async generateTokens(user: User): Promise<{ token: string; refreshToken: string }> {
    const payload = this.createTokenPayload(user);
    
    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { token, refreshToken };
  }

  async validateUser(userId: string): Promise<any> {
    return this.userRepository.findOne({ 
      where: { id: userId },
      select: ['id', 'email', 'full_name', 'role']
    });
  }
  
  async getUserById(userId: string): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          full_name: true,
          organization: true,
          role: true,
          bio: true,
          avatar_url: true,
          favorite_genres: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return new UserResponseDto(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get user');
    }
  }

  private createTokenPayload(user: User) {
    return { 
      userId: user.id,
      email: user.email,
      role: user.role 
    };
  }

  async getCurrentUser(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          full_name: true,
          organization: true,
          role: true,
          bio: true,
          avatar_url: true,
          favorite_genres: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}
