import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './entities/follows.entity';
import { FollowsController } from './controllers/follows/follows.controller';
import { FollowsService } from './services/follows/follows.service';

@Module({
  imports: [TypeOrmModule.forFeature([Follow])],
  controllers: [FollowsController],
  providers: [FollowsService],
  exports: [FollowsService],
})
export class FollowsModule {}
