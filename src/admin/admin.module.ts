import { forwardRef, Module } from '@nestjs/common';
import { AdminService } from './services/admin/admin.service';
import { AdminController } from './controllers/admin/admin.controller';
import { UsersModule } from 'src/users/users.module';
import { PlaylistsModule } from 'src/playlists/playlists.module';

@Module({
  imports: [forwardRef(() => UsersModule), forwardRef(() => PlaylistsModule)],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
