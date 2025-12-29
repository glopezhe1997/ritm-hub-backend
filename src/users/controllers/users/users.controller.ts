import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard/jwt-auth-guard';
import { RolesGuardGuard } from 'src/guards/roles-guard/roles-guard.guard';
import { AuthenticatedRequestDto } from 'src/shared/dto/authenticated-request.dto/authenticated-request.dto';
import { AdminUpdateUserDto } from 'src/users/dto/admin-update-user.dto/admin-update-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto/update-user.dto';
import { UserDto } from 'src/users/dto/user.dto/user.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // Search users by username or email excluding running user
  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchUsers(
    @Query('q') query: string,
    @Req() req: AuthenticatedRequestDto,
  ): Promise<UserDto[]> {
    const allUsers = await this.userService.searchUsers(query);
    const filteredUsers = allUsers.filter((user) => user.id !== req.user.id);
    return filteredUsers;
  }

  // Get user by id
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: number): Promise<UserDto | null> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  // Get all users
  @UseGuards(JwtAuthGuard)
  @Get('')
  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userService.findAll();
    if (users.length == 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  // Create a new user
  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<UserDto> {
    const userExists = await this.userService.findOneByEmail(user.email);
    console.log('userExists:', userExists); // <-- Añade esto
    if (userExists) {
      throw new ConflictException(
        `User with email ${user.email} already exists`,
      );
    }
    const usernameExists = await this.userService.findOneByUsername(
      user.username,
    );
    console.log('usernameExists:', usernameExists); // <-- Añade esto
    if (usernameExists) {
      throw new ConflictException(`Username ${user.username} already exists`);
    }
    return await this.userService.create(user);
  }

  // Update an existing user profile
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateData: UpdateUserDto,
    @Req() req: AuthenticatedRequestDto,
  ): Promise<UserDto> {
    if (req.user.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    if (updateData.username) {
      const usernameExists = await this.userService.findOneByUsername(
        updateData.username,
      );
      if (usernameExists && usernameExists.id !== id) {
        throw new ConflictException(
          `Username ${updateData.username} already exists`,
        );
      }
    }

    const updated = await this.userService.update(id, updateData);
    if (!updated) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updated;
  }

  // Admin update user data
  @UseGuards(JwtAuthGuard, RolesGuardGuard)
  @Put('admin/:id')
  @Roles('admin')
  async adminUpdateUser(
    @Param('id') id: number,
    @Body() updateData: AdminUpdateUserDto,
  ): Promise<UserDto> {
    const updated = await this.userService.adminUpdateUser(id, updateData);
    if (!updated) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updated;
  }

  @UseGuards(JwtAuthGuard, RolesGuardGuard)
  @Delete(':id')
  @Roles('admin')
  async deleteUser(@Param('id') id: number): Promise<{ message: string }> {
    const userToDelete = await this.userService.findOne(id);
    if (!userToDelete) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.userService.remove(id);
    return { message: `User with id ${id} has been deleted` };
  }

  @UseGuards(JwtAuthGuard, RolesGuardGuard)
  @Roles('admin')
  @Post('create-admin')
  async createAdmin(@Body() user: CreateUserDto): Promise<UserDto> {
    return this.userService.createAdmin(user);
  }
}
