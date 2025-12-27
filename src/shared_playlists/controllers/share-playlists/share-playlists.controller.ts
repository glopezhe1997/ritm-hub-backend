import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard/jwt-auth-guard';
import { PlaylistDto } from 'src/playlists/dto/playlist.dto/playlist.dto';
import { AuthenticatedRequestDto } from 'src/shared/dto/authenticated-request.dto/authenticated-request.dto';
import { SharedPlaylistDto } from 'src/shared_playlists/dto/shared-playlist.dto/shared-playlist.dto';
import { SharedPlaylistsResultDto } from 'src/shared_playlists/dto/shared-playlists-result.dto/shared-playlists-result.dto';
import { SharePlaylistsService } from 'src/shared_playlists/services/share-playlists/share-playlists.service';

@Controller('share-playlists')
export class SharePlaylistsController {
  constructor(private sharedPlaylistsService: SharePlaylistsService) {}

  //Get playlists shared with the running user
  @UseGuards(JwtAuthGuard)
  @Get('received')
  async getPlaylistsSharedWithUser(
    @Req() req: AuthenticatedRequestDto,
  ): Promise<PlaylistDto[]> {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    const sharedPlaylists =
      await this.sharedPlaylistsService.getSharedPlaylistsForUser(userId);

    return sharedPlaylists;
  }

  //Share a playlist with another user
  @UseGuards(JwtAuthGuard)
  @Post(':userId/playlists')
  async sharePlaylist(
    @Body() sharePlaylistDto: SharedPlaylistDto,
    @Req() req: AuthenticatedRequestDto,
  ): Promise<SharedPlaylistsResultDto> {
    const shared = await this.sharedPlaylistsService.sharePlaylist(
      sharePlaylistDto.playlist_id,
      req.user.id,
      sharePlaylistDto.shared_with_user_id,
    );
    return {
      playlist_id: shared.playlist_id,
      shared_with_user_id: shared.shared_with_user_id,
      shared_by_user_id: shared.shared_by_user_id,
      shared_at: shared.shared_at,
    };
  }

  //Get a shared playlist by ID
  @UseGuards(JwtAuthGuard)
  @Get('playlists/:playlistId')
  async getSharedPlaylistById(
    @Req() req: AuthenticatedRequestDto,
    @Param('playlistId') playlistId: number,
  ): Promise<PlaylistDto> {
    const userId = req.user.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    return this.sharedPlaylistsService.getSharedPlaylistById(
      playlistId,
      userId,
    );
  }
}
