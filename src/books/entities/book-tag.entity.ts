
import { Entity, PrimaryColumn } from 'typeorm';

@Entity('book_tags')
export class BookTag {
  @PrimaryColumn('uuid')
  book_id: string;

  @PrimaryColumn('uuid')
  tag_id: string;
}
