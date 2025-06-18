import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class CreatePersonalLibraryDto {
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @IsEnum(['want_to_read', 'currently_reading', 'read'])
  @IsNotEmpty()
  status: 'want_to_read' | 'currently_reading' | 'read';
}
