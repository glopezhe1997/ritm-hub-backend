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
  @JoinColumn({ name: 'follower_Id' })
  follower: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'followee_Id' })
  followee: User;

  @CreateDateColumn()
  created_At: Date;
}
