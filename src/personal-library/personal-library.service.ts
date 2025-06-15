import { Injectable } from '@nestjs/common';
import { CreatePersonalLibraryDto } from './dto/create-personal-library.dto';
import { UpdatePersonalLibraryDto } from './dto/update-personal-library.dto';

@Injectable()
export class PersonalLibraryService {
  create(createPersonalLibraryDto: CreatePersonalLibraryDto) {
    return 'This action adds a new personalLibrary';
  }

  findAll() {
    return `This action returns all personalLibrary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} personalLibrary`;
  }

  update(id: number, updatePersonalLibraryDto: UpdatePersonalLibraryDto) {
    return `This action updates a #${id} personalLibrary`;
  }

  remove(id: number) {
    return `This action removes a #${id} personalLibrary`;
  }
}
