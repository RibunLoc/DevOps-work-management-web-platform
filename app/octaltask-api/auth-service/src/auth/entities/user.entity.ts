import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true, type: 'datetime' })
  resetTokenExpires: Date | null;;
}
