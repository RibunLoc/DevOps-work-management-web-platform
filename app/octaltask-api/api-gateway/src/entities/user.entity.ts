import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Task } from './task.entity';
import { List } from './list.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export class TokenResponseSchema {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  accessToken: string;
}

export class MessageResponseSchema {
  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully'
  })
  message: string;
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'User ID',
    example: 1
  })
  id: number;

  @Column({ unique: true })
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe'
  })
  name: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  @ApiProperty({
    description: 'User role',
    enum: Role,
    example: Role.USER
  })
  role: Role;

  @OneToMany(() => Task, (task) => task.createdBy)
  tasks: Task[];

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true, type: 'datetime' })
  resetTokenExpires: Date | null;

  @OneToMany(() => List, (list) => list.createdBy)
  lists: List[];
}