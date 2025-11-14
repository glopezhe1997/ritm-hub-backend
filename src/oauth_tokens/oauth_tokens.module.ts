import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthTokens } from './entities/oauthTokens.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OauthTokens])],
  providers: [],
  controllers: [],
})
export class OauthTokensModule {}
