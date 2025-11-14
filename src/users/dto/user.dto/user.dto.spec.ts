import { UserDto } from './user.dto';

describe('UserDto', () => {
  it('should be defined', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expect(new UserDto()).toBeDefined();
  });
});
