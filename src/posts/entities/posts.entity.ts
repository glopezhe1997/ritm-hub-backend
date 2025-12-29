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

export enum PostStatus {
  HAPPY = 'happy',
  SAD = 'sad',
  ANGRY = 'angry',
  EXCITED = 'excited',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  post_id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.HAPPY,
  })
  status: PostStatus;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner' })
  owner: User;

  @ManyToOne(() => Track, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'track' })
  track: Track;

  // TODO: Cal afegir la relacio inversa a track si es volen obtenir els posts d'una track
}
