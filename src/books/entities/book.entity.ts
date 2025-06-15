
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Review } from '../../reviews/entities/review.entity';
import { PersonalLibrary } from '../../personal-library/entities/personal-library.entity';
import { Tag } from '../../tags/entities/tag.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('text')
  author: string;

  @Column({ type: 'text', unique: true, nullable: true })
  isbn: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  cover_image_url: string;

  @Column({ type: 'date', nullable: true })
  published_date: Date;

  @Column({ type: 'text', nullable: true })
  genre: string;

  @Column({ type: 'integer', nullable: true })
  page_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Review, review => review.book)
  reviews: Review[];

  @OneToMany(() => PersonalLibrary, library => library.book)
  personal_libraries: PersonalLibrary[];

  @ManyToMany(() => Tag, tag => tag.books)
  @JoinTable({
    name: 'book_tags',
    joinColumn: { name: 'book_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
  })
  tags: Tag[];
}
