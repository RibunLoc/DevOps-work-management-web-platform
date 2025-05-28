// src/task/dto/Subtask-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'user' })
  role: string;
}

export class SubtaskResponseDto {
  @ApiProperty({ example: 1 })
  taskId: number;

  @ApiProperty({ example: 1 })
  subtaskId: number;


  @ApiProperty({ example: 'This task is progressing well!' })
  content: string;

  @ApiProperty({ example: true })
  isCompleted: boolean;

  @ApiProperty({ example: '2025-05-16T10:30:00Z' })
  createdAt: string;

  @ApiProperty()
  user: UserInfoDto;
}

export class SubtaskListResponseDto {
  @ApiProperty({ type: [SubtaskResponseDto] })
  Subtasks: SubtaskResponseDto[];
}