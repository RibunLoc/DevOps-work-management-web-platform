import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

type ListType = 'personal' | 'work' | 'home' | 'study' | 'default';
type ListColor = 'blue' | 'green' | 'red' | 'purple' | 'amber';

export class CreateListDto {
  @ApiProperty({ example: 'My List', description: 'The name of the list' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'work',
    enum: ['personal', 'work', 'home', 'study', 'default'],
    required: false,
    description: 'Icon representing the list',
  })
  @IsString()
  @IsOptional()
  icon: ListType;

  @ApiProperty({
    example: 'blue',
    enum: ['blue', 'green', 'red', 'purple', 'amber'],
    required: false,
    description: 'Color of the list',
  })
  @IsString()
  @IsOptional()
  color: ListColor;

  @ApiProperty({
    example: '2023-12-31',
    required: false,
    description: 'Optional due date for the list',
  })
  @IsOptional()
  @IsString()
  dueDate?: string;
}