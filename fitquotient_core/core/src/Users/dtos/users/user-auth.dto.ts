import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserAuthResponseDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}

export class UserAccessTokenResponseDto {
  @IsString()
  @Expose({ name: 'access_token' })
  accessToken: string;
}
