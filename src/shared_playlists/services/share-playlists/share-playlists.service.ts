import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SharedPlaylists } from 'src/shared_playlists/entities/sharedPlaylists.entity';
import { Playlist } from 'src/playlists/entities/playlist.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PlaylistDto } from 'src/playlists/dto/playlist.dto/playlist.dto';

@Injectable()
export class SharePlaylistsService {
  constructor(
    @InjectRepository(SharedPlaylists)
    private sharedPlaylistsRepository: Repository<SharedPlaylists>,
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,
  ) {}

  async sharePlaylist(
    playlistId: number,
    userSharingId: number,
    userSharedWithId: number,
  ): Promise<SharedPlaylists> {
    if (userSharingId === userSharedWithId) {
      throw new BadRequestException('Cannot share playlist with oneself.');
    }
    if (!playlistId || !userSharingId || !userSharedWithId) {
      throw new BadRequestException(
        'Invalid parameters provided for sharing playlist.',
      );
    }

    // Comprobación de permisos: solo el owner puede compartir
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      relations: ['owner'],
    });
    if (!playlist) {
      throw new BadRequestException('Playlist not found.');
    }
    if (playlist.owner?.id !== userSharingId) {
      throw new ForbiddenException('You can only share your own playlists.');
    }

    const existingShare = await this.sharedPlaylistsRepository.findOne({
      where: {
        playlist_id: playlistId,
        shared_by_user_id: userSharingId,
        shared_with_user_id: userSharedWithId,
      },
    });
    if (existingShare) {
      throw new ConflictException(
        'Playlist has already been shared with this user.',
      );
    }
    const sharedPlaylist = this.sharedPlaylistsRepository.create({
      playlist_id: playlistId,
      shared_by_user_id: userSharingId,
      shared_with_user_id: userSharedWithId,
    });
    return this.sharedPlaylistsRepository.save(sharedPlaylist);
  }

  // Show all shared playlists for a user
  async getSharedPlaylistsForUser(userId: number): Promise<PlaylistDto[]> {
    const shared = await this.sharedPlaylistsRepository.find({
      where: { shared_with_user_id: userId },
      relations: ['playlist', 'playlist.owner', 'playlist.tracks'],
    });
    return shared.map((p) => ({
      playlist_id: p.playlist.id,
      name: p.playlist.name,
      description: p.playlist.description,
      images: p.playlist.images,
      owner_id: p.playlist.owner?.id,
      is_public: p.playlist.is_public,
      external_id: p.playlist.external_id,
      createdAt: p.playlist.createdAt,
      tracks: (p.playlist.tracks ?? []).map((track) => ({
        id: track.id,
        title: track.title,
        duration_ms: track.duration_ms,
        album_id: track.album_id,
        external_id: track.external_id,
        preview_url: track.preview_url ?? '',
      })),
    }));
  }
}
