import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PlaylistsService } from '../../services/playlists/playlists.service';
import { PlaylistDto } from '../../dto/playlist.dto/playlist.dto';
import { AuthenticatedRequestDto } from 'src/shared/dto/authenticated-request.dto/authenticated-request.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard/jwt-auth-guard';
import { CreatePlaylistDto } from 'src/playlists/dto/create-playlist-dto/create-playlist-dto';

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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createPlaylist(
    @Body() playlistData: CreatePlaylistDto,
    @Req() req: AuthenticatedRequestDto,
  ): Promise<PlaylistDto> {
    console.log('Datos recibidos del frontend:', playlistData);
    const playlist = await this.playlistsService.createPlaylist(
      playlistData,
      req.user,
    );
    return this.playlistsService.toPlaylistDto(playlist);
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePlaylist(
    @Param('id') id: number,
    @Req() req: AuthenticatedRequestDto,
  ): Promise<{ message: string }> {
    await this.playlistsService.deletePlaylist(id, req.user.id);
    return { message: 'Playlist deleted successfully' };
  }
}
