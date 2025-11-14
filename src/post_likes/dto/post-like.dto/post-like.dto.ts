import { IsDate, IsNumber } from 'class-validator';

export class PostLikeDto {
  @IsNumber()
  post_id: number;

  @IsNumber()
  user_id: number;

  @IsDate()
  created_at: Date;
}
