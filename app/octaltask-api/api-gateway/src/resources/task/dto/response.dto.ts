import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({ example: 1, description: 'The ID of the task' })
  id: number;

  @ApiProperty({ example: 'Complete project documentation', description: 'Title of the task' })
  title: string;

  @ApiProperty({ example: 'Write Swagger docs for all endpoints', description: 'Description of the task', required: false })
  description?: string;

  @ApiProperty({ example: false, description: 'Completion status of the task', required: false })
  isCompleted?: boolean;

  @ApiProperty({ example: true, description: 'Whether the task has been started', required: false })
  isStarted?: boolean;

  @ApiProperty({ example: '2023-12-31', description: 'Due date of the task', required: false })
  dueDate?: string;

  @ApiProperty({ example: 1, description: 'ID of the user who owns the task' })
  userId: number;

  @ApiProperty({ example: 1, description: 'ID of the list this task belongs to', required: false })
  listId?: number;
}

export class TaskCommentResponseDto {
  @ApiProperty({ example: 1, description: 'The ID of the comment' })
  id: number;

  @ApiProperty({ example: 'This task needs more details', description: 'Content of the comment' })
  content: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Creation timestamp of the comment' })
  createdAt: string;

  @ApiProperty({ example: 1, description: 'ID of the task this comment belongs to' })
  taskId: number;

  @ApiProperty({
    type: () => ({
      userId: { type: Number, example: 1 },
      email: { type: String, example: 'user@example.com' },
      name: { type: String, example: 'John Doe' },
      role: { type: String, example: 'user' }
    }),
    description: 'User who created the comment'
  })
  user: {
    userId: number;
    email: string;
    name: string;
    role: string;
  };
}

export class TaskSubtaskResponseDto {
  @ApiProperty({ example: 1, description: 'The ID of the subtask' })
  id: number;

  @ApiProperty({ example: 'Research Swagger documentation', description: 'Content of the subtask' })
  content: string;

  @ApiProperty({ example: false, description: 'Completion status of the subtask' })
  isCompleted: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Creation timestamp of the subtask' })
  createdAt: string;

  @ApiProperty({ example: 1, description: 'ID of the parent task' })
  taskId: number;

  @ApiProperty({
    type: () => ({
      userId: { type: Number, example: 1 },
      email: { type: String, example: 'user@example.com' },
      name: { type: String, example: 'John Doe' },
      role: { type: String, example: 'user' }
    }),
    description: 'User who created the subtask'
  })
  user: {
    userId: number;
    email: string;
    name: string;
    role: string;
  };
}

export class TaskErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request', description: 'Error message' })
  message: string;

  @ApiProperty({ example: 'Validation failed', description: 'Error details', required: false })
  error?: string;
}