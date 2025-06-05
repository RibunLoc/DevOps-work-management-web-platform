import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Complete project documentation',
    description: 'Title of the task'
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Write Swagger docs for all endpoints',
    description: 'Description of the task',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: false,
    description: 'Completion status of the task',
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the task has been started',
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isStarted?: boolean;

  @ApiProperty({
    example: '2023-12-31',
    description: 'Due date of the task',
    required: false
  })
  @IsOptional()
  @IsString()
  dueDate?: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the list this task belongs to',
    required: false
  })
  @IsOptional()
  @IsNumber()
  listId?: number;
}