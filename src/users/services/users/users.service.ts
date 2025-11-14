import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUpdateUserDto } from 'src/users/dto/admin-update-user.dto/admin-update-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto/update-user.dto';
import { UserDto } from 'src/users/dto/user.dto/user.dto';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserDto[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserDto | null> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<UserDto | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findOneByUsername(username: string): Promise<UserDto | null> {
    return await this.usersRepository.findOneBy({ username });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(user: CreateUserDto): Promise<UserDto> {
    const newUser = this.usersRepository.create({
      ...user,
      role: 'user',
    });
    return await this.usersRepository.save(newUser);
  }

  async update(id: number, updateData: UpdateUserDto): Promise<UserDto | null> {
    await this.usersRepository.update(id, updateData);
    return this.usersRepository.findOneBy({ id });
  }

  //Let admin update users data
  async adminUpdateUser(
    id: number,
    updateData: AdminUpdateUserDto,
  ): Promise<UserDto | null> {
    await this.usersRepository.update(id, updateData);
    return this.usersRepository.findOneBy({ id });
  }
}
