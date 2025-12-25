import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from '../../entities/playlist.entity';
import { SpotifyApiService } from 'src/spotify/services/spotify-api/spotify-api.service';
import { TracksService } from 'src/tracks/services/tracks/tracks.service';
import { Track } from 'src/tracks/entities/tracks.entity';
import { PlaylistSpotifyDto } from 'src/spotify/services/spotify-api/spotify-api.service';
import { TrackSpotifyDto } from 'src/tracks/dto/spotify/track-spotify.dto/track-spotify.dto';
import { PlaylistDto } from 'src/playlists/dto/playlist.dto/playlist.dto';
import { UserDto } from 'src/users/dto/user.dto/user.dto';
import { CreatePlaylistDto } from 'src/playlists/dto/create-playlist-dto/create-playlist-dto';
@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
    private spotifyApiService: SpotifyApiService,
    private tracksService: TracksService,
  ) {}

  async getPublicPlaylists(): Promise<Playlist[]> {
    return this.playlistRepository.find({
      where: { is_public: true },
      relations: ['tracks'],
    });
  }

  async getTrendingPlaylists(): Promise<PlaylistSpotifyDto[]> {
    // Buscar playlists públicas populares en Spotify
    const spotifyResult =
      await this.spotifyApiService.search<PlaylistSpotifyDto>(
        'a', // Consulta genérica
        'playlist',
      );

    // Devuelve solo las primeras 5 playlists (SIN guardar)
    return spotifyResult.playlists?.items.slice(0, 5) || [];
  }

  async getPrivatePlaylists(userId: number): Promise<Playlist[]> {
    return this.playlistRepository.find({
      where: { owner: { id: userId }, is_public: false },
      relations: ['tracks'],
    });
  }

  async getUserPlaylists(userId: number): Promise<Playlist[]> {
    return this.playlistRepository.find({
      where: { owner: { id: userId } },
      relations: ['tracks'],
    });
  }

  async getPlaylistById(id: number, userId?: number): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: ['owner', 'tracks'],
    });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    if (!playlist.is_public && playlist.owner?.id !== userId) {
      throw new ForbiddenException('No access');
    }
    return playlist;
  }

  async createPlaylist(
    data: CreatePlaylistDto,
    user: UserDto,
  ): Promise<Playlist> {
    const playlist = this.playlistRepository.create({
      name: data.name,
      description: data.description ?? undefined,
      images: data.images ?? [],
      is_public: data.is_public ?? false,
      owner: user,
      tracks: [],
    });
    console.log('Playlist a guardar:', playlist);
    return this.playlistRepository.save(playlist);
  }

  async deletePlaylist(playlistId: number, userId: number): Promise<void> {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      relations: ['owner'],
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (playlist.owner?.id !== userId) {
      throw new ForbiddenException('You can only delete your own playlists');
    }

    await this.playlistRepository.remove(playlist);
  }

  async findOrCreatePlaylistByExternalId(
    externalId: string,
  ): Promise<Playlist | null> {
    const existing = await this.playlistRepository.findOne({
      where: { external_id: externalId },
    });
    if (existing) return existing;

    const spotifyPlaylist: PlaylistSpotifyDto | null =
      await this.spotifyApiService.getPlaylistById(externalId);
    if (!spotifyPlaylist) return null;

    // Tipamos correctamente la respuesta de tracks
    const spotifyTracks: { track: TrackSpotifyDto }[] =
      await this.spotifyApiService.getPlaylistTracks(externalId);

    const tracks: Track[] = [];
    for (const item of spotifyTracks) {
      // Validar que el objeto track existe y tiene id string
      if (
        item.track &&
        typeof item.track.id === 'string' &&
        item.track.id.length > 0
      ) {
        const track = await this.tracksService.findOrCreateTrackByExternalId(
          item.track.id,
        );
        if (track) tracks.push(track);
      }
    }

    const playlist = this.playlistRepository.create({
      name: spotifyPlaylist.name,
      is_public: true,
      external_id: spotifyPlaylist.id,
      owner: undefined, // Usar undefined en vez de null para evitar error de tipado
      tracks,
    });
    return this.playlistRepository.save(playlist);
  }

  async addTrackToPlaylist(
    playlistId: number,
    trackExternalId: string,
    userId: number,
  ): Promise<Playlist> {
    const playlist = await this.getPlaylistById(playlistId, userId);
    const track =
      await this.tracksService.findOrCreateTrackByExternalId(trackExternalId);
    if (!track) throw new NotFoundException('Track not found');
    // Evitar duplicados
    if (!playlist.tracks.some((t) => t.id === track.id)) {
      playlist.tracks.push(track);
    }
    return this.playlistRepository.save(playlist);
  }

  async removeTrackFromPlaylist(
    playlistId: number,
    trackId: number,
    userId: number,
  ): Promise<Playlist> {
    const playlist = await this.getPlaylistById(playlistId, userId);
    console.log('trackId recibido:', trackId, 'tipo:', typeof trackId); // <-- Aquí ves valor y tipo
    const trackIdNum = Number(trackId);
    playlist.tracks = playlist.tracks.filter((t) => t.id !== trackIdNum);
    console.log(
      'Tracks después de filtrar:',
      playlist.tracks.map((t) => t.id),
    );
    return this.playlistRepository.save(playlist);
  }

  toPlaylistDto(playlist: Playlist): PlaylistDto {
    return {
      playlist_id: playlist.id,
      name: playlist.name,
      description: playlist.description ?? undefined,
      images: playlist.images ?? undefined,
      owner_id: playlist.owner?.id,
      is_public: playlist.is_public,
      external_id: playlist.external_id,
      createdAt: playlist.createdAt,
      tracks: (playlist.tracks ?? []).map((track) => ({
        id: track.id,
        title: track.title,
        duration_ms: track.duration_ms,
        album_id: track.album_id,
        external_id: track.external_id,
        preview_url: track.preview_url ?? '',
      })),
    };
  }
}
