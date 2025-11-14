import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class AdminUpdateUserDto {
  @IsString()
  @IsOptional()
  role?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isBlocked?: boolean;
}
