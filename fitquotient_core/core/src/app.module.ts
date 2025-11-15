import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '@common/common.module';
import { UsersModule } from '@users/users.module';
import { LlmModule } from 'src/Llms/llm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonModule,
    UsersModule,
    LlmModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
