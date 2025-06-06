import { ApiProperty } from '@nestjs/swagger';

export class UserUserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name: string;

  @ApiProperty({ example: 'user', description: 'User role (user/admin)' })
  role: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Creation date' })
  createdAt: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Last update date', required: false })
  updatedAt?: string;
}

export class UsersListResponseDto {
  @ApiProperty({ type: [UserUserResponseDto], description: 'List of users' })
  users: UserUserResponseDto[];
}

export class UserMessageResponseDto {
  @ApiProperty({ example: 'Password changed successfully', description: 'Operation result message' })
  message: string;
}

export class UserErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Invalid input data', description: 'Error message' })
  message: string;

  @ApiProperty({ example: 'Bad Request', description: 'Error type', required: false })
  error?: string;
}