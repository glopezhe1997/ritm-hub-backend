import { Album } from 'src/albums/entities/albums.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  external_id: string;

  @OneToMany(() => Album, (album) => album.artist_id)
  albums: Album[];
}
