import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('llm_match_rates')
export class LlmMatchRateEntity {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  setId() {
    if (!this.id) this.id = uuidv4();
  }

  // Optional candidate/user id that the CV belongs to
  @Column({ nullable: true })
  candidateId: string;

  // Optional job identifier (can be id or external id)
  @Column({ nullable: true })
  jobId: string;

  // Human readable job title or position
  @Column({ nullable: true })
  jobTitle: string;

  // Final score from 0-100 (stored as numeric/float)
  @Column({ type: 'float' })
  matchRate: number;

  // Optional detailed breakdown from LLM or algorithm (json)
  @Column({ type: 'json', nullable: true })
  breakdown: unknown;

  // The prompt or model used during comparison (optional)
  @Column({ nullable: true })
  model: string;

  @CreateDateColumn()
  createdAt: Date;
}
