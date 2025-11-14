import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistTrack } from './entities/playlistTrack.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlaylistTrack])],
  controllers: [],
  providers: [],
  exports: [],
})
export class PlaylistTracksModule {}
