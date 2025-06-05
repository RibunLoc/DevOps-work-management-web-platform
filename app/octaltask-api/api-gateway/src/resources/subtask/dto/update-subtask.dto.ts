import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubtaskDto {
  @ApiProperty({
    required: false,
    example: 'Buy materials',
    description: 'Updated content of the subtask'
  })
  @IsString()
  @IsNotEmpty()
  content?: string;

  @ApiProperty({
    required: false,
    example: true,
    description: 'Updated completion status of the subtask'
  })
  @IsBoolean()
  @IsNotEmpty()
  isCompleted?: boolean;
}