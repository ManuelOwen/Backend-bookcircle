import { Module } from '@nestjs/common';
import { PersonalLibraryService } from './personal-library.service';
import { PersonalLibraryController } from './personal-library.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalLibrary } from './entities/personal-library.entity';
import { BooksModule } from 'src/books/books.module';
import { Book } from 'src/books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalLibrary, Book]), BooksModule],
  controllers: [PersonalLibraryController],
  providers: [PersonalLibraryService],
})
export class PersonalLibraryModule {}
