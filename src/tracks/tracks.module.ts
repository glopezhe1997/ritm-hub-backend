import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './entities/tracks.entity';
import { TracksService } from './services/tracks/tracks.service';
import { TracksController } from './controllers/tracks/tracks.controller';
import { SpotifyModule } from 'src/spotify/spotify.module';
import { AlbumsModule } from 'src/albums/albums.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track]),
    forwardRef(() => SpotifyModule),
    forwardRef(() => AlbumsModule),
  ],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService],
})
export class TracksModule {}
