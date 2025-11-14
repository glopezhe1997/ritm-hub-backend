import { IsDate, IsInt } from 'class-validator';

export class SharedPlaylistDto {
  @IsInt()
  shared_by_user_id: number;

  @IsInt()
  shared_with_user_id: number;

  @IsInt()
  playlist_id: number;

  @IsDate()
  shared_at: Date;
}
