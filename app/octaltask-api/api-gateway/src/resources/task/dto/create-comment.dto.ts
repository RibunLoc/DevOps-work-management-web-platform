import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    example: 'This task needs more details',
    description: 'Content of the comment',
    minLength: 1
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  content: string;
}