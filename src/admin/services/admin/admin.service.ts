import { Injectable } from '@nestjs/common';
import { StatisticsAppDto } from 'src/admin/dto/statistics-app.dto/statistics-app.dto';
import { PlaylistsService } from 'src/playlists/services/playlists/playlists.service';
import { UsersService } from 'src/users/services/users/users.service';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private playlistsService: PlaylistsService,
  ) {}

  async getStatistics(): Promise<StatisticsAppDto> {
    //User statistics
    const totalUsers = await this.usersService.countUsers();
    const totalActiveUsers = await this.usersService.countActiveUsers();
    const totalInactiveUsers = await this.usersService.countDeactivatedUsers();

    //Playlist statistics
    const totalPlaylists = await this.playlistsService.countPlaylists();
    const totalPublicPlaylists =
      await this.playlistsService.countPublicPlaylists();
    const totalPrivatePlaylists =
      await this.playlistsService.countPrivatePlaylists();

    return {
      totalUsers,
      totalActiveUsers,
      totalInactiveUsers,
      totalPlaylists,
      totalPublicPlaylists,
      totalPrivatePlaylists,
    };
  }
}
