import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  email: string;

  // Hash the password before storing it
  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  isActive: boolean;

  @Column()
  isBlocked: boolean;

  @Column()
  createdAt: Date;
}
