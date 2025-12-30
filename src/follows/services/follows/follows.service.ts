import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { FollowDto } from 'src/follows/dto/follow.dto/follow.dto';
import { Follow } from 'src/follows/entities/follows.entity';
import { UserDto } from 'src/users/dto/user.dto/user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private followsRepository: Repository<Follow>,
  ) {}

  // Follow user
  async followUser(followData: FollowDto): Promise<UserDto> {
    const exists = await this.followsRepository.findOneBy({
      follower_Id: followData.follower_Id,
      followee_Id: followData.followee_Id,
    });
    if (exists) throw new ConflictException('Already following');

    const follow = this.followsRepository.create({
      follower_Id: followData.follower_Id,
      followee_Id: followData.followee_Id,
    });
    await this.followsRepository.save(follow);

    // Carga el usuario seguido (followee)
    const followee = await this.followsRepository.manager.findOne('User', {
      where: { id: followData.followee_Id },
    });
    return plainToInstance(UserDto, followee);
  }

  // Unfollow user
  async unfollowUser(followerId: number, followeeId: number): Promise<void> {
    const exists = await this.followsRepository.findOneBy({
      follower_Id: followerId,
      followee_Id: followeeId,
    });

    if (!exists) throw new ConflictException('Not following');

    await this.followsRepository.delete({
      follower_Id: followerId,
      followee_Id: followeeId,
    });
  }

  // Get followers of a user
  async getFollowers(userId: number): Promise<UserDto[]> {
    const follows = await this.followsRepository.find({
      where: { followee_Id: userId },
      relations: ['follower'],
    });
    return follows.map((f) => plainToInstance(UserDto, f.follower));
  }

  // Get followees of a user
  async getFollowees(userId: number): Promise<UserDto[]> {
    const follows = await this.followsRepository.find({
      where: { follower_Id: userId },
      relations: ['followee'],
    });
    return follows.map((f) => plainToInstance(UserDto, f.followee));
  }
}
