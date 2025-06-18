import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { Tag } from '../tags/entities/tag.entity';
import { In } from 'typeorm';
import { BookWithCalculatedProps } from './types/book.types';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<BookWithCalculatedProps> {
    const { tag_ids, ...bookData } = createBookDto;
    
    const book = this.bookRepository.create(bookData);
    
    if (tag_ids && tag_ids.length > 0) {
      const tags = await this.tagRepository.findBy({ id: In(tag_ids) });
      book.tags = tags;
    }
    
    const savedBook = await this.bookRepository.save(book);
    
    // Return the book with relations loaded
    return this.findOne(savedBook.id);
  }

  async findAll(): Promise<BookWithCalculatedProps[]> {
    const books = await this.bookRepository.find({
      relations: ['tags', 'reviews', 'reviews.user'],
      order: { created_at: 'DESC' }
    });

    // Calculate average ratings for each book
    return books.map(book => ({
      ...book,
      avgRating: this.calculateAverageRating(book.reviews),
      reviewCount: book.reviews?.length || 0
    }));
  }

  async findOne(id: string): Promise<BookWithCalculatedProps> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['tags', 'reviews', 'reviews.user', 'reviews.likes']
    });
    
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    
    // Calculate average rating
    const avgRating = this.calculateAverageRating(book.reviews);
    const reviewCount = book.reviews?.length || 0;
    
    return {
      ...book,
      avgRating,
      reviewCount
    };
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<BookWithCalculatedProps> {
    const { tag_ids, ...bookData } = updateBookDto;
    
    await this.bookRepository.update(id, bookData);
    
    const book = await this.findOne(id);
    
    if (tag_ids !== undefined) {
      if (tag_ids.length > 0) {
        const tags = await this.tagRepository.findBy({ id: In(tag_ids) });
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

  async searchBooks(query: string): Promise<BookWithCalculatedProps[]> {
    const books = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.tags', 'tags')
      .leftJoinAndSelect('book.reviews', 'reviews')
      .leftJoinAndSelect('reviews.user', 'user')
      .where('book.title ILIKE :query OR book.author ILIKE :query OR book.description ILIKE :query', 
        { query: `%${query}%` })
      .orderBy('book.created_at', 'DESC')
      .getMany();

    // Calculate average ratings for search results
    return books.map(book => ({
      ...book,
      avgRating: this.calculateAverageRating(book.reviews),
      reviewCount: book.reviews?.length || 0
    }));
  }

  private calculateAverageRating(reviews: any[]): number {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / reviews.length) * 10) / 10; // Round to 1 decimal place
  }
}
