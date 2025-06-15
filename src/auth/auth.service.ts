import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { UserResponseDto } from '../users/dto/user-response.dto';
import * as bcrypt from 'bcrypt';

type AuthResponse = {
  user: UserResponseDto;
  token: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
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
    
    // Generate JWT token
    const payload = this.createTokenPayload(savedUser);
    const token = this.jwtService.sign(payload);
    const userResponse = new UserResponseDto(savedUser);

    return { 
      user: {
        ...userResponse,
        created_at: savedUser.created_at,
        updated_at: savedUser.updated_at
      },
      token 
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // First get user with password
      const user = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', { email })
        .getOne();

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Generate JWT token
      const payload = this.createTokenPayload(user);
      const token = this.jwtService.sign(payload);
      const userResponse = new UserResponseDto(user);
      
      return {
        user: {
          ...userResponse,
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async validateUser(userId: string): Promise<any> {
    return this.userRepository.findOne({ 
      where: { id: userId },
      select: ['id', 'email', 'full_name', 'role']
    });
  }
  
  async getUserById(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      select: ['id', 'email', 'full_name', 'role', 'created_at', 'updated_at']
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return new UserResponseDto(user);
  }

  private createTokenPayload(user: User) {
    return { 
      userId: user.id,
      email: user.email,
      role: user.role 
    };
  }
}
