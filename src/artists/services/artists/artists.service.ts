import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from 'src/artists/entities/artists.entity';
import { SpotifyApiService } from 'src/spotify/services/spotify-api/spotify-api.service';
import { Repository } from 'typeorm';

class ArtistSpotify {
  id: string; // external id
  name: string;
  followers: { total: number };
  genres: string[];
  images: { url: string; height: number; width: number }[];
  type: string;
}

class deleteArtistDto {
  numberRowsAffected: number;
}

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

  // Create artist
  async createArtist(artistData: ArtistSpotify): Promise<Artist> {
    // Check if artist already exists
    const existingArtist = await this.getArtistByExternalId(artistData.id);
    if (existingArtist) {
      return existingArtist;
    }

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
  async deleteArtist(internalId: number): Promise<deleteArtistDto> {
    const artistToDelete = await this.artistsRepository.delete(internalId);
    return { numberRowsAffected: artistToDelete.affected || 0 };
  }
}
