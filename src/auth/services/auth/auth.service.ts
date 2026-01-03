import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from 'src/auth/dto/sign-in.dto/sign-in.dto';
import { UsersService } from 'src/users/services/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Sign In
  async signIn(signInData: SignInDto): Promise<{ access_token: string }> {
    // Find user by email
    const user = await this.usersService.findEntityByEmail(signInData.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    //Inactive user
    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive, contact support');
    }

    //Blocked user
    if (user.isBlocked) {
      throw new UnauthorizedException('User is blocked, contact support');
    }

    // Compare passwords
    const passwordValid = await bcrypt.compare(
      signInData.password,
      user.password,
    );
    // Validate password
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
      name: user.name,
      Birthdate: user.Birthdate,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
