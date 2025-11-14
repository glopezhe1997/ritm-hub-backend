import { IsDate, IsInt, IsString } from 'class-validator';

export class OauthTokenDto {
  @IsInt()
  user_id: number;

  @IsString()
  provider: string;

  @IsString()
  access_token: string;

  @IsString()
  refresh_token: string;

  @IsDate()
  expiry_at: Date;
}
