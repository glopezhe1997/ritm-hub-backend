import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from 'src/artists/entities/artists.entity';
import { SpotifyApiService } from 'src/spotify/services/spotify-api/spotify-api.service';
import { Repository } from 'typeorm';
import { ArtistSpotifyDto } from 'src/artists/dto/spotify/artist-spotify.dto/artist-spotify.dto';
import { DeleteResultDto } from 'src/shared/dto/delete-result.dto/delete-result.dto';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
    private spotifyApiService: SpotifyApiService,
  ) {}

  //get all artists
  async getAllArtists(): Promise<Artist[]> {
    return this.artistsRepository.find();
  }

  // Get artist by internal id
  async getArtistByInternalId(internalId: number): Promise<Artist | null> {
    return this.artistsRepository.findOneBy({ id: internalId });
  }

  // Get artist by external id
  async getArtistByExternalId(externalId: string): Promise<Artist | null> {
    return this.artistsRepository.findOneBy({ external_id: externalId });
  }

  // Get artist by name
  async getArtistByName(name: string): Promise<Artist | null> {
    const local = await this.artistsRepository.findOneBy({ name });
    if (local) return local;

    // Si no está en la BBDD, buscar en Spotify y crear/recuperar
    const spotifyResult = await this.spotifyApiService.search<ArtistSpotifyDto>(
      name,
      'artist',
    );
    const spotifyArtist = spotifyResult.artists?.items?.[0];
    if (!spotifyArtist) return null;

    return this.findOrCreateArtistByExternalId(spotifyArtist.id);
  }

  // Get trending artists
  async getTrendingArtists(): Promise<ArtistSpotifyDto[]> {
    // Buscar artistas populares en Spotify
    const spotifyResult = await this.spotifyApiService.search<ArtistSpotifyDto>(
      'a', // Consulta genérica
      'artist',
    );

    // Devuelve directamente los datos de Spotify (SIN guardar)
    return spotifyResult.artists?.items.slice(0, 5) || [];
  }
  //
  async findOrCreateArtistByExternalId(
    externalId: string,
  ): Promise<Artist | null> {
    const existing = await this.getArtistByExternalId(externalId);
    if (existing) return existing;

    // Obtenir dades de Spotify per ID
    const spotifyData = await this.spotifyApiService.getArtistById(externalId);
    if (!spotifyData) return null;

    return this.createArtist(spotifyData);
  }

  // Create artist
  async createArtist(artistData: ArtistSpotifyDto): Promise<Artist> {
    // Create new artist
    const newArtist = this.artistsRepository.create({
      name: artistData.name,
      external_id: artistData.id,
      genres: artistData.genres,
      followers: artistData.followers.total,
      img_url: artistData.images?.[0]?.url || null,
    });
    return this.artistsRepository.save(newArtist);
  }

  // Delete artists
  async deleteArtist(internalId: number): Promise<DeleteResultDto> {
    const artistToDelete = await this.artistsRepository.delete(internalId);
    return { numberRowsAffected: artistToDelete.affected || 0 };
  }
}
