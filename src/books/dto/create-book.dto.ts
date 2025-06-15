
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber, IsArray } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  cover_image_url?: string;

  @IsOptional()
  @IsDateString()
  published_date?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsNumber()
  page_count?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tag_ids?: string[];
}
