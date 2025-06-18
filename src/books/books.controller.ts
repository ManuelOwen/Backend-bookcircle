import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookWithCalculatedProps } from './types/book.types';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Request() req, @Body() createBookDto: CreateBookDto): Promise<{ success: boolean; data: BookWithCalculatedProps }> {
    try {
      const book = await this.booksService.create(createBookDto);
      return {
        success: true,
        data: book
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all books' })
  async findAll(@Query('search') search?: string): Promise<{ success: boolean; data: BookWithCalculatedProps[] }> {
    try {
      const books = search 
        ? await this.booksService.searchBooks(search)
        : await this.booksService.findAll();
      return {
        success: true,
        data: books
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a book by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<{ success: boolean; data: BookWithCalculatedProps }> {
    try {
      const book = await this.booksService.findOne(id);
      return {
        success: true,
        data: book
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a book' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBookDto: UpdateBookDto): Promise<{ success: boolean; data: BookWithCalculatedProps }> {
    try {
      const book = await this.booksService.update(id, updateBookDto);
      return {
        success: true,
        data: book
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a book' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ success: boolean; message: string }> {
    try {
      await this.booksService.remove(id);
      return {
        success: true,
        message: 'Book deleted successfully'
      };
    } catch (error) {
      throw error;
    }
  }
}
