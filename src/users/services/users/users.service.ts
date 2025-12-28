import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminUpdateUserDto } from 'src/users/dto/admin-update-user.dto/admin-update-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto/update-user.dto';
import { UserDto } from 'src/users/dto/user.dto/user.dto';
import { User } from 'src/users/entities/users.entity';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserDto[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => plainToInstance(UserDto, user));
  }

  async findOne(id: number): Promise<UserDto | null> {
    const user = await this.usersRepository.findOneBy({ id });
    return user ? plainToInstance(UserDto, user) : null;
  }

  async searchUsers(query: string): Promise<UserDto[]> {
    const users = await this.usersRepository.find({
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
      select: ['id', 'username', 'email'],
    });
    return users.map((user) => plainToInstance(UserDto, user));
  }

  async findOneByEmail(email: string): Promise<UserDto | null> {
    const user = await this.usersRepository.findOneBy({ email });
    return user ? plainToInstance(UserDto, user) : null;
  }

  async findOneByUsername(username: string): Promise<UserDto | null> {
    const user = await this.usersRepository.findOneBy({ username });
    return user ? plainToInstance(UserDto, user) : null;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  // InternUse
  async findEntityByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findEntityByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ username });
  }

  async create(user: CreateUserDto): Promise<UserDto> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.usersRepository.create({
      ...user,
      password: hashedPassword,
      role: 'user',
    });
    const savedUser = await this.usersRepository.save(newUser);
    return plainToInstance(UserDto, savedUser);
  }

  async update(id: number, updateData: UpdateUserDto): Promise<UserDto | null> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    await this.usersRepository.update(id, updateData);
    const updatedUser = await this.usersRepository.findOneBy({ id });
    return updatedUser ? plainToInstance(UserDto, updatedUser) : null;
  }

  async adminUpdateUser(
    id: number,
    updateData: AdminUpdateUserDto,
  ): Promise<UserDto | null> {
    await this.usersRepository.update(id, updateData);
    const updatedUser = await this.usersRepository.findOneBy({ id });
    return updatedUser ? plainToInstance(UserDto, updatedUser) : null;
  }

  // Create admin user
  async createAdmin(user: CreateUserDto): Promise<UserDto> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.usersRepository.create({
      ...user,
      password: hashedPassword,
      role: 'admin', // <-- Aquí el rol es admin
    });
    const savedUser = await this.usersRepository.save(newUser);
    return plainToInstance(UserDto, savedUser);
  }

  //Inactive user
  async deactivateUser(id: number): Promise<UserDto | null> {
    await this.usersRepository.update(id, { isActive: false });
    const updatedUser = await this.usersRepository.findOneBy({ id });
    return updatedUser ? plainToInstance(UserDto, updatedUser) : null;
  }

  // Activate user
  async activateUser(id: number): Promise<UserDto | null> {
    await this.usersRepository.update(id, { isActive: true });
    const updatedUser = await this.usersRepository.findOneBy({ id });
    return updatedUser ? plainToInstance(UserDto, updatedUser) : null;
  }

  //Block user
  async blockUser(id: number): Promise<UserDto | null> {
    await this.usersRepository.update(id, { isBlocked: true });
    const updatedUser = await this.usersRepository.findOneBy({ id });
    return updatedUser ? plainToInstance(UserDto, updatedUser) : null;
  }

  // Unblock user
  async unblockUser(id: number): Promise<UserDto | null> {
    await this.usersRepository.update(id, { isBlocked: false });
    const updatedUser = await this.usersRepository.findOneBy({ id });
    return updatedUser ? plainToInstance(UserDto, updatedUser) : null;
  }

  // Count users
  async countUsers(): Promise<number> {
    return this.usersRepository.count();
  }

  // Count active users
  async countActiveUsers(): Promise<number> {
    return this.usersRepository.count({ where: { isActive: true } });
  }

  // Count deactived users
  async countDeactivatedUsers(): Promise<number> {
    return this.usersRepository.count({ where: { isActive: false } });
  }
}
