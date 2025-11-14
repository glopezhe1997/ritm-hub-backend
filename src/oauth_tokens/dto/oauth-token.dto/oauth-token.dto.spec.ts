import { OauthTokenDto } from './oauth-token.dto';

describe('OauthTokenDto', () => {
  it('should be defined', () => {
    expect(new OauthTokenDto()).toBeDefined();
  });
});
