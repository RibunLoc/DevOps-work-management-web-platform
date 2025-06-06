import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';

export class AdminUpdateUserDto extends UpdateUserDto {
  @ApiProperty({
    required: false,
    example: 'admin',
    description: 'User role (user/admin)'
  })
  @IsOptional()
  @IsString()
  role?: string;
}