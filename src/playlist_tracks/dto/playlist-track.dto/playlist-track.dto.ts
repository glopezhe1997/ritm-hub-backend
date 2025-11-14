import { IsNumber } from 'class-validator';

export class PlaylistTrackDto {
  @IsNumber()
  playlist_id: number;

  @IsNumber()
  track_id: number;

  @IsNumber()
  position: number;
}
