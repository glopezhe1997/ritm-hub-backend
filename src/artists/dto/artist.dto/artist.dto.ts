import { IsArray, IsInt, IsString, IsUrl } from 'class-validator';

export class ArtistDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  external_id: string;

  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @IsInt()
  followers: number;

  @IsUrl()
  img_url: string | null;
}
