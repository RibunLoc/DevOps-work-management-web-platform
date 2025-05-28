import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Reset password token received via email',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'New password - must be at least 8 characters',
    example: 'newpassword123',
    minLength: 8
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}