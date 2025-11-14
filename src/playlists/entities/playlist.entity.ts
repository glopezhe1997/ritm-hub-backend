import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  is_public: boolean;

  @Column({ nullable: true })
  external_id?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner?: User;

  @CreateDateColumn()
  createdAt: Date;
}
