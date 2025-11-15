import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '@common/common.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
