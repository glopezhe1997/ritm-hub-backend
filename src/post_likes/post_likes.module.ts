import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLikes } from './entities/postLikes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostLikes])],
  controllers: [],
  providers: [],
  exports: [],
})
export class PostLikesModule {}
