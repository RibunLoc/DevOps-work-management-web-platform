import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'oldPassword123',
    description: 'Current password'
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    example: 'newSecurePassword123',
    description: 'New password (min 8 characters)',
    minLength: 8
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}