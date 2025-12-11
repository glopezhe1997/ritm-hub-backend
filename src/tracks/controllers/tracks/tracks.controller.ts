import { Controller, Get } from '@nestjs/common';
import { TracksService } from '../../services/tracks/tracks.service';
import { TrackSpotifyDto } from '../../dto/spotify/track-spotify.dto/track-spotify.dto';

@Controller('tracks')
export class TracksController {
  constructor(private tracksService: TracksService) {}

  @Get('trending')
  async getTrendingTracks(): Promise<TrackSpotifyDto[]> {
    return this.tracksService.getTrendingTracks();
  }
}
