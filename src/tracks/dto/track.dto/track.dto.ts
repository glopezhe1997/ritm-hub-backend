import { IsInt, IsString, IsUrl } from 'class-validator';

export class TrackDto {
  @IsInt()
  id: number;

  @IsString()
  title: string;

  @IsInt()
  duration_ms: number;

  @IsInt()
  album_id: number;

  @IsString()
  external_id: string;

  @IsUrl()
  preview_url: string;
}
