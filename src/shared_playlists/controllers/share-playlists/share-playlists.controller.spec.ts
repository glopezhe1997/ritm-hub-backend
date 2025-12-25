import { Test, TestingModule } from '@nestjs/testing';
import { SharePlaylistsController } from './share-playlists.controller';

describe('SharePlaylistsController', () => {
  let controller: SharePlaylistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SharePlaylistsController],
    }).compile();

    controller = module.get<SharePlaylistsController>(SharePlaylistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
