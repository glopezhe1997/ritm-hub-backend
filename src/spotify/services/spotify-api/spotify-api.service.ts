import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { AlbumSpotifyDto } from 'src/albums/dto/spotify/album-spotify.dto/album-spotify.dto';
import { ArtistSpotifyDto } from 'src/artists/dto/spotify/artist-spotify.dto/artist-spotify.dto';
import { TrackSpotifyDto } from 'src/tracks/dto/spotify/track-spotify.dto/track-spotify.dto';
// DTO para playlist de Spotify
export interface PlaylistSpotifyDto {
  id: string;
  name: string;
  description: string | null;
  images: { url: string }[];
  tracks: { items: { track: { id: string } }[] };
}

export interface SpotifySearchResult<T> {
  artists?: { items: T[] };
  albums?: { items: T[] };
  playlists?: { items: T[] };
  tracks?: { items: T[] };
}

@Injectable()
export class SpotifyApiService {
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  private async getAccessToken(): Promise<string> {
    const now = Date.now() / 1000;
    if (this.accessToken && now < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
      const response = await axios.post<{
        access_token: string;
        expires_in: number;
      }>(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      this.accessToken = response.data.access_token;
      this.tokenExpiresAt = now + response.data.expires_in - 60; // 1 min de marge
      return this.accessToken;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          'Error getting Spotify token: ' + error.message,
        );
      }
      throw new InternalServerErrorException(
        'Unknown error getting Spotify token',
      );
    }
  }

  async search<T = unknown>(
    query: string,
    type: string | string[],
  ): Promise<SpotifySearchResult<T>> {
    const token = await this.getAccessToken();
    // Si type es array, únete con comas
    const typeParam = Array.isArray(type) ? type.join(',') : type;
    try {
      const response = await axios.get<SpotifySearchResult<T>>(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${typeParam}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Spotify search error:', error.message);
        throw new InternalServerErrorException(
          'Error searching Spotify: ' + error.message,
        );
      }
      throw new InternalServerErrorException('Unknown error searching Spotify');
    }
  }

  // Get artist by Spotify ID
  async getArtistById(spotifyId: string): Promise<ArtistSpotifyDto | null> {
    const token = await this.getAccessToken();
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/artists/${spotifyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data as ArtistSpotifyDto;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Spotify getArtistById error:', error.message);
        return null;
      }
      console.log('Unknown error in Spotify getArtistById');
      return null;
    }
  }

  // Get playlist by Spotify ID
  async getPlaylistById(spotifyId: string): Promise<PlaylistSpotifyDto | null> {
    const token = await this.getAccessToken();
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${spotifyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data as PlaylistSpotifyDto;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Spotify getPlaylistById error:', error.message);
        return null;
      }
      console.log('Unknown error in Spotify getPlaylistById');
      return null;
    }
  }

  // Get tracks from a playlist by Spotify ID
  async getPlaylistTracks(
    spotifyId: string,
  ): Promise<{ track: TrackSpotifyDto }[]> {
    const token = await this.getAccessToken();
    try {
      const response = await axios.get<{ items: { track: TrackSpotifyDto }[] }>(
        `https://api.spotify.com/v1/playlists/${spotifyId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // Devuelve array de items (cada uno tiene un track)
      return response.data.items;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Spotify getPlaylistTracks error:', error.message);
        return [];
      }
      console.log('Unknown error in Spotify getPlaylistTracks');
      return [];
    }
  }

  getAlbumById(spotifyId: string): Promise<AlbumSpotifyDto | null> {
    const token = this.getAccessToken();
    return token.then(async (accessToken) => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/albums/${spotifyId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        return response.data as AlbumSpotifyDto;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log('Spotify getAlbumById error:', error.message);
          return null;
        }
        console.log('Unknown error in Spotify getAlbumById');
        return null;
      }
    });
  }

  async getTrackById(spotifyId: string): Promise<TrackSpotifyDto | null> {
    const token = await this.getAccessToken();
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/tracks/${spotifyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data as TrackSpotifyDto;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('Spotify getTrackById error:', error.message);
        return null;
      }
      console.log('Unknown error in Spotify getTrackById');
      return null;
    }
  }
}
