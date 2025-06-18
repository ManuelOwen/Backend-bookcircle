import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    return this.reviewsService.create(createReviewDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('book/:bookId')
  findByBook(@Param('bookId') bookId: string) {
    return this.reviewsService.findByBook(bookId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.reviewsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @Request() req) {
    return this.reviewsService.update(id, updateReviewDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.reviewsService.remove(id, req.user.userId);
  }
}
