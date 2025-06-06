import { ApiProperty } from '@nestjs/swagger';

export class ListResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'My List' })
  name: string;

  @ApiProperty({ example: 'work', enum: ['personal', 'work', 'home', 'study', 'default'] })
  icon: string;

  @ApiProperty({ example: 'blue', enum: ['blue', 'green', 'red', 'purple', 'amber'] })
  color: string;

  @ApiProperty({ example: '2023-12-31', required: false })
  dueDate?: string;

  @ApiProperty({ example: 'owner', enum: ['owner', 'viewer', 'editor', 'admin'] })
  userRole: string;

  @ApiProperty({ type: () => [SharedUserDto], required: false })
  sharedUsers?: SharedUserDto[];
}

export class SharedUserDto {
  @ApiProperty({ example: 2 })
  userId: number;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe', required: false })
  name?: string;

  @ApiProperty({ example: 'editor', enum: ['viewer', 'editor', 'admin'] })
  role: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  sharedAt: string;
}

export class SharedListsResponseDto {
  @ApiProperty({ type: () => [ListResponseDto] })
  lists: ListResponseDto[];
}

export class SharedUsersResponseDto {
  @ApiProperty({ type: () => [SharedUserDto] })
  sharedUsers: SharedUserDto[];
}

export class ListMessageResponseDto {
  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;
}

export class UsersSearchResponseDto {
  @ApiProperty({ type: () => [UserDto] })
  users: UserDto[];
}

export class UserDto {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe', required: false })
  name?: string;
}

export class ListErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({ example: 'Validation failed' })
  message: string;

  @ApiProperty({ example: ['name should not be empty'], required: false })
  errors?: string[];
}