import { IsInt } from 'class-validator';

export class SharedPlaylistDto {
  @IsInt()
  shared_with_user_id: number;

  @IsInt()
  playlist_id: number;
}
