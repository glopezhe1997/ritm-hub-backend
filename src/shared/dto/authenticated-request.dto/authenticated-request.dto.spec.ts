import { AuthenticatedRequestDto } from './authenticated-request.dto';

describe('AuthenticatedRequestDto', () => {
  it('should be defined', () => {
    expect(new AuthenticatedRequestDto()).toBeDefined();
  });
});
