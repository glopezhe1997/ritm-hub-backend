import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';
import { SpotifyApiService } from '../../services/spotify-api/spotify-api.service';
import { ArtistsService } from 'src/artists/services/artists/artists.service';
import { AlbumsService } from 'src/albums/services/albums/albums.service';
import { TracksService } from 'src/tracks/services/tracks/tracks.service';
import { PlaylistsService } from 'src/playlists/services/playlists/playlists.service';
import { Artist } from 'src/artists/entities/artists.entity';
import { Album } from 'src/albums/entities/albums.entity';
import { Track } from 'src/tracks/entities/tracks.entity';
import { Playlist } from 'src/playlists/entities/playlist.entity';

@Controller('spotify')
export class SpotifyApiController {
  constructor(
    private readonly spotifyApiService: SpotifyApiService,
    private readonly artistsService: ArtistsService,
    private readonly albumsService: AlbumsService,
    private readonly tracksService: TracksService,
    private readonly playlistsService: PlaylistsService,
  ) {}

  // Buscar en todos los tipos por defecto
  @Get('search')
  async search(
    @Query('q') q: string,
    @Query('type')
    type: string | string[] = ['artist', 'album', 'track', 'playlist'],
  ): Promise<any> {
    // Si type es string, conviértelo en array separando por coma
    let typeArray: string[];
    if (typeof type === 'string') {
      typeArray = type.split(',');
    } else {
      typeArray = type;
    }
    const result = await this.spotifyApiService.search(q, typeArray);

    return {
      artists: result.artists?.items.slice(0, 5) ?? [],
      albums: result.albums?.items.slice(0, 5) ?? [],
      tracks: result.tracks?.items.slice(0, 10) ?? [],
      playlists: result.playlists?.items.slice(0, 5) ?? [],
    };
  }

  // Obtener playlist de Spotify por ID
  @Get('playlist/:id')
  async getPlaylist(@Param('id') id: string): Promise<any> {
    return await this.spotifyApiService.getPlaylistById(id);
  }

  // Obtener tracks de una playlist de Spotify por ID
  @Get('playlist/:id/tracks')
  async getPlaylistTracks(@Param('id') id: string): Promise<any[]> {
    return await this.spotifyApiService.getPlaylistTracks(id);
  }

  // Seleccionar y guardar recurso en la BBDD
  @Post('select')
  async selectResource(
    @Body() body: { type: string; external_id: string },
  ): Promise<Artist | Album | Track | Playlist | null> {
    const { type, external_id } = body;

    if (type === 'artist') {
      return await this.artistsService.findOrCreateArtistByExternalId(
        external_id,
      );
    }

    if (type === 'album') {
      return await this.albumsService.findOrCreateAlbumByExternalId(
        external_id,
      );
    }

    if (type === 'track') {
      return await this.tracksService.findOrCreateTrackByExternalId(
        external_id,
      );
    }

    if (type === 'playlist') {
      return await this.playlistsService.findOrCreatePlaylistByExternalId(
        external_id,
      );
    }

    return null;
  }
}
