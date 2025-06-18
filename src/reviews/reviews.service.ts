import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: string) {
    // Check if user already reviewed this book
    const existingReview = await this.reviewRepository.findOne({
      where: {
        user_id: userId,
        book_id: createReviewDto.book_id,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this book');
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      user_id: userId,
    });

    return await this.reviewRepository.save(review);
  }

  async findAll() {
    return await this.reviewRepository.find({
      relations: ['user', 'book'],
    });
  }

  async findOne(id: string) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'book'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, userId: string) {
    const review = await this.reviewRepository.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    if (review.user_id !== userId) {
      throw new BadRequestException('You can only update your own reviews');
    }

    Object.assign(review, updateReviewDto);
    return await this.reviewRepository.save(review);
  }

  async remove(id: string, userId: string) {
    const review = await this.reviewRepository.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    if (review.user_id !== userId) {
      throw new BadRequestException('You can only delete your own reviews');
    }

    await this.reviewRepository.remove(review);
    return { message: 'Review deleted successfully' };
  }

  async findByBook(bookId: string) {
    return await this.reviewRepository.find({
      where: { book_id: bookId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async findByUser(userId: string) {
    return await this.reviewRepository.find({
      where: { user_id: userId },
      relations: ['book'],
      order: { created_at: 'DESC' },
    });
  }
}
