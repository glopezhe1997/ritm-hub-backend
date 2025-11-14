import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Playlist } from '../../playlists/entities/playlist.entity';
import { Track } from '../../tracks/entities/tracks.entity';

@Entity()
export class PlaylistTrack {
  @PrimaryColumn()
  playlist_id: number;

  @PrimaryColumn()
  track_id: number;

  @ManyToOne(() => Playlist, (playlist) => playlist.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'playlist_id' })
  playlist: Playlist;

  @ManyToOne(() => Track, (track) => track.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'track_id' })
  track: Track;

  @Column()
  position: number;
}
