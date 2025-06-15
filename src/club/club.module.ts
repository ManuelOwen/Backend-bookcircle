
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import { Club } from './entities/club.entity';
import { Membership } from '../membership/entities/membership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Club, Membership])],
  controllers: [ClubController],
  providers: [ClubService],
  exports: [ClubService],
})
export class ClubModule {}
