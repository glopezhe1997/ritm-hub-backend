import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FollowResponseDto } from 'src/follows/dto/follow-response.dto/follow-response.dto';
import { FollowDto } from 'src/follows/dto/follow.dto/follow.dto';
import { FollowsService } from 'src/follows/services/follows/follows.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard/jwt-auth-guard';
import { AuthenticatedRequestDto } from 'src/shared/dto/authenticated-request.dto/authenticated-request.dto';
import { UserDto } from 'src/users/dto/user.dto/user.dto';

@UseGuards(JwtAuthGuard)
@Controller('follows')
export class FollowsController {
  constructor(private followsService: FollowsService) {}

  //Get Followers
  @Get('followers/:userId')
  async getFollowers(
    @Param('userId') userId: number,
    @Req() req: AuthenticatedRequestDto,
  ): Promise<UserDto[]> {
    const userRequesting = req.user.id;
    if (userRequesting !== userId) {
      throw new ConflictException('Cannot view followers of other users');
    }
    return this.followsService.getFollowers(userId);
  }

  // Follow User
  @Post('follow')
  @Post('follow')
  async followUser(
    @Body() followData: FollowDto,
    @Req() req: AuthenticatedRequestDto,
  ): Promise<FollowResponseDto> {
    const userRequesting = req.user.id;
    const user = await this.followsService.followUser(
      userRequesting,
      followData.followee_Id,
    );
    return {
      response: 'Followed user successfully',
      user,
    };
  }

  // Unfollow User
  @Post('unfollow')
  async unfollowUser(
    @Body() followData: FollowDto,
    @Req() req: AuthenticatedRequestDto,
  ): Promise<FollowResponseDto> {
    const userRequesting = req.user.id;
    await this.followsService.unfollowUser(
      userRequesting,
      followData.followee_Id,
    );
    return {
      response: 'Unfollowed user successfully',
      user: null,
    };
  }

  // Get Followees
  @Get('followees/:userId')
  async getFollowees(
    @Param('userId') userId: number,
    @Req() req: AuthenticatedRequestDto,
  ): Promise<UserDto[]> {
    const userRequesting = Number(req.user.id);
    userId = Number(userId);
    console.log('userRequesting:', userRequesting);
    console.log('userId:', userId);
    if (userRequesting !== userId) {
      throw new ConflictException('Cannot view followees of other users');
    }
    return this.followsService.getFollowees(userId);
  }
}
