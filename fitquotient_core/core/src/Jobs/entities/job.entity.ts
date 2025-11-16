import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LlmApiKeyEntity } from '@llm/context/llm-api-keys';
import { UserEntity } from '@users/context/users';
import { UserCvEntity } from '@users/context/user-cvs';

@Entity('jobs')
export class JobEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  requirements: string | null;

  @Column({ type: 'json', nullable: true })
  details: unknown;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  apiKeyId: string;

  @ManyToOne(() => LlmApiKeyEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'apiKeyId' })
  apiKey: LlmApiKeyEntity;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ nullable: true })
  userCvId: string | null;

  @ManyToOne(() => UserCvEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userCvId' })
  userCv: UserCvEntity;
}
