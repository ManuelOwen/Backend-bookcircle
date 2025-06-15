
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseGuards, Request } from '@nestjs/common';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('clubs')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createClubDto: CreateClubDto, @Request() req) {
    return this.clubService.create(createClubDto, req.user.userId);
  }

  @Get()
  @Public()
  findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.clubService.getUserClubs(userId);
    }
    return this.clubService.findAll();
  }

  @Get('my-clubs')
  @UseGuards(JwtAuthGuard)
  getMyClubs(@Request() req) {
    return this.clubService.getUserClubs(req.user.userId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clubService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateClubDto: UpdateClubDto, @Request() req) {
    return this.clubService.update(id, updateClubDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.clubService.remove(id, req.user.userId);
  }
}
