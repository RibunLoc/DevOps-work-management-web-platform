// src/task/entities/task.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import {Subtask} from './subtask.entity'
import { List } from './list.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({default:false})
  isImportant:boolean;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  user: User;
  
  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  @OneToMany(() => Subtask, (subtask) => subtask.task)
  subtasks: Subtask[];

  @ManyToOne(() => List, (list) => list.tasks, { onDelete: 'SET NULL', nullable: true })
  list: List;
  
  createdBy: any;
}