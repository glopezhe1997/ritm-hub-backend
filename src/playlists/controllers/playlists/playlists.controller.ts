import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { PlaylistsService } from '../../services/playlists/playlists.service';
import { PlaylistDto } from '../../dto/playlist.dto/playlist.dto';
import { AuthenticatedRequestDto } from 'src/shared/dto/authenticated-request.dto/authenticated-request.dto';

export class CreatePlaylistDto {
  name: string;
}

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Get('trending')
  async getTrendingPlaylists(): Promise<any[]> {
    return this.playlistsService.getTrendingPlaylists();
  }

  @Get('public')
  async getPublicPlaylists(): Promise<PlaylistDto[]> {
    const playlists = await this.playlistsService.getPublicPlaylists();
    return playlists.map((playlist) =>
      this.playlistsService.toPlaylistDto(playlist),
    );
  }

  @Get('private')
  async getPrivatePlaylists(
    @Req() req: AuthenticatedRequestDto,
  ): Promise<PlaylistDto[]> {
    const playlists = await this.playlistsService.getPrivatePlaylists(
      req.user.id,
    );
    return playlists.map((playlist) =>
      this.playlistsService.toPlaylistDto(playlist),
    );
  }

  @Get(':id')
  async getPlaylistById(
    @Param('id') id: number,
    @Req() req: AuthenticatedRequestDto,
  ): Promise<PlaylistDto> {
    const playlist = await this.playlistsService.getPlaylistById(
      id,
      req.user?.id,
    );
    return this.playlistsService.toPlaylistDto(playlist);
  }

  @Post('create')
  async createPlaylist(
    @Body() playlistData: CreatePlaylistDto,
    @Req() req: AuthenticatedRequestDto,
  ): Promise<PlaylistDto> {
    const playlist = await this.playlistsService.createPlaylist(
      { name: playlistData.name },
      req.user,
    );
    return this.playlistsService.toPlaylistDto(playlist);
  }

  @Post(':id/tracks')
  async addTrackToPlaylist(
    @Param('id') id: number,
    @Body('trackExternalId') trackExternalId: string,
    @Req() req: AuthenticatedRequestDto,
  ): Promise<PlaylistDto> {
    const playlist = await this.playlistsService.addTrackToPlaylist(
      id,
      trackExternalId,
      req.user.id,
    );
    return this.playlistsService.toPlaylistDto(playlist);
  }
}
