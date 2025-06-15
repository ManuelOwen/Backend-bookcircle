
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Membership } from '../../membership/entities/membership.entity';

@Entity('clubs')
export class Club {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  cover_image_url: string;

  @Column('uuid')
  created_by: string;

  @Column({ type: 'boolean', default: false })
  is_private: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, user => user.created_clubs)
  @JoinColumn({ name: 'created_by' })
  created_by_user: User;

  @OneToMany(() => Membership, membership => membership.club)
  memberships: Membership[];
}
