
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Check } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Book } from '../../books/entities/book.entity';
import { ReviewLike } from '../../likes/entities/like.entity';

@Entity('reviews')
@Check(`rating >= 1 AND rating <= 5`)
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  book_id: string;

  @Column('integer')
  rating: number;

  @Column({ type: 'text', nullable: true })
  review_text: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, user => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Book, book => book.reviews)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @OneToMany(() => ReviewLike, like => like.review)
  likes: ReviewLike[];
}
