import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '@common/common.module';
import { UsersModule } from '@users/users.module';
import { LlmModule } from '@llm/llm.module';
import { JobsModule } from '@jobs/jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonModule,
    UsersModule,
    LlmModule,
    JobsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
