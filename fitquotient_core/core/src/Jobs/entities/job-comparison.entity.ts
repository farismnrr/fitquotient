import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('job_comparisons')
export class JobComparisonEntity {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  setId() {
    if (!this.id) this.id = uuidv4();
  }

  @BeforeInsert()
  setComparisonId() {
    if (!this.comparisonId) this.comparisonId = uuidv4();
  }

  @Column({ unique: true, type: 'uuid' })
  comparisonId: string;

  @Column()
  cvId: string;

  @Column()
  jobId: string;

  @Column({ default: 'processing' })
  status: string; // processing | completed | failed

  @Column({ type: 'json', nullable: true })
  result: unknown;

  @Column({ nullable: true })
  errorMessage: string;

  // Soft-delete flag
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
