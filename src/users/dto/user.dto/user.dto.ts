import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UserDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsDate()
  Birthdate: Date;

  @IsStrongPassword()
  @Exclude() // Exclude password from serialization
  password: string;

  @IsString()
  role: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isBlocked?: boolean;

  @IsDate()
  createdAt: Date;
}
