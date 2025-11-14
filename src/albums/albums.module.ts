import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/albums.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album])],
  providers: [],
  controllers: [],
})
export class AlbumsModule {}
