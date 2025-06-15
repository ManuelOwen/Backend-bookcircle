
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewLike } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(ReviewLike)
    private reviewLikeRepository: Repository<ReviewLike>,
  ) {}

  async create(createLikeDto: CreateLikeDto, userId: string): Promise<ReviewLike> {
    const { review_id } = createLikeDto;
    
    // Check if user already liked this review
    const existingLike = await this.reviewLikeRepository.findOne({
      where: { user_id: userId, review_id },
    });
    
    if (existingLike) {
      throw new ConflictException('User has already liked this review');
    }
    
    const like = this.reviewLikeRepository.create({
      user_id: userId,
      review_id,
    });
    
    return this.reviewLikeRepository.save(like);
  }

  async findAll(): Promise<ReviewLike[]> {
    return this.reviewLikeRepository.find({
      relations: ['user', 'review'],
    });
  }

  async findOne(id: string): Promise<ReviewLike> {
    const like = await this.reviewLikeRepository.findOne({
      where: { id },
      relations: ['user', 'review'],
    });
    
    if (!like) {
      throw new NotFoundException(`Like with ID ${id} not found`);
    }
    
    return like;
  }

  async remove(id: string, userId: string): Promise<void> {
    const like = await this.reviewLikeRepository.findOne({
      where: { id, user_id: userId },
    });
    
    if (!like) {
      throw new NotFoundException(`Like with ID ${id} not found or not owned by user`);
    }
    
    await this.reviewLikeRepository.remove(like);
  }

  async removeByReviewAndUser(reviewId: string, userId: string): Promise<void> {
    const like = await this.reviewLikeRepository.findOne({
      where: { review_id: reviewId, user_id: userId },
    });
    
    if (!like) {
      throw new NotFoundException('Like not found');
    }
    
    await this.reviewLikeRepository.remove(like);
  }

  async getLikesByUser(userId: string): Promise<ReviewLike[]> {
    return this.reviewLikeRepository.find({
      where: { user_id: userId },
      relations: ['review', 'review.book'],
    });
  }

  async getLikesByReview(reviewId: string): Promise<ReviewLike[]> {
    return this.reviewLikeRepository.find({
      where: { review_id: reviewId },
      relations: ['user'],
    });
  }
}
