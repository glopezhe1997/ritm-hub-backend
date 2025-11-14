import { IsDate, IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsDate()
  Birthdate: Date;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  username: string;
}
