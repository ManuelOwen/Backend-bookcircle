import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { PersonalLibraryService } from './personal-library.service';
import { CreatePersonalLibraryDto } from './dto/create-personal-library.dto';
import { UpdatePersonalLibraryDto } from './dto/update-personal-library.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('personal-library')
export class PersonalLibraryController {
  constructor(private readonly personalLibraryService: PersonalLibraryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createPersonalLibraryDto: CreatePersonalLibraryDto, @Request() req) {
    return this.personalLibraryService.create(createPersonalLibraryDto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    return this.personalLibraryService.findAll(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    return this.personalLibraryService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Param('id') id: string, @Body() updatePersonalLibraryDto: UpdatePersonalLibraryDto, @Request() req) {
    return this.personalLibraryService.update(id, updatePersonalLibraryDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.personalLibraryService.remove(id, req.user.userId);
  }
}
