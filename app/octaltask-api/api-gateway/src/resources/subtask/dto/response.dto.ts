import { ApiProperty } from '@nestjs/swagger';

export class SubtaskSubtaskResponseDto {
  @ApiProperty({ example: 1, description: 'The ID of the subtask' })
  id: number;

  @ApiProperty({ example: 'Buy materials', description: 'The content of the subtask' })
  content: string;

  @ApiProperty({ example: false, description: 'Completion status of the subtask' })
  isCompleted: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ example: 1, description: 'The ID of the parent task' })
  taskId: number;

  @ApiProperty({
    type: 'object',
    properties: {
      userId: { type: 'number', example: 1 },
      email: { type: 'string', example: 'user@example.com' },
      name: { type: 'string', example: 'John Doe' },
      role: { type: 'string', example: 'user' }
    },
    description: 'User who created the subtask'
  })
  user: {
    userId: number;
    email: string;
    name: string;
    role: string;
  };
}

export class SubtaskErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Invalid input data', description: 'Error message' })
  message: string;

  @ApiProperty({ example: 'Bad Request', description: 'Error type', required: false })
  error?: string;
}

export class DeleteResponseDto {
  @ApiProperty({ example: 'Subtask deleted successfully', description: 'Confirmation message' })
  message: string;
}