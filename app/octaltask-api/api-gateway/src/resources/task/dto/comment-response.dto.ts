// src/task/dto/comment-response.dto.ts
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

export class CommentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'This task is progressing well!' })
  content: string;

  @ApiProperty({ example: '2025-05-16T10:30:00Z' })
  createdAt: string;

  @ApiProperty()
  user: UserInfoDto;
}

export class CommentListResponseDto {
  @ApiProperty({ type: [CommentResponseDto] })
  comments: CommentResponseDto[];
}