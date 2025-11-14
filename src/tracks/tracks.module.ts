import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './entities/tracks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  controllers: [],
  providers: [],
})
export class TracksModule {}
