import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

type ListType = 'personal' | 'work' | 'home' | 'study' | 'default';
type ListColor = 'blue' | 'green' | 'red' | 'purple' | 'amber';

export class UpdateListDto {
  @ApiProperty({ example: 'Updated List', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'work',
    enum: ['personal', 'work', 'home', 'study', 'default'],
    required: false,
  })
  @IsString()
  @IsOptional()
  icon: ListType;

  @ApiProperty({
    example: 'green',
    enum: ['blue', 'green', 'red', 'purple', 'amber'],
    required: false,
  })
  @IsString()
  @IsOptional()
  color: ListColor;

  @ApiProperty({ example: '2023-12-31', required: false })
  @IsOptional()
  @IsString()
  dueDate?: string;
}