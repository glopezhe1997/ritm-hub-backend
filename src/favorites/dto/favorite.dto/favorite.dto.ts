import { IsEnum, IsInt, IsString } from 'class-validator';
enum FavoriteType {
  TRACK = 'track',
  ALBUM = 'album',
  PLAYLIST = 'playlist',
  ARTIST = 'artist',
}

export class FavoriteDto {
  @IsString()
  external_id: string;

  @IsInt()
  user_id: number;

  @IsEnum(FavoriteType)
  type: FavoriteType;
}
