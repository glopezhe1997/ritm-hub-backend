import {
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';

@Entity()
export class Follow {
  @PrimaryColumn()
  follower_Id: number;

  @PrimaryColumn()
  followee_Id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'followee_id' })
  followee: User;

  @CreateDateColumn()
  created_At: Date;
}
