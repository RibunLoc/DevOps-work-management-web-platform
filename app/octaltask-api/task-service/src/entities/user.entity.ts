import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from './task.entity';
import { List } from './list.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  name: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @OneToMany(() => Task, (task) => task.createdBy)
  tasks: Task[];
  
  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true, type: 'datetime' })
  resetTokenExpires: Date | null;;

  @OneToMany(() => List, (list) => list.createdBy)
  lists: List[];
}
