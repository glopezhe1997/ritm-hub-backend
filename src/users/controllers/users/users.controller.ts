import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard/jwt-auth-guard';
import { AuthenticatedRequestDto } from 'src/shared/dto/authenticated-request.dto/authenticated-request.dto';
import { AdminUpdateUserDto } from 'src/users/dto/admin-update-user.dto/admin-update-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto/update-user.dto';
import { UserDto } from 'src/users/dto/user.dto/user.dto';
import { UsersService } from 'src/users/services/users/users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // Search users by username or email excluding running user
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
  @Get(':id')
  async getUser(@Param() id: number): Promise<UserDto | null> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  // Get all users
  @Get('')
  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userService.findAll();
    if (users.length == 0) {
      throw new NotFoundException('No users found');
    }
    return await this.userService.findAll();
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
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateData: UpdateUserDto,
  ): Promise<UserDto> {
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
  @Put('admin/:id')
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

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<{ message: string }> {
    const userToDelete = await this.userService.findOne(id);
    if (!userToDelete) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.userService.remove(id);
    return { message: `User with id ${id} has been deleted` };
  }
}
