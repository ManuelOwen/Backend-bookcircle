
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateLikeDto {
  @IsUUID()
  @IsNotEmpty()
  review_id: string;
}
