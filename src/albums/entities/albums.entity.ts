import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Artist } from '../../artists/entities/artists.entity';
import { Track } from 'src/tracks/entities/tracks.entity';

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  img_url: string | null;

  @ManyToOne(() => Artist, (artist) => artist.albums)
  @JoinColumn({ name: 'artist_id' })
  artist_id: Artist;

  @Column()
  external_id: string;

  @OneToMany(() => Track, (tracks) => tracks.album_id)
  tracks: Track[];
}
