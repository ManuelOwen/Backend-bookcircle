
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { Book } from '../../books/entities/book.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  name: string;

  @Column({ type: 'text', default: '#3B82F6' })
  color: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => Book, book => book.tags)
  books: Book[];
}
