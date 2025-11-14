import { IsInt } from 'class-validator';

export class PostTagDto {
  @IsInt()
  user_id: number;

  @IsInt()
  post_id: number;
}
