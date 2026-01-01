import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return access_token on valid credentials', async () => {
    const mockToken = { access_token: 'token123' };
    (authService.signIn as jest.Mock).mockResolvedValue(mockToken);

    const result = await controller.signIn({
      email: 'test@test.com',
      password: '1234',
    });
    expect(result).toEqual(mockToken);
    expect(authService.signIn as jest.Mock).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: '1234',
    });
  });

  it('should throw UnauthorizedException on invalid credentials', async () => {
    (authService.signIn as jest.Mock).mockResolvedValue(null);

    await expect(
      controller.signIn({ email: 'test@test.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
