import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';

@Entity()
export class OauthTokens {
  @PrimaryColumn()
  user_id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @PrimaryColumn()
  provider: string;

  @Column()
  access_token: string;

  @Column()
  refresh_token: string;

  @Column({ type: 'timestamp' })
  expires_at: Date;
}
