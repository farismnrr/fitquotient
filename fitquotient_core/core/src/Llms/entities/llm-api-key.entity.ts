import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum LlmProvider {
  OPENAI = 'OPENAI',
  ANTHROPIC = 'ANTHROPIC',
  AZURE_OPENAI = 'AZURE_OPENAI',
  GOOGLE = 'GOOGLE',
  OTHER = 'OTHER',
}

@Entity('llm_api_keys')
export class LlmApiKeyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
