import {
  IsDateString,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { PostStatus } from 'src/posts/entities/posts.entity';
import { TrackDto } from 'src/tracks/dto/track.dto/track.dto';
import { UserDto } from 'src/users/dto/user.dto/user.dto';

export class PostDto {
  @IsInt()
  post_id: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(PostStatus)
  status: PostStatus;

  @IsObject()
  owner: UserDto;

  @IsDateString()
  createdAt: Date;

  @IsObject()
  @IsOptional()
  track?: TrackDto;
}
