import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
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
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  setId() {
    if (!this.id) this.id = uuidv4();
  }

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
