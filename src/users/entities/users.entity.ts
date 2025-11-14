import { Post } from 'src/posts/entities/posts.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  Birthdate: Date;

  @Column({ unique: true })
  email: string;

  // Hash the password before storing it
  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isBlocked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Post, (post) => post.owner)
  posts: Post[];
}
