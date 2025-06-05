import { IsOptional, IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({
    required: false,
    example: 'new.email@example.com',
    description: 'New email address'
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    required: false,
    example: 'New Name',
    description: 'New display name'
  })
  @IsOptional()
  @IsString()
  name?: string;
}