import { Injectable } from '@nestjs/common';
import { StatisticsAppDto } from 'src/admin/dto/statistics-app.dto/statistics-app.dto';
import { PlaylistsService } from 'src/playlists/services/playlists/playlists.service';
import { UserDto } from 'src/users/dto/user.dto/user.dto';
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

  // Block user by id
  async blockUserById(id: number): Promise<UserDto | null> {
    return await this.usersService.blockUser(id);
  }

  // Unblock user by id
  async unblockUserById(id: number): Promise<UserDto | null> {
    return await this.usersService.unblockUser(id);
  }

  //Deactivate user by id
  async deactivateUserById(id: number): Promise<UserDto | null> {
    return await this.usersService.deactivateUser(id);
  }

  //Activate user by id
  async activateUserById(id: number): Promise<UserDto | null> {
    return await this.usersService.activateUser(id);
  }
}
