import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { StatisticsAppDto } from 'src/admin/dto/statistics-app.dto/statistics-app.dto';
import { AdminService } from 'src/admin/services/admin/admin.service';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard/jwt-auth-guard';
import { RolesGuardGuard } from 'src/guards/roles-guard/roles-guard.guard';
import { UserDto } from 'src/users/dto/user.dto/user.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuardGuard)
@Roles('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  //Get app statistics
  @Get('statistics')
  async getStatistics(): Promise<StatisticsAppDto> {
    const statistics = await this.adminService.getStatistics();
    return statistics;
  }

  // Block User by Id
  @Patch('users/block/:id')
  async blockUserById(
    @Param('id') id: number,
  ): Promise<{ message: string; user: UserDto | null }> {
    const user = await this.adminService.blockUserById(id);
    return {
      message: 'User blocked successfully',
      user,
    };
  }

  // Unblock User by Id
  @Patch('users/unblock/:id')
  async unblockUserById(@Param('id') id: number): Promise<UserDto | null> {
    const user = await this.adminService.unblockUserById(id);
    return user;
  }

  // Deactivate User by Id
  @Patch('users/deactivate/:id')
  async deactivateUserById(@Param('id') id: number): Promise<UserDto | null> {
    const user = await this.adminService.deactivateUserById(id);
    return user;
  }

  // Activate User by Id
  @Patch('users/activate/:id')
  async activateUserById(@Param('id') id: number): Promise<UserDto | null> {
    const user = await this.adminService.activateUserById(id);
    return user;
  }
}
