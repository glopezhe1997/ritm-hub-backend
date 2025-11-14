import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedPlaylists } from './entities/sharedPlaylists.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SharedPlaylists])],
  controllers: [],
  providers: [],
  exports: [],
})
export class SharedPlaylistsModule {}
