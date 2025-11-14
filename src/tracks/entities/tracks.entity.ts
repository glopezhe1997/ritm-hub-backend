import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Album } from '../../albums/entities/albums.entity';

@Entity()
export class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  duration_ms: number;

  @ManyToOne(() => Album, (album) => album.tracks)
  @JoinColumn({ name: 'album_id' })
  album_id: number;

  @Column()
  external_id: string;

  @Column()
  preview_url: string;
}
