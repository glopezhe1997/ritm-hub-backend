import { Request } from 'express';
import { UserDto } from 'src/users/dto/user.dto/user.dto';

export class AuthenticatedRequestDto extends Request {
  user: UserDto;
}
