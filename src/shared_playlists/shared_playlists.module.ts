import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedPlaylists } from './entities/sharedPlaylists.entity';
import { SharePlaylistsService } from './services/share-playlists/share-playlists.service';
import { SharePlaylistsController } from './controllers/share-playlists/share-playlists.controller';
import { Playlist } from 'src/playlists/entities/playlist.entity';
import { PlaylistsModule } from 'src/playlists/playlists.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SharedPlaylists, Playlist]),
    forwardRef(() => PlaylistsModule),
  ],
  controllers: [SharePlaylistsController],
  providers: [SharePlaylistsService],
  exports: [],
})
export class SharedPlaylistsModule {}
