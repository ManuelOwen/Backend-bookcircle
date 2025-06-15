import { Module } from '@nestjs/common';
import { PersonalLibraryService } from './personal-library.service';
import { PersonalLibraryController } from './personal-library.controller';

@Module({
  controllers: [PersonalLibraryController],
  providers: [PersonalLibraryService],
})
export class PersonalLibraryModule {}
