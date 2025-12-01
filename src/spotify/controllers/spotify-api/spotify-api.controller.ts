import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';
import {
  PlaylistSpotifyDto,
  SpotifyApiService,
} from '../../services/spotify-api/spotify-api.service';
import { ArtistsService } from 'src/artists/services/artists/artists.service';
import { AlbumsService } from 'src/albums/services/albums/albums.service';
import { ArtistSpotifyDto } from 'src/artists/dto/spotify/artist-spotify.dto/artist-spotify.dto';
import { AlbumSpotifyDto } from 'src/albums/dto/spotify/album-spotify.dto/album-spotify.dto';
import { TrackSpotifyDto } from 'src/tracks/dto/spotify/track-spotify.dto/track-spotify.dto';

@Controller('spotify')
export class SpotifyApiController {
  constructor(
    private readonly spotifyApiService: SpotifyApiService,
    private readonly artistsService: ArtistsService,
    private readonly albumsService: AlbumsService,
  ) {}

  @Get('search')
  async search(
    @Query('q') q: string,
    @Query('type') type: string,
  ): Promise<any> {
    return await this.spotifyApiService.search(q, type);
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

  @Post('select')
  async selectResource(
    @Body() body: { type: string; external_id: string },
  ): Promise<
    | ArtistSpotifyDto
    | AlbumSpotifyDto
    | PlaylistSpotifyDto
    | TrackSpotifyDto
    | null
  > {
    const { type, external_id } = body;

    if (type === 'artist') {
      const artist =
        await this.artistsService.findOrCreateArtistByExternalId(external_id);
      return artist
        ? {
            id: artist.external_id,
            name: artist.name,
            genres: artist.genres,
            followers: {
              total: artist.followers,
            },
            images: artist.img_url
              ? [{ url: artist.img_url, height: 0, width: 0 }]
              : [],
            type: 'artist',
          }
        : null;
    }

    if (type === 'album') {
      const album =
        await this.albumsService.findOrCreateAlbumByExternalId(external_id);
      return album
        ? {
            id: album.external_id,
            name: album.name,
            artists: album.artist_id
              ? [{ id: album.artist_id.external_id }]
              : [],
            images: album.img_url ? [{ url: album.img_url }] : [],
            total_tracks: 0,
          }
        : null;
    }

    if (type === 'playlist') {
      return await this.spotifyApiService.getPlaylistById(external_id);
    }

    if (type === 'track') {
      return await this.spotifyApiService.getTrackById(external_id);
    }

    return null;
  }
}
