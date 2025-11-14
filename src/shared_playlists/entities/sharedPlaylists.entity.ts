import { Playlist } from 'src/playlists/entities/playlist.entity';
import { User } from 'src/users/entities/users.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class SharedPlaylists {
  @PrimaryColumn()
  shared_by_user_id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shared_by_user_id' })
  shared_by_user: User;

  @PrimaryColumn()
  shared_with_user_id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shared_with_user_id' })
  shared_with_user: User;

  @PrimaryColumn()
  playlist_id: number;

  @ManyToOne(() => Playlist, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'playlist_id' })
  playlist: Playlist;

  @CreateDateColumn()
  shared_at: Date;
}
