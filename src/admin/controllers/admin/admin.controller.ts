import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticsAppDto } from 'src/admin/dto/statistics-app.dto/statistics-app.dto';
import { AdminService } from 'src/admin/services/admin/admin.service';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard/jwt-auth-guard';
import { RolesGuardGuard } from 'src/guards/roles-guard/roles-guard.guard';

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
}
