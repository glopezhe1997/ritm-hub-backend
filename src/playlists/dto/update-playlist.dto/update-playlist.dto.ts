import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePlaylistDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsBoolean()
  is_public?: boolean;
}
