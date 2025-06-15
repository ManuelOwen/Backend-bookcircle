
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Check } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Club } from '../../club/entities/club.entity';

export enum MembershipRole {
  MEMBER = 'member',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

@Entity('memberships')
@Check(`role IN ('member', 'moderator', 'admin')`)
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  club_id: string;

  @Column({ type: 'enum', enum: MembershipRole, default: MembershipRole.MEMBER })
  role: MembershipRole;

  @CreateDateColumn()
  joined_at: Date;

  @ManyToOne(() => User, user => user.memberships)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Club, club => club.memberships)
  @JoinColumn({ name: 'club_id' })
  club: Club;
}
