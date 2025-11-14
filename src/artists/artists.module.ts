import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artists.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist])],
  controllers: [],
  providers: [],
})
export class ArtistsModule {}
