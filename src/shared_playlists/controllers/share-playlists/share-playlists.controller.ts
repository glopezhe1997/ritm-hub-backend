import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard/jwt-auth-guard';
import { AuthenticatedRequestDto } from 'src/shared/dto/authenticated-request.dto/authenticated-request.dto';
import { SharedPlaylistDto } from 'src/shared_playlists/dto/shared-playlist.dto/shared-playlist.dto';
import { SharedPlaylistsResultDto } from 'src/shared_playlists/dto/shared-playlists-result.dto/shared-playlists-result.dto';
import { SharePlaylistsService } from 'src/shared_playlists/services/share-playlists/share-playlists.service';

@Controller('share-playlists')
export class SharePlaylistsController {
  constructor(private sharedPlaylistsService: SharePlaylistsService) {}

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
}
