import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artists.entity';
import { ArtistsService } from './services/artists/artists.service';
import { ArtistsController } from './controllers/artists/artists.controller';
import { SpotifyModule } from 'src/spotify/spotify.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Artist]),
    forwardRef(() => SpotifyModule),
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
