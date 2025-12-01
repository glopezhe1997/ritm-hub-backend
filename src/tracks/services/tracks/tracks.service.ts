import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from 'src/tracks/entities/tracks.entity';
import { TrackSpotifyDto } from 'src/tracks/dto/spotify/track-spotify.dto/track-spotify.dto';
import { SpotifyApiService } from 'src/spotify/services/spotify-api/spotify-api.service';
import { AlbumsService } from 'src/albums/services/albums/albums.service';
import { DeleteResultDto } from 'src/shared/dto/delete-result.dto/delete-result.dto';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    private spotifyApiService: SpotifyApiService,
    private albumsService: AlbumsService,
  ) {}

  // Get all tracks
  async getAllTracks(): Promise<Track[]> {
    return this.trackRepository.find({ relations: ['album_id'] });
  }

  // Get track by internal id
  async getTrackByInternalId(internalId: number): Promise<Track | null> {
    return this.trackRepository.findOne({
      where: { id: internalId },
      relations: ['album_id'],
    });
  }

  // Get track by external id
  async getTrackByExternalId(externalId: string): Promise<Track | null> {
    return this.trackRepository.findOne({
      where: { external_id: externalId },
      relations: ['album_id'],
    });
  }

  // Get track by title
  async getTrackByTitle(title: string): Promise<Track | null> {
    return this.trackRepository.findOne({
      where: { title },
      relations: ['album_id'],
    });
  }

  // Find or create track by external id
  async findOrCreateTrackByExternalId(
    externalId: string,
  ): Promise<Track | null> {
    const existing = await this.getTrackByExternalId(externalId);
    if (existing) return existing;

    const spotifyData = await this.spotifyApiService.getTrackById(externalId);
    if (!spotifyData) return null;

    return this.createTrack(spotifyData);
  }

  // Create track
  async createTrack(trackData: TrackSpotifyDto): Promise<Track> {
    // Comprova si ja existeix
    const existing = await this.getTrackByExternalId(trackData.id);
    if (existing) return existing;

    // Busca o crea l'àlbum automàticament
    const album = await this.albumsService.findOrCreateAlbumByExternalId(
      trackData.album.id,
    );
    if (!album) {
      throw new NotFoundException(
        `Album with Spotify ID ${trackData.album.id} not found`,
      );
    }

    const newTrack = this.trackRepository.create({
      title: trackData.name,
      duration_ms: trackData.duration_ms,
      preview_url: trackData.preview_url,
      album_id: album,
      external_id: trackData.id,
    });

    return this.trackRepository.save(newTrack);
  }

  // Delete track
  async deleteTrack(internalId: number): Promise<DeleteResultDto> {
    const result = await this.trackRepository.delete(internalId);
    return { numberRowsAffected: result.affected || 0 };
  }
}
