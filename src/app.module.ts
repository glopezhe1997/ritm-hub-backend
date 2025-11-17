import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi'; // Opcional: per validar variables d'entorn

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
import { PlaylistTracksModule } from './playlist_tracks/playlist_tracks.module';
import { SharedPlaylistsModule } from './shared_playlists/shared_playlists.module';
import { PostLikesModule } from './post_likes/post_likes.module';
import { PostsTagModule } from './posts_tag/posts_tag.module';
import { AuthModule } from './auth/auth.module';
import { SpotifyModule } from './spotify/spotify.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    // Configuració global amb validació opcional
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      // Validació opcional de variables d'entorn
      validationSchema: Joi.object({
        DB_TYPE: Joi.string()
          .valid('postgres', 'mysql', 'mariadb')
          .default('postgres'),
        DB_HOST: Joi.string().default('localhost'),
        DB_PORT: Joi.number().default(5432),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().allow('').default(''),
        DB_NAME: Joi.string().required(),
      }),
    }),

    // Configuració de TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'postgres' | 'mysql' | 'mariadb'>(
          'DB_TYPE',
          'postgres',
        ),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true, // Carrega automàticament les entitats
        synchronize: process.env.NODE_ENV !== 'production', // Només en desenvolupament
      }),
    }),

    // Mòduls de funcionalitats
    UsersModule,

    PlaylistsModule,

    TracksModule,

    AlbumsModule,

    PostsModule,

    ArtistsModule,

    FollowsModule,

    OauthTokensModule,

    PlaylistTracksModule,

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
