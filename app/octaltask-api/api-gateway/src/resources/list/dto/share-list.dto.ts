import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum SharedRole {
  VIEWER = 'viewer',
  EDITOR = 'editor',
  ADMIN = 'admin',
}

export class ShareListDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email of the user to share the list with',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'editor',
    enum: SharedRole,
    description: 'Role to assign to the shared user',
  })
  @IsEnum(SharedRole, { message: 'Role must be viewer, editor, or admin' })
  @IsNotEmpty({ message: 'Role is required' })
  role: SharedRole;
}