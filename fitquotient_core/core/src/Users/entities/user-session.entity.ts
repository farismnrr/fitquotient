import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_sessions')
export class UserSessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  userId: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date;

  @Column({ nullable: true })
  revokedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.sessions, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
