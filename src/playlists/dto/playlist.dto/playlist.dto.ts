import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PlaylistDto {
  @IsNumber()
  playlist_id: number;

  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  owner_id?: number;

  @IsBoolean()
  is_public: boolean;

  @IsString()
  @IsOptional()
  external_id?: string;

  @IsDate()
  createdAt: Date;
}
