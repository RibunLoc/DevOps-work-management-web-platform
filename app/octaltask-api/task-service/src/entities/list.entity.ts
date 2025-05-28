// src/task/entities/list.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne } from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

export type ListType = 'personal' | 'work' | 'home' | 'study' | 'default';
export type ListColor = 'blue' | 'green' | 'red' | 'purple' | 'amber';

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['personal', 'work', 'home', 'study', 'default'] })
  icon: ListType;

  @Column({ type: 'enum', enum: ['blue', 'green', 'red', 'purple', 'amber'] })
  color: ListColor;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @OneToMany(() => Task, (task) => task.list)
  tasks: Task[];

  @ManyToOne(() => User, (user) => user.lists, { onDelete: 'CASCADE' })
  user: User;

  createdBy: any;
}