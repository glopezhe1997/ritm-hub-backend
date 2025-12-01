import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { AlbumsService } from 'src/albums/services/albums/albums.service';
import { AlbumDto } from 'src/albums/dto/album.dto/album.dto';
import { DeleteResultDto } from 'src/shared/dto/delete-result.dto/delete-result.dto';
import { Album } from 'src/albums/entities/albums.entity';

@Controller('albums')
export class AlbumsController {
  constructor(private albumService: AlbumsService) {}

  // Mètode auxiliar per transformar a DTO
  private toDto(album: Album): AlbumDto {
    return {
      id: album.id,
      name: album.name,
      artist_id: album.artist_id,
      external_id: album.external_id,
      img_url: album.img_url,
    };
  }

  // Get all albums
  @Get()
  async getAllAlbums(): Promise<AlbumDto[]> {
    const albums = await this.albumService.getAllAlbums();
    return albums.map((album) => this.toDto(album));
  }

  // Get album by internal id
  @Get('by-id/:id')
  async getAlbumById(@Param('id') internalId: number): Promise<AlbumDto> {
    const album = await this.albumService.getAlbumByInternalId(internalId);
    if (!album) throw new NotFoundException('Album not found');
    return this.toDto(album);
  }

  // Get album by name
  @Get('by-name/:name')
  async getAlbumByName(@Param('name') name: string): Promise<AlbumDto> {
    const album = await this.albumService.getAlbumByName(name);
    if (!album) throw new NotFoundException('Album not found');
    return this.toDto(album);
  }

  // Find or create album by external id
  @Get('insert/:externalId')
  async findOrCreateAlbumByExternalId(
    @Param('externalId') externalId: string,
  ): Promise<AlbumDto | null> {
    const album =
      await this.albumService.findOrCreateAlbumByExternalId(externalId);
    return album ? this.toDto(album) : null;
  }

  // Delete album
  @Delete(':id')
  async deleteAlbum(@Param('id') internalId: number): Promise<DeleteResultDto> {
    const album = await this.albumService.getAlbumByInternalId(internalId);
    if (!album) throw new NotFoundException('Album not found');
    return this.albumService.deleteAlbum(internalId);
  }
}
