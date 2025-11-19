import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export enum LlmProvider {
  OPENAI = 'OPENAI',
  ANTHROPIC = 'ANTHROPIC',
  AZURE_OPENAI = 'AZURE_OPENAI',
  GOOGLE = 'GOOGLE',
  OTHER = 'OTHER',
}

@Entity('llm_api_keys')
export class LlmApiKeyEntity {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  setId() {
    if (!this.id) this.id = uuidv4();
  }

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'varchar', default: LlmProvider.OPENAI })
  provider: LlmProvider;

  // Encrypted key; encryption/decryption handled by utilities when reading/writing
  @Column({ type: 'text' })
  secret: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
