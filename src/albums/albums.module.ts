import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/albums.entity';
import { AlbumsService } from './services/albums/albums.service';
import { AlbumsController } from './controllers/albums/albums.controller';
import { ArtistsModule } from 'src/artists/artists.module';
import { SpotifyModule } from 'src/spotify/spotify.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    forwardRef(() => ArtistsModule),
    forwardRef(() => SpotifyModule),
  ],
  providers: [AlbumsService],
  controllers: [AlbumsController],
  exports: [AlbumsService],
})
export class AlbumsModule {}
