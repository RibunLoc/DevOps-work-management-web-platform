import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'bb168872-46d2-4d4c-8a25-21b0de4ab251',
    description: 'Password reset token received via email',
  })
  @IsString()
  token: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'New password (min 8 characters)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}