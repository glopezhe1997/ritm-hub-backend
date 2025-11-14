import { IsInt, IsString } from 'class-validator';

export class ArtistDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  external_id: string;
}
