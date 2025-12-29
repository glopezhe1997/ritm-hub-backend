import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { PostStatus } from 'src/posts/entities/posts.entity';
import { TrackDto } from 'src/tracks/dto/track.dto/track.dto';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(PostStatus)
  status: PostStatus;

  @IsObject()
  @IsOptional()
  track?: TrackDto;
}
