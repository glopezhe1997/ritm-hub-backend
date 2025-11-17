import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';

export enum FavoriteType {
  TRACK = 'track',
  ALBUM = 'album',
  ARTIST = 'artist',
  PLAYLIST = 'playlist',
}

@Entity()
export class Favorite {
  @PrimaryColumn()
  external_id!: string;

  @PrimaryColumn({
    type: 'enum',
    enum: FavoriteType,
  })
  type!: FavoriteType;

  @PrimaryColumn()
  user_id!: number;

  @ManyToOne(() => User, (user) => user.favorites, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
