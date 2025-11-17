import { Module } from '@nestjs/common';
import { FavoritesService } from './services/favorites/favorites.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite])],
  providers: [FavoritesService],
})
export class FavoritesModule {}
