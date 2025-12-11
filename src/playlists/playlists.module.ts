import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { PlaylistsService } from './services/playlists/playlists.service';
import { PlaylistsController } from './controllers/playlists/playlists.controller';
import { SpotifyModule } from 'src/spotify/spotify.module';
import { TracksModule } from 'src/tracks/tracks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Playlist]),
    forwardRef(() => SpotifyModule),
    forwardRef(() => TracksModule),
  ],
  providers: [PlaylistsService],
  controllers: [PlaylistsController],
  exports: [PlaylistsService],
})
export class PlaylistsModule {}
