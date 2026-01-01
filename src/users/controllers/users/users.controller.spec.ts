import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from 'src/users/services/users/users.service';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto/update-user.dto';
import { AdminUpdateUserDto } from 'src/users/dto/admin-update-user.dto/admin-update-user.dto';
import { AuthenticatedRequestDto } from 'src/shared/dto/authenticated-request.dto/authenticated-request.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Record<string, jest.Mock>;

  const mockUser = {
    id: 1,
    name: 'Test User',
    username: 'testuser',
    Birthdate: new Date('2000-01-01'),
    email: 'test@test.com',
    role: 'user',
    isActive: true,
    isBlocked: false,
  };

  beforeEach(async () => {
    usersService = {
      searchUsers: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findOneByEmail: jest.fn(),
      findOneByUsername: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      adminUpdateUser: jest.fn(),
      remove: jest.fn(),
      createAdmin: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should search users and exclude requesting user', async () => {
    usersService.searchUsers.mockResolvedValue([
      { ...mockUser, id: 1 },
      { ...mockUser, id: 2 },
    ]);
    const req = { user: { id: 1 } };
    const result = await controller.searchUsers(
      'test',
      req as AuthenticatedRequestDto,
    );
    expect(result).toEqual([{ ...mockUser, id: 2 }]);
  });

  it('should get user by id', async () => {
    usersService.findOne.mockResolvedValue(mockUser);
    const result = await controller.getUser(1);
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException if user not found', async () => {
    usersService.findOne.mockResolvedValue(null);
    await expect(controller.getUser(99)).rejects.toThrow(NotFoundException);
  });

  it('should get all users', async () => {
    usersService.findAll.mockResolvedValue([mockUser]);
    const result = await controller.getAllUsers();
    expect(result).toEqual([mockUser]);
  });

  it('should throw NotFoundException if no users found', async () => {
    usersService.findAll.mockResolvedValue([]);
    await expect(controller.getAllUsers()).rejects.toThrow(NotFoundException);
  });

  it('should create a new user', async () => {
    usersService.findOneByEmail.mockResolvedValue(null);
    usersService.findOneByUsername.mockResolvedValue(null);
    usersService.create.mockResolvedValue(mockUser);

    const dto: CreateUserDto = {
      name: 'Test User',
      username: 'testuser',
      Birthdate: new Date('2000-01-01'),
      email: 'test@test.com',
      password: '1234',
    };
    const result = await controller.createUser(dto);
    expect(result).toEqual(mockUser);
  });

  it('should throw ConflictException if email exists', async () => {
    usersService.findOneByEmail.mockResolvedValue(mockUser);
    const dto: CreateUserDto = {
      name: 'Test User',
      username: 'testuser',
      Birthdate: new Date('2000-01-01'),
      email: 'test@test.com',
      password: '1234',
    };
    await expect(controller.createUser(dto)).rejects.toThrow(ConflictException);
  });

  it('should throw ConflictException if username exists', async () => {
    usersService.findOneByEmail.mockResolvedValue(null);
    usersService.findOneByUsername.mockResolvedValue(mockUser);
    const dto: CreateUserDto = {
      name: 'Test User',
      username: 'testuser',
      Birthdate: new Date('2000-01-01'),
      email: 'test@test.com',
      password: '1234',
    };
    await expect(controller.createUser(dto)).rejects.toThrow(ConflictException);
  });

  it('should update user if ids match', async () => {
    usersService.update.mockResolvedValue(mockUser);
    const req = { user: { id: 1 } };
    const dto: UpdateUserDto = { name: 'Updated' };
    const result = await controller.updateUser(
      1,
      dto,
      req as AuthenticatedRequestDto,
    );
    expect(result).toEqual(mockUser);
  });

  it('should throw ForbiddenException if ids do not match', async () => {
    const req = { user: { id: 2 } };
    const dto: UpdateUserDto = { name: 'Updated' };
    await expect(
      controller.updateUser(1, dto, req as AuthenticatedRequestDto),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw ConflictException if username exists on update', async () => {
    usersService.findOneByUsername.mockResolvedValue({ ...mockUser, id: 2 });
    usersService.update.mockResolvedValue(mockUser);
    const req = { user: { id: 1 } };
    const dto: UpdateUserDto = { username: 'testuser' };
    await expect(
      controller.updateUser(1, dto, req as AuthenticatedRequestDto),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw NotFoundException if user not found on update', async () => {
    usersService.update.mockResolvedValue(null);
    const req = { user: { id: 1 } };
    const dto: UpdateUserDto = { name: 'Updated' };
    await expect(
      controller.updateUser(1, dto, req as AuthenticatedRequestDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('should admin update user', async () => {
    usersService.adminUpdateUser.mockResolvedValue(mockUser);
    const dto: AdminUpdateUserDto = { role: 'Admin' };
    const result = await controller.adminUpdateUser(1, dto);
    expect(result).toEqual(mockUser);
  });

  it('should delete user', async () => {
    usersService.findOne.mockResolvedValue(mockUser);
    usersService.remove.mockResolvedValue(undefined);
    const result = await controller.deleteUser(1);
    expect(result).toEqual({ message: 'User with id 1 has been deleted' });
  });

  it('should throw NotFoundException if user not found on delete', async () => {
    usersService.findOne.mockResolvedValue(null);
    await expect(controller.deleteUser(1)).rejects.toThrow(NotFoundException);
  });

  it('should create admin', async () => {
    usersService.createAdmin.mockResolvedValue(mockUser);
    const dto: CreateUserDto = {
      name: 'Test User',
      username: 'testuser',
      Birthdate: new Date('2000-01-01'),
      email: 'test@test.com',
      password: '1234',
    };
    const result = await controller.createAdmin(dto);
    expect(result).toEqual(mockUser);
  });
});
