import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export enum SharedRole {
  VIEWER = 'viewer',
  EDITOR = 'editor',
  ADMIN = 'admin',
}

export class ShareListDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsEnum(SharedRole, { message: 'Role must be viewer, editor, or admin' })
  @IsNotEmpty({ message: 'Role is required' })
  role: SharedRole;
}