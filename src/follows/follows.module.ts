import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './entities/follows.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Follow])],
  controllers: [],
  providers: [],
})
export class FollowsModule {}
