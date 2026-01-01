import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/services/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findEntityByEmail: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should throw UnauthorizedException if user not found', async () => {
    (usersService.findEntityByEmail as jest.Mock).mockResolvedValue(null);

    await expect(
      authService.signIn({ email: 'test@test.com', password: '1234' }),
    ).rejects.toThrow(new UnauthorizedException('User not found'));
  });

  it('should throw UnauthorizedException if user is inactive', async () => {
    (usersService.findEntityByEmail as jest.Mock).mockResolvedValue({
      isActive: false,
      isBlocked: false,
    });

    await expect(
      authService.signIn({ email: 'test@test.com', password: '1234' }),
    ).rejects.toThrow(
      new UnauthorizedException('User is inactive, contact support'),
    );
  });

  it('should throw UnauthorizedException if user is blocked', async () => {
    (usersService.findEntityByEmail as jest.Mock).mockResolvedValue({
      isActive: true,
      isBlocked: true,
    });

    await expect(
      authService.signIn({ email: 'test@test.com', password: '1234' }),
    ).rejects.toThrow(
      new UnauthorizedException('User is blocked, contact support'),
    );
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    (usersService.findEntityByEmail as jest.Mock).mockResolvedValue({
      isActive: true,
      isBlocked: false,
      password: 'hashedPassword',
    });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    await expect(
      authService.signIn({ email: 'test@test.com', password: 'wrongPassword' }),
    ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
  });

  it('should return access_token if credentials are valid', async () => {
    const user = {
      id: 1,
      email: 'test@test.com',
      role: 'user',
      username: 'testuser',
      name: 'Test User',
      Birthdate: '2000-01-01',
      isActive: true,
      isBlocked: false,
      password: 'hashedPassword',
    };

    (usersService.findEntityByEmail as jest.Mock).mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    (jwtService.signAsync as jest.Mock).mockResolvedValue('mockAccessToken123');

    const result = await authService.signIn({
      email: 'test@test.com',
      password: '1234',
    });

    expect(result).toEqual({ access_token: 'mockAccessToken123' });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
      name: user.name,
      Birthdate: user.Birthdate,
    });
  });
});
