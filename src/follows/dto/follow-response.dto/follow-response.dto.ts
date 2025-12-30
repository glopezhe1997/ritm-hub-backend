import { UserDto } from 'src/users/dto/user.dto/user.dto';

export class FollowResponseDto {
  response: string;
  user: UserDto | null;
}
