// src/task/entities/subtask.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity('subtasks')
export class Subtask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ default: false })
  isCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Task, (task) => task.subtasks, { onDelete: 'CASCADE' })
  task: Task;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}