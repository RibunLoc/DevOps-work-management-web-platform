import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateSubtaskDto {
  @ApiProperty({
    description: 'Updated content of the Subtask',
    example: 'This is the updated Subtask text'
  })

  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsBoolean()
  @IsNotEmpty()
  isCompleted?:boolean;

}
