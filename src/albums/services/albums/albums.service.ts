import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumSpotifyDto } from 'src/albums/dto/spotify/album-spotify.dto/album-spotify.dto';
import { Album } from 'src/albums/entities/albums.entity';
import { ArtistsService } from 'src/artists/services/artists/artists.service';
import { SpotifyApiService } from 'src/spotify/services/spotify-api/spotify-api.service';
import { DeleteResultDto } from 'src/shared/dto/delete-result.dto/delete-result.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    private spotifyApiService: SpotifyApiService,
    private artistsService: ArtistsService,
  ) {}

  // Get all albums
  async getAllAlbums(): Promise<Album[]> {
    return this.albumRepository.find({ relations: ['artist_id'] });
  }

  // Get album by internal id
  async getAlbumByInternalId(internalId: number): Promise<Album | null> {
    return this.albumRepository.findOne({
      where: { id: internalId },
      relations: ['artist_id'],
    });
  }

  // Get album by external id
  async getAlbumByExternalId(externalId: string): Promise<Album | null> {
    return this.albumRepository.findOne({
      where: { external_id: externalId },
      relations: ['artist_id'],
    });
  }

  // Get album by name
  async getAlbumByName(name: string): Promise<Album | null> {
    return this.albumRepository.findOne({
      where: { name },
      relations: ['artist_id'],
    });
  }

  // Find or create album by external id
  async findOrCreateAlbumByExternalId(
    externalId: string,
  ): Promise<Album | null> {
    const existing = await this.getAlbumByExternalId(externalId);
    if (existing) return existing;

    const spotifyData = await this.spotifyApiService.getAlbumById(externalId);
    if (!spotifyData) return null;

    return this.createAlbum(spotifyData);
  }

  // Create album
  async createAlbum(albumData: AlbumSpotifyDto): Promise<Album> {
    // Comprova si ja existeix (evita duplicats)
    const existing = await this.getAlbumByExternalId(albumData.id);
    if (existing) return existing;

    // Busca o crea l'artista automàticament
    const artist = await this.artistsService.findOrCreateArtistByExternalId(
      albumData.artists[0]?.id,
    );
    if (!artist) {
      throw new NotFoundException(
        `Artist with Spotify ID ${albumData.artists[0]?.id} not found`,
      );
    }

    const newAlbum = this.albumRepository.create({
      name: albumData.name,
      artist_id: artist,
      external_id: albumData.id,
      img_url: albumData.images?.[0]?.url || null,
    });

    return this.albumRepository.save(newAlbum);
  }

  // Delete album
  async deleteAlbum(internalId: number): Promise<DeleteResultDto> {
    const result = await this.albumRepository.delete(internalId);
    return { numberRowsAffected: result.affected || 0 };
  }
}
