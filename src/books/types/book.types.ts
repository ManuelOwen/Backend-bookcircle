import { Book } from '../entities/book.entity';

// Interface for books with calculated properties
export interface BookWithCalculatedProps extends Book {
  avgRating?: number;
  reviewCount?: number;
} 