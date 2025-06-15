
import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  avatar_url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favorite_genres?: string[];
}
