import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonalLibraryDto } from './dto/create-personal-library.dto';
import { UpdatePersonalLibraryDto } from './dto/update-personal-library.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonalLibrary } from './entities/personal-library.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Book } from '../books/entities/book.entity';
import { ReadingStatus } from './entities/personal-library.entity';

@Injectable()
export class PersonalLibraryService {
  constructor(
    @InjectRepository(PersonalLibrary)
    private personalLibraryRepository: Repository<PersonalLibrary>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async create(createPersonalLibraryDto: CreatePersonalLibraryDto, userId: string): Promise<PersonalLibrary> {
    const { bookId, status } = createPersonalLibraryDto;

    const existingEntry = await this.personalLibraryRepository.findOne({
      where: { user_id: userId, book_id: bookId },
    });

    if (existingEntry) {
      throw new NotFoundException('Book already in personal library');
    }

    const book = await this.bookRepository.findOne({ where: { id: bookId } });

    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    // Map string status to enum
    let statusEnum: ReadingStatus;
    switch (status) {
      case 'want_to_read':
        statusEnum = ReadingStatus.WANT_TO_READ;
        break;
      case 'currently_reading':
        statusEnum = ReadingStatus.CURRENTLY_READING;
        break;
      case 'read':
        statusEnum = ReadingStatus.READ;
        break;
      default:
        throw new NotFoundException('Invalid reading status');
    }

    const personalLibraryEntry = this.personalLibraryRepository.create({
      user_id: userId,
      book_id: bookId,
      status: statusEnum,
    });

    const savedEntry = await this.personalLibraryRepository.save(personalLibraryEntry);

    // Return the saved entry with the book relation loaded
    const entryWithBook = await this.personalLibraryRepository.findOne({
      where: { id: savedEntry.id },
      relations: ['book'],
    });
    if (!entryWithBook) throw new NotFoundException('Personal library entry not found after save');
    return entryWithBook;
  }

  async findAll(userId: string): Promise<PersonalLibrary[]> {
    return this.personalLibraryRepository.find({
      where: { user_id: userId },
      relations: ['book'], // Eagerly load the book relation
    });
  }

  async findOne(id: string, userId: string): Promise<PersonalLibrary> {
    const entry = await this.personalLibraryRepository.findOne({
      where: { id, user_id: userId },
      relations: ['book'],
    });
    if (!entry) {
      throw new NotFoundException(`Personal library entry with ID ${id} not found`);
    }
    return entry;
  }

  async update(id: string, updatePersonalLibraryDto: UpdatePersonalLibraryDto, userId: string): Promise<PersonalLibrary> {
    const entry = await this.personalLibraryRepository.findOne({
      where: { id, user_id: userId },
    });
    if (!entry) {
      throw new NotFoundException(`Personal library entry with ID ${id} not found`);
    }

    Object.assign(entry, updatePersonalLibraryDto);
    const savedEntry = await this.personalLibraryRepository.save(entry);
    
    const entryWithBook = await this.personalLibraryRepository.findOne({
      where: { id: savedEntry.id },
      relations: ['book'],
    });
    if (!entryWithBook) throw new NotFoundException('Personal library entry not found after update');
    return entryWithBook;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.personalLibraryRepository.delete({ id, user_id: userId });
    if (result.affected === 0) {
      throw new NotFoundException(`Personal library entry with ID ${id} not found`);
    }
  }
}
