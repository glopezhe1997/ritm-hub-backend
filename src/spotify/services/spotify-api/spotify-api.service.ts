import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

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

  async search(query: string, type: string): Promise<any> {
    const token = await this.getAccessToken();
    try {
      const response = await axios.get<{ [key: string]: unknown }>(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}`,
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
}
