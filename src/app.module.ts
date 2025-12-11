import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { TracksModule } from './tracks/tracks.module';
import { AlbumsModule } from './albums/albums.module';
import { PostsModule } from './posts/posts.module';
import { ArtistsModule } from './artists/artists.module';
import { FollowsModule } from './follows/follows.module';
import { OauthTokensModule } from './oauth_tokens/oauth_tokens.module';
import { SharedPlaylistsModule } from './shared_playlists/shared_playlists.module';
import { PostLikesModule } from './post_likes/post_likes.module';
import { PostsTagModule } from './posts_tag/posts_tag.module';
import { AuthModule } from './auth/auth.module';
import { SpotifyModule } from './spotify/spotify.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().optional(), // Para Railway
        DB_TYPE: Joi.string()
          .valid('postgres', 'mysql', 'mariadb')
          .default('postgres'),
        DB_HOST: Joi.string().optional(),
        DB_PORT: Joi.number().optional(),
        DB_USER: Joi.string().optional(),
        DB_PASS: Joi.string().allow('').optional(),
        DB_NAME: Joi.string().optional(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        // Si existe DATABASE_URL (Railway), úsala directamente
        if (databaseUrl) {
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            autoLoadEntities: true,
            synchronize: process.env.NODE_ENV !== 'production',
            ssl: {
              rejectUnauthorized: false,
            },
          };
        }

        // Si no existe DATABASE_URL, usa variables individuales (localhost)
        return {
          type: configService.get<'postgres' | 'mysql' | 'mariadb'>(
            'DB_TYPE',
            'postgres',
          ),
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASS'),
          database: configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),

    UsersModule,
    PlaylistsModule,
    TracksModule,
    AlbumsModule,
    PostsModule,
    ArtistsModule,
    FollowsModule,
    OauthTokensModule,
    SharedPlaylistsModule,
    PostLikesModule,
    PostsTagModule,
    AuthModule,
    SpotifyModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
