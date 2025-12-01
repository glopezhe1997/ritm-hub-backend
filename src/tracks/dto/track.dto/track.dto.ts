import { IsInt, IsObject, IsString, IsUrl } from 'class-validator';
import { Album } from 'src/albums/entities/albums.entity';

export class TrackDto {
  @IsInt()
  id: number;

  @IsString()
  title: string;

  @IsInt()
  duration_ms: number;

  @IsObject()
  album_id: Album;

  @IsString()
  external_id: string;

  @IsUrl()
  preview_url: string;
}
