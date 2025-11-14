import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/posts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [],
  providers: [],
})
export class PostsModule {}
