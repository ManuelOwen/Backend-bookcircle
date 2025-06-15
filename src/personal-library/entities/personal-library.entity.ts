
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Check } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Book } from '../../books/entities/book.entity';

export enum ReadingStatus {
  WANT_TO_READ = 'want_to_read',
  CURRENTLY_READING = 'currently_reading',
  READ = 'read'
}

@Entity('personal_library')
@Check(`status IN ('want_to_read', 'currently_reading', 'read')`)
export class PersonalLibrary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  book_id: string;

  @Column({ type: 'enum', enum: ReadingStatus, default: ReadingStatus.WANT_TO_READ })
  status: ReadingStatus;

  @CreateDateColumn()
  added_at: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  started_reading_at: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  finished_reading_at: Date;

  @ManyToOne(() => User, user => user.personal_library)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Book, book => book.personal_libraries)
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
