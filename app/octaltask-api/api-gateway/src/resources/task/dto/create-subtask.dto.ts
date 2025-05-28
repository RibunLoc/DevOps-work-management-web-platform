// src/task/dto/create-Subtask.dto.ts
import { IsBoolean, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubtaskDto {
  @ApiProperty({
    description: 'Content of the Subtask',
    example: 'This task is progressing well!',
    required: true
  })
  
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  content: string;

  @IsNotEmpty()
  @IsBoolean()
  isCompleted: boolean;
}