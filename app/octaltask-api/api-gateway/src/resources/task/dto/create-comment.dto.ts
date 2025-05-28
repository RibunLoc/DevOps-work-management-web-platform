// src/task/dto/create-comment.dto.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Content of the comment',
    example: 'This task is progressing well!',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  content: string;
}