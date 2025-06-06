import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum SharedRole {
  VIEWER = 'viewer',
  EDITOR = 'editor',
  ADMIN = 'admin',
}

export class UpdateSharedRoleDto {
  @ApiProperty({
    example: 'editor',
    enum: SharedRole,
    description: 'New role to assign',
  })
  @IsEnum(SharedRole, { message: 'Role must be viewer, editor, or admin' })
  @IsNotEmpty({ message: 'Role is required' })
  role: SharedRole;
}