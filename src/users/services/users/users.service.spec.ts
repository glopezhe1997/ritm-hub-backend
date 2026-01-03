import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const userEntity = {
  id: 1,
  name: 'Test User',
  username: 'testuser',
  Birthdate: new Date('2000-01-01'),
  email: 'test@test.com',
  password: 'hashedPassword',
  role: 'user',
  isActive: true,
  isBlocked: false,
  createdAt: new Date(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
    (repo.create as jest.Mock).mockReturnValue({ ...userEntity });
    (repo.save as jest.Mock).mockResolvedValue({ ...userEntity });

    const result = await service.create({
      name: 'Test User',
      username: 'testuser',
      Birthdate: new Date('2000-01-01'),
      email: 'test@test.com',
      password: 'plainPassword',
    });

    expect(result).toHaveProperty('id', 1);
    expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);
  });

  it('should find a user by id', async () => {
    (repo.findOneBy as jest.Mock).mockResolvedValue(userEntity);
    const result = await service.findOne(1);
    expect(result).toHaveProperty('id', 1);
  });

  it('should return null if user not found by id', async () => {
    (repo.findOneBy as jest.Mock).mockResolvedValue(null);
    const result = await service.findOne(999);
    expect(result).toBeNull();
  });

  it('should update a user', async () => {
    (repo.update as jest.Mock).mockResolvedValue(undefined);
    (repo.findOneBy as jest.Mock).mockResolvedValue(userEntity);

    const result = await service.update(1, { name: 'Updated' });
    expect(result).toHaveProperty('id', 1);
  });

  it('should block a user', async () => {
    (repo.update as jest.Mock).mockResolvedValue(undefined);
    (repo.findOneBy as jest.Mock).mockResolvedValue({
      ...userEntity,
      isBlocked: true,
    });

    const result = await service.blockUser(1);
    expect(result).toHaveProperty('isBlocked', true);
  });

  it('should throw if changing to invalid role', async () => {
    await expect(service.changeUserRole(1, 'invalid')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw if user not found when changing role', async () => {
    (repo.findOneBy as jest.Mock).mockResolvedValue(null);
    await expect(service.changeUserRole(1, 'admin')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw if user already has the role', async () => {
    (repo.findOneBy as jest.Mock).mockResolvedValue({
      ...userEntity,
      role: 'admin',
    });
    await expect(service.changeUserRole(1, 'admin')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should change user role', async () => {
    (repo.findOneBy as jest.Mock).mockResolvedValue({
      ...userEntity,
      role: 'user',
    });
    (repo.save as jest.Mock).mockResolvedValue({
      ...userEntity,
      role: 'admin',
    });

    const result = await service.changeUserRole(1, 'admin');
    expect(result).toHaveProperty('role', 'admin');
  });

  it('should count users', async () => {
    (repo.count as jest.Mock).mockResolvedValue(5);
    const result = await service.countUsers();
    expect(result).toBe(5);
  });
});
