import { IsEnum, IsNotEmpty } from 'class-validator';

export enum SharedRole {
  VIEWER = 'viewer',
  EDITOR = 'editor',
  ADMIN = 'admin',
}

export class UpdateSharedRoleDto {
  @IsEnum(SharedRole, { message: 'Role must be viewer, editor, or admin' })
  @IsNotEmpty({ message: 'Role is required' })
  role: SharedRole;
}