import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TrackDto } from 'src/tracks/dto/track.dto/track.dto';

export class PlaylistDto {
  @IsNumber()
  playlist_id: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string | undefined;

  @IsString({ each: true })
  @IsOptional()
  images?: string[];

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

  tracks: TrackDto[];
}
