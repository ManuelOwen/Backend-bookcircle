
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto, @Request() req) {
    return this.likesService.create(createLikeDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.likesService.findAll();
  }

  @Get('my-likes')
  getMyLikes(@Request() req) {
    return this.likesService.getLikesByUser(req.user.userId);
  }

  @Get('review/:reviewId')
  getLikesByReview(@Param('reviewId', ParseUUIDPipe) reviewId: string) {
    return this.likesService.getLikesByReview(reviewId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.likesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.likesService.remove(id, req.user.userId);
  }

  @Delete('review/:reviewId')
  removeByReview(@Param('reviewId', ParseUUIDPipe) reviewId: string, @Request() req) {
    return this.likesService.removeByReviewAndUser(reviewId, req.user.userId);
  }
}
