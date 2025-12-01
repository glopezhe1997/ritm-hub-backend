import { Module, forwardRef } from '@nestjs/common';
import { SpotifyApiService } from './services/spotify-api/spotify-api.service';
import { SpotifyApiController } from './controllers/spotify-api/spotify-api.controller';
import { ArtistsModule } from 'src/artists/artists.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { TracksModule } from 'src/tracks/tracks.module';

@Module({
  imports: [
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
  ],
  providers: [SpotifyApiService],
  controllers: [SpotifyApiController],
  exports: [SpotifyApiService],
})
export class SpotifyModule {}
