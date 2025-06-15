
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Club } from './entities/club.entity';
import { Membership, MembershipRole } from '../membership/entities/membership.entity';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club)
    private clubRepository: Repository<Club>,
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
  ) {}

  async create(createClubDto: CreateClubDto, userId: string): Promise<Club> {
    const club = this.clubRepository.create({
      ...createClubDto,
      created_by: userId,
    });
    
    const savedClub = await this.clubRepository.save(club);
    
    // Automatically add creator as admin
    const membership = this.membershipRepository.create({
      user_id: userId,
      club_id: savedClub.id,
      role: MembershipRole.ADMIN,
    });
    
    await this.membershipRepository.save(membership);
    
    return this.findOne(savedClub.id);
  }

  async findAll(): Promise<Club[]> {
    return this.clubRepository.find({
      relations: ['created_by_user', 'memberships', 'memberships.user'],
      where: { is_private: false },
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Club> {
    const club = await this.clubRepository.findOne({
      where: { id },
      relations: ['created_by_user', 'memberships', 'memberships.user']
    });
    
    if (!club) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }
    
    return club;
  }

  async update(id: string, updateClubDto: UpdateClubDto, userId: string): Promise<Club> {
    const club = await this.findOne(id);
    
    if (club.created_by !== userId) {
      throw new ForbiddenException('Only club creators can update the club');
    }
    
    await this.clubRepository.update(id, updateClubDto);
    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const club = await this.findOne(id);
    
    if (club.created_by !== userId) {
      throw new ForbiddenException('Only club creators can delete the club');
    }
    
    const result = await this.clubRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Club with ID ${id} not found`);
    }
  }

  async getUserClubs(userId: string): Promise<Club[]> {
    return this.clubRepository
      .createQueryBuilder('club')
      .leftJoinAndSelect('club.memberships', 'membership')
      .leftJoinAndSelect('membership.user', 'user')
      .leftJoinAndSelect('club.created_by_user', 'creator')
      .where('membership.user_id = :userId OR club.created_by = :userId', { userId })
      .orderBy('club.created_at', 'DESC')
      .getMany();
  }
}
