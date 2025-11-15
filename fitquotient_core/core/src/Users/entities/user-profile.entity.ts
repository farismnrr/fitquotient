// This file is not currently in use, but it’s kept for future user profile–related features.

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_profiles')
export class UserProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  bio: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserEntity, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
