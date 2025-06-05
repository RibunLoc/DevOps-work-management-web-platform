import { IsBoolean, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubtaskDto {
  @ApiProperty({
    example: 'Research Swagger documentation',
    description: 'Content of the subtask',
    minLength: 1
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  content: string;

  @ApiProperty({
    example: false,
    description: 'Completion status of the subtask'
  })
  @IsNotEmpty()
  @IsBoolean()
  isCompleted: boolean;
}