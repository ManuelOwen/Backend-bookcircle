
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { Tag } from '../tags/entities/tag.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const { tag_ids, ...bookData } = createBookDto;
    
    const book = this.bookRepository.create(bookData);
    
    if (tag_ids && tag_ids.length > 0) {
      const tags = await this.tagRepository.findByIds(tag_ids);
      book.tags = tags;
    }
    
    return this.bookRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find({
      relations: ['tags', 'reviews', 'reviews.user'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['tags', 'reviews', 'reviews.user', 'reviews.likes']
    });
    
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const { tag_ids, ...bookData } = updateBookDto;
    
    await this.bookRepository.update(id, bookData);
    
    const book = await this.findOne(id);
    
    if (tag_ids !== undefined) {
      if (tag_ids.length > 0) {
        const tags = await this.tagRepository.findByIds(tag_ids);
        book.tags = tags;
      } else {
        book.tags = [];
      }
      await this.bookRepository.save(book);
    }
    
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }

  async searchBooks(query: string): Promise<Book[]> {
    return this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.tags', 'tags')
      .where('book.title ILIKE :query OR book.author ILIKE :query OR book.description ILIKE :query', 
        { query: `%${query}%` })
      .orderBy('book.created_at', 'DESC')
      .getMany();
  }
}
