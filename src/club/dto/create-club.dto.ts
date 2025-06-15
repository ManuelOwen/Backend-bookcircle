
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateClubDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  cover_image_url?: string;

  @IsOptional()
  @IsBoolean()
  is_private?: boolean;
}
