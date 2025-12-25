import { Test, TestingModule } from '@nestjs/testing';
import { SharePlaylistsService } from './share-playlists.service';

describe('SharePlaylistsService', () => {
  let service: SharePlaylistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharePlaylistsService],
    }).compile();

    service = module.get<SharePlaylistsService>(SharePlaylistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
