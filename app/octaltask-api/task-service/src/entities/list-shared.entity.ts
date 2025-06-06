import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { List } from './list.entity';
import { User } from './user.entity';

export enum SharedRole {
  VIEWER = 'viewer',
  EDITOR = 'editor',
  ADMIN = 'admin',
}

@Entity('list_shared')
export class ListShared {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => List, (list) => list.sharedUsers, { onDelete: 'CASCADE' })
  list: List;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: SharedRole })
  role: SharedRole;

  @Column()
  sharedBy: number; // ID của user chia sẻ

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}