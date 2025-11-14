import { Track } from 'src/tracks/entities/tracks.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  post_id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ManyToOne(() => Track, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'track_id' })
  track: Track;

  // TODO: Cal afegir la relacio inversa a track si es volen obtenir els posts d'una track
}
