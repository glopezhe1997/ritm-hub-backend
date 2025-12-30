import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/posts.entity';
import { PostsService } from './services/posts/posts.service';
import { PostsController } from './controller/posts/posts.controller';
import { FollowsModule } from 'src/follows/follows.module';
import { TracksModule } from 'src/tracks/tracks.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), FollowsModule, TracksModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
