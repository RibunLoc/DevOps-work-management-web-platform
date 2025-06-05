import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({
    example: 'Updated comment content',
    description: 'New content for the comment',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}