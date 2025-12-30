import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/posts.entity';
import { PostsService } from './services/posts/posts.service';
import { PostsController } from './controller/posts/posts.controller';
import { FollowsModule } from 'src/follows/follows.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), FollowsModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
