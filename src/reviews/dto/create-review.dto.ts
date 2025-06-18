import { IsString, IsNumber, IsUUID, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  @IsNotEmpty()
  book_id: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  review_text: string;
}
