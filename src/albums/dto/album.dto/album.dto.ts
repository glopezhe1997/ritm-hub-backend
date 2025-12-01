import { IsInt, IsObject, IsString, IsUrl } from 'class-validator';
import { Artist } from 'src/artists/entities/artists.entity';

export class AlbumDto {
  @IsInt()
  id!: number;

  @IsString()
  name: string;

  @IsObject()
  artist_id: Artist;

  @IsString()
  external_id: string;

  @IsUrl()
  img_url: string | null;
}
