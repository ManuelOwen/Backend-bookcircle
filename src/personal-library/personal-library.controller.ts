import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PersonalLibraryService } from './personal-library.service';
import { CreatePersonalLibraryDto } from './dto/create-personal-library.dto';
import { UpdatePersonalLibraryDto } from './dto/update-personal-library.dto';

@Controller('personal-library')
export class PersonalLibraryController {
  constructor(private readonly personalLibraryService: PersonalLibraryService) {}

  @Post()
  create(@Body() createPersonalLibraryDto: CreatePersonalLibraryDto) {
    return this.personalLibraryService.create(createPersonalLibraryDto);
  }

  @Get()
  findAll() {
    return this.personalLibraryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personalLibraryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonalLibraryDto: UpdatePersonalLibraryDto) {
    return this.personalLibraryService.update(+id, updatePersonalLibraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personalLibraryService.remove(+id);
  }
}
