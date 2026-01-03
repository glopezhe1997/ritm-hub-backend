import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { Track } from 'src/tracks/entities/tracks.entity';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | undefined;

  @Column('text', { array: true, nullable: true })
  images?: string[];

  @Column({ default: false })
  is_public: boolean;

  @Column({ nullable: true })
  external_id?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner?: User;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Track)
  @JoinTable({
    name: 'playlist_tracks',
    joinColumn: { name: 'playlist_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'track_id', referencedColumnName: 'id' },
  })
  tracks: Track[];
}
