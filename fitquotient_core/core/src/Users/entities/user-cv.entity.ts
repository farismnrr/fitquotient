import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from './user.entity';

@Entity('user_cvs')
export class UserCvEntity {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  setId() {
    if (!this.id) this.id = uuidv4();
  }

  @Index()
  @Column()
  userId: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  filename: string;

  @Column({ type: 'varchar', nullable: true })
  name: string | null;

  @Column({ nullable: true })
  mimeType: string;

  @Column({ type: 'bigint', nullable: true })
  size: number | null;

  @Column({ nullable: true })
  storageProvider: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.cvs, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
