import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonalLibraryDto } from './create-personal-library.dto';

export class UpdatePersonalLibraryDto extends PartialType(CreatePersonalLibraryDto) {}
