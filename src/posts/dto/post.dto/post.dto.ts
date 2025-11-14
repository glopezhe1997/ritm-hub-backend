import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class PostDto {
  @IsInt()
  post_id: number;

  @IsString()
  content: string;

  @IsInt()
  owner_id: number;

  @IsDate()
  createdAt: Date;

  @IsInt()
  @IsOptional()
  track_id?: number;
}
