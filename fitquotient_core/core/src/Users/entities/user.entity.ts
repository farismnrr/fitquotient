import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserSessionEntity } from './user-session.entity';
import { UserCvEntity } from './user-cv.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'FitQuotient' })
  organization: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'varchar', default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'varchar', default: UserStatus.ACTIVE })
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserSessionEntity, (session) => session.user, {
    cascade: true,
  })
  sessions: UserSessionEntity[];

  @OneToMany(() => UserCvEntity, (cv) => cv.user, {
    cascade: true,
  })
  cvs: UserCvEntity[];
}
