import { ApiProperty } from '@nestjs/swagger';

export class CommentUserDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  userId: number;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name: string;

  @ApiProperty({ example: 'user', description: 'User role' })
  role: string;
}

export class CommentCommentResponseDto {
  @ApiProperty({ example: 1, description: 'Comment ID' })
  id: number;

  @ApiProperty({ example: 'This is a comment', description: 'Comment content' })
  content: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ example: 1, description: 'Task ID this comment belongs to' })
  taskId: number;

  @ApiProperty({
    type: () => CommentUserDto,
    description: 'User who created the comment'
  })
  user: CommentUserDto;
}

export class DeleteCommentResponseDto {
  @ApiProperty({ example: 'Comment deleted successfully', description: 'Success message' })
  message: string;
}

export class CommentErrorResponseDto {
  @ApiProperty({ example: 404, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Comment not found', description: 'Error message' })
  message: string;

  @ApiProperty({ example: 'Not Found', description: 'Error type', required: false })
  error?: string;
}