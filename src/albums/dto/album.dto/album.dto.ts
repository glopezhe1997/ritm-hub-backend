import { IsInt, IsString } from 'class-validator';

export class AlbumDto {
  @IsInt()
  id!: number;

  @IsString()
  title: string;

  @IsInt()
  artist_id: number;

  @IsString()
  external_id: string;
}
