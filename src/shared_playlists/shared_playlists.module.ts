import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedPlaylists } from './entities/sharedPlaylists.entity';
import { SharePlaylistsService } from './services/share-playlists/share-playlists.service';
import { SharePlaylistsController } from './controllers/share-playlists/share-playlists.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SharedPlaylists])],
  controllers: [SharePlaylistsController],
  providers: [SharePlaylistsService],
  exports: [],
})
export class SharedPlaylistsModule {}
