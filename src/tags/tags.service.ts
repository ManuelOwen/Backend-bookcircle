import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find({
      order: { name: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    await this.tagRepository.update(id, updateTagDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.tagRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
  }
}
