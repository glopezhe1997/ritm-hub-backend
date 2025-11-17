import { Controller, Get, Query } from '@nestjs/common';
import { SpotifyApiService } from '../../services/spotify-api/spotify-api.service';

@Controller('spotify')
export class SpotifyApiController {
  constructor(private readonly spotifyApiService: SpotifyApiService) {}

  @Get('search')
  async search(
    @Query('q') q: string,
    @Query('type') type: string,
  ): Promise<any> {
    return await this.spotifyApiService.search(q, type);
  }
}
